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
const PT_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(DAMAGE_TYPES_PT).map(([en, pt]) => [pt, en])
);

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function EquipmentModal({ visible, initial, onSave, onCancel }: Props) {
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const { language, units } = useI18n();
  const s = makeStyles(c);
  const typeLabels = language === 'en' ? EQUIPMENT_TYPE_LABELS_EN : EQUIPMENT_TYPE_LABELS_PT;
  const L = (pt: string, en: string) => language === 'en' ? en : pt;

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [type, setType] = useState<EquipmentType>('weapon');
  const [description, setDescription] = useState('');
  const [equipped, setEquipped] = useState(true);
  const [goldInput, setGoldInput] = useState('0');
  const [weightInput, setWeightInput] = useState('0');
  const [duration, setDuration] = useState<'forever' | 'long_rest'>('forever');
  const [chargesInput, setChargesInput] = useState('1');
  const [maxChargesInput, setMaxChargesInput] = useState('1');
  const [useEffectType, setUseEffectType] = useState<'heal' | 'temp_hp' | 'damage'>('heal');
  const [useEffectDice, setUseEffectDice] = useState('');
  const [useEffectDmgType, setUseEffectDmgType] = useState('fire');
  const [armorCategory, setArmorCategory] = useState<'light' | 'medium' | 'heavy' | 'none'>('none');
  const [baseACInput, setBaseACInput] = useState('10');
  const [weaponCategory, setWeaponCategory] = useState<'simple' | 'martial' | ''>('simple');
  const [weaponHands, setWeaponHands] = useState<'one' | 'two' | ''>('one');
  const [bonuses, setBonuses] = useState<EquipmentBonus[]>([]);
  const [attacks, setAttacks] = useState<(EquipmentAttack & { dmgInput: string; bonusInput: string })[]>([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<EquipmentType | 'all'>('all');

  const lbsToDisplay = (lbs: number) =>
    units === 'metric' ? parseFloat((lbs * 0.453592).toFixed(2)).toString() : String(lbs);
  const displayToLbs = (val: string) => {
    const n = parseFloat(val) || 0;
    return units === 'metric' ? n / 0.453592 : n;
  };

  useEffect(() => {
    if (!visible) return;
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setDescription(initial.description);
      setEquipped(initial.equipped);
      setGoldInput(String(initial.goldValue ?? 0));
      setWeightInput(lbsToDisplay(initial.weight ?? 0));
      setDuration(initial.duration ?? 'forever');
      setChargesInput(String(initial.charges ?? 1));
      setMaxChargesInput(String(initial.maxCharges ?? 1));
      setUseEffectDice(initial.useEffect?.dice ?? '');
      setUseEffectType(initial.useEffect?.type ?? 'heal');
      setUseEffectDmgType(initial.useEffect?.damageType ?? 'fire');
      setArmorCategory(initial.armorCategory ?? 'none');
      setBaseACInput(String(initial.baseAC ?? 10));
      setWeaponCategory(initial.weaponCategory ?? 'simple');
      setWeaponHands(initial.weaponHands === 'two' ? 'two' : 'one');
      setBonuses(initial.bonuses.map((b) => ({ ...b })));
      setAttacks(initial.attacks.map((a) => ({
        ...a,
        damageType: PT_TO_EN[a.damageType] ?? a.damageType,
        dmgInput: a.damage,
        bonusInput: a.attackBonus >= 0 ? `+${a.attackBonus}` : String(a.attackBonus),
      })));
    } else {
      setName(''); setType('weapon'); setDescription('');
      setEquipped(true); setGoldInput('0'); setWeightInput('0');
      setDuration('forever'); setChargesInput('1'); setMaxChargesInput('1');
      setUseEffectDice(''); setUseEffectType('heal'); setUseEffectDmgType('fire');
      setArmorCategory('none'); setBaseACInput('10');
      setWeaponCategory('simple'); setWeaponHands('one');
      setBonuses([]); setAttacks([]);
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
      goldValue: parseInt(goldInput) || 0,
      duration,
      ...(type === 'consumable' && chargesNum > 0
        ? { charges: chargesNum, maxCharges: maxChargesNum || chargesNum }
        : {}),
      ...(type === 'consumable' && useEffectDice.trim()
        ? { useEffect: {
            type: useEffectType,
            dice: useEffectDice.trim(),
            ...(useEffectType === 'damage' ? { damageType: useEffectDmgType } : {}),
          } }
        : {}),
      ...(armorCategory !== 'none'
        ? { armorCategory: armorCategory as 'light' | 'medium' | 'heavy', baseAC: parseInt(baseACInput) || 10 }
        : {}),
      ...(type === 'weapon' && weaponCategory ? { weaponCategory } : {}),
      ...(type === 'weapon' && weaponHands ? { weaponHands } : {}),
      ...(parseFloat(weightInput) > 0 ? { weight: displayToLbs(weightInput) } : {}),
      bonuses,
      traits: [],
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

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addBonus = () => setBonuses((b) => [...b, { type: 'ac', value: 1 }]);
  const removeBonus = (i: number) => setBonuses((b) => b.filter((_, idx) => idx !== i));
  const setBonusType = (i: number, bt: BonusType) =>
    setBonuses((b) => b.map((x, idx) => idx === i ? { ...x, type: bt } : x));
  const setBonusValue = (i: number, v: number) =>
    setBonuses((b) => b.map((x, idx) => idx === i ? { ...x, value: v } : x));

  const addAttack = () => setAttacks((a) => [...a, {
    id: genId(), name: '', attackBonus: 0, bonusInput: '+0',
    damage: '1d6', dmgInput: '1d6', damageType: 'slashing', range: '5 ft',
  }]);
  const removeAttack = (i: number) => setAttacks((a) => a.filter((_, idx) => idx !== i));
  const setAttackField = (i: number, field: string, value: string) =>
    setAttacks((a) => a.map((x, idx) => idx === i ? { ...x, [field]: value } : x));

  const applyTemplate = (entry: CatalogEntry) => {
    setName(L(entry.namePt, entry.nameEn));
    setType(entry.type);
    setDescription(L(entry.descPt, entry.descEn));
    setBonuses(entry.bonuses.map((b) => ({ ...b })));
    setAttacks(entry.attacks.map((a) => ({
      ...a,
      dmgInput: a.damage,
      bonusInput: a.attackBonus >= 0 ? `+${a.attackBonus}` : String(a.attackBonus),
    })));
    setGoldInput(String(entry.goldValue));
    setWeightInput(lbsToDisplay(entry.weight ?? 0));
    setChargesInput(String(entry.maxCharges ?? 1));
    setMaxChargesInput(String(entry.maxCharges ?? 1));
    setUseEffectDice(entry.useEffect?.dice ?? '');
    setUseEffectType(entry.useEffect?.type ?? 'heal');
    setArmorCategory(entry.armorCategory ?? 'none');
    setBaseACInput(String(entry.baseAC ?? 10));
    setWeaponCategory('');
    setWeaponHands('');
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
          {/* ── Header ── */}
          <View style={s.header}>
            <Text style={s.headerTitle}>
              {initial ? L('✏️ Editar Item', '✏️ Edit Item') : L('📦 Novo Item', '📦 New Item')}
            </Text>
            <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Text style={s.headerClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.scroll} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

            {/* ── Catalog ── */}
            {!initial && (
              <View style={{ marginBottom: 12 }}>
                <TouchableOpacity style={s.catalogToggle} onPress={() => setCatalogOpen((v) => !v)}>
                  <Text style={s.catalogToggleText}>
                    {catalogOpen ? L('▲ Ocultar Modelos', '▲ Hide Templates') : L('📋 Usar Modelo', '📋 Use Template')}
                  </Text>
                </TouchableOpacity>
                {catalogOpen && (
                  <View style={s.catalogContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={[s.row, { padding: 8 }]}>
                        {(['all', ...TYPES] as (EquipmentType | 'all')[]).map((tp) => (
                          <TouchableOpacity
                            key={tp}
                            style={[s.chip, catalogFilter === tp && s.chipActive]}
                            onPress={() => setCatalogFilter(tp)}
                          >
                            <Text style={[s.chipText, catalogFilter === tp && s.chipTextActive]}>
                              {tp === 'all'
                                ? L('Todos', 'All')
                                : `${EQUIPMENT_TYPE_ICONS[tp as EquipmentType]} ${typeLabels[tp as EquipmentType]}`}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                    {filteredCatalog.map((entry, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={s.catalogItem}
                        onPress={() => applyTemplate(entry)}
                      >
                        <Text style={{ fontSize: 18, marginRight: 8 }}>{EQUIPMENT_TYPE_ICONS[entry.type]}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={s.catalogItemName}>{L(entry.namePt, entry.nameEn)}</Text>
                          <Text style={s.catalogItemMeta}>
                            🪙 {entry.goldValue} gp
                            {entry.bonuses.length > 0
                              ? '  ·  ' + entry.bonuses.map((b) =>
                                `+${b.value} ${BONUS_TYPE_LABELS[b.type as BonusType]?.[language === 'en' ? 'en' : 'pt'] ?? b.type}`
                              ).join(', ')
                              : ''}
                          </Text>
                        </View>
                        <Text style={{ color: c.subtext, fontSize: 14 }}>→</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* ── Name ── */}
            <TextInput
              style={s.nameInput}
              value={name}
              onChangeText={setName}
              placeholder={L('Nome do item *', 'Item name *')}
              placeholderTextColor={c.subtext + '66'}
            />

            {/* ── Type chips ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={s.row}>
                {TYPES.map((tp) => (
                  <TouchableOpacity
                    key={tp}
                    style={[s.typeChip, type === tp && s.chipActive]}
                    onPress={() => setType(tp)}
                  >
                    <Text style={{ fontSize: 16 }}>{EQUIPMENT_TYPE_ICONS[tp]}</Text>
                    <Text style={[s.chipText, type === tp && s.chipTextActive, { fontSize: 10 }]}>
                      {typeLabels[tp]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* ── Equipped + Duration ── */}
            <View style={[s.row, { marginBottom: 10 }]}>
              <TouchableOpacity
                style={[s.toggleBtn, equipped && s.toggleBtnGreen, { flex: 1 }]}
                onPress={() => setEquipped((v) => !v)}
              >
                <Text style={[s.toggleBtnText, equipped && { color: '#50d080' }]}>
                  {equipped ? L('✅ Equipado', '✅ Equipped') : L('○ Desequipado', '○ Unequipped')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtn, duration === 'long_rest' && s.toggleBtnBlue, { flex: 1 }]}
                onPress={() => setDuration((d) => d === 'forever' ? 'long_rest' : 'forever')}
              >
                <Text style={[s.toggleBtnText, duration === 'long_rest' && { color: '#4a90d9' }]}>
                  {duration === 'forever' ? L('♾️ Permanente', '♾️ Forever') : L('🌙 Desc. Longo', '🌙 Long Rest')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Gold + Weight ── */}
            <View style={[s.row, { marginBottom: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>🪙 {L('Ouro (po)', 'Gold (gp)')}</Text>
                <TextInput
                  style={s.compactInput}
                  value={goldInput}
                  onChangeText={setGoldInput}
                  placeholder="0"
                  placeholderTextColor={c.subtext + '55'}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>
                  ⚖️ {L(`Peso (${units === 'metric' ? 'kg' : 'lbs'})`, `Weight (${units === 'metric' ? 'kg' : 'lbs'})`)}
                </Text>
                <TextInput
                  style={s.compactInput}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder="0"
                  placeholderTextColor={c.subtext + '55'}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* ── Consumable block ── */}
            {type === 'consumable' && (
              <View style={s.block}>
                <View style={[s.row, { marginBottom: 8 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>🔋 {L('Cargas', 'Charges')}</Text>
                    <TextInput
                      style={s.compactInput}
                      value={chargesInput}
                      onChangeText={setChargesInput}
                      placeholder="1"
                      placeholderTextColor={c.subtext + '55'}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>{L('Máx. Cargas', 'Max Charges')}</Text>
                    <TextInput
                      style={s.compactInput}
                      value={maxChargesInput}
                      onChangeText={setMaxChargesInput}
                      placeholder="1"
                      placeholderTextColor={c.subtext + '55'}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                <Text style={s.fieldLabel}>✨ {L('Efeito ao usar', 'Effect on use')}</Text>
                <View style={[s.row, { marginTop: 4, marginBottom: 6 }]}>
                  {(['heal', 'temp_hp', 'damage'] as const).map((et) => (
                    <TouchableOpacity
                      key={et}
                      style={[s.chip, useEffectType === et && s.chipActive, { flex: 1 }]}
                      onPress={() => setUseEffectType(et)}
                    >
                      <Text style={[s.chipText, useEffectType === et && s.chipTextActive, { fontSize: 11 }]}>
                        {et === 'heal' ? L('❤️ Cura', '❤️ Heal')
                          : et === 'temp_hp' ? L('🛡️ PV Temp', '🛡️ Temp HP')
                          : L('💥 Dano', '💥 Damage')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={s.row}>
                  <TextInput
                    style={[s.compactInput, { flex: 1 }]}
                    value={useEffectDice}
                    onChangeText={setUseEffectDice}
                    placeholder={useEffectType === 'heal' ? L('dados: 2d4+2', 'dice: 2d4+2') : L('dados: 4d8', 'dice: 4d8')}
                    placeholderTextColor={c.subtext + '55'}
                  />
                  {useEffectType === 'damage' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 2 }}>
                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        {DAMAGE_TYPES_EN.map((dt) => (
                          <TouchableOpacity
                            key={dt}
                            style={[s.chip, useEffectDmgType === dt && s.chipActive,
                              { paddingHorizontal: 8, paddingVertical: 4 }]}
                            onPress={() => setUseEffectDmgType(dt)}
                          >
                            <Text style={[s.chipText, useEffectDmgType === dt && s.chipTextActive, { fontSize: 11 }]}>
                              {language === 'en' ? dt : (DAMAGE_TYPES_PT[dt] ?? dt)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>
              </View>
            )}

            {/* ── Weapon Properties ── */}
            {type === 'weapon' && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[s.sectionTitle, { marginBottom: 8 }]}>
                  {L('⚔️ Propriedades da Arma', '⚔️ Weapon Properties')}
                </Text>
                <Text style={s.fieldLabel}>{L('Categoria', 'Category')}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
                  {(['', 'simple', 'martial'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[s.chip, weaponCategory === cat && s.chipActive, { flex: 1 }]}
                      onPress={() => setWeaponCategory(cat)}
                    >
                      <Text style={[s.chipText, weaponCategory === cat && s.chipTextActive, { textAlign: 'center', fontSize: 12 }]}>
                        {cat === '' ? L('—', '—') : cat === 'simple' ? L('Simples', 'Simple') : L('Marcial', 'Martial')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.fieldLabel}>{L('Mãos', 'Hands')}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                  {(['one', 'two'] as const).map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[s.chip, weaponHands === h && s.chipActive, { flex: 1 }]}
                      onPress={() => setWeaponHands(h)}
                    >
                      <Text style={[s.chipText, weaponHands === h && s.chipTextActive, { textAlign: 'center', fontSize: 12 }]}>
                        {h === 'one' ? L('1 mão', '1-hand') : L('2 mãos', '2-hand')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── AC Formula ── */}
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>{L('\u{1f6e1}\ufe0f F\u00f3rmula de CA', '\u{1f6e1}\ufe0f AC Formula')}</Text>
            </View>
            <Text style={[s.emptyHint, { marginBottom: 8 }]}>
              {L(
                'Armaduras usam f\u00f3rmula por categoria. Itens planos (escudo, anel) deixe em Nenhuma e adicione b\u00f4nus CA abaixo.',
                'Armors use a category formula. Flat items (shield, ring) leave None and add an AC bonus below.',
              )}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
              {(['none', 'light', 'medium', 'heavy'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[s.chip, armorCategory === cat && s.chipActive, { flex: 1 }]}
                  onPress={() => setArmorCategory(cat)}
                >
                  <Text style={[s.chipText, armorCategory === cat && s.chipTextActive, { textAlign: 'center', fontSize: 12 }]}>
                    {cat === 'none' ? L('Nenhuma', 'None')
                      : cat === 'light' ? L('Leve', 'Light')
                      : cat === 'medium' ? L('M\u00e9dia', 'Medium')
                      : L('Pesada', 'Heavy')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {armorCategory !== 'none' && (
              <View style={[s.row, { marginBottom: 12 }]}>
                <Text style={s.fieldLabel}>CA Base</Text>
                <TextInput
                  style={[s.compactInput, { width: 80 }]}
                  keyboardType="number-pad"
                  value={baseACInput}
                  onChangeText={setBaseACInput}
                  placeholderTextColor={c.subtext}
                />
                <Text style={{ flex: 1, color: c.text, fontSize: 12 }}>
                  {armorCategory === 'heavy'
                    ? L('CA fixa (sem b\u00f4nus de DES)', 'Fixed AC (no DEX bonus)')
                    : armorCategory === 'medium'
                    ? L('+ DES m\u00e1x +2', '+ DEX max +2')
                    : L('+ DES (livre)', '+ DEX (full)')}
                </Text>
              </View>
            )}

            {/* ── Bonuses ── */}
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>{L('📊 Bônus', '📊 Bonuses')}</Text>
              <TouchableOpacity style={s.addBtn} onPress={addBonus}>
                <Text style={s.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {bonuses.length === 0 && (
              <Text style={s.emptyHint}>{L('Nenhum bônus.', 'No bonuses.')}</Text>
            )}
            {bonuses.map((b, i) => (
              <View key={i} style={s.bonusRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 4, paddingVertical: 2 }}>
                    {ALL_BONUS_TYPES.map((bt) => (
                      <TouchableOpacity
                        key={bt}
                        style={[s.chip, b.type === bt && s.chipActive, { paddingHorizontal: 8, paddingVertical: 4 }]}
                        onPress={() => setBonusType(i, bt)}
                      >
                        <Text style={[s.chipText, b.type === bt && s.chipTextActive, { fontSize: 11 }]}>
                          {BONUS_TYPE_LABELS[bt][language === 'en' ? 'en' : 'pt']}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <View style={s.stepper}>
                  <TouchableOpacity style={s.stepBtn} onPress={() => setBonusValue(i, b.value - 1)}>
                    <Text style={s.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={s.stepValue}>{b.value >= 0 ? `+${b.value}` : b.value}</Text>
                  <TouchableOpacity style={s.stepBtn} onPress={() => setBonusValue(i, b.value + 1)}>
                    <Text style={s.stepBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeBonus(i)} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 15 }}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* ── Attacks ── */}
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>{L('⚔️ Ataques / Habilidades', '⚔️ Attacks / Abilities')}</Text>
              <TouchableOpacity style={s.addBtn} onPress={addAttack}>
                <Text style={s.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {attacks.length === 0 && (
              <Text style={s.emptyHint}>{L('Nenhum ataque.', 'No attacks.')}</Text>
            )}
            {attacks.map((a, i) => (
              <View key={a.id} style={s.attackCard}>
                <View style={[s.row, { marginBottom: 8 }]}>
                  <TextInput
                    style={[s.compactInput, { flex: 1, fontWeight: '600', fontSize: 14 }]}
                    value={a.name}
                    onChangeText={(v) => setAttackField(i, 'name', v)}
                    placeholder={L('Nome do ataque', 'Attack name')}
                    placeholderTextColor={c.subtext + '55'}
                  />
                  <TouchableOpacity onPress={() => removeAttack(i)} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 15 }}>🗑</Text>
                  </TouchableOpacity>
                </View>
                <View style={[s.row, { marginBottom: 6 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>{L('Acerto', 'Hit')}</Text>
                    <TextInput
                      style={s.compactInput}
                      value={a.bonusInput}
                      onChangeText={(v) => setAttackField(i, 'bonusInput', v)}
                      placeholder="+5"
                      placeholderTextColor={c.subtext + '55'}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>{L('Dano', 'Damage')}</Text>
                    <TextInput
                      style={s.compactInput}
                      value={a.dmgInput}
                      onChangeText={(v) => setAttackField(i, 'dmgInput', v)}
                      placeholder="1d8+3"
                      placeholderTextColor={c.subtext + '55'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>{L('Alcance', 'Range')}</Text>
                    <TextInput
                      style={s.compactInput}
                      value={a.range}
                      onChangeText={(v) => setAttackField(i, 'range', v)}
                      placeholder="5 ft"
                      placeholderTextColor={c.subtext + '55'}
                    />
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {DAMAGE_TYPES_EN.map((dt) => {
                      const active = a.damageType === dt;
                      return (
                        <TouchableOpacity
                          key={dt}
                          style={[s.chip, active && s.chipActive, { paddingHorizontal: 8, paddingVertical: 3 }]}
                          onPress={() => setAttackField(i, 'damageType', dt)}
                        >
                          <Text style={[s.chipText, active && s.chipTextActive, { fontSize: 11 }]}>
                            {language === 'en' ? dt : (DAMAGE_TYPES_PT[dt] ?? dt)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ))}

            {/* ── Description ── */}
            <TextInput
              style={[s.compactInput, s.descInput]}
              value={description}
              onChangeText={setDescription}
              placeholder={L('Descrição, notas, lore…', 'Description, notes, lore…')}
              placeholderTextColor={c.subtext + '44'}
              multiline
              numberOfLines={3}
            />

          </ScrollView>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
              <Text style={s.cancelBtnText}>{L('Cancelar', 'Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, !name.trim() && { opacity: 0.4 }]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={s.saveBtnText}>{L('💾 Salvar', '💾 Save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type C = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: C) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: c.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '93%',
    borderTopWidth: 1,
    borderColor: c.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  headerTitle: { color: c.text, fontSize: 17, fontWeight: '700' },
  headerClose: { color: c.subtext, fontSize: 20, paddingHorizontal: 4 },
  scroll: { flex: 1 },
  body: { padding: 16, paddingBottom: 6 },

  nameInput: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: c.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  chip: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: c.accent + '22', borderColor: c.accent },
  chipText: { color: c.subtext, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: c.accent },

  typeChip: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: 'center',
    gap: 2,
  },

  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  toggleBtn: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  toggleBtnGreen: { backgroundColor: '#50d08018', borderColor: '#50d080' },
  toggleBtnBlue:  { backgroundColor: '#4a90d918', borderColor: '#4a90d9' },
  toggleBtnText:  { color: c.subtext, fontSize: 13, fontWeight: '600' },

  fieldLabel: {
    color: c.subtext,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compactInput: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: c.text,
    fontSize: 14,
  },
  descInput: {
    minHeight: 68,
    textAlignVertical: 'top',
    marginTop: 10,
    fontSize: 13,
    color: c.subtext,
  },

  block: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: { color: c.accent, fontSize: 13, fontWeight: '700' },
  addBtn: {
    backgroundColor: c.accent + '22',
    borderWidth: 1,
    borderColor: c.accent + '55',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: c.accent, fontSize: 18, fontWeight: '700', lineHeight: 18, includeFontPadding: false, textAlignVertical: 'center', textAlign: 'center' },
  emptyHint: { color: c.subtext + '77', fontSize: 12, fontStyle: 'italic', marginBottom: 8 },

  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 6,
    gap: 6,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: c.text, fontSize: 16, fontWeight: 'bold', lineHeight: 20 },
  stepValue: { color: c.accent, fontSize: 15, fontWeight: 'bold', width: 34, textAlign: 'center' },

  attackCard: {
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: c.border,
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  cancelBtnText: { color: c.subtext, fontSize: 15, fontWeight: '600' },
  saveBtn: {
    flex: 2,
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  catalogToggle: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.accent + '55',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  catalogToggleText: { color: c.accent, fontSize: 13, fontWeight: '700' },
  catalogContainer: {
    marginTop: 6,
    backgroundColor: c.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden',
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border + '55',
  },
  catalogItemName: { color: c.text, fontSize: 13, fontWeight: '600' },
  catalogItemMeta: { color: c.subtext, fontSize: 11, marginTop: 2 },
});