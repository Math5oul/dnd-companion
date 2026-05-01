import { Spell } from '../../data/spells';
import { ClassFeature, TraitOption } from '../../data/classFeatures';
import { AppLanguage } from '../../store/settingsStore';
import { SPELL_NAMES_EN, SPELL_DESCS_EN } from './spells';
import { FEATURE_NAMES_EN, FEATURE_DESCRIPTIONS_EN } from './features';

/** Returns the localized name of a spell. Falls back to the original name if no EN translation exists. */
export function localizeSpellName(spell: Spell, lang: AppLanguage): string {
  if (lang !== 'en') return spell.name;
  return SPELL_NAMES_EN[spell.id] ?? spell.name;
}

/** Returns the localized description of a spell. Falls back to the original PT description. */
export function localizeSpellDesc(spell: Spell, lang: AppLanguage): string {
  if (lang !== 'en') return spell.description;
  return SPELL_DESCS_EN[spell.id] ?? spell.description;
}

/** Returns the localized name of a class feature or trait option. */
export function localizeFeatureName(
  id: string,
  namePt: string,
  lang: AppLanguage,
): string {
  if (lang !== 'en') return namePt;
  return FEATURE_NAMES_EN[id] ?? namePt;
}

/** Returns localized name for a TraitOption. */
export function localizeOptionName(opt: TraitOption, lang: AppLanguage): string {
  return localizeFeatureName(opt.id, opt.name, lang);
}

/** Returns localized name for a ClassFeature. */
export function localizeClassFeatureName(feat: ClassFeature, lang: AppLanguage): string {
  return localizeFeatureName(feat.id, feat.name, lang);
}

/** Returns the localized description of a feature or option. Falls back to the PT description. */
export function localizeFeatureDesc(
  id: string,
  descPt: string,
  lang: AppLanguage,
): string {
  if (lang !== 'en') return descPt;
  return FEATURE_DESCRIPTIONS_EN[id] ?? descPt;
}
