import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { formatModifier, rollDamage } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { getClassById } from '../../src/data/classes';
import { getSpellById, getSpellDamage, SCHOOL_ICON, SCHOOL_COLOR } from '../../src/data/spells';
import { AbilityName } from '../../src/types/character';
import ConfirmModal from '../../src/components/ConfirmModal';

const ABILITIES: { key: AbilityName; label: string; icon: string }[] = [
  { key: 'strength', label: 'Força', icon: '💪' },
  { key: 'dexterity', label: 'Destreza', icon: '🏹' },
  { key: 'constitution', label: 'Constituição', icon: '🛡️' },
  { key: 'intelligence', label: 'Inteligência', icon: '📚' },
  { key: 'wisdom', label: 'Sabedoria', icon: '🔮' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
];

export default function CharacterSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { characters, useSpellSlot, recoverSpellSlots, updateHp, deleteCharacter, levelUp } = useCharacterStore();

  const char = characters.find((c) => c.id === id);
  const [hpDelta, setHpDelta] = useState(0);

  type ModalType = 'delete' | 'levelup' | 'longrest' | 'noslot' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [noSlotLevel, setNoSlotLevel] = useState(0);

  // { spellId -> { total, detail, expires } }
  const [rollResults, setRollResults] = useState<Record<string, { total: number; detail: string }>>({});

  const showRoll = (spellId: string, dmgStr: string) => {
    const result = rollDamage(dmgStr);
    setRollResults((prev) => ({ ...prev, [spellId]: result }));
    setTimeout(() => {
      setRollResults((prev) => { const n = { ...prev }; delete n[spellId]; return n; });
    }, 4000);
  };

  const handleCastSpell = (spellId: string, spellLevel: number, dmgStr: string | null) => {
    if (spellLevel > 0) {
      const slot = char.spellSlots[spellLevel];
      if (!slot || slot.used >= slot.total) {
        setNoSlotLevel(spellLevel);
        setModal('noslot');
        return;
      }
      useSpellSlot(char.id, spellLevel);
    }
    if (dmgStr) showRoll(spellId, dmgStr);
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

  if (!char) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Personagem não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const race = getRaceById(char.race);
  const cls = getClassById(char.className);

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
      `${race?.name ?? char.race} · ${cls?.name ?? char.className} · Nível ${char.level}`,
      `❤️ HP: ${char.hp}/${char.maxHp}`,
      '',
      'Atributos:',
      ...ABILITIES.map(
        ({ key, label }) =>
          `  ${label}: ${char.abilityScores[key]} (${formatModifier(char.abilityScores[key])})`
      ),
    ].join('\n');

    await Share.share({ message: text, title: char.name });
  };

  const hpPercent = char.maxHp > 0 ? char.hp / char.maxHp : 0;
  const hpColor =
    hpPercent > 0.6 ? '#50d080' : hpPercent > 0.3 ? '#e0a030' : '#ff5050';

  const spellLevelNames = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.charName}>{char.name}</Text>
          <Text style={styles.charSub}>
            {race?.name ?? char.race} · {cls?.name ?? char.className} · Nível {char.level}
          </Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>🔗 Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {/* HP */}
      <View style={styles.hpCard}>
        <View style={styles.hpHeader}>
          <Text style={styles.hpLabel}>Pontos de Vida</Text>
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

      {/* Atributos */}
      <Text style={styles.sectionTitle}>Atributos</Text>
      <View style={styles.statsGrid}>
        {ABILITIES.map(({ key, label, icon }) => (
          <View key={key} style={styles.statBox}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statScore}>{char.abilityScores[key]}</Text>
            <Text style={styles.statMod}>{formatModifier(char.abilityScores[key])}</Text>
            <Text style={styles.statLabel}>{label.slice(0, 3).toUpperCase()}</Text>
          </View>
        ))}
      </View>

      {/* Magias */}
      {cls?.spellcaster && (
        <>
          <Text style={styles.sectionTitle}>Magias</Text>

          {/* Truques */}
          {(knownSpellsByLevel[0]?.length ?? 0) > 0 && (
            <View style={styles.spellsBlock}>
              <Text style={styles.spellGroupLabel}>TRUQUES</Text>
              {knownSpellsByLevel[0].map((sp) => {
                const dmg = getSpellDamage(sp, char.level);
                const result = rollResults[sp.id];
                return (
                  <TouchableOpacity
                    key={sp.id}
                    style={[styles.spellMiniRow, result && styles.spellMiniRowActive]}
                    onPress={() => handleCastSpell(sp.id, 0, dmg)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>
                      {SCHOOL_ICON[sp.school]}
                    </Text>
                    <Text style={styles.spellMiniName}>{sp.name}</Text>
                    {result ? (
                      <Text style={styles.rollResult}>{result.total} {result.detail}</Text>
                    ) : dmg ? (
                      <Text style={styles.spellMiniDmg}>🎲 {dmg}</Text>
                    ) : (
                      <Text style={styles.spellMiniCast}>toque</Text>
                    )}
                  </TouchableOpacity>
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
                return (
                  <View key={lvl} style={styles.slotGroup}>
                    <View style={styles.spellRow}>
                      <Text style={styles.spellLevel}>{spellLevelNames[Number(lvl) - 1]} nível</Text>
                      <View style={styles.slotDots}>
                        {Array.from({ length: slot.total }).map((_, i) => (
                          <View
                            key={i}
                            style={[styles.slotDot, i < available ? styles.slotDotFull : styles.slotDotEmpty]}
                          />
                        ))}
                      </View>
                      <Text style={styles.slotCount}>{available}/{slot.total}</Text>
                    </View>
                    {spellsOfLevel.length === 0 && (
                      <Text style={styles.noSpellsHint}>Nenhuma magia de {spellLevelNames[Number(lvl) - 1]} nível</Text>
                    )}
                    {spellsOfLevel.map((sp) => {
                      const dmg = getSpellDamage(sp, char.level);
                      const result = rollResults[sp.id];
                      return (
                        <TouchableOpacity
                          key={sp.id}
                          style={[
                            styles.spellMiniRow,
                            result && styles.spellMiniRowActive,
                            available === 0 && styles.spellMiniRowDisabled,
                          ]}
                          onPress={() => handleCastSpell(sp.id, Number(lvl), dmg)}
                          activeOpacity={available === 0 ? 1 : 0.7}
                        >
                          <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>
                            {SCHOOL_ICON[sp.school]}
                          </Text>
                          <Text style={styles.spellMiniName}>{sp.name}</Text>
                          {result ? (
                            <Text style={styles.rollResult}>{result.total} {result.detail}</Text>
                          ) : dmg ? (
                            <Text style={styles.spellMiniDmg}>🎲 {dmg}</Text>
                          ) : (
                            <Text style={styles.spellMiniCast}>toque</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}

      {/* Ações */}
      <Text style={styles.sectionTitle}>Ações</Text>
      {cls?.spellcaster && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/character/spells/${char.id}`)}
        >
          <Text style={styles.actionBtnText}>📖 Gerenciar Grimório</Text>
          <Text style={styles.actionBtnSub}>
            {(char.spells?.length ?? 0)} {(char.spells?.length ?? 0) === 1 ? 'magia' : 'magias'} selecionadas
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.actionBtn} onPress={handleLongRestConfirm}>
        <Text style={styles.actionBtnText}>🌙 Descanso Longo</Text>
        <Text style={styles.actionBtnSub}>Recupera HP e Spell Slots</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.levelUpBtn} onPress={handleLevelUp}>
        <Text style={styles.levelUpBtnText}>⬆️ Level Up — Nível {char.level} → {char.level + 1}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>🗑️ Deletar Personagem</Text>
      </TouchableOpacity>

      {/* Modais de confirmação */}
      <ConfirmModal
        visible={modal === 'delete'}
        title="Deletar personagem"
        message={`Tem certeza que deseja deletar ${char.name}? Essa ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        confirmDestructive
        onCancel={() => setModal(null)}
        onConfirm={async () => {
          setModal(null);
          await deleteCharacter(char.id);
          router.replace('/');
        }}
      />
      <ConfirmModal
        visible={modal === 'levelup'}
        title="Level Up! 🎉"
        message={`${char.name} vai passar para o Nível ${char.level + 1}.\nHP aumenta automaticamente (dado de vida + CON).`}
        confirmLabel={`Subir para Nível ${char.level + 1}`}
        onCancel={() => setModal(null)}
        onConfirm={() => { setModal(null); levelUp(char.id); }}
      />
      <ConfirmModal
        visible={modal === 'longrest'}
        title="🌙 Descanso Longo"
        message="Recuperar todos os spell slots e HP máximo?"
        confirmLabel="Descansar"
        onCancel={() => setModal(null)}
        onConfirm={() => {
          setModal(null);
          recoverSpellSlots(char.id);
          updateHp(char.id, char.maxHp);
        }}
      />
      <ConfirmModal
        visible={modal === 'noslot'}
        title="Sem slots disponíveis"
        message={`Você não tem mais slots de nível ${noSlotLevel} disponíveis.`}
        confirmLabel="OK"
        onCancel={() => setModal(null)}
        onConfirm={() => setModal(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { padding: 20, paddingBottom: 60 },
  notFound: { flex: 1, backgroundColor: '#1a0a00', alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#c9a84c', fontSize: 18, marginBottom: 12 },
  backLink: { color: '#a07030', fontSize: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  charName: { color: '#c9a84c', fontSize: 26, fontWeight: 'bold' },
  charSub: { color: '#a07030', fontSize: 14, marginTop: 4 },
  shareBtn: {
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: '#c9a84c44',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shareBtnText: { color: '#c9a84c', fontSize: 13 },

  hpCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#c9a84c33',
  },
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  hpLabel: { color: '#8a7060', fontSize: 14 },
  hpValue: { fontSize: 22, fontWeight: 'bold' },
  hpBarBg: {
    height: 8,
    backgroundColor: '#1a0a00',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  hpBarFill: { height: '100%', borderRadius: 4 },
  hpActions: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  hpBtn: {
    flex: 1,
    backgroundColor: '#3a1a00',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff505055',
  },
  hpBtnHeal: { borderColor: '#50d08055' },
  hpBtnText: { color: '#e0c070', fontWeight: '600' },

  sectionTitle: { color: '#c9a84c', fontSize: 16, fontWeight: '700', marginBottom: 12 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statBox: {
    width: '30%',
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c9a84c33',
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statScore: { color: '#e0c070', fontSize: 22, fontWeight: 'bold' },
  statMod: { color: '#a07030', fontSize: 14, fontWeight: '600' },
  statLabel: { color: '#6a5040', fontSize: 11, marginTop: 2 },

  spellCard: {
    backgroundColor: '#2d1a00',
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
  slotDotEmpty: { backgroundColor: '#3a2a4a', borderWidth: 1, borderColor: '#6a5080' },
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
    backgroundColor: '#2d1a00',
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
    backgroundColor: '#15080088',
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
    color: '#c9a84c',
    fontSize: 13,
    flex: 1,
  },
  spellMiniDmg: {
    color: '#ff8040',
    fontSize: 12,
    fontWeight: '600',
  },
  spellMiniCast: {
    color: '#6a5040',
    fontSize: 11,
    fontStyle: 'italic',
  },
  rollResult: {
    color: '#f0e040',
    fontSize: 14,
    fontWeight: '800',
  },
  noSpellsHint: {
    color: '#5a4030',
    fontSize: 11,
    fontStyle: 'italic',
    paddingLeft: 8,
    paddingTop: 4,
  },

  actionBtn: {
    backgroundColor: '#2d1a00',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c9a84c33',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtnText: { color: '#c9a84c', fontSize: 16, fontWeight: '600' },
  actionBtnSub: { color: '#6a5040', fontSize: 12, marginTop: 2 },

  grimoireCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#c9a84c33',
    gap: 12,
  },
  grimoireLvl: {
    color: '#c9a84c',
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
  grimoireName: { fontSize: 14, fontWeight: '600' },
  grimoireMeta: { color: '#6a5040', fontSize: 11, marginTop: 1 },

  deleteBtn: {
    borderWidth: 1,
    borderColor: '#ff404055',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#ff4040', fontWeight: '600', fontSize: 15 },
  levelUpBtn: {
    backgroundColor: '#1a3a00',
    borderWidth: 1,
    borderColor: '#60c030',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  levelUpBtnText: { color: '#80e040', fontWeight: '700', fontSize: 15 },
});
