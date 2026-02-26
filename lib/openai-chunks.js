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

const MODEL = 'gpt-4o-mini'; // faster, still supports structured output

const SYSTEM_PROMPT = `You are a D&D 5e character sheet creator. Convert CVs into D&D format.

RULES:
- Ability scores 8-20. Modifier = floor((score-10)/2)
- Level = ~1 per 2 years experience (max 20). Proficiency = ceil(level/4)+1
- Map jobs to D&D classes (Engineer→Artificer, Manager→Commander, Designer→Bard)
- SKILLS: Include ALL 18 official D&D 5e skills with EXACT names:
  Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation,
  Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, Survival
  Map each to a professional skill via cvMeaning (e.g., Persuasion → "Sales & Negotiation")
- Generate 2-4 defenses and conditions (never empty)
- Actions need all fields filled (attackBonus=modifier+proficiency, damage=dice like "2d6+3")
- SPELLS: Generate 2-3 cantrips and 2-4 spells per level (1-3). Map professional abilities to D&D spells:
  e.g., "Sending" = email/messaging, "Charm Person" = networking, "Comprehend Languages" = multilingual
- Keep D&D flavor while being accurate to CV content

Return valid JSON matching the schema.`;

/**
 * Run a single OpenAI structured-output call for one chunk.
 */
async function generateChunk(client, cvText, chunkName, schema, extraContext = '') {
  const userPrompt = `Here is the CV / professional documents text:

---
${cvText}
---

${extraContext ? `Additional context from previously generated chunks:\n${extraContext}\n\n` : ''}Generate the "${chunkName}" section of the D&D character sheet based on this CV. Follow the schema exactly.`;

  const completion = await client.beta.chat.completions.parse({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: zodResponseFormat(schema, chunkName),
    temperature: 0.7,
    max_tokens: 2500,
  });

  const parsed = completion.choices[0].message.parsed;
  if (!parsed) {
    throw new Error(`No parsed response for chunk ${chunkName}`);
  }
  return parsed;
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
  const startChunk1 = Date.now();
  const chunk1 = await generateChunk(client, cvText, 'chunk1_personal_abilities', Chunk1Schema);
  console.log(`Chunk 1 took ${Date.now() - startChunk1}ms`);

  const chunk1Summary = `Character: ${chunk1.personal.name}, ${chunk1.personal.title}. Level ${chunk1.personal.level}. ` +
    `STR ${chunk1.abilities.str.score}, DEX ${chunk1.abilities.dex.score}, CON ${chunk1.abilities.con.score}, ` +
    `INT ${chunk1.abilities.int.score}, WIS ${chunk1.abilities.wis.score}, CHA ${chunk1.abilities.cha.score}. ` +
    `Proficiency bonus: +${chunk1.coreStats.proficiencyBonus}.`;

  // ── Chunks 2-5 in parallel (all only need chunk1Summary) ──
  progress(2, 5, 'Generating skills, campaigns, achievements, and classes in parallel...');
  
  const chunk4NotableContext = chunk1Summary +
    `\n\nIMPORTANT for notableAdventures and notableEncounters: extract ONLY specific achievements, results, and milestones — NOT job descriptions. ` +
    `Look for: grades/GPA, awards, startups launched/sold/acquired, measurable impact metrics, funding raised, community milestones, publications, ` +
    `speaking engagements, certifications, or any concrete "I did X and achieved Y" moments from the CV. ` +
    `Job roles and work history belong in campaigns (already generated). Do NOT repeat them here.`;

  const startParallel = Date.now();
  const [chunk2, chunk3, chunk4, chunk5] = await Promise.all([
    generateChunk(client, cvText, 'chunk2_skills_actions_spells', Chunk2Schema, chunk1Summary),
    generateChunk(client, cvText, 'chunk3_campaigns', Chunk3Schema, chunk1Summary),
    generateChunk(client, cvText, 'chunk4_notable_features', Chunk4Schema, chunk4NotableContext),
    generateChunk(client, cvText, 'chunk5_classes_media', Chunk5Schema, chunk1Summary),
  ]);
  console.log(`Parallel chunks took ${Date.now() - startParallel}ms`);
  
  progress(5, 5, 'Finalizing character sheet...');

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
