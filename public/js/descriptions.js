/* ============================================
   DESCRIPTIONS - D&D Definitions & CV Mappings
   ============================================ */

// Ability Score Descriptions
const abilityDescriptions = {
  str: {
    dndDefinition: "Strength measures physical power, athletic training, and the extent to which you can exert raw physical force. A Strength check can model any attempt to lift, push, pull, or break something.",
    artLabel: 'commissioned art — "impact force"',
  },
  dex: {
    dndDefinition: "Dexterity measures agility, reflexes, and balance. A Dexterity check can model any attempt to move nimbly, quickly, or quietly, or to keep from falling on tricky footing.",
    artLabel: 'commissioned art — "the pivot dance"',
  },
  con: {
    dndDefinition: "Constitution measures health, stamina, and vital force. Constitution checks are uncommon, and no skills apply. A Constitution check can model your attempt to push beyond normal limits.",
    artLabel: 'commissioned art — "the long march"',
  },
  int: {
    dndDefinition: "Intelligence measures mental acuity, accuracy of recall, and the ability to reason. An Intelligence check comes into play when you need to draw on logic, education, memory, or deductive reasoning.",
    artLabel: 'commissioned art — "the scholar of three schools"',
  },
  wis: {
    dndDefinition: "Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition. A Wisdom check might reflect an effort to read body language or understand someone's feelings.",
    artLabel: 'commissioned art — "the counsel of elders"',
  },
  cha: {
    dndDefinition: "Charisma measures your ability to interact effectively with others. It includes factors such as confidence and eloquence, and it can represent a charming or commanding personality.",
    photoCaption: 'The Face of the Party',
  }
};

// Skill Descriptions
const skillDescriptions = {
  // STR
  athletics: {
    dndDefinition: "Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. It's also used for grappling and shoving.",
    cvMeaning: "Fundraising Stamina",
    cvDescription: "The physical and mental endurance needed to pitch to 200+ VCs, attend countless events, and push through rejection after rejection."
  },
  
  // DEX
  acrobatics: {
    dndDefinition: "Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as running across ice or balancing on a tightrope.",
    cvMeaning: "Pivoting & Adapting",
    cvDescription: "The agility to quickly change direction when market conditions shift, pivoting strategy without losing momentum. Essential for startup lifestyle."
  },
  sleightofhand: {
    dndDefinition: "Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone or concealing an object on your person, make a Dexterity (Sleight of Hand) check.",
    cvMeaning: "Operational Efficiency",
    cvDescription: "Juggling multiple priorities, handling details without anyone noticing, making complex operations look effortless. Fast execution."
  },
  stealth: {
    dndDefinition: "Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone.",
    cvMeaning: "Stealth Mode Building",
    cvDescription: "Working behind the scenes before a big launch, building quietly before announcing, strategic timing of information. Quiet product development."
  },
  
  // INT
  arcana: {
    dndDefinition: "Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.",
    cvMeaning: "AI/ML Technical Knowledge",
    cvDescription: "Deep understanding of artificial intelligence, machine learning models, neural networks, and the 'magic' of modern technology. Built AI platform used by 4500+ engineers."
  },
  history: {
    dndDefinition: "Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.",
    cvMeaning: "Teaching & Past Lessons",
    cvDescription: "Learning from past mistakes, teaching others (physics & chemistry), understanding what has worked before in business and technology. Iterating based on experience."
  },
  investigation: {
    dndDefinition: "When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object or discern the weakest point in a tunnel.",
    cvMeaning: "User Research & Data Analysis",
    cvDescription: "Data-driven decision making, 500+ user and customer interviews conducted, market research, analyzing patterns, A/B testing and experiments. Finding insights that others miss."
  },
  nature: {
    dndDefinition: "Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.",
    cvMeaning: "Ecosystem Understanding",
    cvDescription: "Understanding startup ecosystems, how different players interact, natural market forces. AI for nature projects (Wildlife, Coral Reefs, Forests)."
  },
  religion: {
    dndDefinition: "Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.",
    cvMeaning: "Values & Mission",
    cvDescription: "Understanding what drives people, organizational cultures, ethical frameworks for AI. Strong ethical stance on AI. Galvanizing engineers for global good."
  },
  
  // WIS
  animalhandling: {
    dndDefinition: "When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal's intentions, you make a Wisdom (Animal Handling) check.",
    cvMeaning: "Team Management",
    cvDescription: "Managing teams of engineers (herding cats), understanding what motivates different personalities, keeping morale high. Coordinating distributed teams."
  },
  insight: {
    dndDefinition: "Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone's next move.",
    cvMeaning: "Reading People & Needs",
    cvDescription: "Understanding what stakeholders really want, reading between the lines in negotiations, sensing when something is off. Customer interview insights. Empathy-driven product design."
  },
  medicine: {
    dndDefinition: "A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.",
    cvMeaning: "Problem Diagnosis",
    cvDescription: "Diagnosing what's broken in a business, understanding root causes, knowing when to apply first aid vs. major surgery. AI for Health projects (Heart Failure, Sepsis, COVID)."
  },
  perception: {
    dndDefinition: "Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings.",
    cvMeaning: "Market Awareness",
    cvDescription: "Spotting opportunities before others, noticing market trends, being aware of competitive landscape and emerging threats. Early identification of AI for Good space."
  },
  survival: {
    dndDefinition: "The DM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs of nearby creatures, or avoid natural hazards.",
    cvMeaning: "Startup Survival",
    cvDescription: "Navigating uncertainty, finding resources in scarce environments, knowing when to conserve and when to spend. 7 years of startup survival. Resource-constrained building."
  },
  
  // CHA
  deception: {
    dndDefinition: "Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions.",
    cvMeaning: "Negotiation Tactics",
    cvDescription: "Strategic positioning, 'fake it till you make it', not showing all your cards in negotiations, projecting confidence. Confident pitching."
  },
  intimidation: {
    dndDefinition: "When you attempt to influence someone through overt threats, hostile actions, and physical violence, you make a Charisma (Intimidation) check.",
    cvMeaning: "Commanding Presence",
    cvDescription: "Having presence in a room, commanding attention when needed, being taken seriously in high-stakes situations. Event security background. Authority in meetings."
  },
  performance: {
    dndDefinition: "Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.",
    cvMeaning: "Public Speaking & Pitching",
    cvDescription: "Captivating audiences, delivering compelling pitches, storytelling that moves people to action. Professional actor (2010-2015). First paid IKEA gig at 14 (2010)."
  },
  persuasion: {
    dndDefinition: "When you attempt to influence someone or a group of people with tact, social graces, or good nature, you make a Charisma (Persuasion) check.",
    cvMeaning: "Sales & Partnership Building",
    cvDescription: "Convincing organizations to partner, closing deals, building relationships that lead to €45M in crowdsourced impact. Stanford, ESA, NXP deals."
  }
};

// Combat Stats Descriptions
const combatStatDescriptions = {
  proficiency: {
    dndDefinition: "Your proficiency bonus reflects your overall experience and training. It's added to attack rolls, saving throws, and ability checks where you're proficient.",
    cvMeaning: "Experience Level",
    cvDescription: "+3 reflects 7 years of startup experience, multiple ventures, and deep expertise in AI, community building and business operations."
  },
  initiative: {
    dndDefinition: "Initiative determines the order of turns during combat. At the start of every combat, you roll initiative by making a Dexterity check.",
    cvMeaning: "First Mover Advantage",
    cvDescription: "+8 = DEX (+4) + Alertness feat (+4). Cannot be surprised — always aware of opportunities and threats, first to spot market gaps.",
    breakdown: "DEX modifier (+4) + Alertness Feat (+4) = +8"
  },
  ac: {
    dndDefinition: "Armor Class (AC) represents how hard it is for opponents to land a solid, damaging blow on you.",
    cvMeaning: "Market Protection",
    cvDescription: "Strong positioning through a 4500-engineer community, 80+ partner organizations, and a proven track record that protects against competitive threats."
  },
  speed: {
    dndDefinition: "Speed determines how far you can move on your turn during combat.",
    cvMeaning: "Execution Velocity",
    cvDescription: "Base 30 ft, doubled by Cunning Action: Dash. Willingness to move anywhere for the right opportunity — and sprint when it matters."
  },
  hp: {
    dndDefinition: "Hit Points represent a combination of physical and mental durability, the will to live, and luck.",
    cvMeaning: "Impact Capacity",
    cvDescription: "Hit points measure impact capacity: each point stands for roughly €1M of AI engineering crowdsourced for organizations like Stanford, ESA, Greenpeace and WWF."
  }
};

// Alignment Description
const alignmentDescription = {
  dndDefinition: "Chaotic Good characters do what is necessary to bring about change for the better, disdaining bureaucratic organizations that get in the way of social improvement.",
  cvMeaning: "Impact-Driven Rebel",
  cvDescription: "\"I will always do exactly what I think the right thing to do is.\" Challenges authority when it conflicts with doing good — ask Tata Steel."
};

// Defenses Descriptions
const defenseDescriptions = {
  'resilient-network': {
    dndDefinition: "A network of allies that provides backup support when facing challenges.",
    cvMeaning: "Community Shield",
    cvDescription: "4500+ AI engineers and 80+ partner organizations (Stanford, ESA, Greenpeace, etc.) provide a resilient network that can be called upon for support."
  },
  'pivot-ready': {
    dndDefinition: "The ability to quickly change direction when a situation becomes unfavorable.",
    cvMeaning: "Adaptability",
    cvDescription: "Multiple successful pivots during the FruitPunch journey - from NGO to startup, through COVID, to eventual acquisition. Can quickly adapt to changing situations."
  },
  'community-shield': {
    dndDefinition: "Protection provided by strong community relationships.",
    cvMeaning: "Market Protection",
    cvDescription: "Strong community relationships provide protection against market uncertainties. The community itself becomes a moat."
  }
};

// Conditions Descriptions
const conditionDescriptions = {
  'inspired': {
    dndDefinition: "You have advantage on certain checks due to inspiration.",
    cvMeaning: "Mission-Driven",
    cvDescription: "Advantage on Charisma checks when pursuing impact-driven goals. The mission to create AI for Good provides constant motivation and energy."
  },
  'alert': {
    dndDefinition: "You can't be surprised while conscious. You gain a +4 bonus to initiative.",
    cvMeaning: "Always Aware",
    cvDescription: "The Alertness feat grants +4 to initiative and prevents being caught off guard. Always aware of market changes and opportunities."
  },
  'mission-driven': {
    dndDefinition: "Resistance to effects that would distract from your purpose.",
    cvMeaning: "Focus",
    cvDescription: "Resistance to distractions that don't align with core values. Technology should serve humanity, not the other way around."
  }
};

// Saving Throws Descriptions
const savingThrowDescriptions = {
  str: {
    dndDefinition: "Strength saving throws resist being pushed, knocked down, or physically restrained.",
    cvMeaning: "Resisting Pressure",
    cvDescription: "Resisting external pressure to compromise on values or give up when things get hard.",
    calculation: "STR modifier (+2)"
  },
  dex: {
    dndDefinition: "Dexterity saving throws help you dodge area effects and avoid traps.",
    cvMeaning: "Avoiding Pitfalls",
    cvDescription: "Quick reflexes to avoid market traps and pivot when danger is detected.",
    calculation: "DEX modifier (+4) + Proficiency (+3) = +7",
    proficient: true
  },
  con: {
    dndDefinition: "Constitution saving throws resist poison, disease, and effects that drain vitality.",
    cvMeaning: "Enduring Hardship",
    cvDescription: "Surviving startup hardships, pushing through exhaustion and setbacks.",
    calculation: "CON modifier (+3)"
  },
  int: {
    dndDefinition: "Intelligence saving throws resist effects that assault the mind with illusions or psychic attacks.",
    cvMeaning: "Mental Clarity",
    cvDescription: "Seeing through deceptive business practices and maintaining clear thinking under pressure.",
    calculation: "INT modifier (+2)"
  },
  wis: {
    dndDefinition: "Wisdom saving throws resist charms, frightening effects, and possession.",
    cvMeaning: "Staying True",
    cvDescription: "Resisting pressure to compromise values, staying true to the mission when others try to influence.",
    calculation: "WIS modifier (+3) + Proficiency (+3) = +6",
    proficient: true
  },
  cha: {
    dndDefinition: "Charisma saving throws resist effects that would banish you or force you to a different plane.",
    cvMeaning: "Force of Personality",
    cvDescription: "Using force of personality to resist being pushed out of markets or communities.",
    calculation: "CHA modifier (+4) + Proficiency (+3) = +7",
    proficient: true
  }
};

// Spell Descriptions
const spellDescriptions = {
  'Networking': {
    dndEquivalent: 'Message',
    cvMeaning: 'LinkedIn, warm intros, event networking',
    cvDescription: 'Make professional connections with anyone in range. The foundation of community building. Each connection can open doors to many more.'
  },
  'Prestidigitation': {
    dndEquivalent: 'Prestidigitation',
    cvMeaning: 'Small operational fixes, presentation polish',
    cvDescription: 'Minor business magic - fix small problems, clean up messes, make a good impression. The little touches that make everything work smoothly.'
  },
  'User Research': {
    dndEquivalent: 'Guidance',
    cvMeaning: 'Customer interviews, user testing, empathy mapping',
    cvDescription: 'Understand what users really need beyond what they say. Detect underlying motivations. 500+ user and customer interviews conducted.'
  },
  'Charm Person': {
    dndEquivalent: 'Charm Person',
    cvMeaning: 'First meetings, sales calls, partnership discussions',
    cvDescription: 'Win someone over in a meeting. They regard you as a friendly acquaintance for 1 hour. Essential for building initial relationships.'
  },
  'Comprehend Languages': {
    dndEquivalent: 'Comprehend Languages',
    cvMeaning: 'Cross-functional communication, domain translation',
    cvDescription: 'Understand technical jargon in any domain - AI, finance, legal, academic. Translate between different stakeholder languages.'
  },
  'Detect Thoughts': {
    dndEquivalent: 'Detect Thoughts',
    cvMeaning: 'Reading room dynamics, understanding true objections',
    cvDescription: 'Read what stakeholders really want beyond their words. Essential for negotiations and product decisions.'
  },
  'Suggestion': {
    dndEquivalent: 'Suggestion',
    cvMeaning: 'Influential proposals, gentle steering',
    cvDescription: 'Plant an idea that seems reasonable and natural. The seed grows on its own. Used ethically to guide toward better outcomes.'
  },
  'Sending': {
    dndEquivalent: 'Sending',
    cvMeaning: 'Cold emails that land, international coordination',
    cvDescription: 'Communicate with anyone, anywhere. Perfect for cold outreach that actually gets responses. Unlimited range.'
  },
  'Tongues': {
    dndEquivalent: 'Tongues',
    cvMeaning: 'Code-switching between stakeholder types',
    cvDescription: 'Speak any professional language fluently - startup, corporate, academic, government. Adapt communication style to audience.'
  },
  'Recruit': {
    dndEquivalent: 'Hypnotic Pattern',
    cvMeaning: 'Hiring above your weight class, recruiting advisors',
    cvDescription: 'Recruit characters up to 7 levels higher to your party at will. Can convince senior leaders, experienced advisors, and industry experts to join your cause.'
  }
};

// Action Descriptions
const actionDescriptions = {
  'Pitch Attack': {
    type: 'Attack',
    cvMeaning: 'Sales pitches, investor meetings, partnership proposals',
    cvDescription: 'Deliver a compelling pitch that overcomes resistance. Uses CHA modifier + Expertise for maximum persuasive impact.'
  },
  'Network Strike': {
    type: 'Attack',
    cvMeaning: 'Leveraging connections, warm intros, referrals',
    cvDescription: 'Use your network to create new opportunities. Each connection can cascade into more. The network effect in action.'
  },
  'Cold Outreach': {
    type: 'Attack',
    cvMeaning: 'Cold emails, LinkedIn messages, conference approaches',
    cvDescription: 'Reach out to someone you have never met. High risk, high reward. Sometimes the boldest move is the right one.'
  },
  'Strategic Pivot': {
    type: 'Action',
    cvMeaning: 'Major strategic changes based on learning',
    cvDescription: 'Completely change direction based on new information. Requires wisdom and courage. Previous investments become lessons, not losses.'
  },
  'Community Rally': {
    type: 'Action',
    cvMeaning: 'Challenge launches, community mobilization',
    cvDescription: 'Call upon your community for support. 4500+ engineers respond to meaningful challenges. Summon 10-100 allied engineers for 10-week challenges.'
  },
  'User Interview': {
    type: 'Action',
    cvMeaning: 'Customer discovery, user research sessions',
    cvDescription: 'Conduct deep research to understand what users really need vs what they say they want. The foundation of product decisions.'
  },
  'A/B Experiment': {
    type: 'Action',
    cvMeaning: 'Product experiments, growth tests',
    cvDescription: 'Run a controlled experiment to validate hypotheses before committing resources. Data determines winner.'
  },
  'Dash': {
    type: 'Bonus Action',
    cvMeaning: 'Sprint phases, rapid execution',
    cvDescription: 'Sprint to achieve remarkable results in a short time. A burst of focused energy and speed. Double your movement this turn.'
  },
  'Cunning Action': {
    type: 'Bonus Action',
    cvMeaning: 'Quick tactical moves',
    cvDescription: 'Take the Dash, Disengage, or Hide action as a bonus action. Pivot quickly when the situation demands.'
  },
  'Inspire Team': {
    type: 'Bonus Action',
    cvMeaning: 'Team motivation, morale boosts',
    cvDescription: 'Boost an ally with encouraging words. Your acting background shows. One ally gains advantage on their next roll.'
  },
  'Operational Maneuver': {
    type: 'Bonus Action',
    cvMeaning: 'Resource reallocation, team reorganization',
    cvDescription: 'Reposition team and resources for tactical advantage. Reorganize without losing momentum.'
  },
  'Sneak Attack (Startup Edition)': {
    type: 'Reaction',
    cvMeaning: 'Striking at opportune moments',
    cvDescription: 'When you have advantage or an ally nearby, deal extra impact. Timing is everything in startups.'
  }
};

// Dice roll result messages
const diceMessages = {
  nat20: [
    "CRITICAL SUCCESS! You've achieved the impossible!",
    "NAT 20! The universe bends to your will!",
    "CRITICAL HIT! Your expertise shines brilliantly!",
    "NATURAL 20! Even the gods are impressed!"
  ],
  highSuccess: [
    "Excellent! Your skills shine through.",
    "Success! You make it look easy.",
    "Well done! Your training pays off.",
    "Impressive! The stakeholders are convinced."
  ],
  moderateSuccess: [
    "It works, but just barely.",
    "Success, though there's room for improvement.",
    "You manage to pull it off.",
    "A solid effort - it gets the job done."
  ],
  lowSuccess: [
    "By the skin of your teeth...",
    "Close call, but you made it.",
    "Barely successful - that was tense.",
    "It could have gone either way."
  ],
  failure: [
    "Not your best work, but you'll recover.",
    "This approach isn't working - time to pivot.",
    "Setback! But failures are just learning opportunities.",
    "The dice weren't kind, but persistence is key."
  ],
  nat1: [
    "CRITICAL FAIL! Everything goes wrong!",
    "NAT 1! Murphy's Law in full effect!",
    "FUMBLE! Time to pivot dramatically!",
    "NATURAL 1! Well, that's a story to tell..."
  ]
};

// Get random message based on roll
function getDiceMessage(roll, total, skillName) {
  let category;
  if (roll === 20) category = 'nat20';
  else if (roll === 1) category = 'nat1';
  else if (total >= 25) category = 'highSuccess';
  else if (total >= 15) category = 'moderateSuccess';
  else if (total >= 10) category = 'lowSuccess';
  else category = 'failure';
  
  const messages = diceMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    abilityDescriptions, 
    skillDescriptions, 
    combatStatDescriptions,
    alignmentDescription,
    defenseDescriptions,
    conditionDescriptions,
    savingThrowDescriptions,
    spellDescriptions,
    actionDescriptions,
    diceMessages, 
    getDiceMessage 
  };
}
