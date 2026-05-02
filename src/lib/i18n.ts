import { useSettingsStore } from '../store/settingsStore';
import type { AppLanguage } from '../store/settingsStore';

// ─── Translations dictionary ──────────────────────────────────────────────────
const translations = {
  pt: {
    // Abilities
    strength: 'Força', dexterity: 'Destreza', constitution: 'Constituição',
    intelligence: 'Inteligência', wisdom: 'Sabedoria', charisma: 'Carisma',
    // Character sheet sections
    hitPoints: 'Pontos de Vida',
    attributes: 'Atributos',
    spells: 'Magias',
    cantrips: 'Truques',
    actions: 'Ações',
    features: '📜 Habilidades & Traits',
    sorceryPoints: '✨ Pontos de Feitiçaria',
    slotToPoints: 'Slot → Pontos',
    pointsToSlot: 'Pontos → Slot',
    // Buttons / labels
    share: '🔗 Compartilhar',
    manageSpellbook: '📖 Gerenciar Grimório',
    longRest: '🌙 Descanso Longo',
    longRestSub: 'Recupera HP e Spell Slots',
    shortRest: '☕ Descanso Curto',
    shortRestSub: 'Gaste Dados de Vida para recuperar HP',
    levelUp: (from: number, to: number) => `⬆️ Level Up — Nível ${from} → ${to}`,
    deleteChar: '🗑️ Deletar Personagem',
    back: '← Voltar',
    level: 'Nível',
    // Modals
    noSlotsTitle: 'Sem slots disponíveis',
    noSlotsMsg: (n: number) => `Você não tem mais slots de nível ${n} disponíveis.`,
    ok: 'OK',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    deleteTitle: 'Deletar personagem',
    deleteMsg: (name: string) => `Tem certeza que deseja deletar ${name}? Essa ação não pode ser desfeita.`,
    deleteLabel: 'Deletar',
    longRestTitle: '🌙 Descanso Longo',
    longRestMsg: 'HP completamente restaurado e todos os spell slots recuperados.',
    shortRestTitle: '☕ Descanso Curto',
    shortRestDice: (used: number, total: number) => `Dados de Vida: ${used}/${total} usados`,
    shortRestHitDie: (d: number) => `Dado de Vida: d${d}`,
    shortRestRoll: '🎲 Gastar 1 Dado de Vida',
    shortRestHealResult: (roll: number, con: number, total: number) => `Rolou ${roll} + ${con >= 0 ? '+' + con : con} CON = +${total} HP`,
    shortRestNoDice: 'Sem dados de vida disponíveis.',
    shortRestClose: 'Fechar',
    shortRestRecoverHint: 'Role dados de vida para recuperar HP. Warlock recupera spell slots.',
    // Spellbook
    spellbookTitle: (name: string) => `📖 Grimório de ${name}`,
    searchPlaceholder: 'Buscar magia...',
    allFilter: 'Todos',
    cantripLimit: 'Limite de truques atingido',
    spellLimit: 'Limite de magias atingido',
    noSpellsFound: 'Nenhuma magia encontrada.',
    cantripGroupLabel: 'Truques (Cantrips)',
    levelGroupLabel: (n: number) => `${['1°','2°','3°','4°','5°','6°','7°','8°','9°'][n-1] ?? `${n}°`} Nível`,
    cantripsCount: (n: number, max: number | string) => `✨ ${n}/${max} truques`,
    spellsCount: (n: number, max: number | string) => `📚 ${n}/${max} magias`,
    noSpellsHint: 'Nenhuma magia adicionada.',
    spellsAdded: (n: number) => `${n} magia${n !== 1 ? 's' : ''} selecionada${n !== 1 ? 's' : ''}`,
    // Index
    yourChars: 'Seus Personagens',
    newChar: '+ Novo Personagem',
    noCharsYet: 'Nenhum personagem ainda.\nCrie o primeiro!',
    // Settings
    settingsTitle: '⚙️ Configurações',
    themeLabel: 'TEMA',
    languageLabel: 'IDIOMA',
    unitsLabel: 'MEDIDAS',
    themeDark: '🌑 Escuro',
    themeSepia: '📜 Sépia',
    themeAbyss: '🌌 Abismo',
    langPt: '🇧🇷 Português',
    langEn: '🇺🇸 English',
    unitsMetric: '📏 Métrico',
    unitsImperial: '🦶 Imperial',
    settingsClose: 'Fechar',
    // Spell schools
    evocação: 'Evocação', abjuração: 'Abjuração', conjuração: 'Conjuração',
    ilusão: 'Ilusão', transmutação: 'Transmutação', necromancia: 'Necromancia',
    encantamento: 'Encantamento', adivinhação: 'Adivinhação',
    // Stat modal
    base: 'Base', asi: 'Bônus ASI', total: 'Total', modifier: 'Modificador',
    tapForDetail: 'Toque para detalhes',
    // Ability short labels
    strengthShort: 'FOR', dexterityShort: 'DES', constitutionShort: 'CON',
    intelligenceShort: 'INT', wisdomShort: 'SAB', charismaShort: 'CAR',
    // Create flow
    stepOf: (s: number, total: number) => `Passo ${s} de ${total}`,
    step1Title: 'Como se chama seu personagem?',
    step1Subtitle: 'Escolha um nome que ecoe pelos salões da taverna.',
    step1Placeholder: 'Ex: Arathorn, Elspeth, Zuko...',
    step2Title: (name: string) => `Escolha a raça de ${name}`,
    step3Title: (name: string) => `Qual é a classe de ${name}?`,
    step4Title: 'Distribua os Atributos',
    step4Subtitle: 'Role 4d6 (descarta o menor) e atribua cada valor a um atributo.',
    rollDice: '🎲 Rolar Dados',
    rerollDice: '🎲 Rolar Novamente',
    selectValueHint: 'Selecione um valor e depois um atributo:',
    racial: 'racial',
    reviewBtn: 'Revisar Personagem →',
    step5Title: 'Revisão Final',
    raceLabel: 'Raça',
    classLabel: 'Classe',
    speedLabel: (v: string) => `⚡ Velocidade: ${v}`,
    traitsLabel: '🎯 Traços',
    hitDieLabel: (d: number) => `❤️ Dado de Vida: d${d}`,
    primaryAbilityLabel: '⚡ Atributo Principal',
    spellcasterLabel: '✨ Conjurador de magias',
    createChar: '⚔️ Criar Personagem!',
    continueBtn: 'Continuar →',
    spellcasterTag: '✨ Conjurador',
    savesLabel: 'Saves',
    // Skills
    skillsSection: '🎯 Perícias',
    profBonusLabel: (n: number) => `Bônus de Proficiência: +${n}`,
    skillRollResult: (skill: string, total: number, detail: string) => `${skill}: ${total} ${detail}`,
    proficientHint: 'Toque no ponto para alternar proficiência · Toque na linha para rolar',
    skillPicksLeft: (n: number) => `${n} escolha${n !== 1 ? 's' : ''} restante${n !== 1 ? 's' : ''}`,
    skillPickHint: 'Toque no ● para escolher uma proficiência (permanente)',
  },

  en: {
    // Abilities
    strength: 'Strength', dexterity: 'Dexterity', constitution: 'Constitution',
    intelligence: 'Intelligence', wisdom: 'Wisdom', charisma: 'Charisma',
    // Character sheet sections
    hitPoints: 'Hit Points',
    attributes: 'Attributes',
    spells: 'Spells',
    cantrips: 'Cantrips',
    actions: 'Actions',
    features: '📜 Features & Traits',
    sorceryPoints: '✨ Sorcery Points',
    slotToPoints: 'Slot → Points',
    pointsToSlot: 'Points → Slot',
    // Buttons / labels
    share: '🔗 Share',
    manageSpellbook: '📖 Manage Spellbook',
    longRest: '🌙 Long Rest',
    longRestSub: 'Recover HP and Spell Slots',
    shortRest: '☕ Short Rest',
    shortRestSub: 'Spend Hit Dice to recover HP',
    levelUp: (from: number, to: number) => `⬆️ Level Up — Level ${from} → ${to}`,
    deleteChar: '🗑️ Delete Character',
    back: '← Back',
    level: 'Level',
    // Modals
    noSlotsTitle: 'No slots available',
    noSlotsMsg: (n: number) => `You have no more level ${n} slots available.`,
    ok: 'OK',
    cancel: 'Cancel',
    confirm: 'Confirm',
    deleteTitle: 'Delete character',
    deleteMsg: (name: string) => `Are you sure you want to delete ${name}? This cannot be undone.`,
    deleteLabel: 'Delete',
    longRestTitle: '🌙 Long Rest',
    longRestMsg: 'HP fully restored and all spell slots recovered.',
    shortRestTitle: '☕ Short Rest',
    shortRestDice: (used: number, total: number) => `Hit Dice: ${used}/${total} used`,
    shortRestHitDie: (d: number) => `Hit Die: d${d}`,
    shortRestRoll: '🎲 Spend 1 Hit Die',
    shortRestHealResult: (roll: number, con: number, total: number) => `Rolled ${roll} + ${con >= 0 ? '+' + con : con} CON = +${total} HP`,
    shortRestNoDice: 'No hit dice available.',
    shortRestClose: 'Close',
    shortRestRecoverHint: 'Roll hit dice to recover HP. Warlock recovers spell slots.',
    // Spellbook
    spellbookTitle: (name: string) => `📖 ${name}'s Spellbook`,
    searchPlaceholder: 'Search spell...',
    allFilter: 'All',
    cantripLimit: 'Cantrip limit reached',
    spellLimit: 'Spell limit reached',
    noSpellsFound: 'No spells found.',
    cantripGroupLabel: 'Cantrips',
    levelGroupLabel: (n: number) => {
      const ord = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th'][n-1] ?? `${n}th`;
      return `${ord} Level`;
    },
    cantripsCount: (n: number, max: number | string) => `✨ ${n}/${max} cantrips`,
    spellsCount: (n: number, max: number | string) => `📚 ${n}/${max} spells`,
    noSpellsHint: 'No spells added.',
    spellsAdded: (n: number) => `${n} spell${n !== 1 ? 's' : ''} selected`,
    // Index
    yourChars: 'Your Characters',
    newChar: '+ New Character',
    noCharsYet: 'No characters yet.\nCreate the first one!',
    // Settings
    settingsTitle: '⚙️ Settings',
    themeLabel: 'THEME',
    languageLabel: 'LANGUAGE',
    unitsLabel: 'UNITS',
    themeDark: '🌑 Dark',
    themeSepia: '📜 Sepia',
    themeAbyss: '🌌 Abyss',
    langPt: '🇧🇷 Português',
    langEn: '🇺🇸 English',
    unitsMetric: '📏 Metric',
    unitsImperial: '🦶 Imperial',
    settingsClose: 'Close',
    // Spell schools
    evocação: 'Evocation', abjuração: 'Abjuration', conjuração: 'Conjuration',
    ilusão: 'Illusion', transmutação: 'Transmutation', necromancia: 'Necromancy',
    encantamento: 'Enchantment', adivinhação: 'Divination',
    // Stat modal
    base: 'Base', asi: 'ASI Bonus', total: 'Total', modifier: 'Modifier',
    tapForDetail: 'Tap for details',
    // Ability short labels
    strengthShort: 'STR', dexterityShort: 'DEX', constitutionShort: 'CON',
    intelligenceShort: 'INT', wisdomShort: 'WIS', charismaShort: 'CHA',
    // Create flow
    stepOf: (s: number, total: number) => `Step ${s} of ${total}`,
    step1Title: "What's your character's name?",
    step1Subtitle: 'Choose a name that echoes through the halls of the tavern.',
    step1Placeholder: 'e.g.: Arathorn, Elspeth, Zuko...',
    step2Title: (name: string) => `Choose ${name}'s race`,
    step3Title: (name: string) => `What's ${name}'s class?`,
    step4Title: 'Distribute Ability Scores',
    step4Subtitle: 'Roll 4d6 (drop the lowest) and assign each value to an ability.',
    rollDice: '🎲 Roll Dice',
    rerollDice: '🎲 Reroll Dice',
    selectValueHint: 'Select a value then an ability:',
    racial: 'racial',
    reviewBtn: 'Review Character →',
    step5Title: 'Final Review',
    raceLabel: 'Race',
    classLabel: 'Class',
    speedLabel: (v: string) => `⚡ Speed: ${v}`,
    traitsLabel: '🎯 Traits',
    hitDieLabel: (d: number) => `❤️ Hit Die: d${d}`,
    primaryAbilityLabel: '⚡ Primary Ability',
    spellcasterLabel: '✨ Spellcaster',
    createChar: '⚔️ Create Character!',
    continueBtn: 'Continue →',
    spellcasterTag: '✨ Spellcaster',
    savesLabel: 'Saves',
    // Skills
    skillsSection: '🎯 Skills',
    profBonusLabel: (n: number) => `Proficiency Bonus: +${n}`,
    skillRollResult: (skill: string, total: number, detail: string) => `${skill}: ${total} ${detail}`,
    proficientHint: 'Tap dot to toggle proficiency · Tap row to roll',
    skillPicksLeft: (n: number) => `${n} pick${n !== 1 ? 's' : ''} remaining`,
    skillPickHint: 'Tap ● to pick a proficiency (permanent)',
  },
} as const;

export type TranslationKeys = typeof translations['pt'];
export type T = typeof translations['pt'];

/** React hook — returns the translation object for the current language */
export function useI18n() {
  const { language, units } = useSettingsStore();
  return {
    t: translations[language] as T,
    language,
    units,
  };
}

// ─── Race / Class name translations by ID ─────────────────────────────────────
const RACE_NAMES_EN: Record<string, string> = {
  human: 'Human',
  elf: 'Elf',
  dwarf: 'Dwarf',
  halfling: 'Halfling',
  gnome: 'Gnome',
  'half-elf': 'Half-Elf',
  dragonborn: 'Dragonborn',
  tiefling: 'Tiefling',
};

const CLASS_NAMES_EN: Record<string, string> = {
  barbarian: 'Barbarian',
  bard: 'Bard',
  cleric: 'Cleric',
  druid: 'Druid',
  fighter: 'Fighter',
  monk: 'Monk',
  paladin: 'Paladin',
  ranger: 'Ranger',
  rogue: 'Rogue',
  sorcerer: 'Sorcerer',
  warlock: 'Warlock',
  wizard: 'Wizard',
};

/** Translate a race name given its ID and the current language */
export function translateRaceName(id: string, ptName: string, lang: AppLanguage): string {
  if (lang === 'pt') return ptName;
  return RACE_NAMES_EN[id] ?? ptName;
}

/** Translate a class name given its ID and the current language */
export function translateClassName(id: string, ptName: string, lang: AppLanguage): string {
  if (lang === 'pt') return ptName;
  return CLASS_NAMES_EN[id] ?? ptName;
}
