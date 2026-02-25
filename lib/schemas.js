// ============================================
// ZOD SCHEMAS — 5 chunks for OpenAI structured output
// All fields are REQUIRED (no .optional() or .default())
// Use .nullable() where a field may have no value
// No .min()/.max() constraints (not supported by OpenAI)
// ============================================
import { z } from 'zod';

// ── Reusable small schemas ──────────────────

const VouchSchema = z.object({
  text: z.string(),
  author: z.string(),
  role: z.string(),
}).nullable();

// ── CHUNK 1 — Personal + Abilities + Core Stats ────────

const PersonalSchema = z.object({
  name: z.string(),
  title: z.string(),
  species: z.string(),
  alignment: z.string(),
  alignmentDescription: z.string(),
  background: z.string(),
  level: z.number().int(),
  email: z.string(),
  phone: z.string(),
  linkedin: z.string(),
  github: z.string(),
  location: z.string(),
  address: z.string(),
  currentStatus: z.string(),
  currentCampaign: z.string(),
  summary: z.string(),
  avatar: z.string(),
});

const AbilitySchema = z.object({
  name: z.string(),
  abbr: z.string(),
  score: z.number().int(),
  modifier: z.number().int(),
  saveProficient: z.boolean(),
  dndMeaning: z.string(),
  cvMeaning: z.string(),
  cvDescription: z.string(),
  evidence: z.array(z.string()),
  vouch: VouchSchema,
});

const CoreStatsSchema = z.object({
  proficiencyBonus: z.number().int(),
  armorClass: z.number().int(),
  armorClassExplanation: z.string(),
  initiative: z.number().int(),
  initiativeBreakdown: z.string(),
  speed: z.string(),
  speedExplanation: z.string(),
  hitPoints: z.object({
    current: z.number().int(),
    max: z.number().int(),
    meaning: z.string(),
  }),
  hitDice: z.string(),
  passivePerception: z.number().int(),
  passiveInvestigation: z.number().int(),
  passiveInsight: z.number().int(),
});

const DefenseSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const ConditionSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  description: z.string(),
});

const Chunk1Schema = z.object({
  personal: PersonalSchema,
  abilities: z.object({
    str: AbilitySchema,
    dex: AbilitySchema,
    con: AbilitySchema,
    int: AbilitySchema,
    wis: AbilitySchema,
    cha: AbilitySchema,
  }),
  coreStats: CoreStatsSchema,
  defenses: z.array(DefenseSchema),
  conditions: z.array(ConditionSchema),
  senses: z.string(),
});

// ── CHUNK 2 — Skills + Actions + Spells + Inventory + Proficiencies ──

const SkillSchema = z.object({
  name: z.string(),
  ability: z.enum(['str', 'dex', 'con', 'int', 'wis', 'cha']),
  proficient: z.boolean(),
  expertise: z.boolean(),
  modifier: z.number().int(),
  cvMeaning: z.string(),
  evidence: z.array(z.string()),
  vouch: VouchSchema,
});

const ActionSchema = z.object({
  name: z.string(),
  type: z.enum(['Attack', 'Action', 'Bonus Action', 'Reaction']),
  attackBonus: z.number().int().nullable(),
  damage: z.string().nullable(),
  damageType: z.string().nullable(),
  description: z.string(),
  range: z.string().nullable(),
  properties: z.array(z.string()).nullable(),
  uses: z.string().nullable(),
  effect: z.string().nullable(),
  recharge: z.string().nullable(),
});

const SpellSchema = z.object({
  name: z.string(),
  castTime: z.string(),
  range: z.string(),
  description: z.string(),
  dndEquivalent: z.string(),
  cvMeaning: z.string(),
  slots: z.number().int().nullable(),
});

const InventoryItemSchema = z.object({
  name: z.string(),
  weight: z.string(),
  qty: z.number().int(),
  value: z.string(),
  notes: z.string(),
  active: z.boolean(),
});

const LanguageSchema = z.object({
  name: z.string(),
  native: z.string(),
  proficiency: z.string(),
});

const Chunk2Schema = z.object({
  skills: z.array(SkillSchema),
  actions: z.array(ActionSchema),
  spells: z.object({
    spellcastingAbility: z.string(),
    spellSaveDC: z.number().int(),
    spellAttackBonus: z.number().int(),
    cantrips: z.array(SpellSchema),
    level1: z.array(SpellSchema),
    level2: z.array(SpellSchema),
    level3: z.array(SpellSchema),
  }),
  inventory: z.array(InventoryItemSchema),
  proficiencies: z.object({
    armor: z.array(z.string()),
    weapons: z.array(z.string()),
    tools: z.array(z.string()),
    languages: z.array(LanguageSchema),
  }),
});

// ── CHUNK 3 — Campaigns + Side Quests ──────────

const EncounterSchema = z.object({
  name: z.string(),
  description: z.string(),
  notable: z.boolean(),
  link: z.string().nullable(),
});

const AdventureSchema = z.object({
  id: z.string(),
  name: z.string(),
  dates: z.string(),
  role: z.string().nullable(),
  organization: z.string().nullable(),
  summary: z.string(),
  encounters: z.array(EncounterSchema),
});

const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  dates: z.string(),
  duration: z.string(),
  summary: z.string(),
  outcome: z.string().nullable(),
  party: z.string().nullable(),
  partners: z.array(z.string()),
  adventures: z.array(AdventureSchema),
});

const SideQuestSchema = z.object({
  name: z.string(),
  role: z.string(),
  dates: z.string(),
  description: z.string(),
  url: z.string().nullable(),
});

const Chunk3Schema = z.object({
  campaignsData: z.array(CampaignSchema),
  sideQuests: z.array(SideQuestSchema),
});

// ── CHUNK 4 — Notable + Features + Background + Vouches + Orgs ──

const NotableAdventureSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  link: z.string().nullable(),
});

const NotableEncounterSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
});

const ClassFeatureSchema = z.object({
  name: z.string(),
  source: z.string(),
  description: z.string(),
});

const AchievementSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  link: z.string().nullable(),
});

const IdealSchema = z.object({
  name: z.string(),
  description: z.string(),
  alignment: z.string(),
});

const BackgroundSchema = z.object({
  name: z.string(),
  template: z.string(),
  skillProficiencies: z.array(z.string()),
  toolProficiencies: z.array(z.string()),
  equipment: z.string(),
  personalityTraits: z.array(z.string()),
  ideals: z.array(IdealSchema),
  bonds: z.array(z.string()),
  flaws: z.array(z.string()),
  characteristics: z.object({
    faith: z.string(),
    origin: z.string(),
    formerLife: z.string(),
    firstGig: z.string(),
    artToEngineering: z.string(),
    backgroundStory: z.string(),
  }),
});

const OrganizationSchema = z.object({
  name: z.string(),
  role: z.string(),
  dates: z.string(),
  description: z.string(),
  url: z.string().nullable(),
});

const Chunk4Schema = z.object({
  notableAdventures: z.array(NotableAdventureSchema),
  notableEncounters: z.array(NotableEncounterSchema),
  features: z.object({
    classFeatures: z.array(ClassFeatureSchema),
    backgroundFeature: z.object({
      name: z.string(),
      source: z.string(),
      description: z.string(),
    }),
    achievements: z.array(AchievementSchema),
  }),
  background: BackgroundSchema,
  vouches: z.array(z.object({
    text: z.string(),
    author: z.string(),
    role: z.string(),
  })),
  organizations: z.array(OrganizationSchema),
});

// ── CHUNK 5 — Classes + Media + Extras ──

const ClassFeatureDetailSchema = z.object({
  level: z.number().int(),
  name: z.string(),
  desc: z.string(),
});

const ClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().int(),
  isPrimary: z.boolean(),
  primaryAbility: z.string(),
  description: z.string(),
  dndStyle: z.string(),
  features: z.array(ClassFeatureDetailSchema),
  evidence: z.array(z.string()),
  vouch: VouchSchema,
});

const UnleveledClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  primaryAbility: z.string(),
  description: z.string(),
  notYetMessage: z.string(),
});

const MediaItemSchema = z.object({
  name: z.string(),
  title: z.string(),
  date: z.string(),
  platform: z.string(),
  url: z.string(),
  description: z.string(),
});

const Chunk5Schema = z.object({
  classes: z.array(ClassSchema),
  unleveldClasses: z.array(UnleveledClassSchema),
  mediaMentions: z.object({
    podcasts: z.array(MediaItemSchema),
    press: z.array(MediaItemSchema),
    profiles: z.array(MediaItemSchema),
  }),
  extras: z.object({
    funFacts: z.array(z.string()),
    interests: z.array(z.string()),
  }),
});

// ── Combined App Data Blob (for validation, not sent to OpenAI) ──

const AppDataSchema = z.object({
  characterData: z.object({
    personal: PersonalSchema,
    classes: z.array(ClassSchema),
    unleveldClasses: z.array(UnleveledClassSchema),
    abilities: z.object({
      str: AbilitySchema,
      dex: AbilitySchema,
      con: AbilitySchema,
      int: AbilitySchema,
      wis: AbilitySchema,
      cha: AbilitySchema,
    }),
    coreStats: CoreStatsSchema,
    defenses: z.array(DefenseSchema),
    conditions: z.array(ConditionSchema),
    senses: z.string(),
    skills: z.array(SkillSchema),
    proficiencies: z.object({
      armor: z.array(z.string()),
      weapons: z.array(z.string()),
      tools: z.array(z.string()),
      languages: z.array(LanguageSchema),
    }),
    actions: z.array(ActionSchema),
    spells: z.object({
      spellcastingAbility: z.string(),
      spellSaveDC: z.number().int(),
      spellAttackBonus: z.number().int(),
      cantrips: z.array(SpellSchema),
      level1: z.array(SpellSchema),
      level2: z.array(SpellSchema),
      level3: z.array(SpellSchema),
    }),
    inventory: z.array(InventoryItemSchema),
    features: z.object({
      classFeatures: z.array(ClassFeatureSchema),
      backgroundFeature: z.object({
        name: z.string(),
        source: z.string(),
        description: z.string(),
      }),
      achievements: z.array(AchievementSchema),
    }),
    background: BackgroundSchema,
    vouches: z.array(z.object({
      text: z.string(),
      author: z.string(),
      role: z.string(),
    })),
    organizations: z.array(OrganizationSchema),
    extras: z.object({
      funFacts: z.array(z.string()),
      interests: z.array(z.string()),
    }),
  }),
  campaignsData: z.array(CampaignSchema),
  sideQuests: z.array(SideQuestSchema),
  notableAdventures: z.array(NotableAdventureSchema),
  notableEncounters: z.array(NotableEncounterSchema),
  mediaMentions: z.object({
    podcasts: z.array(MediaItemSchema),
    press: z.array(MediaItemSchema),
    profiles: z.array(MediaItemSchema),
  }),
});

export {
  Chunk1Schema,
  Chunk2Schema,
  Chunk3Schema,
  Chunk4Schema,
  Chunk5Schema,
  AppDataSchema,
  PersonalSchema,
  AbilitySchema,
  SkillSchema,
  ActionSchema,
  CampaignSchema,
  ClassSchema,
};
