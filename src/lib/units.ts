import type { AppLanguage, UnitSystem } from '../store/settingsStore';

// ─── Meters → feet (D&D 5e: 1.5m = 5 ft) ────────────────────────────────────
function metersToFeet(meters: number): number {
  // Round to nearest 5 ft
  return Math.round((meters * 10) / 3 / 5) * 5;
}

// ─── Regex: matches numbers like 1, 1.5, 1,5, 8 ─────────────────────────────
const NUMBER_RE = /(\d+(?:[,.]\d+)?)/g;

// Replace all "Xm" or "X km" occurrences in a string
function convertDistancesInText(
  text: string,
  units: UnitSystem,
  lang: AppLanguage,
): string {
  if (units === 'metric') return text;

  // Handle "X km"
  let result = text.replace(/(\d+(?:[,.]\d+)?)\s*km\b/gi, (_, n) => {
    const km = parseFloat(n.replace(',', '.'));
    const miles = Math.round(km * 0.621371 * 10) / 10;
    return lang === 'en' ? `${miles} mi` : `${miles} milhas`;
  });

  // Handle "Xm" (meters)
  result = result.replace(/(\d+(?:[,.]\d+)?)\s*m\b/g, (_, n) => {
    const meters = parseFloat(n.replace(',', '.'));
    const ft = metersToFeet(meters);
    return lang === 'en' ? `${ft} ft` : `${ft} pés`;
  });

  return result;
}

// ─── Named range labels ───────────────────────────────────────────────────────
const RANGE_LABELS_EN: Record<string, string> = {
  'Toque': 'Touch',
  'Pessoal': 'Self',
  'Visível': 'Sight',
  'Ilimitado': 'Unlimited',
  'Especial': 'Special',
  'cone': 'cone',
  'cubo': 'cube',
  'esfera': 'sphere',
  'linha': 'line',
  'raio': 'radius',
};

function translateRangeLabels(text: string): string {
  let result = text;
  for (const [pt, en] of Object.entries(RANGE_LABELS_EN)) {
    result = result.replace(new RegExp(pt, 'gi'), (match) =>
      match[0] === match[0].toUpperCase() ? en.charAt(0).toUpperCase() + en.slice(1) : en
    );
  }
  return result;
}

/** Convert a spell range string (e.g. "9m", "Pessoal (cone 4,5m)", "Toque") */
export function convertRange(
  range: string,
  units: UnitSystem,
  lang: AppLanguage,
): string {
  let result = range;
  if (lang === 'en') result = translateRangeLabels(result);
  result = convertDistancesInText(result, units, lang);
  return result;
}

// ─── Duration translations ────────────────────────────────────────────────────
const DURATION_EN: Record<string, string> = {
  'Instantânea': 'Instantaneous',
  '1 rodada': '1 round',
  '6 rodadas': '6 rounds',
  '1 minuto': '1 minute',
  '10 minutos': '10 minutes',
  '1 hora': '1 hour',
  '2 horas': '2 hours',
  '6 horas': '6 hours',
  '8 horas': '8 hours',
  '24 horas': '24 hours',
  '7 dias': '7 days',
  '10 dias': '10 days',
  '30 dias': '30 days',
  'Até 1 rodada': 'Up to 1 round',
  'Até 1 minuto': 'Up to 1 minute',
  'Até 10 minutos': 'Up to 10 minutes',
  'Até 1 hora': 'Up to 1 hour',
  'Até ser acionado ou removido': 'Until triggered or removed',
  'Até ser removida': 'Until dispelled',
  'Até a criatura se recuperar': 'Until the creature recovers',
  'Concentração, 1 rodada': 'Concentration, up to 1 round',
  'Concentração, 6 rodadas': 'Concentration, up to 6 rounds',
  'Concentração, 1 minuto': 'Concentration, up to 1 minute',
  'Concentração, 10 minutos': 'Concentration, up to 10 minutes',
  'Concentração, 1 hora': 'Concentration, up to 1 hour',
  'Concentração, 8 horas': 'Concentration, up to 8 hours',
  'Especial': 'Special',
};

/** Translate a spell duration string */
export function convertDuration(duration: string, lang: AppLanguage): string {
  if (lang === 'pt') return duration;
  return DURATION_EN[duration] ?? duration;
}

// ─── Casting time translations ────────────────────────────────────────────────
const CASTING_TIME_EN: Record<string, string> = {
  '1 ação': '1 action',
  '1 ação (ritual)': '1 action (ritual)',
  '1 ação bônus': '1 bonus action',
  '1 ação ou 8 horas': '1 action or 8 hours',
  '1 reação': '1 reaction',
  '1 minuto': '1 minute',
  '1 minuto (ritual)': '1 minute (ritual)',
  '10 minutos': '10 minutes',
  '1 hora': '1 hour',
  '1 hora (ritual)': '1 hour (ritual)',
};

/** Translate a casting time string */
export function convertCastingTime(ct: string, lang: AppLanguage): string {
  if (lang === 'pt') return ct;
  return CASTING_TIME_EN[ct] ?? ct;
}

// ─── Spell school translations ────────────────────────────────────────────────
const SCHOOL_EN: Record<string, string> = {
  evocação: 'evocation', abjuração: 'abjuration', conjuração: 'conjuration',
  ilusão: 'illusion', transmutação: 'transmutation', necromancia: 'necromancy',
  encantamento: 'enchantment', adivinhação: 'divination',
};

/** Translate a spell school name */
export function convertSchool(school: string, lang: AppLanguage): string {
  if (lang === 'pt') return school;
  const lower = school.toLowerCase();
  const en = SCHOOL_EN[lower] ?? school;
  return en.charAt(0).toUpperCase() + en.slice(1);
}

// ─── Damage type translations ─────────────────────────────────────────────────
const DAMAGE_TYPE_EN: Record<string, string> = {
  fogo: 'fire', frio: 'cold', elétrico: 'lightning', trovejante: 'thunder',
  necrótico: 'necrotic', psíquico: 'psychic', radiante: 'radiant',
  ácido: 'acid', força: 'force', veneno: 'poison',
  cortante: 'slashing', contundente: 'bludgeoning', perfurante: 'piercing',
};

/** Translate damage type words in a damage string (e.g. "1d10 fogo" → "1d10 fire") */
export function translateDamageType(damage: string, lang: AppLanguage): string {
  if (lang === 'pt') return damage;
  return damage.replace(/[a-záàâãéèêíóôõúûçñ]+/gi, (word) =>
    DAMAGE_TYPE_EN[word.toLowerCase()] ?? word
  );
}

/**
 * Convert a speed value in feet to a display string.
 * D&D uses 5ft increments; metric equivalent is 1.5m per 5ft.
 */
export function convertSpeed(feet: number, units: UnitSystem, lang: AppLanguage): string {
  if (units === 'imperial') return `${feet}ft`;
  const meters = (feet / 5) * 1.5;
  const display = Number.isInteger(meters) ? `${meters}m` : `${meters.toFixed(1).replace('.', ',')}m`;
  return display;
}

/**
 * Convert all distance measurements in any free-form text.
 */
export function convertTextDistances(
  text: string,
  units: UnitSystem,
  lang: AppLanguage,
): string {
  if (units === 'metric') return text;

  // "X,Y metros" | "X metros" | "Xm " (standalone)
  let result = text.replace(
    /(\d+(?:[,.]\d+)?)\s*(metros?)\b/gi,
    (_, n) => {
      const ft = metersToFeet(parseFloat(n.replace(',', '.')));
      return lang === 'en' ? `${ft} feet` : `${ft} pés`;
    }
  );

  // "X km" → miles
  result = result.replace(/(\d+(?:[,.]\d+)?)\s*km\b/gi, (_, n) => {
    const miles = Math.round(parseFloat(n.replace(',', '.')) * 0.621371 * 10) / 10;
    return lang === 'en' ? `${miles} miles` : `${miles} milhas`;
  });

  return result;
}
