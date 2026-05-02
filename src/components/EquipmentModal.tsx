import { useState, useEffect } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSettingsStore, THEMES } from '../store/settingsStore';
import { useI18n } from '../lib/i18n';
import {
  Equipment, EquipmentType, EquipmentBonus, EquipmentAttack,
  BonusType, EQUIPMENT_TYPE_ICONS, EQUIPMENT_TYPE_LABELS_PT, EQUIPMENT_TYPE_LABELS_EN,
  BONUS_TYPE_LABELS, ALL_BONUS_TYPES,
} from '../types/equipment';
import { EQUIPMENT_CATALOG, CatalogEntry } from '../data/defaultEquipment';

interface Props {
  visible: boolean;
  initial: Equipment | null;
  onSave: (item: Equipment) => void;
  onCancel: () => void;
}

const TYPES: EquipmentType[] = ['weapon', 'armor', 'shield', 'accessory', 'consumable', 'other'];

// Damage types stored in EN internally; displayed in PT when language === 'pt'
const DAMAGE_TYPES_EN = [
  'slashing', 'piercing', 'bludgeoning',
  'fire', 'cold', 'lightning', 'thunder',
  'necrotic', 'radiant', 'psychic',
  'acid', 'poison', 'force',
];
const DAMAGE_TYPES_PT: Record<string, string> = {
  slashing: 'cortante', piercing: 'perfurante', bludgeoning: 'contundente',
  fire: 'fogo', cold: 'frio', lightning: 'elétrico', thunder: 'trovejante',
  necrotic: 'necrótico', radiant: 'radiante', psychic: 'psíquico',
  acid: 'ácido', poison: 'veneno', force: 'força',
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function EquipmentModal({ visible, initial, onSave, onCancel }: Props) {
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const { t, language, units } = useI18n();
  const s = makeStyles(c);
  const typeLabels = language === 'en' ? EQUIPMENT_TYPE_LABELS_EN : EQUIPMENT_TYPE_LABELS_PT;

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [type, setType] = useState<EquipmentType>('weapon');
  const [description, setDescription] = useState('');
  const [equipped, setEquipped] = useState(true);
  const [goldValue, setGoldValue] = useState(0);
  const [goldInput, setGoldInput] = useState('0');
  const [weightInput, setWeightInput] = useState('0');
  const [duration, setDuration] = useState<'forever' | 'long_rest'>('forever');
  const [chargesInput, setChargesInput] = useState('0');
  const [maxChargesInput, setMaxChargesInput] = useState('0');
  const [useEffectType, setUseEffectType] = useState<'heal' | 'temp_hp'>('heal');
  const [useEffectDice, setUseEffectDice] = useState('');
  const [bonuses, setBonuses] = useState<EquipmentBonus[]>([]);
  const [traits, setTraits] = useState<string[]>([]);
  const [attacks, setAttacks] = useState<(EquipmentAttack & { dmgInput: string; bonusInput: string })[]>([]);
  // Catalog picker state
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<EquipmentType | 'all'>('all');

  // Weight unit helpers
  const lbsToDisplay = (lbs: number) =>
    units === 'metric' ? parseFloat((lbs * 0.453592).toFixed(2)).toString() : String(lbs);
  const displayToLbs = (val: string) => {
    const n = parseFloat(val) || 0;
    return units === 'metric' ? n / 0.453592 : n;
  };

  // Reset when opening
  useEffect(() => {
    if (!visible) return;
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setDescription(initial.description);
      setEquipped(initial.equipped);
      const gv = initial.goldValue ?? 0;
      setGoldValue(gv);
      setGoldInput(String(gv));
      setWeightInput(lbsToDisplay(initial.weight ?? 0));
      setChargesInput(String(initial.charges ?? 0));
      setMaxChargesInput(String(initial.maxCharges ?? 0));
      setUseEffectDice(initial.useEffect?.dice ?? '');
      setUseEffectType(initial.useEffect?.type ?? 'heal');
      setBonuses(initial.bonuses);
      setTraits([...initial.traits]);
      // Normalize damageType to EN (in case old data was saved in PT)
      const PT_TO_EN: Record<string, string> = Object.fromEntries(
        Object.entries(DAMAGE_TYPES_PT).map(([en, pt]) => [pt, en])
      );
      setAttacks(initial.attacks.map((a) => ({
        ...a,
        damageType: PT_TO_EN[a.damageType] ?? a.damageType,
        dmgInput: a.damage,
        bonusInput: String(a.attackBonus >= 0 ? `+${a.attackBonus}` : a.attackBonus),
      })));
    } else {
      setName(''); setType('weapon'); setDescription('');
      setEquipped(true); setGoldValue(0); setGoldInput('0');
      setWeightInput('0'); setChargesInput('0'); setMaxChargesInput('0');      setUseEffectDice(''); setUseEffectType('heal');
      setBonuses([]); setTraits([]); setAttacks([]);
    }
    setCatalogOpen(false);
  }, [visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    const chargesNum = parseInt(chargesInput) || 0;
    const maxChargesNum = parseInt(maxChargesInput) || 0;
    const item: Equipment = {
      id: initial?.id ?? genId(),
      name: name.trim(),
      type,
      description: description.trim(),
      equipped,
      goldValue,
      duration,
      ...(chargesNum > 0 ? { charges: chargesNum, maxCharges: maxChargesNum || chargesNum } : {}),
      ...(useEffectDice.trim() ? { useEffect: { type: useEffectType, dice: useEffectDice.trim() } } : {}),
      ...(parseFloat(weightInput) > 0 ? { weight: displayToLbs(weightInput) } : {}),
      bonuses,
      traits: traits.filter((t) => t.trim()),
      attacks: attacks.map((a) => ({
        id: a.id,
        name: a.name,
        attackBonus: parseInt(a.bonusInput.replace('+', '')) || 0,
        damage: a.dmgInput.trim() || '1d4',
        damageType: a.damageType,
        range: a.range,
      })),
    };
    onSave(item);
  };

  // ── Bonus helpers ─────────────────────────────────────────────────────────
  const addBonus = () => setBonuses((b) => [...b, { type: 'strength', value: 1 }]);
  const removeBonus = (i: number) => setBonuses((b) => b.filter((_, idx) => idx !== i));
  const setBonusType = (i: number, bt: BonusType) =>
    setBonuses((b) => b.map((x, idx) => idx === i ? { ...x, type: bt } : x));
  const setBonusValue = (i: number, v: number) =>
    setBonuses((b) => b.map((x, idx) => idx === i ? { ...x, value: v } : x));

  // ── Trait helpers ─────────────────────────────────────────────────────────
  const addTrait = () => setTraits((t) => [...t, '']);
  const removeTrait = (i: number) => setTraits((t) => t.filter((_, idx) => idx !== i));
  const setTrait = (i: number, v: string) => setTraits((t) => t.map((x, idx) => idx === i ? v : x));

  // ── Attack helpers ────────────────────────────────────────────────────────
  const addAttack = () => setAttacks((a) => [...a, {
    id: genId(), name: '', attackBonus: 0, bonusInput: '+0',
    damage: '1d6', dmgInput: '1d6', damageType: 'slashing', range: '5 ft',
  }]);
  const removeAttack = (i: number) => setAttacks((a) => a.filter((_, idx) => idx !== i));
  const setAttackField = (i: number, field: string, value: string) =>
    setAttacks((a) => a.map((x, idx) => idx === i ? { ...x, [field]: value } : x));

  // ── Catalog template helper ───────────────────────────────────────────────
  const applyTemplate = (entry: CatalogEntry) => {
    setName(language === 'en' ? entry.nameEn : entry.namePt);
    setType(entry.type);
    setDescription(language === 'en' ? entry.descEn : entry.descPt);
    setBonuses(entry.bonuses.map((b) => ({ ...b })));
    setTraits(language === 'en' ? [...entry.traitsEn] : [...entry.traitsPt]);
    setAttacks(entry.attacks.map((a) => ({
      ...a,
      dmgInput: a.damage,
      bonusInput: a.attackBonus >= 0 ? `+${a.attackBonus}` : String(a.attackBonus),
    })));
    const gv = entry.goldValue;
    setGoldValue(gv);
    setGoldInput(String(gv));
    setWeightInput(lbsToDisplay(entry.weight ?? 0));
    setChargesInput(String(entry.maxCharges ?? 0));
    setMaxChargesInput(String(entry.maxCharges ?? 0));
    setUseEffectDice(entry.useEffect?.dice ?? '');
    setUseEffectType(entry.useEffect?.type ?? 'heal');
    setCatalogOpen(false);
  };

  const filteredCatalog = catalogFilter === 'all'
    ? EQUIPMENT_CATALOG
    : EQUIPMENT_CATALOG.filter((e) => e.type === catalogFilter);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>
              {initial
                ? (language === 'en' ? '✏️ Edit Item' : '✏️ Editar Item')
                : (language === 'en' ? '📦 New Item' : '📦 Novo Item')}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={s.headerClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">

            {/* ── Template Catalog Picker ── */}
            {!initial && (
              <View style={s.catalogSection}>
                <TouchableOpacity style={s.catalogToggle} onPress={() => setCatalogOpen((v) => !v)}>
                  <Text style={s.catalogToggleText}>
                    {catalogOpen
                      ? (language === 'en' ? '▲ Hide Templates' : '▲ Ocultar Modelos')
                      : (language === 'en' ? '📋 Browse Templates' : '📋 Navegar Modelos')}
                  </Text>
                </TouchableOpacity>
                {catalogOpen && (
                  <View style={s.catalogContainer}>
                    {/* Filter row */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catalogFilterScroll}>
                      <View style={s.catalogFilterRow}>
                        {(['all', ...TYPES] as (EquipmentType | 'all')[]).map((tp) => (
                          <TouchableOpacity
                            key={tp}
                            style={[s.catalogFilterBtn, catalogFilter === tp && s.catalogFilterBtnActive]}
                            onPress={() => setCatalogFilter(tp)}
                          >
                            <Text style={[s.catalogFilterText, catalogFilter === tp && s.catalogFilterTextActive]}>
                              {tp === 'all'
                                ? (language === 'en' ? 'All' : 'Todos')
                                : `${EQUIPMENT_TYPE_ICONS[tp]} ${typeLabels[tp]}`}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                    {/* Item list */}
                    {filteredCatalog.map((entry, idx) => (
                      <TouchableOpacity key={idx} style={s.catalogItem} onPress={() => applyTemplate(entry)}>
                        <View style={s.catalogItemLeft}>
                          <Text style={s.catalogItemIcon}>{EQUIPMENT_TYPE_ICONS[entry.type]}</Text>
                          <View>
                            <Text style={s.catalogItemName}>
                              {language === 'en' ? entry.nameEn : entry.namePt}
                            </Text>
                            <Text style={s.catalogItemMeta}>
                              🪙 {entry.goldValue} gp
                              {entry.bonuses.length > 0
                                ? '  •  ' + entry.bonuses.map((b) => `+${b.value} ${b.type}`).join(', ')
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <Text style={s.catalogItemArrow}>→</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* ── Name ── */}
            <Text style={s.label}>{language === 'en' ? 'Name' : 'Nome'} *</Text>
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder={language === 'en' ? 'e.g.: Longsword +1' : 'Ex: Espada Longa +1'}
              placeholderTextColor={c.subtext + '88'}
            />

            {/* ── Type ── */}
            <Text style={s.label}>{language === 'en' ? 'Type' : 'Tipo'}</Text>
            <View style={s.typeRow}>
              {TYPES.map((tp) => (
                <TouchableOpacity
                  key={tp}
                  style={[s.typeBtn, type === tp && s.typeBtnActive]}
                  onPress={() => setType(tp)}
                >
                  <Text style={s.typeIcon}>{EQUIPMENT_TYPE_ICONS[tp]}</Text>
                  <Text style={[s.typeLabel, type === tp && s.typeLabelActive]}>
                    {typeLabels[tp]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Equipped toggle ── */}
            <TouchableOpacity style={s.equippedRow} onPress={() => setEquipped((v) => !v)}>
              <View style={[s.equippedDot, equipped && s.equippedDotOn]} />
              <Text style={s.equippedLabel}>
                {equipped
                  ? (language === 'en' ? '✅ Equipped' : '✅ Equipado')
                  : (language === 'en' ? '○ Unequipped' : '○ Desequipado')}
              </Text>
              <Text style={s.equippedHint}>
                {language === 'en' ? '(bonuses apply when equipped)' : '(bônus aplicados quando equipado)'}
              </Text>
            </TouchableOpacity>

            {/* ── Gold Value ── */}
            <Text style={s.label}>🪙 {language === 'en' ? 'Gold Value (gp)' : 'Valor em Ouro (po)'}</Text>
            <TextInput
              style={[s.input, { width: 120 }]}
              value={goldInput}
              onChangeText={(v) => {
                setGoldInput(v);
                const n = parseInt(v);
                if (!isNaN(n) && n >= 0) setGoldValue(n);
              }}
              onBlur={() => setGoldInput(String(goldValue))}
              placeholder="0"
              placeholderTextColor={c.subtext + '88'}
              keyboardType="number-pad"
            />

            {/* ── Weight ── */}
            <Text style={s.label}>⚖️ {language === 'en'
              ? `Weight (${units === 'metric' ? 'kg' : 'lbs'})`
              : `Peso (${units === 'metric' ? 'kg' : 'lbs'})`}</Text>
            <TextInput
              style={[s.input, { width: 120 }]}
              value={weightInput}
              onChangeText={setWeightInput}
              onBlur={() => {
                const n = parseFloat(weightInput);
                setWeightInput(isNaN(n) ? '0' : String(n));
              }}
              placeholder="0"
              placeholderTextColor={c.subtext + '88'}
              keyboardType="decimal-pad"
            />

            {/* ── Duration ── */}
            <Text style={s.label}>⏳ {language === 'en' ? 'Bonus Duration' : 'Duração do Bônus'}</Text>
            <View style={s.typeRow}>
              {(['forever', 'long_rest'] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[s.typeBtn, duration === d && s.typeBtnActive]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={s.typeIcon}>{d === 'forever' ? '♾️' : '🌙'}</Text>
                  <Text style={[s.typeLabel, duration === d && s.typeLabelActive]}>
                    {d === 'forever'
                      ? (language === 'en' ? 'Forever' : 'Permanente')
                      : (language === 'en' ? 'Long Rest' : 'Desc. Longo')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Charges (consumables) ── */}
            {type === 'consumable' && (
              <>
                <Text style={s.label}>🔋 {language === 'en' ? 'Charges (uses)' : 'Cargas (usos)'}</Text>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View>
                    <Text style={[s.label, { fontSize: 11, marginBottom: 4 }]}>
                      {language === 'en' ? 'Current' : 'Atual'}
                    </Text>
                    <TextInput
                      style={[s.input, { width: 70 }]}
                      value={chargesInput}
                      onChangeText={setChargesInput}
                      placeholder="1"
                      placeholderTextColor={c.subtext + '88'}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View>
                    <Text style={[s.label, { fontSize: 11, marginBottom: 4 }]}>
                      {language === 'en' ? 'Max' : 'Máx'}
                    </Text>
                    <TextInput
                      style={[s.input, { width: 70 }]}
                      value={maxChargesInput}
                      onChangeText={setMaxChargesInput}
                      placeholder="1"
                      placeholderTextColor={c.subtext + '88'}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {/* ── Use Effect (auto-apply on use) ── */}
                <Text style={s.label}>✨ {language === 'en' ? 'Auto-Effect on Use' : 'Efeito Automático ao Usar'}</Text>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
                  <View>
                    <Text style={[s.label, { fontSize: 11, marginBottom: 4 }]}>
                      {language === 'en' ? 'Type' : 'Tipo'}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {(['heal', 'temp_hp'] as const).map((et) => (
                        <TouchableOpacity
                          key={et}
                          style={[s.typeBtn, useEffectType === et && s.typeBtnActive, { paddingHorizontal: 10 }]}
                          onPress={() => setUseEffectType(et)}
                        >
                          <Text style={[s.typeLabel, useEffectType === et && s.typeLabelActive]}>
                            {et === 'heal'
                              ? (language === 'en' ? '❤️ Heal' : '❤️ Cura')
                              : (language === 'en' ? '🛡️ Temp HP' : '🛡️ PV Temp')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.label, { fontSize: 11, marginBottom: 4 }]}>
                      {language === 'en' ? 'Dice (e.g. 2d4+2)' : 'Dados (ex: 2d4+2)'}
                    </Text>
                    <TextInput
                      style={s.input}
                      value={useEffectDice}
                      onChangeText={setUseEffectDice}
                      placeholder="2d4+2"
                      placeholderTextColor={c.subtext + '88'}
                    />
                  </View>
                </View>
              </>
            )}

            {/* ── Stat Bonuses ── */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{language === 'en' ? '📊 Stat Bonuses' : '📊 Bônus de Atributo'}</Text>
              <TouchableOpacity style={s.addBtn} onPress={addBonus}>
                <Text style={s.addBtnText}>+ {language === 'en' ? 'Add' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>
            {bonuses.length === 0 && (
              <Text style={s.emptyHint}>{language === 'en' ? 'No bonuses yet.' : 'Nenhum bônus.'}</Text>
            )}
            {bonuses.map((b, i) => (
              <View key={i} style={s.bonusRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.bonusTypeScroll}>
                  <View style={s.bonusTypeRow}>
                    {ALL_BONUS_TYPES.map((bt) => (
                      <TouchableOpacity
                        key={bt}
                        style={[s.bonusTypeBtn, b.type === bt && s.bonusTypeBtnActive]}
                        onPress={() => setBonusType(i, bt)}
                      >
                        <Text style={[s.bonusTypeBtnText, b.type === bt && s.bonusTypeBtnTextActive]}>
                          {BONUS_TYPE_LABELS[bt][language === 'en' ? 'en' : 'pt']}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <View style={s.bonusValueRow}>
                  <TouchableOpacity style={s.bonusValueBtn} onPress={() => setBonusValue(i, b.value - 1)}>
                    <Text style={s.bonusValueBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={s.bonusValueText}>{b.value >= 0 ? `+${b.value}` : b.value}</Text>
                  <TouchableOpacity style={s.bonusValueBtn} onPress={() => setBonusValue(i, b.value + 1)}>
                    <Text style={s.bonusValueBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.removeBtn} onPress={() => removeBonus(i)}>
                    <Text style={s.removeBtnText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* ── Traits ── */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{language === 'en' ? '📜 Traits' : '📜 Traços'}</Text>
              <TouchableOpacity style={s.addBtn} onPress={addTrait}>
                <Text style={s.addBtnText}>+ {language === 'en' ? 'Add' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>
            {traits.length === 0 && (
              <Text style={s.emptyHint}>{language === 'en' ? 'No traits yet.' : 'Nenhum traço.'}</Text>
            )}
            {traits.map((tr, i) => (
              <View key={i} style={s.traitInputRow}>
                <TextInput
                  style={s.traitInput}
                  value={tr}
                  onChangeText={(v) => setTrait(i, v)}
                  placeholder={language === 'en' ? 'e.g.: +1d4 fire damage on hit' : 'Ex: +1d4 dano de fogo no acerto'}
                  placeholderTextColor={c.subtext + '66'}
                  multiline
                />
                <TouchableOpacity style={s.removeBtn} onPress={() => removeTrait(i)}>
                  <Text style={s.removeBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* ── Attacks ── */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{language === 'en' ? '⚔️ Attacks / Abilities' : '⚔️ Ataques / Habilidades'}</Text>
              <TouchableOpacity style={s.addBtn} onPress={addAttack}>
                <Text style={s.addBtnText}>+ {language === 'en' ? 'Add' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>
            {attacks.length === 0 && (
              <Text style={s.emptyHint}>{language === 'en' ? 'No attacks yet.' : 'Nenhum ataque.'}</Text>
            )}
            {attacks.map((a, i) => (
              <View key={a.id} style={s.attackCard}>
                <View style={s.attackCardHeader}>
                  <TextInput
                    style={s.attackNameInput}
                    value={a.name}
                    onChangeText={(v) => setAttackField(i, 'name', v)}
                    placeholder={language === 'en' ? 'Attack name' : 'Nome do ataque'}
                    placeholderTextColor={c.subtext + '66'}
                  />
                  <TouchableOpacity style={s.removeBtn} onPress={() => removeAttack(i)}>
                    <Text style={s.removeBtnText}>🗑</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.attackFieldsRow}>
                  <View style={s.attackField}>
                    <Text style={s.attackFieldLabel}>{language === 'en' ? 'Hit Bonus' : 'Bônus de Acerto'}</Text>
                    <TextInput
                      style={s.attackFieldInput}
                      value={a.bonusInput}
                      onChangeText={(v) => setAttackField(i, 'bonusInput', v)}
                      placeholder="+5"
                      placeholderTextColor={c.subtext + '66'}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={s.attackField}>
                    <Text style={s.attackFieldLabel}>{language === 'en' ? 'Damage' : 'Dano'}</Text>
                    <TextInput
                      style={s.attackFieldInput}
                      value={a.dmgInput}
                      onChangeText={(v) => setAttackField(i, 'dmgInput', v)}
                      placeholder="1d8+3"
                      placeholderTextColor={c.subtext + '66'}
                    />
                  </View>
                  <View style={[s.attackField, { flex: 2, minWidth: 160 }]}>
                    <Text style={s.attackFieldLabel}>{language === 'en' ? 'Dmg Type' : 'Tipo Dano'}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 2 }}>
                      {DAMAGE_TYPES_EN.map((dt) => {
                        const label = language === 'en' ? dt : (DAMAGE_TYPES_PT[dt] ?? dt);
                        const active = a.damageType === dt;
                        return (
                          <TouchableOpacity
                            key={dt}
                            onPress={() => setAttackField(i, 'damageType', dt)}
                            style={{
                              paddingHorizontal: 8, paddingVertical: 3, marginRight: 4,
                              borderRadius: 10, borderWidth: 1,
                              borderColor: active ? c.accent : c.border,
                              backgroundColor: active ? c.accent + '33' : 'transparent',
                            }}
                          >
                            <Text style={{ fontSize: 11, color: active ? c.accent : c.subtext }}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <View style={s.attackField}>
                    <Text style={s.attackFieldLabel}>{language === 'en' ? 'Range' : 'Alcance'}</Text>
                    <TextInput
                      style={s.attackFieldInput}
                      value={a.range}
                      onChangeText={(v) => setAttackField(i, 'range', v)}
                      placeholder="5 ft"
                      placeholderTextColor={c.subtext + '66'}
                    />
                  </View>
                </View>
              </View>
            ))}

            {/* ── Description ── */}
            <Text style={[s.label, { marginTop: 16 }]}>{language === 'en' ? 'Description' : 'Descrição'}</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder={language === 'en' ? 'Item description, lore, notes…' : 'Descrição, lore, anotações…'}
              placeholderTextColor={c.subtext + '66'}
              multiline
              numberOfLines={3}
            />

          </ScrollView>

          {/* Footer */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
              <Text style={s.cancelBtnText}>{language === 'en' ? 'Cancel' : 'Cancelar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, !name.trim() && s.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={s.saveBtnText}>{language === 'en' ? '💾 Save' : '💾 Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type C = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: C) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: c.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: c.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  headerTitle: { color: c.text, fontSize: 18, fontWeight: 'bold' },
  headerClose: { color: c.subtext, fontSize: 20, padding: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 8 },

  label: { color: c.subtext, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: c.text,
    fontSize: 15,
    marginBottom: 16,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: {
    alignItems: 'center',
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 70,
  },
  typeBtnActive: { borderColor: c.accent, backgroundColor: c.accent + '22' },
  typeIcon: { fontSize: 18, marginBottom: 2 },
  typeLabel: { color: c.subtext, fontSize: 11 },
  typeLabelActive: { color: c.accent, fontWeight: '700' },

  equippedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  equippedDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: c.subtext },
  equippedDotOn: { backgroundColor: '#50d080', borderColor: '#50d080' },
  equippedLabel: { color: c.text, fontSize: 14, fontWeight: '600' },
  equippedHint: { color: c.subtext, fontSize: 11, flex: 1 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  sectionTitle: { color: c.accent, fontSize: 14, fontWeight: '700' },
  addBtn: {
    backgroundColor: c.accent + '22',
    borderWidth: 1,
    borderColor: c.accent + '55',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addBtnText: { color: c.accent, fontSize: 12, fontWeight: '700' },
  emptyHint: { color: c.subtext, fontSize: 12, fontStyle: 'italic', marginBottom: 8 },

  bonusRow: { marginBottom: 8, gap: 6 },
  bonusTypeScroll: { marginBottom: 4 },
  bonusTypeRow: { flexDirection: 'row', gap: 6 },
  bonusTypeBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bonusTypeBtnActive: { backgroundColor: c.accent + '33', borderColor: c.accent },
  bonusTypeBtnText: { color: c.subtext, fontSize: 12, fontWeight: '600' },
  bonusTypeBtnTextActive: { color: c.accent },
  bonusValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bonusValueBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusValueBtnText: { color: c.text, fontSize: 18, fontWeight: 'bold' },
  bonusValueText: { color: c.accent, fontSize: 16, fontWeight: 'bold', width: 40, textAlign: 'center' },
  removeBtn: { padding: 4 },
  removeBtnText: { fontSize: 16 },

  traitInputRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  traitInput: {
    flex: 1,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: c.text,
    fontSize: 13,
    minHeight: 44,
    textAlignVertical: 'top',
  },

  attackCard: {
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.border,
    gap: 8,
  },
  attackCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attackNameInput: {
    flex: 1,
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: c.text,
    fontSize: 14,
    fontWeight: '600',
  },
  attackFieldsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  attackField: { flex: 1, minWidth: 70 },
  attackFieldLabel: { color: c.subtext, fontSize: 10, fontWeight: '600', marginBottom: 3, textTransform: 'uppercase' },
  attackFieldInput: {
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    color: c.text,
    fontSize: 13,
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelBtnText: { color: c.subtext, fontSize: 15, fontWeight: '600' },
  saveBtn: {
    flex: 2,
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // ── Catalog ──────────────────────────────────────────────────────────────
  catalogSection: { marginBottom: 12 },
  catalogToggle: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.accent + '66',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  catalogToggleText: { color: c.accent, fontSize: 14, fontWeight: '700' },
  catalogContainer: {
    marginTop: 8,
    backgroundColor: c.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden',
  },
  catalogFilterScroll: { borderBottomWidth: 1, borderBottomColor: c.border },
  catalogFilterRow: { flexDirection: 'row', padding: 8, gap: 6 },
  catalogFilterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: c.border,
  },
  catalogFilterBtnActive: { backgroundColor: c.accent, borderColor: c.accent },
  catalogFilterText: { color: c.subtext, fontSize: 12, fontWeight: '600' },
  catalogFilterTextActive: { color: '#fff' },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  catalogItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  catalogItemIcon: { fontSize: 20 },
  catalogItemName: { color: c.text, fontSize: 14, fontWeight: '700' },
  catalogItemMeta: { color: c.subtext, fontSize: 11, marginTop: 1 },
  catalogItemArrow: { color: c.accent, fontSize: 16, fontWeight: 'bold', paddingLeft: 8 },
});
