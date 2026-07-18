// ============================================
// BUSTER FRANKEN - D&D CHARACTER SHEET DATA
// ============================================

const characterData = {
  // ==========================================
  // PERSONAL INFO
  // ==========================================
  personal: {
    name: "Buster Franken",
    title: "Founder & AI Executive",
    species: "Human",
    alignment: "Chaotic Good",
    alignmentDescription: "Doing the right thing, but not following rules. Always does exactly what they think is the right thing to do, regardless of conventions or expectations. Will challenge authority when it conflicts with doing good.",
    background: "Entrepreneur",
    level: 7,
    email: "busterfranken@gmail.com",
    phone: "+31624877967",
    linkedin: "https://linkedin.com/in/buster-franken",
    github: "https://github.com/BusterFranken",
    location: "Amsterdam, Netherlands",
    address: "Nieuwegrachtje 5-3, 1011 VP",
    currentStatus: "Open to Adventures.",
    currentCampaignName: "Energy Hardtech Exploration",
    currentCampaign: "Currently exploring new adventures in energy hardtech — open to other impact-focused ventures.",
    summary: "With my past startup FruitPunch AI we crowdsourced €45M in AI engineering for impact organizations. Through our platform >4500 AI engineers built AI solutions for: Stanford, ESA, Greenpeace, WWF, Philips, NXP, Huawei, etc.",
    avatar: "assets/images/buster.jpg"
  },

  // ==========================================
  // MULTICLASS SYSTEM
  // ==========================================
  classes: [
    {
      id: "founder",
      name: "Founder",
      level: 3,
      isPrimary: true,
      primaryAbility: "CHA",
      description: "Entrepreneurs who build ventures from nothing through vision, persuasion, and relentless execution. Product visionaries who design platform experiences from first principles.",
      dndStyle: "High CHA primary, WIS secondary. Specializes in Venture Creation, inspiring others, and building platforms that enable massive scale.",
      features: [
        { level: 1, name: "Venture Creation", desc: "Can create something from nothing with just an idea and determination" },
        { level: 2, name: "Pitch Mastery", desc: "Advantage on Persuasion checks when presenting a vision" },
        { level: 3, name: "Subclass: Vision Caster", desc: "Can inspire large groups to work toward a common goal" }
      ],
      evidence: [
        "Founded FruitPunch AI (2018) - grew to €45M impact",
        "Built platform matching AI engineers with impact projects for volunteer work",
        "Co-founded Webholders (2018) - web development agency",
        "Co-founded Founder Space Utrecht (2024) - impact startup coworking",
        "Made all key product decisions: user interviews, experience design, experiments"
      ]
    },
    {
      id: "community-builder",
      name: "Community Builder",
      level: 2,
      isPrimary: false,
      primaryAbility: "WIS",
      description: "Masters of gathering and galvanizing groups toward common goals. They understand people deeply through user research and community building.",
      dndStyle: "WIS primary. Specializes in rallying people, expanding networks, and understanding user needs.",
      features: [
        { level: 1, name: "Rally the Troops", desc: "Can inspire groups to action with a rousing speech" },
        { level: 2, name: "Network Expansion", desc: "Connections multiply - each ally brings two more" }
      ],
      evidence: [
        "Built community of 4500+ AI engineers globally",
        "Conducted 500+ user and customer interviews to understand needs",
        "Led Sigma Squared Dutch chapter - organized 14 events",
        "50% female founder representation in applicants",
        "Revived KICKOFF EHV student entrepreneur community"
      ],
      vouch: {
        text: "Getting people excited for collaboration and new endeavors, from founders to senior leaders.",
        author: "Sako Arts",
        role: "Cofounder & CTO of FruitPunch AI"
      }
    },
    {
      id: "growth-hacker",
      name: "Growth Hacker",
      level: 2,
      isPrimary: false,
      primaryAbility: "CHA/INT",
      description: "Specialists in rapid scaling and market penetration. They find unconventional paths to growth through experimentation.",
      dndStyle: "CHA/INT hybrid. Specializes in deals, market infiltration, and running experiments to figure out what works.",
      features: [
        { level: 1, name: "Market Infiltration", desc: "Can identify and exploit growth opportunities others miss" },
        { level: 2, name: "Deal Closer", desc: "Expertise in high-stakes negotiations" }
      ],
      evidence: [
        "€45M in AI engineering crowdsourced for impact organizations",
        "Closed deals with Stanford, ESA, NXP, Huawei, Philips",
        "Raised €1M VC funding from Thomas Wolf (Hugging Face), LUMO Labs",
        "Ran dozens of experiments to validate what engagement models work"
      ],
      vouch: {
        text: "Galvanizing AI engineers to apply their skills towards global challenges and the greater good.",
        author: "Arjé Cahn",
        role: "Investor at Shamrock Ventures"
      }
    }
  ],

  // Greyed out / not leveled classes
  unleveldClasses: [
    {
      id: "technical-architect",
      name: "Technical Architect",
      primaryAbility: "INT",
      description: "Deep technical implementation specialists who build robust systems.",
      notYetMessage: "Buster has technical knowledge but hasn't specialized as a Technical Architect... yet."
    },
    {
      id: "experience-designer",
      name: "Experience Designer",
      primaryAbility: "WIS",
      description: "UX and challenge-based learning design experts.",
      notYetMessage: "Buster has designed learning experiences (challenge-based learning from first principles) but hasn't fully specialized here... yet."
    },
    {
      id: "operations-commander",
      name: "Operations Commander",
      primaryAbility: "CON",
      description: "Scaling processes and managing large teams with military precision.",
      notYetMessage: "Buster has ops experience managing 30+ people but hasn't fully specialized... yet."
    },
    {
      id: "product-manager",
      name: "Product Manager",
      primaryAbility: "WIS/INT",
      description: "Experts in understanding user needs and translating them into product decisions.",
      notYetMessage: "Buster has strong PM experience (user interviews, A/B tests, roadmaps) but hasn't fully specialized... yet."
    }
  ],

  // ==========================================
  // ABILITY SCORES
  // ==========================================
  abilities: {
    str: {
      name: "Strength",
      abbr: "STR",
      score: 14,
      modifier: 2,
      saveProficient: false,
      dndMeaning: "Measures physical power, athletic training, and the extent to which you can exert raw physical force.",
      cvMeaning: "Impact Force",
      cvDescription: "The ability to move big things - closing major deals, moving organizations, physical endurance for events.",
      evidence: [
        "Closed €45M in deals with major organizations",
        "Moved organizations like Stanford, ESA, Greenpeace to action",
        "Physical endurance for conferences and events worldwide"
      ]
    },
    dex: {
      name: "Dexterity",
      abbr: "DEX",
      score: 18,
      modifier: 4,
      saveProficient: true,
      dndMeaning: "Measures agility, reflexes, balance, and coordination.",
      cvMeaning: "Adaptability",
      cvDescription: "Quick pivots, handling multiple things at once, operational agility - essential for the startup lifestyle.",
      evidence: [
        "Pivoted FruitPunch AI multiple times based on market feedback",
        "Managed multiple roles simultaneously (CEO + AI Program Manager)",
        "Quick decision-making in uncertain startup environments",
        "Rapid iteration cycles on product features"
      ]
    },
    con: {
      name: "Constitution",
      abbr: "CON",
      score: 16,
      modifier: 3,
      saveProficient: false,
      dndMeaning: "Measures endurance, stamina, and vital force.",
      cvMeaning: "Resilience",
      cvDescription: "Surviving startup hardships, persistence through failures, never giving up.",
      evidence: [
        "7 years of startup grind (2018-2025)",
        "Survived NGO phase, pivot to startup, COVID, and eventual acquisition",
        "Continued building through countless rejections and setbacks"
      ]
    },
    int: {
      name: "Intelligence",
      abbr: "INT",
      score: 15,
      modifier: 2,
      saveProficient: false,
      dndMeaning: "Measures mental acuity, accuracy of recall, and reasoning ability.",
      cvMeaning: "Technical Knowledge",
      cvDescription: "AI/ML expertise, neuroscience background, data science skills.",
      evidence: [
        "BSc Mechanical Engineering & Neuroscience (TU/e)",
        "60 ECTS in Data Science courses",
        "10/10 Brain Computer Interfacing research",
        "Built AI platform used by 4500+ engineers"
      ]
    },
    wis: {
      name: "Wisdom",
      abbr: "WIS",
      score: 16,
      modifier: 3,
      saveProficient: true,
      dndMeaning: "Measures awareness, intuition, and insight.",
      cvMeaning: "People Understanding",
      cvDescription: "Community building, reading situations, understanding what motivates people. Experience gained from all past adventures.",
      evidence: [
        "Built communities of 4500+ AI engineers",
        "50% female founder representation in Sigma Squared",
        "Understanding what makes engineers engage with impact work",
        "500+ user and customer interviews conducted",
        "Designed challenge-based learning experience from first principles"
      ]
    },
    cha: {
      name: "Charisma",
      abbr: "CHA",
      score: 18,
      modifier: 4,
      saveProficient: true,
      dndMeaning: "Measures force of personality, persuasiveness, and leadership.",
      cvMeaning: "Influence",
      cvDescription: "Sales, presenting, inspiring others - rooted in professional acting background.",
      evidence: [
        "Professional teen actor (Groen Casting, 2010-2015)",
        "€45M in deals closed through persuasion",
        "Public speaking at major events",
        "Inspiring engineers to work on impact projects"
      ],
      vouch: {
        text: "Inspiring people to stay true to their goals and ideals, regardless of what others think.",
        author: "Daan Streng",
        role: "Chief Engineer of FruitPunch AI"
      }
    }
  },

  // ==========================================
  // CORE STATS
  // ==========================================
  coreStats: {
    proficiencyBonus: 3,
    armorClass: 14,
    initiative: 8, // DEX(+4) + Alertness(+4)
    initiativeBreakdown: "DEX (+4) + Alertness Feat (+4)",
    speed: "60 ft",
    speedExplanation: "Base 30ft + Rogue Cunning Action: Dash allows doubling movement. Represents willingness to move anywhere for the right opportunity.",
    hitPoints: {
      current: 45,
      max: 45,
      meaning: "€45M crowdsourced"
    },
    hitDice: "7d8",
    passivePerception: 13, // 10 + WIS(3)
    passiveInvestigation: 12, // 10 + INT(2)
    passiveInsight: 16 // 10 + WIS(3) + proficiency(3)
  },

  // ==========================================
  // DEFENSES & CONDITIONS
  // ==========================================
  defenses: [
    { name: "Resilient Network", description: "Allies provide backup support - 4500+ engineers and 80+ partner organizations" },
    { name: "Pivot Ready", description: "Can quickly adapt to changing situations - multiple successful pivots in startup journey" },
    { name: "Community Shield", description: "Strong community relationships provide protection against market uncertainties" }
  ],
  conditions: [
    { name: "Inspired", active: true, description: "Advantage on Charisma checks when pursuing impact-driven goals" },
    { name: "Alert", active: true, description: "Cannot be surprised while conscious, +4 to initiative (Alertness feat)" },
    { name: "Mission-Driven", active: true, description: "Resistance to distractions that don't align with core values" }
  ],

  // ==========================================
  // SKILLS
  // ==========================================
  skills: [
    // STR skills
    { name: "Athletics", ability: "str", proficient: false, expertise: false, modifier: 2, cvMeaning: "Fundraising Stamina", evidence: ["Pitched to 200+ VCs", "Physical endurance for events"] },
    
    // DEX skills (now +4 base)
    { name: "Acrobatics", ability: "dex", proficient: false, expertise: false, modifier: 4, cvMeaning: "Pivoting", evidence: ["Quick strategic pivots", "Adapting to market changes", "Rapid iteration cycles"] },
    { name: "Sleight of Hand", ability: "dex", proficient: false, expertise: false, modifier: 4, cvMeaning: "Operational Efficiency", evidence: ["Multitasking", "Juggling priorities", "Fast execution"] },
    { name: "Stealth", ability: "dex", proficient: false, expertise: false, modifier: 4, cvMeaning: "Stealth Mode Building", evidence: ["Building in stealth before launch", "Working behind scenes", "Quiet product development"] },
    
    // INT skills
    { name: "Arcana", ability: "int", proficient: true, expertise: false, modifier: 5, cvMeaning: "AI/ML Technical Knowledge", evidence: ["Built AI platform", "BSc + Data Science courses", "BCI research 10/10", "Technical architecture decisions"] },
    { name: "History", ability: "int", proficient: false, expertise: false, modifier: 2, cvMeaning: "Teaching & Past Lessons", evidence: ["Taught physics & chemistry", "Learning from past mistakes", "Iterating based on experience"] },
    { name: "Investigation", ability: "int", proficient: true, expertise: false, modifier: 5, cvMeaning: "User Research & Data Analysis", evidence: ["500+ user and customer interviews conducted", "Data-driven product decisions", "Market research", "A/B testing and experiments"], vouch: { text: "Buster has the strong ability to translate high-level ideas into testable experiments. Using the data and analysis gathered to build a plan grounded in truth.", author: "Dorian Groen" } },
    { name: "Nature", ability: "int", proficient: false, expertise: false, modifier: 2, cvMeaning: "Ecosystem Understanding", evidence: ["Understanding startup ecosystems", "AI for nature projects (Wildlife, Coral Reefs, Forests)"] },
    { name: "Religion", ability: "int", proficient: false, expertise: false, modifier: 2, cvMeaning: "Values & Mission", evidence: ["Panpsychism", "Strong ethical stance on AI", "Galvanizing engineers for global good"], vouch: { text: "Galvanizing AI engineers to apply their skills towards global challenges and the greater good.", author: "Arjé Cahn" } },
    
    // WIS skills (now +3 base)
    { name: "Animal Handling", ability: "wis", proficient: false, expertise: false, modifier: 3, cvMeaning: "Team Management", evidence: ["Managing teams up to 30 people", "Herding cats (engineers)", "Coordinating distributed teams"] },
    { name: "Insight", ability: "wis", proficient: true, expertise: false, modifier: 6, cvMeaning: "Reading People & Needs", evidence: ["Understanding community needs", "Reading stakeholder motivations", "Customer interview insights", "Empathy-driven product design"], vouch: { text: "Inspiring people to stay true to their goals and ideals, regardless of what others think, or where the money may push him to go.", author: "Daan Streng" } },
    { name: "Medicine", ability: "wis", proficient: false, expertise: false, modifier: 3, cvMeaning: "Problem Diagnosis", evidence: ["Diagnosing business problems", "AI for Health projects (Heart Failure, Sepsis, COVID)"] },
    { name: "Perception", ability: "wis", proficient: false, expertise: false, modifier: 3, cvMeaning: "Market Awareness", evidence: ["Spotting opportunities", "Market trends", "Early identification of AI for Good space"] },
    { name: "Survival", ability: "wis", proficient: true, expertise: false, modifier: 6, cvMeaning: "Startup Survival", evidence: ["7 years of startup survival", "Navigating uncertainty", "Resource-constrained building"] },
    
    // CHA skills
    { name: "Deception", ability: "cha", proficient: false, expertise: false, modifier: 4, cvMeaning: "Negotiation Tactics", evidence: ["Fake it till you make it", "Strategic positioning", "Confident pitching"] },
    { name: "Intimidation", ability: "cha", proficient: false, expertise: false, modifier: 4, cvMeaning: "Commanding Presence", evidence: ["Event security background", "Commanding attention", "Authority in meetings"] },
    { name: "Performance", ability: "cha", proficient: true, expertise: true, modifier: 10, cvMeaning: "Public Speaking & Pitching", evidence: ["Professional actor (2010-2015)", "First paid IKEA gig at 14 (2010)", "Pitch deck presentations", "Public speaking at events"] },
    { name: "Persuasion", ability: "cha", proficient: true, expertise: true, modifier: 10, cvMeaning: "Sales & Partnership Building", evidence: ["€45M crowdsourced", "Stanford, ESA, NXP deals", "€1M VC funding"], vouch: { text: "Getting people excited for collaboration and new endeavors, from founders to senior leaders.", author: "Sako Arts" } }
  ],

  // ==========================================
  // PROFICIENCIES
  // ==========================================
  proficiencies: {
    armor: ["Light Armor (Startup Environments)"],
    weapons: ["Pitch Decks", "Google Sheets", "AI Models", "Presentation Tools", "User Interview Scripts"],
    tools: ["Thieves' Tools (Startup Hacks)", "Python", "Web Development", "Business Operations", "Product Analytics"],
    languages: [
      { name: "Common", native: "English", proficiency: "Native" },
      { name: "Dwarvish", native: "Dutch", proficiency: "Native" },
      { name: "Giant", native: "German", proficiency: "B2" }
    ]
  },

  // ==========================================
  // ACTIONS TAB
  // ==========================================
  actions: [
    // Attacks
    {
      name: "Pitch Attack",
      type: "Attack",
      attackBonus: 10,
      damage: "2d10+4",
      damageType: "persuasion",
      description: "Deliver a compelling pitch that deals persuasion damage to resistance. Uses CHA modifier + Expertise.",
      range: "30 ft (or any room)",
      properties: ["Finesse", "Reach"]
    },
    {
      name: "Network Strike",
      type: "Attack",
      attackBonus: 7,
      damage: "1d8+4",
      damageType: "connection",
      description: "Leverage your network to create new opportunities. Each connection can cascade into more.",
      range: "Unlimited (email/LinkedIn)",
      properties: ["Ranged", "Unlimited"]
    },
    {
      name: "Cold Outreach",
      type: "Attack",
      attackBonus: 7,
      damage: "1d6+4",
      damageType: "opportunity",
      description: "Reach out to someone you've never met. High risk, high reward.",
      range: "Unlimited",
      properties: ["Ranged", "Light"]
    },
    // Actions
    {
      name: "Strategic Pivot",
      type: "Action",
      description: "Completely change direction based on new information. Requires wisdom and courage.",
      uses: "1 / long rest",
      effect: "investments become lessons, not losses"
    },
    {
      name: "Community Rally",
      type: "Action",
      description: "Call upon your community for support. 4500+ engineers respond to meaningful challenges.",
      uses: "at will",
      effect: "summon 10–100 allied engineers for a 10-week challenge"
    },
    {
      name: "User Interview",
      type: "Action",
      description: "Conduct deep research to understand what users really need vs what they say they want.",
      uses: "at will",
      effect: "what users need vs. what they say they want"
    },
    {
      name: "A/B Experiment",
      type: "Action",
      description: "Run a controlled experiment to validate hypotheses before committing resources.",
      uses: "at will",
      effect: "test both — the data crowns the winner"
    },
    // Bonus Actions
    {
      name: "Dash",
      type: "Bonus Action",
      description: "Sprint to achieve remarkable results in a short time. A burst of focused energy and speed.",
      uses: "1 / short rest",
      effect: "a burst of focused speed toward remarkable results",
      recharge: "Short Rest"
    },
    {
      name: "Cunning Action",
      type: "Bonus Action",
      description: "Take the Dash, Disengage, or Hide action as a bonus action. Pivot quickly when needed.",
      uses: "at will",
      effect: "Dash, Disengage or Hide as a bonus action"
    },
    {
      name: "Inspire Team",
      type: "Bonus Action",
      description: "Boost an ally's confidence with encouraging words. Your acting background shows.",
      uses: "3 / long rest",
      effect: "one ally gains advantage on their next roll"
    },
    {
      name: "Operational Maneuver",
      type: "Bonus Action",
      description: "Reposition team and resources for tactical advantage.",
      uses: "at will",
      effect: "reposition the party without losing momentum"
    },
    // Reactions
    {
      name: "Sneak Attack (Startup Edition)",
      type: "Reaction",
      description: "When you have advantage or an ally nearby, deal extra impact damage.",
      uses: "1 / turn",
      effect: "+2d6 impact when the timing is right"
    }
  ],

  // ==========================================
  // SPELLS TAB
  // ==========================================
  spells: {
    spellcastingAbility: "CHA",
    spellSaveDC: 15,
    spellAttackBonus: 7,
    cantrips: [
      { name: "Networking", castTime: "At will", range: "60 ft", description: "Make a professional connection with anyone in range. The foundation of community building.", dndEquivalent: "Message", cvMeaning: "LinkedIn, warm intros, event networking" },
      { name: "Prestidigitation", castTime: "At will", range: "Touch", description: "Minor business magic - fix small problems, clean up messes, make a good impression.", dndEquivalent: "Prestidigitation", cvMeaning: "small operational fixes, presentation polish" },
      { name: "User Research", castTime: "At will", range: "30 ft", description: "Understand what users really need beyond what they say. Detect underlying motivations.", dndEquivalent: "Guidance", cvMeaning: "interviews, user testing, empathy mapping" }
    ],
    level1: [
      { name: "Charm Person", slots: 4, castTime: "1 action", range: "30 ft", description: "Win someone over in a meeting. They regard you as a friendly acquaintance for 1 hour.", dndEquivalent: "Charm Person", cvMeaning: "win the meeting; friendly acquaintance for 1 hour" },
      { name: "Comprehend Languages", slots: 4, castTime: "1 action", range: "Self", description: "Understand technical jargon in any domain - AI, finance, legal, academic.", dndEquivalent: "Comprehend Languages", cvMeaning: "jargon in any domain — AI, finance, legal, academic" }
    ],
    level2: [
      { name: "Detect Thoughts", slots: 3, castTime: "1 action", range: "Self", description: "Read what stakeholders really want beyond their words. Essential for negotiations.", dndEquivalent: "Detect Thoughts", cvMeaning: "read what stakeholders really want beyond their words" },
      { name: "Suggestion", slots: 3, castTime: "1 action", range: "30 ft", description: "Plant an idea that seems reasonable and natural. The seed grows on its own.", dndEquivalent: "Suggestion", cvMeaning: "plant a reasonable idea; the seed grows on its own" }
    ],
    level3: [
      { name: "Sending", slots: 2, castTime: "1 action", range: "Unlimited", description: "Communicate with anyone, anywhere. Perfect for cold outreach that actually gets responses.", dndEquivalent: "Sending", cvMeaning: "cold outreach that actually gets responses; unlimited range" },
      { name: "Tongues", slots: 2, castTime: "1 action", range: "Touch", description: "Speak any professional language fluently - startup, corporate, academic, government.", dndEquivalent: "Tongues", cvMeaning: "speak startup, corporate, academic and government fluently" },
      // featured: OPTIONAL additive flag — this is the prototype's one highlighted spell
      // (oxblood badge + name); renderSpells() checks it to add a guarded modifier class.
      { name: "Recruit", slots: 2, castTime: "1 action", range: "60 ft", description: "Recruit characters up to 7 levels higher to your party at will. Can convince senior leaders to join your cause.", dndEquivalent: "Hypnotic Pattern", cvMeaning: "recruit characters up to 7 levels higher to your party", featured: true }
    ]
  },

  // ==========================================
  // INVENTORY TAB
  // ==========================================
  // Order is sorted descending by gp value (matches the prototype's rendered row order,
  // which is the only consumer of this array's order — see renderInventory()).
  inventory: [
    { name: "Network of VCs", weight: "—", qty: 1, value: "100 gp", notes: "Thomas Wolf, LUMO Labs, Shamrock…", active: true },
    { name: "International Contacts", weight: "—", qty: 1, value: "80 gp", notes: "Stanford, ESA, Greenpeace level", active: true },
    { name: "Customer Interview Notes", weight: "—", qty: 500, value: "50 gp", notes: "500+ interviews documented", active: true },
    { name: "Challenge Design Framework", weight: "—", qty: 1, value: "40 gp", notes: "10-week AI challenge template", active: true },
    { name: "Experiment Backlog", weight: "—", qty: 1, value: "30 gp", notes: "validated learning archive", active: true },
    { name: "Product Roadmap", weight: "—", qty: 1, value: "25 gp", notes: "platform development history", active: true },
    { name: "AI/ML Frameworks", weight: "—", qty: 1, value: "20 gp", notes: "technical foundation", active: true },
    { name: "Python Ecosystem", weight: "—", qty: 1, value: "15 gp", notes: "primary programming tool", active: true },
    { name: "Pitch Deck Templates", weight: "—", qty: 1, value: "10 gp", notes: "battle-tested presentations", active: true },
    { name: "Google Sheets Mastery", weight: "—", qty: 1, value: "5 gp", notes: "\"animal in the sheets\"", active: true }
  ],

  // ==========================================
  // FEATURES & TRAITS TAB
  // ==========================================
  features: {
    classFeatures: [
      { name: "Expertise", source: "Founder", description: "double proficiency in Persuasion & Performance: acting background + sales experience" },
      { name: "Sneak Attack (Startup Edition)", source: "Founder", description: "extra impact with advantage or allies nearby; timing is everything" },
      { name: "Cunning Action", source: "Founder", description: "Dash, Disengage or Hide as a bonus action; pivot quickly" },
      { name: "Alertness", source: "feat", description: "+4 initiative, can't be surprised; always aware of opportunities and threats" },
      { name: "Product Sense", source: "Experience", description: "what users need vs. what they say; built from 500+ interviews" },
      { name: "Experiment-Driven", source: "Growth Hacker", description: "systematic experiments to validate hypotheses; data over opinions" },
      { name: "Platform Architect", source: "Founder", description: "designed the platform that let 4500+ engineers create €45M in impact" }
    ],
    backgroundFeature: {
      name: "AI & Startup Network",
      source: "Entrepreneur background",
      description: "call upon 4500+ engineers, founders, investors and institutions for information, resources or introductions"
    },
    // rarity: OPTIONAL additive field (Legendary/Epic tier for the featured-achievement badge pill).
    // Only the 3 items carrying `rarity` render on the Character Sheet's Features tab
    // (curated subset matching the prototype); the full 8-item list stays intact here.
    achievements: [
      { name: "The €45M Crowdsource", description: "", date: "2024", rarity: "Legendary" },
      { name: "4500+ Engineers", description: "Built and mobilized a global AI community", date: "2024" },
      { name: "The Tata Steel Victory", description: "€4.1M in fines", date: "2023", link: "https://siliconcanals.com/fruitpunch-ai-to-monitor-illegal-air-pollution/", rarity: "Legendary" },
      { name: "ESA Partnership", description: "European Space Agency partnership for AI for Earth projects", date: "2021" },
      { name: "€1M Fundraised", description: "VC funding from Thomas Wolf (Hugging Face) and LUMO Labs", date: "2020", link: "https://eu-startups.com/2021/01/dutch-startup-fruitpunch-ai-lands-six-figure-investment-to-create-future-ai-and-data-talent-for-good" },
      { name: "10/10 Research", description: "Perfect score on Brain Computer Interfacing research", date: "2018" },
      { name: "The Successful Exit", description: "acquired by Zindi, 2025", date: "2025", rarity: "Epic" },
      { name: "Platform Built", description: "Built online platform matching AI engineers with impact projects for volunteer work", date: "2018-2024" }
    ]
  },

  // ==========================================
  // BACKGROUND TAB
  // ==========================================
  background: {
    name: "Entrepreneur",
    template: "Criminal",
    skillProficiencies: ["Persuasion", "Stealth"],
    toolProficiencies: ["Thieves' Tools", "Gaming Set"],
    equipment: "Dark clothes, crowbar (for breaking into markets)",
    // Note: personalityTraits/bonds/flaws each carry 3 candidates; the Character Sheet's
    // Background tab renders only the first (curation = existing array order, no data removed).
    personalityTraits: [
      "Getting people excited for collaboration and new endeavors, from founders to senior leaders.",
      "I translate high-level ideas into testable experiments",
      "I believe in doing the right thing, even when it's not the easy thing"
    ],
    // featured: OPTIONAL additive rank field. Only the 2 ideals carrying `featured` are
    // joined into the Background tab's single "Ideals" line (rendered in `featured` order);
    // Interdependence stays in the data, unfeatured, per the prototype's curation.
    ideals: [
      { name: "Interdependence", description: "We rise by lifting others.", alignment: "Good" },
      { name: "Responsibility", description: "Nothing is impossible to those who will try.", alignment: "Chaotic", featured: 2 },
      { name: "Impact", description: "Technology should serve humanity, not the other way around.", alignment: "Good", featured: 1 }
    ],
    bonds: [
      "The AI engineers I've worked with are like family.",
      "I owe everything to my co-founders and early believers",
      "The platform we built represents years of learning and iteration"
    ],
    flaws: [
      "I struggle with purely theoretical work — I need real-world impact.",
      "I can be too idealistic about what startups can achieve",
      "I sometimes move too fast and need to slow down for others"
    ],
    characteristics: {
      faith: "Panpsychism.",
      origin: "Grew up in parents' pawn shop in the Netherlands",
      formerLife: "Professional teen actor (Groen Casting, 2010-2015)",
      firstGig: "First paid acting gig for IKEA at 14 years old (2010)",
      artToEngineering: "Made art and performed until discovering engineering and the power of technology for good",
      // backgroundStory: merged single-paragraph Origin Story narrative (verbatim prototype
      // copy), replacing the old shorter summary. origin/formerLife/firstGig/artToEngineering
      // above are kept untouched (no longer individually rendered on this tab, per the
      // prototype's 2-section Background tab; still available in data for future use).
      backgroundStory: "Grew up in the family pawn shop in the Netherlands — learned to see value where others don't. Professional teen actor (Groen Casting, 2010–2015; first paid gig an IKEA commercial at 14), festival security guard, physics & chemistry teacher, then Mechanical Engineering & Neuroscience with a Data Science extension at TU/e, researching brain-computer interfaces. Helped found the university's AI institute (EAISI), dropped out of the MSc to found FruitPunch AI: seven years, 4500+ engineers, €45M crowdsourced, acquired by Zindi in 2025."
    }
  },

  // ==========================================
  // NOTES TAB - VOUCHES
  // ==========================================
  vouches: [
    {
      text: "Getting people excited for collaboration and new endeavors, from founders to senior leaders.",
      author: "Sako Arts",
      role: "Cofounder & CTO, FruitPunch AI"
    },
    {
      text: "Inspiring people to stay true to their goals and ideals, regardless of what others think, or where the money may push him to go.",
      author: "Daan Streng",
      role: "Chief Engineer, FruitPunch AI"
    },
    {
      text: "The strong ability to translate high-level ideas into testable experiments — a plan grounded in truth.",
      author: "Dorian Groen",
      role: "Challenge Manager, FruitPunch AI"
    },
    {
      text: "Galvanizing AI engineers to apply their skills towards global challenges and the greater good.",
      author: "Arjé Cahn",
      role: "Investor, Shamrock Ventures"
    }
  ],

  // featured: OPTIONAL additive flag. Only the 6 flagged orgs render as name-only chips
  // on the Character Sheet's Notes tab (curated subset matching the prototype); all 9
  // organizations stay in the data, untouched, for other pages (e.g. contact.html).
  organizations: [
    { name: "Open Edge HPC Initiative", role: "Board Member", dates: "Jun 2023 - Oct 2025", description: "Fostering open ecosystem for Arm & RISC-V technologies. Built consortium with Arm, Huawei, Fraunhofer.", url: "https://openedgehpc.org", featured: true },
    { name: "Founder Space Utrecht", role: "Co-Founder", dates: "Apr 2024 - Oct 2025", description: "Community-first coworking for impact startup founders. 10 startups hosted, sold for profit.", url: null, featured: true },
    { name: "Nationale Coalitie Duurzame Digitalisering", role: "Board Member", dates: "Jul 2024 - May 2025", description: "Shaping goals of Dutch Coalition for Sustainable Digitization.", url: null },
    { name: "Sigma Squared Society", role: "Executive, Dutch Chapter", dates: "Oct 2022 - Mar 2024", description: "Global community of impactful founders under 26. Led Dutch chapter, 14 events, 50% female founders.", url: "https://sigma-squared.org", featured: true },
    { name: "Provincie Noord-Brabant", role: "AI Advisory Board Member", dates: "Sep 2022 - Apr 2024", description: "Advised Dutch government (Brabant region) on AI policy & actions.", url: null },
    { name: "KICKOFF EHV", role: "External Affairs", dates: "Sep 2018 - Jul 2019", description: "Student entrepreneur community at TU/e. Revived community and organized monthly events.", url: null },
    { name: "NL AI Coalitie", role: "Member", dates: "2020 - Present", description: "Dutch national AI coalition.", url: "https://nlaic.com", featured: true },
    { name: "TU/e Alumni", role: "Active Alumnus", dates: "2018 - Present", description: "Eindhoven University of Technology alumni network.", url: "https://tue.nl", featured: true },
    { name: "Tim Draper's Network State", role: "Member", dates: "2023 - Present", description: "Part of the global founder network.", url: null, featured: true }
  ],

  // ==========================================
  // EXTRAS TAB
  // ==========================================
  extras: {
    funFacts: [
      "Grew up in a pawn shop (parents' business)",
      "Professional teen actor (Groen Casting) - first paid gig for IKEA at 14",
      "Part of Tim Draper's network state",
      "Loves bodybuilding, rollerblading, climbing, ocean",
      "Philosophy & politics nerd",
      "Dreams of building a coliving community / network state"
    ],
    interests: [
      "Energy tech",
      "Climate tech",
      "Deeptech AI",
      "AI for Good applications",
      "Participatory democracy",
      "Challenge-based learning"
    ]
  }
};

// ==========================================
// CAMPAIGNS DATA (Work History)
// ==========================================
const campaignsData = [
  {
    id: "fruitpunch-saga",
    name: "The FruitPunch Saga",
    dates: "Sep 2018 - May 2025",
    duration: "7 years",
    summary: "Built a platform for AI engineers to train their skills by crowdsourcing solutions for impact organizations. Made all key product decisions: user interviews, experience design, and experiments to figure out what works.",
    outcome: "Acquired by Zindi",
    party: "Co-founded with Sako Arts and team",
    partners: ["Stanford", "ESA", "Greenpeace", "WWF", "NXP", "Huawei", "Philips", "AWS", "United Nations"],
    adventures: [
      {
        id: "the-exit",
        name: "The Exit",
        dates: "2025",
        summary: "Acquisition by Zindi - successful exit.",
        encounters: [
          { name: "Acquisition Negotiations", description: "Deal with Zindi closed - 7 years of building resulted in successful exit" },
          { name: "Transition Planning", description: "Ensuring smooth handover of platform and community" }
        ]
      },
      {
        id: "the-growth",
        name: "The Growth",
        dates: "2023-2024",
        summary: "Scaling to 4500+ engineers and €45M crowdsourced impact.",
        encounters: [
          { name: "4500th Engineer", description: "Global AI community reaches massive scale" },
          { name: "€45M Milestone", description: "Crowdsourced engineering value reaches €45M" },
          { name: "80+ Partners", description: "Partner network expands to 80+ organizations globally" }
        ]
      },
      {
        id: "the-giants",
        name: "The Giants",
        dates: "2021-2023",
        summary: "Partnerships with major organizations and massive impact.",
        encounters: [
          { name: "Tata Steel Victory", description: "AI against Toxic Clouds challenge with Greenpeace caused €4.1M in fines. Dutch ministry started external monitoring.", notable: true, link: "https://siliconcanals.com/fruitpunch-ai-to-monitor-illegal-air-pollution/" },
          { name: "Stanford Collaboration", description: "World's top research university joins forces", notable: true },
          { name: "ESA Project Launch", description: "European Space Agency partnership for AI for Earth", notable: true },
          { name: "Greenpeace Alliance", description: "Environmental giant joins the mission" },
          { name: "Corporate Deals", description: "NXP, Huawei, Philips partnerships closed" }
        ],
        projects: [
          { name: "AI against Toxic Clouds", link: "/fruitpunch/challenges/ai-against-toxic-clouds/", description: "Automated detection of illegal PAH emissions from Tata Steel" },
          { name: "AI-powered Wildlife Conservation", link: "/fruitpunch/blog/ai-powered-wildlife-conservation-in-africa/" },
          { name: "AI for Coral Reefs", link: "/fruitpunch/challenges/ai-for-coral-reefs/" },
          { name: "AI against Oil Spills", link: "/fruitpunch/blog/how-we-detect-oil-spills/" },
          { name: "AI for Forest Elephants", link: "/fruitpunch/blog/listening-to-the-giants-protecting-forest-elephants-through-audio-monitoring/" },
          { name: "Heart Failure Detection", link: "/fruitpunch/blog/can-ai-detect-heart-failure-from-electrocardiograms/" },
          { name: "Sepsis Prevention", link: "/fruitpunch/blog/how-we-applied-ai-to-prevent-sepsis-in-preterm-babies/" }
        ]
      },
      {
        id: "the-fundraise",
        name: "The Fundraise",
        dates: "2020",
        summary: "Raised €1M VC funding to scale the platform.",
        encounters: [
          { name: "Thomas Wolf Investment", description: "Hugging Face founder believed in the vision", notable: true },
          { name: "LUMO Labs Partnership", description: "Accelerator partnership secured", link: "https://lumolabs.io/lumo-labs-invests-in-fruitpunch-ais-approach-to-creating-future-ai-and-data-talent/" },
          { name: "€1M Raised", description: "Total VC funding reached €1M", notable: true, link: "https://eu-startups.com/2021/01/dutch-startup-fruitpunch-ai-lands-six-figure-investment-to-create-future-ai-and-data-talent-for-good" },
          { name: "The 200+ Pitches", description: "Pitched to over 200 VCs - resilience tested" }
        ]
      },
      {
        id: "the-platform",
        name: "Building the Platform",
        dates: "2019-2020",
        summary: "Designed and built the online platform matching AI engineers with impact projects. Made all key product decisions.",
        encounters: [
          { name: "First User Interviews", description: "Conducted first of 500+ user and customer interviews to understand engineer needs" },
          { name: "Challenge Design", description: "Designed the 10-week challenge-based learning experience from first principles" },
          { name: "Platform Launch", description: "Online matching platform goes live" },
          { name: "Iteration Cycles", description: "Ran dozens of experiments to figure out what engagement models work" }
        ]
      },
      {
        id: "the-founding",
        name: "The Founding",
        dates: "2018-2019",
        summary: "Started as NGO, bootstrapped through passion and determination. First AI for Wildlife challenge in South Africa.",
        encounters: [
          { name: "AI for Wildlife Launch", description: "First challenge - autonomous drone with thermal cameras to detect poachers in South Africa's Pilanesberg reserve", notable: true },
          { name: "First 100 Engineers", description: "Recruited the first 100 AI engineers to the platform" },
          { name: "First Impact Project", description: "Completed first AI for Good challenge - proving the model works" }
        ]
      }
    ]
  },
  {
    id: "zindi-transition",
    name: "The Zindi Transition",
    dates: "May 2025 - Oct 2025",
    duration: "6 months",
    summary: "Ensuring smooth transition post-acquisition.",
    adventures: [
      {
        id: "the-handover",
        name: "The Handover",
        dates: "2025",
        role: "VP of Partnerships",
        organization: "Zindi",
        summary: "Post-acquisition role ensuring smooth transition.",
        encounters: [
          { name: "Partnership Transfers", description: "Successfully transferred all 80+ partnerships" },
          { name: "Community Migration", description: "Migrated 4500+ community members to new home" }
        ]
      }
    ]
  },
  {
    id: "academic-archives",
    name: "The Academic Archives",
    dates: "2014 - 2022",
    duration: "8 years",
    summary: "Building AI research infrastructure and pioneering brain-computer interfaces.",
    adventures: [
      {
        id: "institute-builders",
        name: "The Institute Builders",
        dates: "2019-2022",
        role: "AI Program Manager",
        organization: "EAISI @ TU/e",
        summary: "Founding team of the AI institute at TU/e.",
        encounters: [
          { name: "AI Experience Room", description: "Built room with 6 physical AI demos for visitors" },
          { name: "Professor Recruitment", description: "Helped recruit AI professors to build the institute" },
          { name: "Founding Team Assembly", description: "Built and managed the initial EAISI team" },
          { name: "TU/e AI Course", description: "Launched accredited AI for Coral Reefs course for 135 CS students with Prof. Dirk Fahland" }
        ]
      },
      {
        id: "engineering-foundation",
        name: "The Engineering Foundation",
        dates: "2014-2018",
        role: "Student",
        organization: "TU/e",
        summary: "BSc Mechanical Engineering & Neuroscience with Data Science extension.",
        encounters: [
          { name: "10/10 BCI Research", description: "Perfect score on Brain Computer Interfacing thesis", notable: true },
          { name: "Brain Organoid Discovery", description: "Showed functional brain organoids can be grown on a chip" },
          { name: "60 ECTS Data Science", description: "Extended studies with additional AI/ML courses" }
        ]
      },
      {
        id: "dropout-decision",
        name: "The Dropout Decision",
        dates: "2018-2019",
        summary: "MSc Data Science - dropped out to start FruitPunch AI.",
        encounters: [
          { name: "The Choice", description: "Chose real-world impact over theoretical studies - no regrets" }
        ]
      }
    ]
  },
  {
    id: "early-years",
    name: "The Early Years",
    dates: "2010 - 2018",
    duration: "8 years",
    summary: "Origin story: building diverse experience from acting to engineering.",
    adventures: [
      { id: "the-code", name: "The Code", dates: "2018-2019", role: "Software Developer", organization: "Webholders", summary: "Co-founded web development agency." },
      { id: "the-classroom", name: "The Classroom", dates: "2016-2018", role: "Teacher", organization: "Lyceo", summary: "Teaching physics and chemistry to exam students." },
      { id: "the-watch", name: "The Watch", dates: "2014-2016", role: "Event Security Officer", organization: "Crowd Support", summary: "Security at hardstyle festivals, graveyard shifts." },
      { id: "the-stage", name: "The Stage", dates: "2010-2015", role: "Actor", organization: "Groen Casting", summary: "Professional teen actor in Amsterdam. First paid gig for IKEA at 14 (2010).", encounters: [
        { name: "First IKEA Gig", description: "First paid acting job at 14 years old for IKEA commercial (2010)", notable: true }
      ] }
    ]
  }
];

// Side Quests (Volunteer & Board)
const sideQuests = [
  { name: "Open Edge HPC Initiative", role: "Board Member", dates: "Jun 2023 - Oct 2025", description: "Built consortia with Arm, Huawei, Fraunhofer for open HPC ecosystem", url: "https://openedgehpc.org" },
  { name: "Founder Space Utrecht", role: "Co-Founder", dates: "Apr 2024 - Oct 2025", description: "10 startups hosted, sold for profit" },
  { name: "Nationale Coalitie Duurzame Digitalisering", role: "Strategic Board Member", dates: "Jul 2024 - May 2025", description: "Shaped Dutch Coalition for Sustainable Digitization" },
  { name: "Sigma Squared Society", role: "Executive, Dutch Chapter", dates: "Oct 2022 - Mar 2024", description: "Led Dutch chapter, 14 events, 50% female founders", url: "https://sigma-squared.org" },
  { name: "Provincie Noord-Brabant", role: "AI Advisory Board Member", dates: "Sep 2022 - Apr 2024", description: "Advised Dutch government on AI policy" },
  { name: "KICKOFF EHV", role: "External Affairs", dates: "Sep 2018 - Jul 2019", description: "Revived student entrepreneur community at TU/e" }
];

// Notable Achievements
const notableAdventures = [
  { name: "The €45M Crowdsource", description: "Mobilized €45M worth of AI engineering for impact organizations", date: "2024", category: "Impact" },
  { name: "The Tata Steel Victory", description: "AI against Toxic Clouds challenge with Greenpeace caused €4.1M in fines for Tata Steel. Dutch ministry started external monitoring.", date: "2023", category: "Impact", link: "https://siliconcanals.com/fruitpunch-ai-to-monitor-illegal-air-pollution/" },
  { name: "The Stanford Partnership", description: "Collaboration with world's top research university", date: "2021", category: "Partnership" },
  { name: "The ESA Partnership", description: "European Space Agency partnership for AI for Earth projects using Sentinel-2 satellite data", date: "2021", category: "Partnership" },
  { name: "The €1M Fundraise", description: "Raised €1M VC funding from Thomas Wolf (Hugging Face) and LUMO Labs", date: "2020", category: "Funding", link: "https://eu-startups.com/2021/01/dutch-startup-fruitpunch-ai-lands-six-figure-investment-to-create-future-ai-and-data-talent-for-good" },
  { name: "The Successful Exit", description: "FruitPunch AI acquired by Zindi", date: "2025", category: "Exit" },
  { name: "The Brain Breakthrough", description: "10/10 research on functional brain organoids", date: "2018", category: "Research" },
  { name: "The Community of 4500", description: "Built global AI engineer community", date: "2024", category: "Community" },
  { name: "The Platform Launch", description: "Built online platform matching AI engineers with impact projects for volunteer work", date: "2019", category: "Product" }
];

const notableEncounters = [
  { name: "The Acquisition Signing", description: "Deal closed with Zindi - 7 year journey complete", date: "2025", category: "Exit" },
  { name: "The 4500th Engineer", description: "Global AI community reaches milestone scale", date: "2024", category: "Community" },
  { name: "The Tata Steel Fines", description: "€4.1M in fines issued, Dutch ministry starts external monitoring", date: "2023", category: "Impact" },
  { name: "The Stanford Deal", description: "World's top research university signs partnership", date: "2021", category: "Partnership" },
  { name: "The ESA Launch", description: "European Space Agency partnership begins", date: "2021", category: "Partnership" },
  { name: "The Thomas Wolf Investment", description: "Hugging Face founder believed in the vision", date: "2020", category: "Funding" },
  { name: "The €1M Close", description: "VC funding round completed", date: "2020", category: "Funding" },
  { name: "The AI for Wildlife Launch", description: "First challenge launched - poacher detection in South Africa", date: "2018", category: "Product" },
  { name: "The First 100", description: "First 100 AI engineers joined FruitPunch", date: "2019", category: "Community" },
  { name: "The Perfect Score", description: "10/10 on BCI thesis", date: "2018", category: "Research" },
  { name: "The Government Advisory", description: "Dutch government seeks AI guidance", date: "2022", category: "Advisory" },
  { name: "The First IKEA Gig", description: "First paid acting job at 14 years old", date: "2010", category: "Origin" }
];

// Partner Logos (for social proof)
const partnerLogos = {
  tier1: [
    { name: "European Space Agency", abbr: "ESA", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d588623620967a2c9f9090.png" },
    { name: "United Nations", abbr: "UN", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58862c1e4ef1e342061ca.png" },
    { name: "World Wide Fund for Nature", abbr: "WWF", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d5886247b9d4827a2d45ae.png" },
    { name: "Amazon Web Services", abbr: "AWS", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58861355bb2094fd82b9f.png" }
  ],
  tier2: [
    { name: "Eindhoven University of Technology", abbr: "TU/e", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58a4c5bef065a48fd11c7.png" },
    { name: "Vrije Universiteit Amsterdam", abbr: "VU", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d5886202d4413d7f55b70a.png" },
    { name: "NL AI Coalitie", abbr: "NLAIC", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58862355bb22facd82ba0.png" }
  ],
  tier3: [
    { name: "Axelera AI", abbr: "Axelera", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58862074baa3ed7280fc8.png" },
    { name: "Roboflow", abbr: "Roboflow", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d588628cb7f98cb1d3390e.png" },
    { name: "Cape AI", abbr: "Cape AI", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d588623749cc424d804519.png" },
    { name: "ML6", abbr: "ML6", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d58861c1e4ef5bc02061b7.png" },
    { name: "Space 4 Good", abbr: "S4G", logo: "fruitpunch/assets/asset__623d7d246e8213dbe6aace84_62d588625bef0615f0fcfef1.png" }
  ]
};

// AI for Good Projects - All 24 blog posts
const aiForGoodProjects = [
  // Wildlife
  { category: "Wildlife", name: "AI-powered Wildlife Conservation in Africa", link: "/fruitpunch/blog/ai-powered-wildlife-conservation-in-africa/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641cd12fd14fd9cef2776fa_header.jpeg.jpeg" },
  { category: "Wildlife", name: "Listening to the Giants: Forest Elephants", link: "/fruitpunch/blog/listening-to-the-giants-protecting-forest-elephants-through-audio-monitoring/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_66333fa3e30d0d2a2b8e5eac_header.jpeg.jpeg" },
  { category: "Wildlife", name: "Tracking Turtles with AI", link: "/fruitpunch/blog/tracking-turtles-how-ai-helps-conservationists-to-re-identify-sea-turtles/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_663361075d73d9047e74b26b_header.jpeg.jpeg" },
  { category: "Wildlife", name: "The Bear Necessity of AI in Conservation", link: "/fruitpunch/blog/the-bear-necessity-of-ai-in-conservation/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6643611db64f259e60a5aaca_header.jpeg.jpeg" },
  { category: "Wildlife", name: "Counting Pelicans in the Danube Delta", link: "/fruitpunch/blog/flying-high-with-ai-counting-pelican-breeding-pairs-in-the-danube-delta/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641d88f832415aafea0c3e2_header.png.png" },
  { category: "Wildlife", name: "Birdwatching Revolution with AI", link: "/fruitpunch/blog/from-pixels-to-preservation-how-ai-gives-rise-to-a-birdwatching-revolution/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_66335b008479305b73129072_header.jpeg.jpeg" },
  { category: "Wildlife", name: "Understanding Seals with AI", link: "/fruitpunch/blog/understanding-seals-with-ai/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6633589d9e444f3244d43236_header.jpeg.jpeg" },
  { category: "Wildlife", name: "Automated Wildlife Taxonomy", link: "/fruitpunch/blog/solving-automated-wildlife-taxonomy-with-ai/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_66335bfe1a999152a6dbfe26_header.png.png" },
  { category: "Wildlife", name: "Model Optimization for Poacher Detection", link: "/fruitpunch/blog/model-optimization-and-pruning-of-poacher-detecting-yolov5/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_66335cc02d12933658564da2_header.jpeg.jpeg" },
  
  // Earth
  { category: "Earth", name: "AI for Coral Reefs", link: "/fruitpunch/challenges/ai-for-coral-reefs/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6633521ff6c8da6a897ef8ab_header.jpeg.jpeg" },
  { category: "Earth", name: "Detecting Oil Spills on Open Sea", link: "/fruitpunch/blog/how-we-detect-oil-spills/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_667bd8983a99eb471f03d3cd_header.jpeg.jpeg" },
  { category: "Earth", name: "Going Inland to Clean Oil Spills", link: "/fruitpunch/blog/ai-against-oil-spills-going-inland-to-clean-oil-spills-with-ai/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641dde23e855f21eac89f80_header.jpeg.jpeg" },
  { category: "Earth", name: "AI for Flood Prediction", link: "/fruitpunch/blog/ai-based-early-warning-system-for-river-floods/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_663359f42272f941bac71e40_header.jpeg.jpeg" },
  { category: "Earth", name: "Classifying Flooded Forests in Satellite Data", link: "/fruitpunch/blog/the-pains-of-classifying-flooded-forests-in-satellite-data/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641d523ea67321016aa9c82_header.jpeg.jpeg" },
  { category: "Earth", name: "Tracking Reforestation with AI", link: "/fruitpunch/blog/can-ai-track-reforestation-projects-using-drone-and-satellite-data/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641c8823a2d1861f07fbe62_header.png.png" },
  { category: "Earth", name: "Vehicle Sensors for Sustainable Cities", link: "/fruitpunch/blog/how-to-use-vehicle-sensors-to-make-cities-more-sustainable/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641d69dbe76045b970e6caa_header.png.png" },
  { category: "Earth", name: "LLMs for Business Sustainability", link: "/fruitpunch/blog/leveraging-large-language-models-to-make-businesses-around-the-world-more-sustainable/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641daa41279c3ca329791a6_header.jpeg.jpeg" },
  
  // Health
  { category: "Health", name: "Heart Failure Detection from ECGs", link: "/fruitpunch/blog/can-ai-detect-heart-failure-from-electrocardiograms/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641d5f44ba58d59226b5e47_header.png.png" },
  { category: "Health", name: "Preventing Sepsis in Preterm Babies", link: "/fruitpunch/blog/how-we-applied-ai-to-prevent-sepsis-in-preterm-babies/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641cf46dd58a961950cb268_header.png.png" },
  { category: "Health", name: "Prioritizing Essential Care with AI", link: "/fruitpunch/blog/prioritizing-essential-care-with-ai/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6798efc44097af4454e6f6f8_header.jpeg.jpeg" },
  
  // Other
  { category: "Autonomous", name: "Autonomous Fixed-Wing UAV Landing", link: "/fruitpunch/blog/autonomous-flight-and-the-landing-of-a-fixed-wing-uav/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641c9dc690de4376b9fb022_header.jpeg.jpeg" },
  { category: "MLOps", name: "User-friendly Wilderness-proof MLOps", link: "/fruitpunch/blog/user-friendly-wilderness-proof-mlops/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641ce707ba5c7a65616cbaa_header.jpeg.jpeg" },
  { category: "Safety", name: "AI for Road Safety", link: "/fruitpunch/blog/ai-and-visualisations-a-data-driven-all-rounded-approach-for-road-safety/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_6641dcd23e855f21eac7935a_header.jpeg.jpeg" },
  { category: "Community", name: "FruitPunch AI 2.0: Community Driven", link: "/fruitpunch/blog/fruitpunch-ai-2-0-community-driven/", image: "fruitpunch/assets/62604c2173fafef5f182b55a_669537b602b727a016d8e1ba_Screenshot_202021-09-01_20at_2019.21.05_20_2_.png.png" }
];

// Media mentions
const mediaMentions = {
  podcasts: [
    { name: "AI Game Changers", title: "AI Game Changers with Buster Franken - FruitPunch", date: "Dec 2022", platform: "Spotify", url: "https://creators.spotify.com/pod/profile/aigamechangers/episodes/AI-Game-Changers-with-Buster-Franken---FruitPunch-e1ruv3r", description: "Discussion about FruitPunch AI's mission to develop challenge-based AI education." },
    { name: "The Automagic Podcast", title: "Building AI Projects for Social Impact", date: "Jan 2023", platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/building-ai-projects-for-social-impact/id1573599014?i=1000594240922", description: "With Jasper Wognum about building AI projects for social impact." },
    { name: "Innovators Can Laugh", title: "Transforming Diverse Experiences into FruitPunch AI", date: "Aug 2023", platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/how-buster-transformed-his-diverse-experiences-into/id1567328445?i=1000623992011", description: "Dutch Startups series - how diverse background led to creating 2,500 engineer community." },
    { name: "Learning to be a Leader", title: "How to Maximize Human Potential", date: "Jun 2024", platform: "Substack", url: "https://evakuttichova.substack.com/p/how-to-maximize-human-potential-with", description: "With Eva Kuttichova about FruitPunch's 50-year plan and education approaches." }
  ],
  press: [
    { name: "EU-Startups", title: "Dutch startup FruitPunch AI lands six-figure investment", date: "Jan 2021", url: "https://eu-startups.com/2021/01/dutch-startup-fruitpunch-ai-lands-six-figure-investment-to-create-future-ai-and-data-talent-for-good", description: "Coverage of seed funding round." },
    { name: "Silicon Canals", title: "Greenpeace, FrisseWind and FruitPunch AI team up to monitor illegal air pollution", date: "2022", url: "https://siliconcanals.com/fruitpunch-ai-to-monitor-illegal-air-pollution/", description: "Coverage of AI against Toxic Clouds challenge." },
    { name: "Brainport Eindhoven", title: "Founder FruitPunch AI about leveraging AI for social impact", date: "2022", url: "https://brainporteindhoven.com/en/news/founder-fruitpunch-ai-about-leveraging-ai-for-social-impact", description: "Interview about AI for Good mission." },
    { name: "LUMO Labs", title: "LUMO Labs invests in FruitPunch AI's approach", date: "2021", url: "https://lumolabs.io/lumo-labs-invests-in-fruitpunch-ais-approach-to-creating-future-ai-and-data-talent/", description: "Investment announcement and company overview." }
  ],
  profiles: [
    { name: "Crunchbase", url: "https://www.crunchbase.com/organization/fruitpunch-ai", description: "Company profile with funding history." },
    { name: "Tracxn", url: "https://tracxn.com/d/companies/fruitpunch-ai", description: "Detailed company analytics." },
    { name: "Authory", url: "https://authory.com/Buster", description: "Portfolio as Sigma Squared Executive." }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { characterData, campaignsData, sideQuests, notableAdventures, notableEncounters, partnerLogos, aiForGoodProjects, mediaMentions };
}
