import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { formatModifier, rollDamage } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { getClassById } from '../../src/data/classes';
import { getSpellById, getSpellDamage, getSpellDamageAtSlot, SCHOOL_ICON, SCHOOL_COLOR } from '../../src/data/spells';
import { AbilityName } from '../../src/types/character';
import ConfirmModal from '../../src/components/ConfirmModal';
import LevelUpModal from '../../src/components/LevelUpModal';
import { getFeaturesForLevel, CLASS_FEATURES, computeAsiTotals } from '../../src/data/classFeatures';

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
  const { characters, useSpellSlot, recoverSpellSlots, updateHp, deleteCharacter, levelUp, useSorceryPoint, recoverSorceryPoints, convertSlotToPoints, convertPointsToSlot } = useCharacterStore();

  const char = characters.find((c) => c.id === id);
  const [hpDelta, setHpDelta] = useState(0);

  type ModalType = 'delete' | 'levelup' | 'longrest' | 'noslot' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [noSlotLevel, setNoSlotLevel] = useState(0);
  const [statDetailKey, setStatDetailKey] = useState<AbilityName | null>(null);

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

  // Bonus de atributos acumulado por ASIs (escolhas de nível)
  const asiTotals = useMemo(() => computeAsiTotals(char?.traits ?? []), [char?.traits]);

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
        {ABILITIES.map(({ key, label, icon }) => {
          const base = char.abilityScores[key];
          const bonus = asiTotals[key] ?? 0;
          const total = base + bonus;
          return (
            <TouchableOpacity key={key} style={styles.statBox} onPress={() => setStatDetailKey(key)} activeOpacity={0.7}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statScore}>{total}</Text>
              <Text style={styles.statMod}>{formatModifier(total)}</Text>
              <Text style={styles.statLabel}>{label.slice(0, 3).toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal de detalhe de atributo */}
      {statDetailKey && (() => {
        const ab = ABILITIES.find((a) => a.key === statDetailKey)!;
        const base = char.abilityScores[statDetailKey];
        const bonus = asiTotals[statDetailKey] ?? 0;
        const total = base + bonus;
        return (
          <Modal visible transparent animationType="fade">
            <TouchableOpacity style={styles.statModalOverlay} activeOpacity={1} onPress={() => setStatDetailKey(null)}>
              <View style={styles.statModalBox}>
                <Text style={styles.statModalTitle}>{ab.icon} {ab.label}</Text>
                <View style={styles.statModalRow}>
                  <Text style={styles.statModalLabel}>Base (criação)</Text>
                  <Text style={styles.statModalValue}>{base}</Text>
                </View>
                {bonus > 0 && (
                  <View style={styles.statModalRow}>
                    <Text style={styles.statModalLabel}>Bônus de ASI (traits)</Text>
                    <Text style={[styles.statModalValue, { color: '#50d080' }]}>+{bonus}</Text>
                  </View>
                )}
                <View style={[styles.statModalRow, styles.statModalTotal]}>
                  <Text style={styles.statModalLabelBold}>Total</Text>
                  <Text style={styles.statModalValueBold}>{total}  ({formatModifier(total)})</Text>
                </View>
                <Text style={styles.statModalHint}>Toque fora para fechar</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        );
      })()}

      {/* Traits / Habilidades */}
      {(char.traits?.length ?? 0) > 0 && (() => {
        // Collect all feature info by ID for display
        const allFeatures = Object.values(CLASS_FEATURES).flat().flatMap((lf) => lf.features);
        const allOptions = allFeatures.flatMap((f) => f.options ?? []);
        const traitMap = Object.fromEntries([
          ...allFeatures.map((f) => [f.id, { name: f.name, description: f.description }]),
          ...allOptions.map((o) => [o.id, { name: o.name, description: o.description }]),
        ]);
        return (
          <>
            <Text style={styles.sectionTitle}>📜 Habilidades & Traits</Text>
            <View style={styles.traitsBlock}>
              {(char.traits ?? []).map((tid) => {
                const info = traitMap[tid];
                if (!info) return null;
                return (
                  <View key={tid} style={styles.traitCard}>
                    <Text style={styles.traitName}>{info.name}</Text>
                    <Text style={styles.traitDesc}>{info.description}</Text>
                  </View>
                );
              })}
            </View>
          </>
        );
      })()}

      {/* Magias */}
      {cls?.spellcaster && (
        <>
          <Text style={styles.sectionTitle}>Magias</Text>

          {/* Pontos de Feitiçaria (apenas Sorcerer nível ≥ 2) */}
          {char.className === 'sorcerer' && char.sorceryPoints && char.sorceryPoints.total > 0 && (() => {
            const { total, used } = char.sorceryPoints;
            const available = total - used;
            return (
              <View style={styles.sorceryBlock}>
                <View style={styles.sorceryHeader}>
                  <Text style={styles.sorceryTitle}>✨ Pontos de Feitiçaria</Text>
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
                <Text style={styles.flexCastLabel}>Slot → Pontos</Text>
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
                        <Text style={styles.flexCastBtnText}>{lvl}° +{lvl}pt</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Flexible Casting — Pontos → Slot */}
                <Text style={styles.flexCastLabel}>Pontos → Slot</Text>
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
                        <Text style={styles.flexCastBtnText}>{lvl}° -{cost}pt</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })()}

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
                const upcastable = upcastSpellsAtSlot[Number(lvl)] ?? [];
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
                    {spellsOfLevel.length === 0 && upcastable.length === 0 && (
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
                    {upcastable.map((sp) => {
                      const dmg = getSpellDamageAtSlot(sp, Number(lvl));
                      const result = rollResults[`${sp.id}-up${lvl}`];
                      return (
                        <TouchableOpacity
                          key={`${sp.id}-up${lvl}`}
                          style={[
                            styles.spellMiniRow,
                            styles.spellMiniRowUpcast,
                            result && styles.spellMiniRowActive,
                            available === 0 && styles.spellMiniRowDisabled,
                          ]}
                          onPress={() => handleCastSpell(`${sp.id}-up${lvl}`, Number(lvl), dmg)}
                          activeOpacity={available === 0 ? 1 : 0.7}
                        >
                          <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>
                            {SCHOOL_ICON[sp.school]}
                          </Text>
                          <View style={styles.upcastNameRow}>
                            <Text style={styles.spellMiniName}>{sp.name}</Text>
                            <Text style={styles.upcastBadge}>↑{lvl}°</Text>
                          </View>
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
        title="🌙 Descanso Longo"
        message="Recuperar todos os spell slots e HP máximo?"
        confirmLabel="Descansar"
        onCancel={() => setModal(null)}
        onConfirm={() => {
          setModal(null);
          recoverSpellSlots(char.id);
          updateHp(char.id, char.maxHp);
          recoverSorceryPoints(char.id);
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

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' },
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
  statBonus: { color: '#50d080', fontSize: 10, fontWeight: '600', marginTop: -2 },
  statMod: { color: '#a07030', fontSize: 14, fontWeight: '600' },
  statLabel: { color: '#6a5040', fontSize: 11, marginTop: 2 },

  statModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  statModalBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#c9a84c55',
    gap: 10,
  },
  statModalTitle: {
    color: '#e0c070',
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
    borderBottomColor: '#2a2a4a',
  },
  statModalTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  statModalLabel: { color: '#9090b0', fontSize: 14 },
  statModalLabelBold: { color: '#e0e0ff', fontSize: 15, fontWeight: 'bold' },
  statModalValue: { color: '#e0c070', fontSize: 14, fontWeight: '600' },
  statModalValueBold: { color: '#e0c070', fontSize: 18, fontWeight: 'bold' },
  statModalHint: {
    color: '#505060',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

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

  traitsBlock: {
    gap: 8,
    marginBottom: 24,
  },
  traitCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#c9a84c',
  },
  traitName: {
    color: '#e0c070',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  traitDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#907050',
  },

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
});
