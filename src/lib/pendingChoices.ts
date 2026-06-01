import { CLASS_FEATURES, ClassFeature } from '../data/classFeatures';
import { AbilityName } from '../types/character';

export type PendingChoiceCategory = 'levelup' | 'traits' | 'skills';
export type PendingChoiceKind = 'choice' | 'asi' | 'skill_pick';

export interface CharacterChoiceSnapshot {
  className: string;
  level: number;
  traits?: string[];
  featureChoices?: Record<string, string[]>;
  asiChoices?: Record<string, Partial<Record<AbilityName, number>>>;
}

export interface PendingChoiceIssue {
  id: string;
  featureId: string;
  feature: ClassFeature;
  kind: PendingChoiceKind;
  category: PendingChoiceCategory;
  missing: number;
}

export function getUnlockedClassFeatures(className: string, upToLevel: number): ClassFeature[] {
  return (CLASS_FEATURES[className] ?? [])
    .filter((lf) => lf.level <= upToLevel)
    .flatMap((lf) => lf.features);
}

export function detectPendingChoices(
  snapshot: CharacterChoiceSnapshot,
  upToLevel = snapshot.level,
): PendingChoiceIssue[] {
  const traitsSet = new Set(snapshot.traits ?? []);
  const featureChoices = snapshot.featureChoices ?? {};
  const asiChoices = snapshot.asiChoices ?? {};
  const issues: PendingChoiceIssue[] = [];

  for (const feature of getUnlockedClassFeatures(snapshot.className, upToLevel)) {
    if (feature.type === 'choice' && (feature.options?.length ?? 0) > 0) {
      const chosen = feature.options!.find((opt) => traitsSet.has(opt.id));
      if (!chosen) {
        issues.push({
          id: `${feature.id}:choice`,
          featureId: feature.id,
          feature,
          kind: 'choice',
          category: 'levelup',
          missing: 1,
        });
      } else if (feature.id.includes('_asi') && !chosen.id.includes('_feat_')) {
        const used = Object.values(asiChoices[feature.id] ?? {}).reduce(
          (sum, value) => sum + (value ?? 0),
          0,
        );
        if (used < 2) {
          issues.push({
            id: `${feature.id}:asi`,
            featureId: feature.id,
            feature,
            kind: 'asi',
            category: 'traits',
            missing: 2 - used,
          });
        }
      }
    }

    if (feature.pickSkills) {
      const required = feature.pickCount ?? 1;
      const selectedCount = featureChoices[feature.id]?.length ?? 0;
      if (selectedCount < required) {
        issues.push({
          id: `${feature.id}:skills`,
          featureId: feature.id,
          feature,
          kind: 'skill_pick',
          category: 'skills',
          missing: required - selectedCount,
        });
      }
    }
  }

  return issues;
}
