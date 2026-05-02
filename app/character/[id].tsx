import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Modal,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useTabStore } from '../../src/store/tabStore';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n, translateRaceName, translateClassName } from '../../src/lib/i18n';
import { convertRange, convertDuration, convertCastingTime, convertSchool, convertTextDistances, translateDamageType, translateEquipRange } from '../../src/lib/units';
import { localizeSpellName, localizeFeatureName, localizeFeatureDesc } from '../../src/lib/translations';import { formatModifier, rollDamage } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { getClassById } from '../../src/data/classes';
import { getSpellById, getSpellDamage, getSpellDamageAtSlot, SCHOOL_ICON, SCHOOL_COLOR } from '../../src/data/spells';
import { AbilityName } from '../../src/types/character';
import { SKILLS, getProficiencyBonus, CLASS_SKILL_OPTIONS, CLASS_SKILL_COUNT } from '../../src/data/skills';
import ConfirmModal from '../../src/components/ConfirmModal';
import LevelUpModal from '../../src/components/LevelUpModal';
import ShortRestModal from '../../src/components/ShortRestModal';
import EquipmentModal from '../../src/components/EquipmentModal';
import { getFeaturesForLevel, CLASS_FEATURES, computeAsiTotals } from '../../src/data/classFeatures';
import { getActiveFeatureActions } from '../../src/data/featureEffects';
import CombatPanel from '../../src/components/CombatPanel';
import ChecksPanel from '../../src/components/ChecksPanel';
import SkillsChecksPanel from '../../src/components/SkillsChecksPanel';
import CombatManeuvers from '../../src/components/CombatManeuvers';
import { detectMetamagic, spellAttackBonus as calcSpellAttackBonus, spellSaveDC as calcSpellSaveDC, applyMetamagicToDamage, metamagicCost, getSpellTraitBonuses, traitBonusesForSpell } from '../../src/lib/metamagic';
import { Equipment, EQUIPMENT_TYPE_ICONS, EQUIPMENT_TYPE_LABELS_PT, EQUIPMENT_TYPE_LABELS_EN, BONUS_TYPE_LABELS } from '../../src/types/equipment';

const ABILITY_KEYS: { key: AbilityName; icon: string }[] = [
  { key: 'strength', icon: '💪' },
  { key: 'dexterity', icon: '🏹' },
  { key: 'constitution', icon: '🛡️' },
  { key: 'intelligence', icon: '📚' },
  { key: 'wisdom', icon: '🔮' },
  { key: 'charisma', icon: '✨' },
];

export default function CharacterSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { characters, useSpellSlot, recoverSpellSlots, updateHp, deleteCharacter, levelUp, useSorceryPoint, recoverSorceryPoints, useKiPoint, recoverKiPoints, convertSlotToPoints, convertPointsToSlot, shortRest, toggleSkillProficiency, addSkillProficiency, addEquipment, updateEquipment, removeEquipment, toggleEquipped, useEquipmentCharge, clearLongRestItems, activateConsumable, updateGold, updateAsiChoice, useFeatureAction, resetFeatureActions, saveFeatureChoice } = useCharacterStore();
  const { openTab, closeTab } = useTabStore();
  const { theme } = useSettingsStore();
  const themeColors = THEMES[theme];
  const styles = useMemo(() => makeStyles(themeColors), [theme]);
  const { t, language, units } = useI18n();

  // Build ability list with translated labels
  const ABILITIES = useMemo(() => ABILITY_KEYS.map(({ key, icon }) => ({
    key, icon, label: t[key as keyof typeof t] as string,
  })), [language]);

  const char = characters.find((c) => c.id === id);

  // Register tab when character loads
  useEffect(() => {
    if (char) openTab(char.id, char.name);
  }, [char?.id, char?.name]);
  const [hpDelta, setHpDelta] = useState(0);

  type ModalType = 'delete' | 'levelup' | 'longrest' | 'shortrest' | 'noslot' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [noSlotLevel, setNoSlotLevel] = useState(0);
  const [statDetailKey, setStatDetailKey] = useState<AbilityName | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [traitsOpen, setTraitsOpen] = useState(false);
  const [equipOpen, setEquipOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [spellsOpen, setSpellsOpen] = useState(false);
  const [combatOpen, setCombatOpen] = useState(false);
  const [checksOpen, setChecksOpen] = useState(false);
  const [manobraOpen, setManobraOpen] = useState(false);
  const [activeTraitEffects, setActiveTraitEffects] = useState<Set<string>>(new Set());
  const handleToggleTraitEffect = (tag: string) =>
    setActiveTraitEffects(prev => { const n = new Set(prev); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState<Equipment | null>(null);
  const [deleteEquipId, setDeleteEquipId] = useState<string | null>(null);
  const [attackRolls, setAttackRolls] = useState<Record<string, { hit: number; hitDetail: string; dmg: number; dmgDetail: string; dmgType: string }>>({});
  const [healToast, setHealToast] = useState<{ text: string } | null>(null);
  const [goldModalOpen, setGoldModalOpen] = useState(false);
  const [goldInput, setGoldInput] = useState('');
  const [featurePickerModal, setFeaturePickerModal] = useState<{
    featureId: string;
    featureName: string;
    pickSkills: string[];
    pickCount: number;
    pickType: 'proficiency' | 'expertise';
    pending: string[];
  } | null>(null);
  // { spellId -> { total, detail, expires } }
  const [rollResults, setRollResults] = useState<Record<string, { total: number; detail: string }>>({});
  // Spell attack roll results { spellId -> { hit, hitDetail, dmg?, dmgDetail?, critical?, notes? } }
  const [spellCastResults, setSpellCastResults] = useState<Record<string, { hit?: number; hitDetail?: string; dmg?: number; dmgDetail?: string; critical?: boolean; notes?: string }>>({});
  // ADV/DIS per spell
  type AdvDis = 'normal' | 'adv' | 'dis';
  const [spellAdv, setSpellAdv] = useState<Record<string, AdvDis>>({});
  // Selected metamagic per spell
  const [spellMeta, setSpellMeta] = useState<Record<string, Set<string>>>({});
  // skill roll results { skillId -> { total, detail } }
  const [skillRolls, setSkillRolls] = useState<Record<string, { total: number; detail: string }>>({});

  const showRoll = (spellId: string, dmgStr: string) => {
    const result = rollDamage(dmgStr);
    setRollResults((prev) => ({ ...prev, [spellId]: result }));
    setTimeout(() => {
      setRollResults((prev) => { const n = { ...prev }; delete n[spellId]; return n; });
    }, 4000);
  };

  const handleSkillRoll = (skillId: string, modifier: number) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier;
    const detail = `[d20:${d20}${modifier >= 0 ? `+${modifier}` : modifier}]`;
    setSkillRolls((prev) => ({ ...prev, [skillId]: { total, detail } }));
    setTimeout(() => {
      setSkillRolls((prev) => { const n = { ...prev }; delete n[skillId]; return n; });
    }, 4000);
  };

  const handleAttackRoll = (attackId: string, attackBonus: number, dmgStr: string, dmgType: string) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const hitTotal = d20 + attackBonus;
    const hitDetail = `[d20:${d20}${attackBonus >= 0 ? `+${attackBonus}` : attackBonus}]`;
    const dmgResult = rollDamage(dmgStr);
    setAttackRolls((prev) => ({ ...prev, [attackId]: { hit: hitTotal, hitDetail, dmg: dmgResult.total, dmgDetail: dmgResult.detail, dmgType } }));
    setTimeout(() => {
      setAttackRolls((prev) => { const n = { ...prev }; delete n[attackId]; return n; });
    }, 5000);
  };

  const handleUseCharge = async (itemId: string, itemName: string) => {
    if (!char) return;
    const { hpGained, detail } = await useEquipmentCharge(char.id, itemId);
    if (hpGained > 0) {
      setHealToast({ text: `❤️ +${hpGained} HP ${detail}` });
      setTimeout(() => setHealToast(null), 3500);
    } else {
      setHealToast({ text: language === 'en' ? `✅ Used ${itemName}` : `✅ ${itemName} usada` });
      setTimeout(() => setHealToast(null), 2500);
    }
  };

  const handleCastSpell = (spellId: string, spellLevel: number, dmgStr: string | null, spellObj?: ReturnType<typeof getSpellById>) => {
    if (!char) return;
    if (spellLevel > 0) {
      const slot = char.spellSlots[spellLevel];
      if (!slot || slot.used >= slot.total) {
        setNoSlotLevel(spellLevel);
        setModal('noslot');
        return;
      }
      useSpellSlot(char.id, spellLevel);
    }

    const advState = spellAdv[spellId] ?? 'normal';
    const chosenMeta = spellMeta[spellId] ?? new Set<string>();
    const availMeta = char ? detectMetamagic(char.traits ?? []) : [];

    // Consume sorcery points if metamagic chosen
    if (chosenMeta.size > 0) {
      const spCost = metamagicCost(chosenMeta, spellLevel);
      for (let i = 0; i < spCost; i++) useSorceryPoint(char.id);
    }

    // If it's an attack-roll spell, do a full roll
    if (spellObj?.attackRoll) {
      const rollD20 = () => Math.floor(Math.random() * 20) + 1;
      const a = rollD20(); const b = rollD20();
      const d20 = advState === 'adv' ? Math.max(a, b) : advState === 'dis' ? Math.min(a, b) : a;
      const advLabel = advState === 'adv' ? `adv[${a},${b}]` : advState === 'dis' ? `dis[${a},${b}]` : `d20:${a}`;
      const atkBonus = calcSpellAttackBonus(char);
      const hit = d20 + atkBonus;
      const isCrit = d20 === 20;
      const hitDetail = `${advLabel}+${atkBonus}`;

      // Trait bonuses
      const traitBonuses = getSpellTraitBonuses(char);
      const relevant = traitBonusesForSpell(traitBonuses, spellObj);
      let extraDmgBonus = relevant.reduce((s, b) => s + b.damageBonus, 0);

      let finalDmg: number | undefined;
      let finalDmgDetail: string | undefined;
      let notes: string | undefined;

      if (dmgStr) {
        // criticals double dice
        const dmgExpression = isCrit
          ? dmgStr.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
          : dmgStr;
        const baseDmgExpr = extraDmgBonus ? `${dmgExpression}+${extraDmgBonus}` : dmgExpression;
        // Apply metamagic (modifies dice expression string)
        const metaResult = applyMetamagicToDamage(baseDmgExpr, chosenMeta, char);
        const rolledDmg = rollDamage(metaResult.dmg);
        finalDmg = rolledDmg.total;
        finalDmgDetail = rolledDmg.detail;
        notes = metaResult.notes.join(' · ') || undefined;
      }

      // Build meta note text
      const metaNames = [...chosenMeta].map((mid) => {
        const opt = availMeta.find((m) => m.id === mid);
        return opt ? (language === 'en' ? opt.nameEn : opt.namePt) : mid;
      });
      if (metaNames.length > 0) notes = (notes ? notes + ' · ' : '') + `⚗️ ${metaNames.join(' + ')}`;
      if (chosenMeta.has('quickened')) notes = '⚡ BA · ' + (notes ?? '');
      if (chosenMeta.has('heightened')) notes = (notes ?? '') + `  ⬇️ ${language === 'en' ? 'Target: disadv save' : 'Alvo: desv. resist.'}`;
      if (chosenMeta.has('twinned')) notes = (notes ?? '') + `  ×2 ${language === 'en' ? 'targets' : 'alvos'}`;

      setSpellCastResults((prev) => ({ ...prev, [spellId]: { hit, hitDetail, dmg: finalDmg, dmgDetail: finalDmgDetail, critical: isCrit, notes } }));
      setTimeout(() => setSpellCastResults((prev) => { const n = { ...prev }; delete n[spellId]; return n; }), 6000);
      return;
    }

    // Saving-throw or utility spells: just roll damage + note metamagic
    if (dmgStr) {
      const traitBonuses = getSpellTraitBonuses(char);
      const relevant = spellObj ? traitBonusesForSpell(traitBonuses, spellObj) : [];
      const extraDmgBonus = relevant.reduce((s, b) => s + b.damageBonus, 0);
      const baseDmgExpr = extraDmgBonus ? `${dmgStr}+${extraDmgBonus}` : dmgStr;
      const metaResult = applyMetamagicToDamage(baseDmgExpr, chosenMeta, char);
      const rolledDmg = rollDamage(metaResult.dmg);
      const metaNames = [...chosenMeta].map((mid) => {
        const opt = availMeta.find((m) => m.id === mid);
        return opt ? (language === 'en' ? opt.nameEn : opt.namePt) : mid;
      });
      let notes: string | undefined = metaResult.notes.join(' · ') || undefined;
      if (metaNames.length > 0) notes = (notes ? notes + ' · ' : '') + `⚗️ ${metaNames.join(' + ')}`;
      if (chosenMeta.has('heightened')) notes = (notes ?? '') + `  ⬇️ ${language === 'en' ? 'Target: disadv save' : 'Alvo: desv. resist.'}`;
      if (chosenMeta.has('twinned')) notes = (notes ?? '') + `  ×2 ${language === 'en' ? 'targets' : 'alvos'}`;
      setSpellCastResults((prev) => ({ ...prev, [spellId]: { dmg: rolledDmg.total, dmgDetail: rolledDmg.detail, notes } }));
      setTimeout(() => setSpellCastResults((prev) => { const n = { ...prev }; delete n[spellId]; return n; }), 6000);
    }
  };

  const knownSpellsByLevel = useMemo(() => {
    const groups: Record<number, NonNullable<ReturnType<typeof getSpellById>>[]> = {};
    (char?.spells ?? []).forEach((sid) => {
      const sp = getSpellById(sid);
      if (!sp) return;
      if (!groups[sp.level]) groups[sp.level] = [];
      groups[sp.level].push(sp);
    });
    return groups;
  }, [char?.spells]);

  // Magias de nível inferior que podem ser upcastadas num slot maior
  const upcastSpellsAtSlot = useMemo(() => {
    const map: Record<number, NonNullable<ReturnType<typeof getSpellById>>[]> = {};
    const maxSlot = Math.max(...Object.keys(char?.spellSlots ?? {}).map(Number), 0);
    (char?.spells ?? []).forEach((sid) => {
      const sp = getSpellById(sid);
      if (!sp || !sp.upcastDice || sp.level === 0) return;
      for (let slot = sp.level + 1; slot <= maxSlot; slot++) {
        if (!map[slot]) map[slot] = [];
        map[slot].push(sp);
      }
    });
    return map;
  }, [char?.spells, char?.spellSlots]);

  // Metamagic options (Sorcerer only)
  const availableMetamagic = useMemo(() => char ? detectMetamagic(char.traits ?? []) : [], [char?.traits]);
  const spellAtkBonus = char ? calcSpellAttackBonus(char) : 0;
  const spellDC = char ? calcSpellSaveDC(char) : 0;
  const spellTraitBonuses = char ? getSpellTraitBonuses(char) : [];
  const spLeft = char?.sorceryPoints ? char.sorceryPoints.total - char.sorceryPoints.used : 0;

  // Bonus de atributos acumulado por ASIs (escolhas de nível)
  const asiTotals = useMemo(() => computeAsiTotals(char?.traits ?? [], char?.asiChoices), [char?.traits, char?.asiChoices]);

  // Bonus de atributos de itens equipados
  const equipBonuses = useMemo(() => {
    const totals: Record<string, number> = {};
    // Bonuses from equipped items
    (char?.equipment ?? [])
      .filter((e) => e.equipped)
      .forEach((e) => e.bonuses.forEach((b) => {
        totals[b.type] = (totals[b.type] ?? 0) + b.value;
      }));
    // Bonuses from active effects (e.g. Poção de Agilidade drunk)
    (char?.activeEffects ?? []).forEach((ef) =>
      ef.bonuses.forEach((b) => {
        totals[b.type] = (totals[b.type] ?? 0) + b.value;
      })
    );
    return totals;
  }, [char?.equipment, char?.activeEffects]);

  if (!char) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Personagem não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>{t.back}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const race = getRaceById(char.race);
  const cls = getClassById(char.className);
  const raceName = translateRaceName(char.race, race?.name ?? char.race, language);
  const className = translateClassName(char.className, cls?.name ?? char.className, language);

  const handleHpChange = (delta: number) => {
    const newHp = Math.max(0, Math.min(char.maxHp, char.hp + delta));
    updateHp(char.id, newHp);
  };

  const handleUseSpellSlot = (level: number) => {
    const slot = char.spellSlots[level];
    if (!slot || slot.used >= slot.total) {
      setNoSlotLevel(level);
      setModal('noslot');
      return;
    }
    useSpellSlot(char.id, level);
  };

  const handleLevelUp = () => setModal('levelup');
  const handleDelete = () => setModal('delete');
  const handleLongRestConfirm = () => setModal('longrest');

  const handleShare = async () => {
    const text = [
      `⚔️ ${char.name}`,
      `${raceName} · ${className} · ${t.level} ${char.level}`,
      `❤️ HP: ${char.hp}/${char.maxHp}`,
      '',
      `${t.attributes}:`,
      ...ABILITIES.map(({ key, label }) => {
          const total = char.abilityScores[key] + (asiTotals[key] ?? 0);
          return `  ${label}: ${total} (${formatModifier(total)})`;
        }),
    ].join('\n');

    await Share.share({ message: text, title: char.name });
  };

  const hpPercent = char.maxHp > 0 ? char.hp / char.maxHp : 0;
  const hpColor =
    hpPercent > 0.6 ? '#50d080' : hpPercent > 0.3 ? '#e0a030' : '#ff5050';

  const spellLevelNames = language === 'en'
    ? ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th']
    : ['1°','2°','3°','4°','5°','6°','7°','8°','9°'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.charName}>{char.name}</Text>
          <Text style={styles.charSub}>
            {raceName} · {className} · {t.level} {char.level}
          </Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>{t.share}</Text>
        </TouchableOpacity>
      </View>

      {/* HP */}
      <View style={styles.hpCard}>
        <View style={styles.hpHeader}>
          <Text style={styles.hpLabel}>{t.hitPoints}</Text>
          <Text style={[styles.hpValue, { color: hpColor }]}>
            {char.hp} / {char.maxHp}
          </Text>
        </View>
        <View style={styles.hpBarBg}>
          <View style={[styles.hpBarFill, { width: `${hpPercent * 100}%`, backgroundColor: hpColor }]} />
        </View>
        <View style={styles.hpActions}>
          <TouchableOpacity style={styles.hpBtn} onPress={() => handleHpChange(-1)}>
            <Text style={styles.hpBtnText}>− 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hpBtn} onPress={() => handleHpChange(-5)}>
            <Text style={styles.hpBtnText}>− 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.hpBtn, styles.hpBtnHeal]} onPress={() => handleHpChange(1)}>
            <Text style={styles.hpBtnText}>+ 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.hpBtn, styles.hpBtnHeal]} onPress={() => handleHpChange(5)}>
            <Text style={styles.hpBtnText}>+ 5</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bolsa de moedas */}
      <TouchableOpacity style={styles.goldCard} onPress={() => { setGoldInput(''); setGoldModalOpen(true); }} activeOpacity={0.8}>
        <Text style={styles.goldIcon}>🪙</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.goldLabel}>{language === 'en' ? 'Gold Pieces' : 'Peças de Ouro'}</Text>
          <Text style={styles.goldAmount}>{char.gold ?? 40} gp</Text>
        </View>
        <Text style={styles.goldEdit}>✏️</Text>
      </TouchableOpacity>

      {/* Atributos */}
      <Text style={styles.sectionTitle}>{t.attributes}</Text>

      {/* Active effects banner (e.g. poções de status) */}
      {(char.activeEffects ?? []).length > 0 && (
        <View style={styles.activeEffectsRow}>
          {(char.activeEffects ?? []).map((ef) => (
            <View key={ef.id} style={styles.activeEffectBadge}>
              <Text style={styles.activeEffectIcon}>✨</Text>
              <View>
                <Text style={styles.activeEffectName}>{ef.name}</Text>
                <Text style={styles.activeEffectBonuses}>
                  {ef.bonuses.map((b) => `${b.value >= 0 ? '+' : ''}${b.value} ${BONUS_TYPE_LABELS[b.type][language === 'en' ? 'en' : 'pt']}`).join('  ')}
                  {'  '}<Text style={styles.activeEffectExpiry}>🌙 {language === 'en' ? 'Long Rest' : 'Desc. Longo'}</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={styles.statsGrid}>
        {ABILITIES.map(({ key, label, icon }) => {
          const base = char.abilityScores[key];
          const bonus = (asiTotals[key] ?? 0) + (equipBonuses[key] ?? 0);
          const total = base + bonus;
          const hasEquipBonus = (equipBonuses[key] ?? 0) !== 0;
          return (
            <TouchableOpacity key={key} style={[styles.statBox, hasEquipBonus && styles.statBoxBoosted]} onPress={() => setStatDetailKey(key)} activeOpacity={0.7}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statScore}>{total}</Text>
              <Text style={styles.statMod}>{formatModifier(total)}</Text>
              <Text style={styles.statLabel}>{label.slice(0, 3).toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CA — centrado abaixo dos atributos */}
      <View style={styles.acRow}>
        <View style={styles.acBadge}>
          <Text style={styles.acBadgeText}>
            🛡️ CA: {10 + Math.floor(((char.abilityScores.dexterity + (asiTotals.dexterity ?? 0) + (equipBonuses.dexterity ?? 0)) - 10) / 2) + (equipBonuses['ac'] ?? 0)}
          </Text>
        </View>
      </View>

      {/* Modal de detalhe de atributo */}
      {statDetailKey && (() => {
        const ab = ABILITIES.find((a) => a.key === statDetailKey)!;
        const base = char.abilityScores[statDetailKey];
        const asiBonus = asiTotals[statDetailKey] ?? 0;
        const eqBonus = equipBonuses[statDetailKey] ?? 0;
        const total = base + asiBonus + eqBonus;
        return (
          <Modal visible transparent animationType="fade">
            <TouchableOpacity style={styles.statModalOverlay} activeOpacity={1} onPress={() => setStatDetailKey(null)}>
              <View style={styles.statModalBox}>
                <Text style={styles.statModalTitle}>{ab.icon} {ab.label}</Text>
                <View style={styles.statModalRow}>
                  <Text style={styles.statModalLabel}>{t.base}</Text>
                  <Text style={styles.statModalValue}>{base}</Text>
                </View>
                {asiBonus !== 0 && (
                  <View style={styles.statModalRow}>
                    <Text style={styles.statModalLabel}>{t.asi}</Text>
                    <Text style={[styles.statModalValue, { color: '#50d080' }]}>{asiBonus >= 0 ? `+${asiBonus}` : asiBonus}</Text>
                  </View>
                )}
                {eqBonus !== 0 && (
                  <View style={styles.statModalRow}>
                    <Text style={styles.statModalLabel}>{language === 'en' ? 'Equipment' : 'Equipamento'}</Text>
                    <Text style={[styles.statModalValue, { color: '#60aaff' }]}>{eqBonus >= 0 ? `+${eqBonus}` : eqBonus}</Text>
                  </View>
                )}
                <View style={[styles.statModalRow, styles.statModalTotal]}>
                  <Text style={styles.statModalLabelBold}>{t.total}</Text>
                  <Text style={styles.statModalValueBold}>{total}  ({formatModifier(total)})</Text>
                </View>
                <Text style={styles.statModalHint}>{t.tapForDetail}</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        );
      })()}

      {/* ── Perícias & Testes (unified) ── */}
      {(() => {
        const profs = char.skillProficiencies ?? [];
        const maxPicks = CLASS_SKILL_COUNT[char.className] ?? 2;
        const remainingPicks = Math.max(0, maxPicks - profs.length);
        const profBonus = getProficiencyBonus(char.level);
        return (
          <>
            <TouchableOpacity style={styles.skillsHeader} onPress={() => setSkillsOpen((v) => !v)} activeOpacity={0.8}>
              <Text style={styles.sectionTitle}>{language === 'en' ? '🎲 Skills & Checks' : '🎲 Perícias & Testes'}</Text>
              <View style={styles.skillsHeaderRight}>
                {remainingPicks > 0 && (
                  <View style={styles.skillPicksBadge}>
                    <Text style={styles.skillPicksBadgeText}>{t.skillPicksLeft(remainingPicks)}</Text>
                  </View>
                )}
                <Text style={styles.profBonusLabel}>{t.profBonusLabel(profBonus)}</Text>
                <Text style={styles.skillDrawerToggle}>{skillsOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {skillsOpen && (
              <SkillsChecksPanel
                char={char}
                language={language as 'pt' | 'en'}
                themeColors={themeColors}
                activeTraitEffects={activeTraitEffects}
                asiTotals={asiTotals}
                equipBonuses={equipBonuses}
                onAddSkillProficiency={(skillId) => addSkillProficiency(char.id, skillId)}
              />
            )}
          </>
        );
      })()}

      {/* Traits / Habilidades */}
      {((char.traits?.length ?? 0) > 0 || (char.equipment ?? []).some((e) => e.equipped && e.traits.length > 0)) && (() => {
        const allFeatures = Object.values(CLASS_FEATURES).flat().flatMap((lf) => lf.features);
        const allOptions = allFeatures.flatMap((f) => f.options ?? []);
        const traitMap = Object.fromEntries([
          ...allFeatures.map((f) => [f.id, { name: f.name, description: f.description }]),
          ...allOptions.map((o) => [o.id, { name: o.name, description: o.description }]),
        ]);
        const count = (char.traits ?? []).filter((tid) => traitMap[tid]).length
          + (char.equipment ?? []).filter((e) => e.equipped && e.traits.length > 0).length;
        return (
          <>
            <TouchableOpacity
              style={styles.drawerHeader}
              onPress={() => setTraitsOpen((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTitle}>{t.features}</Text>
              <View style={styles.drawerHeaderRight}>
                <View style={styles.drawerCountBadge}>
                  <Text style={styles.drawerCountText}>{count}</Text>
                </View>
                <Text style={styles.drawerToggleIcon}>{traitsOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {traitsOpen && (
              <View style={styles.traitsBlock}>
                {(char.traits ?? []).map((tid) => {
                  const info = traitMap[tid];
                  if (!info) return null;
                  // Detect ASI features: their ID contains '_asi' and they belong to a parent feature with options
                  const parentFeature = Object.values(CLASS_FEATURES).flat().flatMap((lf) => lf.features)
                    .find((f) => f.options?.some((o) => o.id === tid));
                  // Only show ASI editor for straight ability-score increases (no feat), not for feats like Lucky, Tough, GWM, etc.
                  const isAsiFeature = parentFeature && parentFeature.id.includes('_asi') && !tid.includes('_feat_');
                  const featureId = parentFeature?.id ?? tid;
                  const currentChoices = (char.asiChoices ?? {})[featureId] ?? {};

                  // Detect skill-pick features (proficiency or expertise)
                  const directFeature = Object.values(CLASS_FEATURES).flat().flatMap((lf) => lf.features)
                    .find((f) => f.id === tid);
                  const isSkillPickFeature = !!directFeature?.pickSkills;
                  const pickedSkills = (char.featureChoices ?? {})[tid] ?? [];
                  const pointsUsed = Object.values(currentChoices).reduce((s, v) => s + (v ?? 0), 0);
                  const ABILITIES_ASI: { key: AbilityName; short: string }[] = [
                    { key: 'strength', short: language === 'en' ? 'STR' : 'FOR' },
                    { key: 'dexterity', short: language === 'en' ? 'DEX' : 'DES' },
                    { key: 'constitution', short: language === 'en' ? 'CON' : 'CON' },
                    { key: 'intelligence', short: language === 'en' ? 'INT' : 'INT' },
                    { key: 'wisdom', short: language === 'en' ? 'WIS' : 'SAB' },
                    { key: 'charisma', short: language === 'en' ? 'CHA' : 'CAR' },
                  ];
                  return (
                    <View key={tid} style={styles.traitCard}>
                      <Text style={styles.traitName}>{localizeFeatureName(tid, info.name, language)}</Text>
                      <Text style={styles.traitDesc}>{localizeFeatureDesc(tid, convertTextDistances(info.description, units, language), language)}</Text>
                      {isAsiFeature && (
                        <View style={styles.asiEditor}>
                          <View style={styles.asiEditorHeader}>
                            <Text style={styles.asiEditorTitle}>
                              {language === 'en' ? '⚡ Assign Bonuses' : '⚡ Distribuir Bônus'}
                            </Text>
                            <Text style={[styles.asiEditorPoints, pointsUsed > 2 && { color: '#ff4444' }]}>
                              {pointsUsed}/2 {language === 'en' ? 'pts' : 'pts'}
                            </Text>
                          </View>
                          <View style={styles.asiEditorGrid}>
                            {ABILITIES_ASI.map(({ key, short }) => {
                              const val = currentChoices[key] ?? 0;
                              return (
                                <View key={key} style={styles.asiStatCell}>
                                  <Text style={styles.asiStatLabel}>{short}</Text>
                                  <View style={styles.asiStatRow}>
                                    <TouchableOpacity
                                      style={[styles.asiBtn, val <= 0 && styles.asiBtnDisabled]}
                                      onPress={() => {
                                        if (val <= 0) return;
                                        const updated = { ...currentChoices, [key]: val - 1 };
                                        if (updated[key] === 0) delete updated[key];
                                        updateAsiChoice(char.id, featureId, updated);
                                      }}
                                    >
                                      <Text style={styles.asiBtnText}>−</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.asiStatVal, val > 0 && { color: themeColors.accent }]}>
                                      {val > 0 ? `+${val}` : '0'}
                                    </Text>
                                    <TouchableOpacity
                                      style={[styles.asiBtn, pointsUsed >= 2 && styles.asiBtnDisabled]}
                                      onPress={() => {
                                        if (pointsUsed >= 2) return;
                                        const updated = { ...currentChoices, [key]: val + 1 };
                                        updateAsiChoice(char.id, featureId, updated);
                                      }}
                                    >
                                      <Text style={styles.asiBtnText}>+</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      )}
                      {isSkillPickFeature && (() => {
                        const pickCount = directFeature!.pickCount ?? 1;
                        const pickType = directFeature!.pickType ?? 'proficiency';
                        const label = pickType === 'expertise'
                          ? (language === 'en' ? '🎯 Expertise' : '🎯 Especialização')
                          : (language === 'en' ? '📖 Proficiency Choice' : '📖 Escolha de Proficiência');
                        const skillNames = pickedSkills.map((sid) => {
                          const sk = SKILLS.find((s) => s.id === sid);
                          return sk ? (language === 'en' ? sk.nameEn : sk.name) : sid;
                        });
                        return (
                          <View style={styles.featurePickRow}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.featurePickLabel}>{label}</Text>
                              {pickedSkills.length > 0 ? (
                                <Text style={styles.featurePickValue}>{skillNames.join(', ')}</Text>
                              ) : (
                                <Text style={styles.featurePickEmpty}>
                                  {language === 'en' ? `Pick ${pickCount} skill${pickCount > 1 ? 's' : ''}` : `Escolha ${pickCount} habilidade${pickCount > 1 ? 's' : ''}`}
                                </Text>
                              )}
                            </View>
                            <TouchableOpacity
                              style={styles.featurePickBtn}
                              onPress={() => {
                                const availableSkills = pickType === 'expertise'
                                  ? (char.skillProficiencies ?? [])
                                  : (directFeature!.pickSkills!.length > 0 ? directFeature!.pickSkills! : (char.skillProficiencies ?? []));
                                setFeaturePickerModal({
                                  featureId: tid,
                                  featureName: language === 'en' ? info.name : localizeFeatureName(tid, info.name, language),
                                  pickSkills: availableSkills,
                                  pickCount,
                                  pickType,
                                  pending: [...pickedSkills],
                                });
                              }}
                            >
                              <Text style={styles.featurePickBtnText}>
                                {pickedSkills.length > 0 ? (language === 'en' ? 'Edit' : 'Editar') : (language === 'en' ? 'Choose' : 'Escolher')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })()}
                    </View>
                  );
                })}
                {/* Traits from equipped items */}
                {(char.equipment ?? [])
                  .filter((e) => e.equipped && e.traits.length > 0)
                  .map((e) => (
                    <View key={`eq-${e.id}`} style={[styles.traitCard, { borderLeftWidth: 3, borderLeftColor: themeColors.accent + '88' }]}>
                      <Text style={styles.traitName}>
                        {EQUIPMENT_TYPE_ICONS[e.type]} {e.name}
                      </Text>
                      {e.traits.map((tr, i) => (
                        <Text key={i} style={styles.traitDesc}>• {tr}</Text>
                      ))}
                    </View>
                  ))}
              </View>
            )}
          </>
        );
      })()}

      {/* Magias */}
      {cls?.spellcaster && (
        <>
          <TouchableOpacity
            style={styles.drawerHeader}
            onPress={() => setSpellsOpen((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>{t.spells}</Text>
            <View style={styles.drawerHeaderRight}>
              <Text style={styles.drawerToggleIcon}>{spellsOpen ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          {spellsOpen && (<>

          {/* Pontos de Feitiçaria (apenas Sorcerer nível ≥ 2) */}
          {char.className === 'sorcerer' && char.sorceryPoints && char.sorceryPoints.total > 0 && (() => {
            const { total, used } = char.sorceryPoints;
            const available = total - used;
            return (
              <View style={styles.sorceryBlock}>
                <View style={styles.sorceryHeader}>
                  <Text style={styles.sorceryTitle}>{t.sorceryPoints}</Text>
                  <Text style={styles.sorceryCount}>{available}/{total}</Text>
                </View>
                <View style={styles.sorceryDots}>
                  {Array.from({ length: total }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => i >= used ? useSorceryPoint(char.id) : undefined}
                      activeOpacity={i >= used ? 0.7 : 1}
                    >
                      <View style={[styles.sorceryDot, i < used ? styles.sorceryDotUsed : styles.sorceryDotFull]} />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Flexible Casting — Slot → Pontos */}
                <Text style={styles.flexCastLabel}>{t.slotToPoints}</Text>
                <View style={styles.flexCastRow}>
                  {[1,2,3,4,5,6,7,8,9].map((lvl) => {
                    const slotInfo = char.spellSlots?.[lvl];
                    if (!slotInfo) return null;
                    const slotAvailable = slotInfo.total - slotInfo.used;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        style={[styles.flexCastBtn, slotAvailable <= 0 && styles.flexCastBtnDisabled]}
                        disabled={slotAvailable <= 0}
                        onPress={() => convertSlotToPoints(char.id, lvl)}
                      >
                        <Text style={styles.flexCastBtnText}>{spellLevelNames[lvl-1]} +{lvl}pt</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Flexible Casting — Pontos → Slot */}
                <Text style={styles.flexCastLabel}>{t.pointsToSlot}</Text>
                <View style={styles.flexCastRow}>
                  {([1,2,3,4,5] as const).map((lvl) => {
                    const COST: Record<number,number> = {1:2,2:3,3:5,4:6,5:7};
                    const cost = COST[lvl];
                    const canAfford = available >= cost;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        style={[styles.flexCastBtn, !canAfford && styles.flexCastBtnDisabled]}
                        disabled={!canAfford}
                        onPress={() => convertPointsToSlot(char.id, lvl)}
                      >
                        <Text style={styles.flexCastBtnText}>{spellLevelNames[lvl-1]} -{cost}pt</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })()}

          {/* ── Ki Points (Monk) — moved outside spells section ── */}

          {/* Truques */}
          {(knownSpellsByLevel[0]?.length ?? 0) > 0 && (
            <View style={styles.spellsBlock}>
              <Text style={styles.spellGroupLabel}>{t.cantrips.toUpperCase()}</Text>
              {knownSpellsByLevel[0].map((sp) => {
                const dmg = getSpellDamage(sp, char.level);
                const castResult = spellCastResults[sp.id];
                const adv = spellAdv[sp.id] ?? 'normal';
                const chosenMeta = spellMeta[sp.id] ?? new Set<string>();
                const relevantBonuses = traitBonusesForSpell(spellTraitBonuses, sp);
                return (
                  <View key={sp.id} style={[styles.spellMiniRow, castResult ? styles.spellMiniRowActive : undefined]}>
                    <View style={{ flex: 1 }}>
                      {/* Main spell row */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>{SCHOOL_ICON[sp.school]}</Text>
                        <Text style={[styles.spellMiniName, { flex: 1 }]}>{localizeSpellName(sp, language)}</Text>
                        <Text style={{ color: themeColors.subtext, fontSize: 10, marginRight: 4 }}>📏 {convertRange(sp.range, units, language as 'pt' | 'en')}</Text>
                        {sp.savingThrow && (
                          <Text style={[styles.spellMiniCast, { color: themeColors.subtext, fontSize: 10 }]}>
                            CD{spellDC} {language === 'en' ? sp.savingThrow.abilityEn : sp.savingThrow.ability}
                          </Text>
                        )}
                        {dmg && !castResult && (
                          <Text style={styles.spellMiniDmg}>🎲 {translateDamageType(dmg, language)}</Text>
                        )}
                      </View>
                      {/* Trait bonuses */}
                      {relevantBonuses.length > 0 && (
                        <Text style={{ color: themeColors.accent, fontSize: 10, marginLeft: 24 }}>
                          +{relevantBonuses.reduce((s, b) => s + b.damageBonus, 0)} {language === 'en' ? relevantBonuses[0].labelEn : relevantBonuses[0].labelPt}
                        </Text>
                      )}
                      {/* Metamagic chips */}
                      {availableMetamagic.length > 0 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4, marginLeft: 24 }}>
                          <Text style={{ color: themeColors.subtext, fontSize: 10, alignSelf: 'center' }}>⚗️</Text>
                          {availableMetamagic.map((opt) => {
                            const chosen = chosenMeta.has(opt.id);
                            const cost = opt.id === 'twinned' ? 0 : opt.cost;
                            const canAfford = spLeft >= cost || chosen;
                            return (
                              <TouchableOpacity key={opt.id}
                                style={{ borderRadius: 5, borderWidth: 1, borderColor: chosen ? themeColors.accent : themeColors.border, backgroundColor: chosen ? themeColors.accent + '22' : themeColors.bg, paddingHorizontal: 6, paddingVertical: 2, opacity: canAfford || chosen ? 1 : 0.4 }}
                                onPress={() => {
                                  if (!canAfford && !chosen) return;
                                  setSpellMeta((prev) => {
                                    const cur = new Set(prev[sp.id] ?? []);
                                    chosen ? cur.delete(opt.id) : cur.add(opt.id);
                                    return { ...prev, [sp.id]: cur };
                                  });
                                }}
                              >
                                <Text style={{ fontSize: 10, color: chosen ? themeColors.accent : themeColors.subtext, fontWeight: chosen ? '700' : '400' }}>
                                  {chosen ? '✓ ' : ''}{language === 'en' ? opt.nameEn : opt.namePt}({cost}sp)
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                      {/* Cast result */}
                      {castResult && (
                        <View style={{ backgroundColor: themeColors.bg, borderRadius: 6, padding: 6, marginTop: 4, borderWidth: 1, borderColor: themeColors.border }}>
                          {castResult.hit !== undefined && (
                            <Text style={{ color: castResult.critical ? '#f0a500' : themeColors.text, fontWeight: '800', fontSize: 14 }}>
                              🎯 {castResult.critical ? '💥 CRIT! ' : ''}{castResult.hit}  <Text style={{ color: themeColors.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.hitDetail}</Text>
                            </Text>
                          )}
                          {castResult.dmg !== undefined && (
                            <Text style={{ color: themeColors.accent, fontWeight: '800', fontSize: 14 }}>
                              💥 {castResult.dmg}  <Text style={{ color: themeColors.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.dmgDetail}</Text>
                            </Text>
                          )}
                          {castResult.notes && <Text style={{ color: themeColors.subtext, fontSize: 11, marginTop: 2 }}>{castResult.notes}</Text>}
                        </View>
                      )}
                      {/* ADV/DIS toggle + cast button */}
                      {(dmg || sp.attackRoll || sp.savingThrow) && (
                        <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                          {sp.attackRoll && (
                            <TouchableOpacity
                              style={{ flex: 1, borderRadius: 7, borderWidth: 1, borderColor: adv !== 'normal' ? (adv === 'adv' ? '#44ff66' : '#ff4444') : themeColors.border, backgroundColor: adv === 'adv' ? '#1a3a1a' : adv === 'dis' ? '#3a1a1a' : themeColors.bg, paddingVertical: 5, alignItems: 'center' }}
                              onPress={() => setSpellAdv((prev) => { const cur = prev[sp.id] ?? 'normal'; const nxt = cur === 'normal' ? 'adv' : cur === 'adv' ? 'dis' : 'normal'; return { ...prev, [sp.id]: nxt }; })}
                            >
                              <Text style={{ fontSize: 11, fontWeight: '700', color: adv === 'adv' ? '#44ff66' : adv === 'dis' ? '#ff4444' : themeColors.subtext }}>
                                {adv === 'normal' ? '◈ Normal' : adv === 'adv' ? '▲ ADV' : '▼ DIS'}
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={{ flex: 2, borderRadius: 7, backgroundColor: themeColors.accent, paddingVertical: 5, alignItems: 'center' }}
                            onPress={() => handleCastSpell(sp.id, 0, dmg, sp)}
                          >
                            <Text style={{ color: themeColors.bg, fontWeight: '800', fontSize: 12 }}>
                              🎲 {sp.attackRoll ? (language === 'en' ? 'Attack' : 'Atacar') : (language === 'en' ? 'Cast' : 'Conjurar')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Slots com magias */}
          {Object.keys(char.spellSlots).length > 0 && (
            <View style={styles.spellsBlock}>
              {Object.entries(char.spellSlots).map(([lvl, slot]) => {
                const available = slot.total - slot.used;
                const spellsOfLevel = knownSpellsByLevel[Number(lvl)] ?? [];
                const upcastable = upcastSpellsAtSlot[Number(lvl)] ?? [];

                const renderSpellRow = (sp: NonNullable<ReturnType<typeof getSpellById>>, spellKey: string, slotLevel: number, dmg: string | null, isUpcast: boolean) => {
                  const castResult = spellCastResults[spellKey];
                  const adv = spellAdv[spellKey] ?? 'normal';
                  const chosenMeta = spellMeta[spellKey] ?? new Set<string>();
                  const relevantBonuses = traitBonusesForSpell(spellTraitBonuses, sp);
                  return (
                    <View key={spellKey} style={[styles.spellMiniRow, isUpcast ? styles.spellMiniRowUpcast : undefined, castResult ? styles.spellMiniRowActive : undefined, available === 0 ? styles.spellMiniRowDisabled : undefined]}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>{SCHOOL_ICON[sp.school]}</Text>
                          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.spellMiniName}>{localizeSpellName(sp, language)}</Text>
                            {isUpcast && <Text style={styles.upcastBadge}>↑{lvl}°</Text>}
                          </View>
                          <Text style={{ color: themeColors.subtext, fontSize: 10, marginRight: 4 }}>📏 {convertRange(sp.range, units, language as 'pt' | 'en')}</Text>
                          {sp.savingThrow && (
                            <Text style={{ color: themeColors.subtext, fontSize: 10 }}>
                              CD{spellDC} {language === 'en' ? sp.savingThrow.abilityEn : sp.savingThrow.ability}
                            </Text>
                          )}
                          {dmg && !castResult && (
                            <Text style={styles.spellMiniDmg}>🎲 {translateDamageType(dmg, language)}</Text>
                          )}
                        </View>
                        {relevantBonuses.length > 0 && (
                          <Text style={{ color: themeColors.accent, fontSize: 10, marginLeft: 24 }}>
                            +{relevantBonuses.reduce((s, b) => s + b.damageBonus, 0)} {language === 'en' ? relevantBonuses[0].labelEn : relevantBonuses[0].labelPt}
                          </Text>
                        )}
                        {availableMetamagic.length > 0 && (
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4, marginLeft: 24 }}>
                            <Text style={{ color: themeColors.subtext, fontSize: 10, alignSelf: 'center' }}>⚗️</Text>
                            {availableMetamagic.map((opt) => {
                              const chosen = chosenMeta.has(opt.id);
                              const cost = opt.id === 'twinned' ? slotLevel : opt.cost;
                              const canAfford = spLeft >= cost || chosen;
                              return (
                                <TouchableOpacity key={opt.id}
                                  style={{ borderRadius: 5, borderWidth: 1, borderColor: chosen ? themeColors.accent : themeColors.border, backgroundColor: chosen ? themeColors.accent + '22' : themeColors.bg, paddingHorizontal: 6, paddingVertical: 2, opacity: canAfford || chosen ? 1 : 0.4 }}
                                  onPress={() => {
                                    if (!canAfford && !chosen) return;
                                    setSpellMeta((prev) => {
                                      const cur = new Set(prev[spellKey] ?? []);
                                      chosen ? cur.delete(opt.id) : cur.add(opt.id);
                                      return { ...prev, [spellKey]: cur };
                                    });
                                  }}
                                >
                                  <Text style={{ fontSize: 10, color: chosen ? themeColors.accent : themeColors.subtext, fontWeight: chosen ? '700' : '400' }}>
                                    {chosen ? '✓ ' : ''}{language === 'en' ? opt.nameEn : opt.namePt}({cost}sp)
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                        {castResult && (
                          <View style={{ backgroundColor: themeColors.bg, borderRadius: 6, padding: 6, marginTop: 4, borderWidth: 1, borderColor: themeColors.border }}>
                            {castResult.hit !== undefined && (
                              <Text style={{ color: castResult.critical ? '#f0a500' : themeColors.text, fontWeight: '800', fontSize: 14 }}>
                                🎯 {castResult.critical ? '💥 CRIT! ' : ''}{castResult.hit}  <Text style={{ color: themeColors.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.hitDetail}</Text>
                              </Text>
                            )}
                            {castResult.dmg !== undefined && (
                              <Text style={{ color: themeColors.accent, fontWeight: '800', fontSize: 14 }}>
                                💥 {castResult.dmg}  <Text style={{ color: themeColors.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.dmgDetail}</Text>
                              </Text>
                            )}
                            {castResult.notes && <Text style={{ color: themeColors.subtext, fontSize: 11, marginTop: 2 }}>{castResult.notes}</Text>}
                          </View>
                        )}
                        {(dmg || sp.attackRoll || sp.savingThrow) && available > 0 && (
                          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                            {sp.attackRoll && (
                              <TouchableOpacity
                                style={{ flex: 1, borderRadius: 7, borderWidth: 1, borderColor: adv !== 'normal' ? (adv === 'adv' ? '#44ff66' : '#ff4444') : themeColors.border, backgroundColor: adv === 'adv' ? '#1a3a1a' : adv === 'dis' ? '#3a1a1a' : themeColors.bg, paddingVertical: 5, alignItems: 'center' }}
                                onPress={() => setSpellAdv((prev) => { const cur = prev[spellKey] ?? 'normal'; const nxt = cur === 'normal' ? 'adv' : cur === 'adv' ? 'dis' : 'normal'; return { ...prev, [spellKey]: nxt }; })}
                              >
                                <Text style={{ fontSize: 11, fontWeight: '700', color: adv === 'adv' ? '#44ff66' : adv === 'dis' ? '#ff4444' : themeColors.subtext }}>
                                  {adv === 'normal' ? '◈ Normal' : adv === 'adv' ? '▲ ADV' : '▼ DIS'}
                                </Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={{ flex: 2, borderRadius: 7, backgroundColor: themeColors.accent, paddingVertical: 5, alignItems: 'center' }}
                              onPress={() => handleCastSpell(spellKey, slotLevel, dmg, sp)}
                            >
                              <Text style={{ color: themeColors.bg, fontWeight: '800', fontSize: 12 }}>
                                🎲 {sp.attackRoll ? (language === 'en' ? 'Attack' : 'Atacar') : sp.savingThrow ? `CD${spellDC} ${language === 'en' ? 'Save' : 'Resist.'}` : (language === 'en' ? 'Cast' : 'Conjurar')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                };

                return (
                  <View key={lvl} style={styles.slotGroup}>
                    <View style={styles.spellRow}>
                      <Text style={styles.spellLevel}>{spellLevelNames[Number(lvl) - 1]} {language === 'en' ? 'level' : 'nível'}</Text>
                      <View style={styles.slotDots}>
                        {Array.from({ length: slot.total }).map((_, i) => (
                          <View key={i} style={[styles.slotDot, i < available ? styles.slotDotFull : styles.slotDotEmpty]} />
                        ))}
                      </View>
                      <Text style={styles.slotCount}>{available}/{slot.total}</Text>
                    </View>
                    {spellsOfLevel.length === 0 && upcastable.length === 0 && (
                      <Text style={styles.noSpellsHint}>{t.noSpellsHint}</Text>
                    )}
                    {spellsOfLevel.map((sp) => renderSpellRow(sp, sp.id, Number(lvl), getSpellDamage(sp, char.level), false))}
                    {upcastable.map((sp) => renderSpellRow(sp, `${sp.id}-up${lvl}`, Number(lvl), getSpellDamageAtSlot(sp, Number(lvl)), true))}
                  </View>
                );
              })}
            </View>
          )}
          </>)}
        </>
      )}

      {/* ── Ki Points (Monk) ── */}
      {char.className === 'monk' && char.level >= 2 && (() => {
        if (!char.kiPoints) {
          return (
            <View style={[styles.sorceryBlock, { marginHorizontal: 16, marginBottom: 12 }]}>
              <Text style={styles.sorceryTitle}>🌀 {language === 'en' ? 'Ki Points' : 'Pontos de Ki'}</Text>
              <TouchableOpacity style={styles.flexCastBtn} onPress={() => recoverKiPoints(char.id)}>
                <Text style={styles.flexCastBtnText}>
                  {language === 'en' ? '✨ Initialize Ki Points' : '✨ Inicializar Pontos de Ki'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
        const { total, used } = char.kiPoints;
        const available = total - used;
        return (
          <View style={[styles.sorceryBlock, { marginHorizontal: 16, marginBottom: 12 }]}>
            <View style={styles.sorceryHeader}>
              <Text style={styles.sorceryTitle}>🌀 {language === 'en' ? 'Ki Points' : 'Pontos de Ki'}</Text>
              <Text style={styles.sorceryCount}>{available}/{total}</Text>
            </View>
            <View style={styles.sorceryDots}>
              {Array.from({ length: total }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { if (i >= used) useKiPoint(char.id); }}
                  activeOpacity={i >= used ? 0.7 : 1}
                >
                  <View style={[styles.sorceryDot, i < used ? styles.sorceryDotUsed : styles.sorceryDotFull]} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: themeColors.subtext, fontSize: 11, marginTop: 4, marginBottom: 6 }}>
              {language === 'en'
                ? 'Tap a dot to spend 1 ki. Recovers on short or long rest.'
                : 'Toque um ponto para gastar 1 ki. Recupera em descanso curto ou longo.'}
            </Text>
          </View>
        );
      })()}

      {/* ── Painel de Combate Unificado ── */}
      <TouchableOpacity
        style={styles.drawerHeader}
        onPress={() => setCombatOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.sectionTitle}>{language === 'en' ? '⚔️ Combat' : '⚔️ Combate'}</Text>
        <Text style={styles.drawerToggleIcon}>{combatOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {combatOpen && (
      <CombatPanel
        char={char}
        language={language as 'pt' | 'en'}
        units={units}
        themeColors={themeColors}
        actionUses={char.actionUses ?? {}}
        activeTraitEffects={activeTraitEffects}
        onToggleTraitEffect={handleToggleTraitEffect}
        onSpendKi={(amount) => useKiPoint(char.id, amount)}
        onUseFeatureAction={(actionId, maxUses) => useFeatureAction(char.id, actionId, maxUses)}
        onUseCharge={(itemId) => useEquipmentCharge(char.id, itemId)}
      />
      )}

      {/* ── Manobras de Combate ── */}
      <TouchableOpacity
        style={styles.drawerHeader}
        onPress={() => setManobraOpen(v => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.sectionTitle}>{language === 'en' ? '⚔️ Combat Maneuvers' : '⚔️ Manobras de Combate'}</Text>
        <Text style={styles.drawerToggleIcon}>{manobraOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {manobraOpen && (
        <CombatManeuvers
          char={char}
          language={language as 'pt' | 'en'}
          themeColors={themeColors}
          activeTraitEffects={activeTraitEffects}
        />
      )}

      {/* ── Equipamentos + Inventário ── */}
      {(() => {
        const allItems = char.equipment ?? [];
        const typeLabels = language === 'en' ? EQUIPMENT_TYPE_LABELS_EN : EQUIPMENT_TYPE_LABELS_PT;

        // Split: equipped gear (non-consumable, non-other, equipped) vs. inventory (everything else)
        const equippedItems = allItems.filter(
          (e) => e.equipped && e.type !== 'consumable' && e.type !== 'other'
        );
        const inventoryItems = allItems.filter(
          (e) => !e.equipped || e.type === 'consumable' || e.type === 'other'
        );

        const totalWeightLbs = allItems.reduce((s, e) => s + (e.weight ?? 0), 0);
        const carryCapLbs = (char.abilityScores?.strength ?? 10) * 15;
        const weightDisplay = units === 'metric'
          ? `${(totalWeightLbs * 0.453592).toFixed(1)} / ${(carryCapLbs * 0.453592).toFixed(0)} kg`
          : `${totalWeightLbs % 1 === 0 ? totalWeightLbs : totalWeightLbs.toFixed(1)} / ${carryCapLbs} lbs`;
        const weightRatio = totalWeightLbs / carryCapLbs;
        const weightColor = weightRatio >= 1 ? '#ff4444' : weightRatio >= 0.5 ? '#f0a500' : '#4caf50';

        const renderItem = (item: Equipment) => {
          const attackResults = Object.entries(attackRolls).filter(([k]) => k.startsWith(item.id + ':'));
          return (
            <View key={item.id} style={[styles.equipCard, !item.equipped && styles.equipCardUnequipped]}>
              {/* Item header */}
              <View style={styles.equipCardHeader}>
                <Text style={styles.equipTypeIcon}>{EQUIPMENT_TYPE_ICONS[item.type]}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.equipName, !item.equipped && styles.equipNameUnequipped]}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.equipTypeName}>{typeLabels[item.type]}</Text>
                    {(item.goldValue ?? 0) > 0 && (
                      <Text style={styles.equipGoldValue}>🪙 {item.goldValue} gp</Text>
                    )}
                    {item.duration === 'long_rest' && (
                      <Text style={styles.equipDurationBadge}>🌙 {language === 'en' ? 'Long Rest' : 'Desc. Longo'}</Text>
                    )}
                    {item.duration === 'forever' && item.type === 'accessory' && (
                      <Text style={styles.equipDurationBadge}>♾️</Text>
                    )}
                  </View>
                </View>
                {item.type !== 'consumable' && (
                  <TouchableOpacity style={styles.equippedToggle} onPress={() => toggleEquipped(char.id, item.id)}>
                    <View style={[styles.equippedToggleDot, item.equipped && styles.equippedToggleDotOn]} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.equipActionBtn} onPress={() => { setEditingEquip(item); setEquipModalOpen(true); }}>
                  <Text style={styles.equipActionBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.equipActionBtn} onPress={() => setDeleteEquipId(item.id)}>
                  <Text style={styles.equipDeleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Charges + Use button for consumables */}
              {item.type === 'consumable' && item.charges !== undefined && (
                <View style={styles.chargesRow}>
                  {item.activated && (
                    <View style={styles.chargePips}>
                      {Array.from({ length: item.maxCharges ?? item.charges }).map((_, i) => (
                        <View
                          key={i}
                          style={[styles.chargePip, i < item.charges! ? styles.chargePipFull : styles.chargePipEmpty]}
                        />
                      ))}
                      <Text style={styles.chargesLabel}>{item.charges}/{item.maxCharges ?? item.charges}</Text>
                    </View>
                  )}
                  {!item.activated && (
                    <TouchableOpacity
                      style={styles.useBtn}
                      onPress={() => {
                        if (item.useEffect) {
                          handleUseCharge(item.id, item.name);
                        } else {
                          activateConsumable(char.id, item.id);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.useBtnText}>
                        {item.useEffect?.type === 'heal'
                          ? (language === 'en' ? `🧪 Use — ${item.useEffect.dice} HP` : `🧪 Usar — ${item.useEffect.dice} PV`)
                          : (language === 'en' ? '🧪 Drink' : '🧪 Beber')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Bonuses */}
              {item.bonuses.length > 0 && (
                <View style={styles.equipBonusRow}>
                  {item.bonuses.map((b, i) => (
                    <View key={i} style={[styles.equipBonusBadge, !item.equipped && styles.equipBonusBadgeOff]}>
                      <Text style={styles.equipBonusBadgeText}>
                        {BONUS_TYPE_LABELS[b.type][language === 'en' ? 'en' : 'pt']} {b.value >= 0 ? `+${b.value}` : b.value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Traits */}
              {item.traits.map((tr, i) => (
                <Text key={i} style={styles.equipTrait}>• {tr}</Text>
              ))}

              {/* Description */}
              {item.description ? <Text style={styles.equipDesc}>{item.description}</Text> : null}
            </View>
          );
        };

        return (
          <>
            {/* ── Drawer: Equipamentos (gear ativamente equipado) ── */}
            <TouchableOpacity style={styles.drawerHeader} onPress={() => setEquipOpen((v) => !v)} activeOpacity={0.8}>
              <Text style={styles.sectionTitle}>{language === 'en' ? '⚔️ Equipment' : '⚔️ Equipamentos'}</Text>
              <View style={styles.drawerHeaderRight}>
                {totalWeightLbs > 0 && (
                  <Text style={[styles.drawerCountText, { color: weightColor, marginRight: 6 }]}>⚖️ {weightDisplay}</Text>
                )}
                {equippedItems.length > 0 && (
                  <View style={styles.drawerCountBadge}>
                    <Text style={styles.drawerCountText}>{equippedItems.length}</Text>
                  </View>
                )}
                <Text style={styles.drawerToggleIcon}>{equipOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {equipOpen && (
              <View style={styles.equipBlock}>
                {equippedItems.length === 0 && (
                  <Text style={styles.equipEmpty}>{language === 'en' ? 'No equipped gear. Equip items from your inventory.' : 'Nenhum item equipado. Equipe itens do inventário.'}</Text>
                )}
                {equippedItems.map(renderItem)}
              </View>
            )}

            {/* ── Drawer: Inventário (não equipados + consumíveis + outros) ── */}
            <TouchableOpacity style={styles.drawerHeader} onPress={() => setInventoryOpen((v) => !v)} activeOpacity={0.8}>
              <Text style={styles.sectionTitle}>{language === 'en' ? '🎒 Inventory' : '🎒 Inventário'}</Text>
              <View style={styles.drawerHeaderRight}>
                {inventoryItems.length > 0 && (
                  <View style={styles.drawerCountBadge}>
                    <Text style={styles.drawerCountText}>{inventoryItems.length}</Text>
                  </View>
                )}
                <Text style={styles.drawerToggleIcon}>{inventoryOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {inventoryOpen && (
              <View style={styles.equipBlock}>
                {inventoryItems.length === 0 && (
                  <Text style={styles.equipEmpty}>{language === 'en' ? 'Inventory is empty.' : 'Inventário vazio.'}</Text>
                )}
                {inventoryItems.map(renderItem)}

                {/* Add item button only in inventory drawer */}
                <TouchableOpacity style={styles.addEquipBtn} onPress={() => { setEditingEquip(null); setEquipModalOpen(true); }}>
                  <Text style={styles.addEquipBtnText}>+ {language === 'en' ? 'Add Item' : 'Adicionar Item'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      })()}

      {/* Ações */}
      <Text style={styles.sectionTitle}>{t.actions}</Text>
      {cls?.spellcaster && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/character/spells/${char.id}`)}
        >
          <Text style={styles.actionBtnText}>{t.manageSpellbook}</Text>
          <Text style={styles.actionBtnSub}>
            {t.spellsAdded(char.spells?.length ?? 0)}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.actionBtn} onPress={handleLongRestConfirm}>
        <Text style={styles.actionBtnText}>{t.longRest}</Text>
        <Text style={styles.actionBtnSub}>{t.longRestSub}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={() => setModal('shortrest')}>
        <Text style={styles.actionBtnText}>{t.shortRest}</Text>
        <Text style={styles.actionBtnSub}>{t.shortRestSub}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.levelUpBtn} onPress={handleLevelUp}>
        <Text style={styles.levelUpBtnText}>{t.levelUp(char.level, char.level + 1)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>{t.deleteChar}</Text>
      </TouchableOpacity>

      {/* Modais de confirmação */}
      <ConfirmModal
        visible={modal === 'delete'}
        title={t.deleteTitle}
        message={t.deleteMsg(char.name)}
        confirmLabel={t.deleteLabel}
        confirmDestructive
        onCancel={() => setModal(null)}
        onConfirm={async () => {
          setModal(null);
          closeTab(char.id);
          router.replace('/');
          await deleteCharacter(char.id);
        }}
      />
      <LevelUpModal
        visible={modal === 'levelup'}
        characterName={char.name}
        classId={char.className}
        currentLevel={char.level}
        existingTraits={char.traits ?? []}
        onCancel={() => setModal(null)}
        onConfirm={(selectedTraits) => {
          setModal(null);
          levelUp(char.id, selectedTraits);
        }}
      />
      <ConfirmModal
        visible={modal === 'longrest'}
        title={t.longRestTitle}
        message={t.longRestMsg}
        confirmLabel={t.confirm}
        onCancel={() => setModal(null)}
        onConfirm={() => {
          setModal(null);
          recoverSpellSlots(char.id);
          updateHp(char.id, char.maxHp);
          recoverSorceryPoints(char.id);
          recoverKiPoints(char.id);
          clearLongRestItems(char.id);
          resetFeatureActions(char.id, 'long_rest');
        }}
      />
      <ShortRestModal
        visible={modal === 'shortrest'}
        character={char}
        onCancel={() => setModal(null)}
        onConfirm={(diceSpent, hpGained) => {
          setModal(null);
          shortRest(char.id, diceSpent, hpGained);
          resetFeatureActions(char.id, 'short_rest');
        }}
      />
      <ConfirmModal
        visible={modal === 'noslot'}
        title={t.noSlotsTitle}
        message={t.noSlotsMsg(noSlotLevel)}
        confirmLabel={t.ok}
        onCancel={() => setModal(null)}
        onConfirm={() => setModal(null)}
      />
      {/* Equipment modal */}
      <EquipmentModal
        visible={equipModalOpen}
        initial={editingEquip}
        onCancel={() => setEquipModalOpen(false)}
        onSave={(item) => {
          setEquipModalOpen(false);
          if (editingEquip) {
            updateEquipment(char.id, item);
          } else {
            addEquipment(char.id, item);
          }
        }}
      />
      {/* Delete equipment confirm */}
      <ConfirmModal
        visible={deleteEquipId !== null}
        title={language === 'en' ? 'Remove item' : 'Remover item'}
        message={language === 'en' ? 'Remove this item from the character?' : 'Remover este item do personagem?'}
        confirmLabel={language === 'en' ? 'Remove' : 'Remover'}
        confirmDestructive
        onCancel={() => setDeleteEquipId(null)}
        onConfirm={() => {
          if (deleteEquipId) removeEquipment(char.id, deleteEquipId);
          setDeleteEquipId(null);
        }}
      />

      {/* Gold wallet modal */}
      <Modal visible={goldModalOpen} transparent animationType="fade">
        <View style={styles.goldModalOverlay}>
          <View style={styles.goldModalBox}>
            <Text style={styles.goldModalTitle}>🪙 {language === 'en' ? 'Gold Wallet' : 'Bolsa de Moedas'}</Text>
            <Text style={styles.goldModalCurrent}>{char.gold ?? 40} gp</Text>
            <Text style={styles.goldModalHint}>
              {language === 'en'
                ? 'Enter amount to add (+) or remove (−):'
                : 'Digite o valor para adicionar (+) ou remover (−):'}
            </Text>
            <TextInput
              style={styles.goldModalInput}
              value={goldInput}
              onChangeText={setGoldInput}
              placeholder={language === 'en' ? 'e.g.: 50 or -20' : 'Ex: 50 ou -20'}
              placeholderTextColor={themeColors.subtext + '88'}
              keyboardType="numbers-and-punctuation"
              autoFocus
            />
            {/* Quick buttons */}
            <View style={styles.goldModalBtns}>
              {[-50, -10, -5, +5, +10, +50].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.goldQuickBtn, v > 0 ? styles.goldQuickBtnAdd : styles.goldQuickBtnRemove]}
                  onPress={() => { updateGold(char.id, v); setGoldModalOpen(false); }}
                >
                  <Text style={styles.goldQuickBtnText}>{v > 0 ? `+${v}` : v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.goldModalActions}>
              <TouchableOpacity style={styles.goldCancelBtn} onPress={() => setGoldModalOpen(false)}>
                <Text style={styles.goldCancelBtnText}>{language === 'en' ? 'Cancel' : 'Cancelar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.goldConfirmBtn}
                onPress={() => {
                  const val = parseInt(goldInput.replace(',', '.'));
                  if (!isNaN(val)) updateGold(char.id, val);
                  setGoldModalOpen(false);
                }}
              >
                <Text style={styles.goldConfirmBtnText}>{language === 'en' ? 'Apply' : 'Aplicar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Feature skill picker modal */}
      <Modal visible={featurePickerModal !== null} transparent animationType="slide">
        <View style={styles.goldModalOverlay}>
          <View style={[styles.goldModalBox, { maxHeight: '80%' }]}>
            <Text style={[styles.goldModalTitle, { fontSize: 16, color: themeColors.accent }]}>
              {featurePickerModal?.featureName}
            </Text>
            <Text style={[styles.goldModalHint, { marginBottom: 12 }]}>
              {featurePickerModal?.pickType === 'expertise'
                ? (language === 'en'
                  ? `Choose ${featurePickerModal.pickCount} skill${featurePickerModal.pickCount > 1 ? 's' : ''} to gain expertise (double proficiency bonus)`
                  : `Escolha ${featurePickerModal!.pickCount} habilidade${featurePickerModal!.pickCount > 1 ? 's' : ''} para ter expertise (dobrar bônus de proficiência)`)
                : (language === 'en'
                  ? `Choose ${featurePickerModal?.pickCount} skill${(featurePickerModal?.pickCount ?? 1) > 1 ? 's' : ''} to gain proficiency`
                  : `Escolha ${featurePickerModal?.pickCount} habilidade${(featurePickerModal?.pickCount ?? 1) > 1 ? 's' : ''} para ganhar proficiência`)}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {(featurePickerModal?.pickSkills ?? []).map((sid) => {
                const sk = SKILLS.find((s) => s.id === sid);
                if (!sk) return null;
                const chosen = featurePickerModal?.pending.includes(sid) ?? false;
                const atLimit = (featurePickerModal?.pending.length ?? 0) >= (featurePickerModal?.pickCount ?? 1);
                return (
                  <TouchableOpacity
                    key={sid}
                    style={[styles.featurePickSkillRow, chosen && styles.featurePickSkillRowActive]}
                    onPress={() => {
                      if (!featurePickerModal) return;
                      let next: string[];
                      if (chosen) {
                        next = featurePickerModal.pending.filter((x) => x !== sid);
                      } else if (!atLimit) {
                        next = [...featurePickerModal.pending, sid];
                      } else {
                        return;
                      }
                      setFeaturePickerModal({ ...featurePickerModal, pending: next });
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.featurePickSkillText, chosen && { color: themeColors.accent, fontWeight: '700' }]}>
                      {chosen ? '✓ ' : '  '}{language === 'en' ? sk.nameEn : sk.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.goldModalActions}>
              <TouchableOpacity style={styles.goldCancelBtn} onPress={() => setFeaturePickerModal(null)}>
                <Text style={styles.goldCancelBtnText}>{language === 'en' ? 'Cancel' : 'Cancelar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.goldConfirmBtn, { opacity: (featurePickerModal?.pending.length ?? 0) < (featurePickerModal?.pickCount ?? 1) ? 0.5 : 1 }]}
                onPress={() => {
                  if (!featurePickerModal) return;
                  if (featurePickerModal.pending.length < featurePickerModal.pickCount) return;
                  saveFeatureChoice(char.id, featurePickerModal.featureId, featurePickerModal.pending);
                  setFeaturePickerModal(null);
                }}
              >
                <Text style={styles.goldConfirmBtnText}>{language === 'en' ? 'Confirm' : 'Confirmar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Heal / Use toast */}
      {healToast && (
        <View style={styles.healToast} pointerEvents="none">
          <Text style={styles.healToastText}>{healToast.text}</Text>
        </View>
      )}
    </ScrollView>
  );
}

type ThemeColors = typeof THEMES[keyof typeof THEMES];

const makeStyles = (c: ThemeColors) => StyleSheet.create({  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 20, paddingBottom: 60 },
  notFound: { flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: c.accent, fontSize: 18, marginBottom: 12 },
  backLink: { color: c.subtext, fontSize: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  charName: { color: c.accent, fontSize: 26, fontWeight: 'bold' },
  charSub: { color: c.subtext, fontSize: 14, marginTop: 4 },
  shareBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shareBtnText: { color: c.accent, fontSize: 13 },

  hpCard: {
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.border,
  },
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  hpLabel: { color: c.subtext, fontSize: 14 },
  hpValue: { fontSize: 22, fontWeight: 'bold' },
  hpBarBg: {
    height: 8,
    backgroundColor: c.bg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  hpBarFill: { height: '100%', borderRadius: 4 },
  hpActions: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  hpBtn: {
    flex: 1,
    backgroundColor: c.surface,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff505055',
  },
  hpBtnHeal: { borderColor: '#50d08055' },
  hpBtnText: { color: c.text, fontWeight: '600' },

  sectionTitle: { color: c.accent, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' },
  statBox: {
    width: '30%',
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statScore: { color: c.text, fontSize: 22, fontWeight: 'bold' },
  statBonus: { color: '#50d080', fontSize: 10, fontWeight: '600', marginTop: -2 },
  statMod: { color: c.subtext, fontSize: 14, fontWeight: '600' },
  statLabel: { color: c.subtext, fontSize: 11, marginTop: 2 },

  statModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  statModalBox: {
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: c.border,
    gap: 10,
  },
  statModalTitle: {
    color: c.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  statModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  statModalTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  statModalLabel: { color: c.subtext, fontSize: 14 },
  statModalLabelBold: { color: c.text, fontSize: 15, fontWeight: 'bold' },
  statModalValue: { color: c.accent, fontSize: 14, fontWeight: '600' },
  statModalValueBold: { color: c.accent, fontSize: 18, fontWeight: 'bold' },
  statModalHint: {
    color: c.subtext,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  spellCard: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#c090ff33',
    gap: 10,
  },
  spellRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spellLevel: { color: '#c090ff', fontSize: 13, width: 60 },
  slotDots: { flexDirection: 'row', gap: 4, flex: 1 },
  slotDot: { width: 12, height: 12, borderRadius: 6 },
  slotDotFull: { backgroundColor: '#c090ff' },
  slotDotEmpty: { backgroundColor: c.bg, borderWidth: 1, borderColor: '#6a5080' },
  slotCount: { color: '#8a7090', fontSize: 12, width: 30, textAlign: 'right' },
  useSlotBtn: {
    backgroundColor: '#3a1a5a',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  useSlotBtnDisabled: { backgroundColor: '#2a1a3a', opacity: 0.5 },
  useSlotBtnText: { color: '#c090ff', fontSize: 12, fontWeight: '600' },

  spellsBlock: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c090ff33',
    gap: 4,
  },
  spellGroupLabel: {
    color: '#c090ff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  slotGroup: {
    marginBottom: 6,
  },
  spellMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: c.bg + 'aa',
    borderRadius: 6,
    marginTop: 3,
  },
  spellMiniRowActive: {
    backgroundColor: '#1a0030',
    borderWidth: 1,
    borderColor: '#c090ff66',
  },
  spellMiniRowDisabled: {
    opacity: 0.35,
  },
  spellMiniIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  spellMiniName: {
    color: c.accent,
    fontSize: 13,
    flex: 1,
  },
  spellMiniDmg: {
    color: '#ff8040',
    fontSize: 12,
    fontWeight: '600',
  },
  spellMiniCast: {
    color: c.subtext,
    fontSize: 11,
    fontStyle: 'italic',
  },
  rollResult: {
    color: '#f0e040',
    fontSize: 14,
    fontWeight: '800',
  },
  noSpellsHint: {
    color: c.subtext,
    fontSize: 11,
    fontStyle: 'italic',
    paddingLeft: 8,
    paddingTop: 4,
  },

  actionBtn: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtnText: { color: c.accent, fontSize: 16, fontWeight: '600' },
  actionBtnSub: { color: c.subtext, fontSize: 12, marginTop: 2 },

  grimoireCard: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.border,
    gap: 12,
  },
  grimoireLvl: {
    color: c.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  grimoireRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  grimoireIcon: { fontSize: 16 },
  grimoireInfo: { flex: 1 },
  grimoireName: { fontSize: 14, fontWeight: '600', color: c.text },
  grimoireMeta: { color: c.subtext, fontSize: 11, marginTop: 1 },

  deleteBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: '#ff404055',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#ff5555', fontWeight: '600', fontSize: 15 },
  levelUpBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: '#60c03066',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  levelUpBtnText: { color: '#70e040', fontWeight: '700', fontSize: 15 },

  // ── Drawer shared styles ───────────────────────────────────────────────────
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 6,
  },
  drawerHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerCountBadge: {
    backgroundColor: c.accent + '33',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: c.accent + '66',
  },
  drawerCountText: {
    color: c.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  drawerToggleIcon: {
    color: c.subtext,
    fontSize: 13,
  },

  traitsBlock: {
    gap: 8,
    marginBottom: 24,
  },
  traitCard: {
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: c.accent,
  },
  traitName: {
    color: c.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  traitDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: c.subtext,
  },

  // ── ASI inline editor ─────────────────────────────────────────────────────
  asiEditor: {
    marginTop: 10,
    backgroundColor: c.bg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: c.accent + '44',
  },
  asiEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  asiEditorTitle: { color: c.accent, fontSize: 12, fontWeight: '700' },
  asiEditorPoints: { color: c.subtext, fontSize: 12, fontWeight: '600' },
  asiEditorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  asiStatCell: {
    alignItems: 'center',
    minWidth: 52,
  },
  asiStatLabel: { color: c.subtext, fontSize: 10, fontWeight: '600', marginBottom: 4 },
  asiStatRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  asiBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  asiBtnDisabled: { borderColor: c.border, opacity: 0.4 },
  asiBtnText: { color: c.accent, fontSize: 14, fontWeight: '700', lineHeight: 16 },
  asiStatVal: { color: c.text, fontSize: 13, fontWeight: '700', minWidth: 22, textAlign: 'center' },

  spellMiniRowUpcast: {
    borderLeftWidth: 2,
    borderLeftColor: '#8060c0',
    backgroundColor: '#1e1030',
  },
  upcastNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcastBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a080e0',
    backgroundColor: '#2d1a50',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },

  sorceryBlock: {
    backgroundColor: '#1e0a30',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#9040c055',
  },
  sorceryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sorceryTitle: { color: '#c090f0', fontSize: 14, fontWeight: '700' },
  sorceryCount: { color: '#c090f0', fontSize: 14, fontWeight: '700' },
  sorceryDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sorceryDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  sorceryDotFull: {
    backgroundColor: '#9040c0',
    borderColor: '#c090f0',
  },
  sorceryDotUsed: {
    backgroundColor: 'transparent',
    borderColor: '#5a2080',
  },
  flexCastLabel: {
    color: '#b388ff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flexCastRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  flexCastBtn: {
    backgroundColor: '#5a2080',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flexCastBtnDisabled: {
    backgroundColor: '#2a1040',
    opacity: 0.5,
  },
  flexCastBtnText: {
    color: '#e0c8ff',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 4,
  },
  skillsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillPicksBadge: {
    backgroundColor: c.accent + '33',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: c.accent + '66',
  },
  skillPicksBadgeText: {
    color: c.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  skillDrawerToggle: {
    color: c.subtext,
    fontSize: 13,
    marginLeft: 4,
  },
  profBonusLabel: {
    color: c.subtext,
    fontSize: 11,
    fontStyle: 'italic',
  },
  skillHint: {
    color: c.accent,
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  skillsBlock: {
    backgroundColor: c.surface,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.border,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: c.border + '55',
  },
  skillRowActive: {
    backgroundColor: '#1a003044',
    borderRadius: 6,
  },
  skillRowProficient: {
    backgroundColor: c.accent + '11',
  },
  skillProfDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: c.subtext + '88',
    backgroundColor: 'transparent',
  },
  skillProfDotPlaceholder: {
    width: 12,
    height: 12,
  },
  skillProfDotActive: {
    backgroundColor: c.accent,
    borderColor: c.accent,
  },
  skillProfDotPickable: {
    borderColor: c.accent,
    borderWidth: 2,
  },
  skillName: {
    color: c.text,
    fontSize: 13,
    flex: 1,
  },
  skillNameProficient: {
    color: c.accent,
    fontWeight: '600',
  },
  skillAbility: {
    color: c.subtext,
    fontSize: 11,
    width: 30,
    textAlign: 'center',
  },
  skillAbilityProficient: {
    color: c.accent + 'aa',
  },
  skillMod: {
    color: c.subtext,
    fontSize: 13,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  skillModProficient: {
    color: c.accent,
    fontWeight: '800',
  },
  skillRollResult: {
    color: '#f0e040',
    fontSize: 13,
    fontWeight: '800',
    width: 120,
    textAlign: 'right',
  },

  // ── Attributes extra ──────────────────────────────────────────────────────
  statBoxBoosted: {
    borderColor: '#60aaff66',
  },
  acRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  acBadge: {
    backgroundColor: '#1a2a4a',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#60aaff44',
  },
  acBadgeText: { color: '#60aaff', fontSize: 16, fontWeight: '700' },

  // ── Equipment ─────────────────────────────────────────────────────────────
  equipBlock: {
    gap: 10,
    marginBottom: 24,
  },
  equipEmpty: {
    color: c.subtext,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  equipCard: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
    gap: 6,
  },
  equipCardUnequipped: {
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  equipCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipTypeIcon: { fontSize: 20 },
  equipName: { color: c.text, fontSize: 15, fontWeight: '700' },
  equipNameUnequipped: { color: c.subtext },
  equipTypeName: { color: c.subtext, fontSize: 11 },
  equipGoldValue: { color: '#f0b429', fontSize: 11, fontWeight: '600' },
  equippedToggle: { padding: 4 },
  equippedToggleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: c.subtext,
    backgroundColor: 'transparent',
  },
  equippedToggleDotOn: { backgroundColor: '#50d080', borderColor: '#50d080' },
  equipActionBtn: { padding: 4 },
  equipActionBtnText: { fontSize: 16 },
  equipDeleteBtnText: { fontSize: 16, color: '#ff4444', fontWeight: '900' },
  equipBonusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  equipBonusBadge: {
    backgroundColor: '#60aaff22',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#60aaff55',
  },
  equipBonusBadgeOff: { backgroundColor: c.bg, borderColor: c.border },
  equipBonusBadgeText: { color: '#60aaff', fontSize: 12, fontWeight: '700' },
  equipTrait: { color: c.subtext, fontSize: 12, paddingLeft: 4 },
  equipDesc: { color: c.subtext, fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  attackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.bg + 'cc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#ff804033',
    gap: 8,
  },
  attackRowActive: {
    backgroundColor: '#200500',
    borderColor: '#ff8040aa',
  },
  attackName: { color: c.accent, fontSize: 13, fontWeight: '600', flex: 1 },
  attackStatsRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  attackStat: { color: c.subtext, fontSize: 11 },
  attackResultRow: { gap: 2, alignItems: 'flex-end' },
  attackHitResult: { color: '#f0e040', fontSize: 13, fontWeight: '800' },
  attackDmgResult: { color: '#ff8040', fontSize: 12, fontWeight: '700' },
  addEquipBtn: {
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.accent + '55',
    borderStyle: 'dashed',
  },
  addEquipBtnText: { color: c.accent, fontSize: 14, fontWeight: '700' },

  // ── Duration badge ────────────────────────────────────────────────────────
  equipDurationBadge: {
    color: '#a0b4ff',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#a0b4ff22',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },

  // ── Charges row ──────────────────────────────────────────────────────────
  chargesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 10,
  },
  chargePips: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chargePip: { width: 10, height: 10, borderRadius: 5 },
  chargePipFull: { backgroundColor: c.accent },
  chargePipEmpty: { backgroundColor: c.border },
  chargesLabel: { color: c.subtext, fontSize: 11, marginLeft: 4 },
  useBtn: {
    backgroundColor: c.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  useBtnDisabled: { opacity: 0.35 },
  useBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // ── Heal / Use toast ──────────────────────────────────────────────────────
  healToast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#44ff6655',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 9999,
    elevation: 10,
  },
  healToastText: { color: '#44ff66', fontSize: 18, fontWeight: '800' },

  // ── Active Effects (poções de status) ────────────────────────────────────
  activeEffectsRow: { gap: 6, marginBottom: 10 },
  activeEffectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#44ff6644',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeEffectIcon: { fontSize: 18 },
  activeEffectName: { color: '#7fff7f', fontSize: 13, fontWeight: '700' },
  activeEffectBonuses: { color: '#44ff66', fontSize: 12, marginTop: 1 },
  activeEffectExpiry: { color: '#a0b4ff', fontSize: 11, fontWeight: '600' },

  // ── Gold Wallet card ──────────────────────────────────────────────────────
  goldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f0b42944',
    gap: 12,
  },
  goldIcon: { fontSize: 28 },
  goldLabel: { color: c.subtext, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  goldAmount: { color: '#f0b429', fontSize: 26, fontWeight: '900', marginTop: 1 },
  goldEdit: { fontSize: 18, opacity: 0.6 },

  // ── Gold Modal ───────────────────────────────────────────────────────────
  goldModalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  goldModalBox: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: '#f0b42944',
    gap: 12,
  },
  goldModalTitle: { color: '#f0b429', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  goldModalCurrent: { color: c.text, fontSize: 40, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  goldModalHint: { color: c.subtext, fontSize: 13, textAlign: 'center' },
  goldModalInput: {
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: '#f0b42966',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f0b429',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  goldModalBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  goldQuickBtn: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 54,
    alignItems: 'center',
  },
  goldQuickBtnAdd: { backgroundColor: '#1a3a1a', borderWidth: 1, borderColor: '#44ff6644' },
  goldQuickBtnRemove: { backgroundColor: '#3a1a1a', borderWidth: 1, borderColor: '#ff444444' },
  goldQuickBtnText: { color: c.text, fontSize: 14, fontWeight: '700' },
  goldModalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  goldCancelBtn: {
    flex: 1,
    backgroundColor: c.bg,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  goldCancelBtnText: { color: c.subtext, fontSize: 15, fontWeight: '600' },
  goldConfirmBtn: {
    flex: 2,
    backgroundColor: '#f0b429',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  goldConfirmBtnText: { color: '#1a1000', fontSize: 15, fontWeight: '900' },

  // Feature skill picker
  featurePickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: c.border,
    gap: 8,
  },
  featurePickLabel: { color: c.accent, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  featurePickValue: { color: c.text, fontSize: 13, fontWeight: '600', marginTop: 2 },
  featurePickEmpty: { color: c.subtext, fontSize: 13, fontStyle: 'italic', marginTop: 2 },
  featurePickBtn: {
    backgroundColor: c.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  featurePickBtnText: { color: c.bg, fontSize: 13, fontWeight: '700' },
  featurePickSkillRow: {
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  featurePickSkillRowActive: {
    backgroundColor: c.accent + '22',
    borderRadius: 6,
  },
  featurePickSkillText: { color: c.text, fontSize: 15 },

  featureActionCard: {
    backgroundColor: c.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    padding: 12,
    marginBottom: 8,
  },
  featureActionCardExhausted: {
    opacity: 0.5,
  },
  featureActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureActionName: {
    color: c.text,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  featureActionDesc: {
    color: c.subtext,
    fontSize: 12,
    marginTop: 2,
    flexShrink: 1,
  },
  featureActionDice: {
    color: c.accent,
    fontSize: 12,
    marginTop: 4,
  },
  featureActionRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  featureActionPips: {
    flexDirection: 'row',
    gap: 4,
  },
  featureActionPip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  featureActionPipFull: {
    backgroundColor: c.accent,
  },
  featureActionPipEmpty: {
    backgroundColor: c.border,
  },
  featureActionAtWill: {
    color: c.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  featureActionBtn: {
    backgroundColor: c.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  featureActionBtnDisabled: {
    backgroundColor: c.border,
  },
  featureActionBtnText: {
    color: c.bg,
    fontSize: 13,
    fontWeight: '700',
  },
});
