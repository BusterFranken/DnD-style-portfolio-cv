// ============================================
// CHUNKED OPENAI GENERATION
// 5 sequential calls, each with structured output
// ============================================

import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
  Chunk1Schema,
  Chunk2Schema,
  Chunk3Schema,
  Chunk4Schema,
  Chunk5Schema,
} from './schemas';

const MODEL = 'gpt-4o-2024-08-06'; // supports structured output

const SYSTEM_PROMPT = `You are a D&D character sheet creator that maps real-world CVs and professional documents into a D&D 5th Edition character sheet format.

RULES:
- Map the person's career into D&D mechanics faithfully based on their actual CV
- Every text value should be creative but ACCURATE to the real CV content
- Ability scores range 8–20. Higher scores reflect stronger evidence in the CV
- Modifier = floor((score - 10) / 2)
- Character level = roughly 1 per 2 years of professional experience (max 20)
- Proficiency bonus = ceil(level / 4) + 1
- Map job titles to D&D class names creatively (e.g. "Engineer" → "Artificer", "Manager" → "Commander", "Designer" → "Bard", "Marketer" → "Enchanter", "Researcher" → "Wizard", "Salesperson" → "Warlock")

SKILLS — You MUST include ALL 18 D&D skills, each with a cvMeaning mapping to a professional skill:
  Athletics, Acrobatics, Sleight of Hand, Stealth, Arcana, History, Investigation, Nature, Religion, Animal Handling, Insight, Medicine, Perception, Survival, Deception, Intimidation, Performance, Persuasion

DEFENSES — Generate 2-4 defenses that represent the person's professional protections (e.g. "Strong Network", "Domain Expertise", "Adaptability"). Never leave this empty.

CONDITIONS — Generate 2-4 active conditions/buffs that represent the person's current state (e.g. "Focused", "Inspired", "Determined"). Never leave this empty.

ACTIONS — Generate at least 5-8 actions that represent key professional activities. Each action should have:
- A creative D&D-flavored name mapping to a real professional skill
- attackBonus: an integer (ability modifier + proficiency bonus for the relevant ability), NOT null. Use the appropriate ability modifier (e.g. CHA for presentations, INT for research, etc.)
- damage: a dice expression like "1d8+3" representing impact
- damageType: a creative type like "persuasion", "insight", "knowledge", "inspiration", etc.
- type: one of "Attack", "Action", "Bonus Action", "Reaction"
- uses: how often they can do it (e.g. "3/day", "At will", "1/hour")
- description: what this action actually maps to in real life

OTHER RULES:
- Spells should map to professional capabilities (e.g. "Sending" = cold outreach, "Charm Person" = sales calls)
- Campaigns = work history, Adventures = specific roles/jobs, Encounters = key achievements
- Keep the D&D flavor fun and creative while being truthful to the CV
- If information is missing from the CV, use reasonable defaults but NEVER leave defenses, conditions, or skills empty
- All dates should match what's in the CV
- The "senses" field should be a creative D&D-style description of the person's professional awareness (e.g. "Code Sight 60 ft.", "Market Awareness 30 ft.")

IMPORTANT: Return ONLY valid JSON matching the required schema. No commentary.`;

/**
 * Run a single OpenAI structured-output call for one chunk.
 */
async function generateChunk(client, cvText, chunkName, schema, extraContext = '') {
  const userPrompt = `Here is the CV / professional documents text:

---
${cvText}
---

${extraContext ? `Additional context from previously generated chunks:\n${extraContext}\n\n` : ''}Generate the "${chunkName}" section of the D&D character sheet based on this CV. Follow the schema exactly.`;

  try {
    const completion = await client.beta.chat.completions.parse({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(schema, chunkName),
      temperature: 0.7,
      max_tokens: 4096,
    });

    const parsed = completion.choices[0].message.parsed;
    if (!parsed) {
      throw new Error(`No parsed response for chunk ${chunkName}`);
    }
    return parsed;
  } catch (err) {
    // Retry once with error context
    console.error(`Chunk "${chunkName}" failed, retrying:`, err.message);
    const retryCompletion = await client.beta.chat.completions.parse({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt + `\n\nPrevious attempt failed with: ${err.message}. Please fix and try again.` },
      ],
      response_format: zodResponseFormat(schema, chunkName),
      temperature: 0.5,
      max_tokens: 4096,
    });
    const parsed = retryCompletion.choices[0].message.parsed;
    if (!parsed) {
      throw new Error(`Chunk "${chunkName}" failed after retry`);
    }
    return parsed;
  }
}

/**
 * Generate the complete D&D character sheet from CV text.
 * Runs 5 sequential OpenAI calls, each building on previous context.
 * Returns a callback for progress updates.
 */
async function generateFullSheet(cvText, onProgress) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const progress = (step, total, msg) => {
    if (onProgress) onProgress({ step, total, message: msg });
  };

  // ── Chunk 1: Personal + Abilities + Core Stats ──
  progress(1, 5, 'Generating personal info and ability scores...');
  const chunk1 = await generateChunk(client, cvText, 'chunk1_personal_abilities', Chunk1Schema);

  const chunk1Summary = `Character: ${chunk1.personal.name}, ${chunk1.personal.title}. Level ${chunk1.personal.level}. ` +
    `STR ${chunk1.abilities.str.score}, DEX ${chunk1.abilities.dex.score}, CON ${chunk1.abilities.con.score}, ` +
    `INT ${chunk1.abilities.int.score}, WIS ${chunk1.abilities.wis.score}, CHA ${chunk1.abilities.cha.score}. ` +
    `Proficiency bonus: +${chunk1.coreStats.proficiencyBonus}.`;

  // ── Chunk 2: Skills + Actions + Spells + Inventory ──
  progress(2, 5, 'Mapping skills, actions, and spells...');
  const chunk2 = await generateChunk(
    client, cvText, 'chunk2_skills_actions_spells', Chunk2Schema, chunk1Summary
  );

  // ── Chunk 3: Campaigns (Work History) + Side Quests ──
  progress(3, 5, 'Building campaign history...');
  const chunk3 = await generateChunk(
    client, cvText, 'chunk3_campaigns', Chunk3Schema, chunk1Summary
  );

  // ── Chunk 4: Notable + Features + Background ──
  progress(4, 5, 'Documenting notable achievements and background...');
  const chunk4 = await generateChunk(
    client, cvText, 'chunk4_notable_features', Chunk4Schema, chunk1Summary
  );

  // ── Chunk 5: Classes + Media + Extras ──
  progress(5, 5, 'Finalizing classes and extras...');
  const classContext = chunk1Summary + ` Skills emphasize: ${chunk2.skills.filter(s => s.proficient).map(s => s.name).join(', ')}.`;
  const chunk5 = await generateChunk(
    client, cvText, 'chunk5_classes_media', Chunk5Schema, classContext
  );

  // ── Merge all chunks into one app data blob ──
  const appData = {
    characterData: {
      personal: chunk1.personal,
      classes: chunk5.classes,
      unleveldClasses: chunk5.unleveldClasses,
      abilities: chunk1.abilities,
      coreStats: chunk1.coreStats,
      defenses: chunk1.defenses,
      conditions: chunk1.conditions,
      senses: chunk1.senses,
      skills: chunk2.skills,
      proficiencies: chunk2.proficiencies,
      actions: chunk2.actions,
      spells: chunk2.spells,
      inventory: chunk2.inventory,
      features: chunk4.features,
      background: chunk4.background,
      vouches: chunk4.vouches,
      organizations: chunk4.organizations,
      extras: chunk5.extras,
    },
    campaignsData: chunk3.campaignsData,
    sideQuests: chunk3.sideQuests,
    notableAdventures: chunk4.notableAdventures,
    notableEncounters: chunk4.notableEncounters,
    mediaMentions: chunk5.mediaMentions,
  };

  return appData;
}

export { generateFullSheet };
