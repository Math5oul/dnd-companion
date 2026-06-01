-- Criação da tabela de personagens no Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase

CREATE TABLE IF NOT EXISTS characters (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  race          TEXT NOT NULL,
  "className"   TEXT NOT NULL,
  level         INTEGER NOT NULL DEFAULT 1,
  "abilityScores" JSONB NOT NULL DEFAULT '{"strength":10,"dexterity":10,"constitution":10,"intelligence":10,"wisdom":10,"charisma":10}',
  hp            INTEGER NOT NULL DEFAULT 8,
  "maxHp"       INTEGER NOT NULL DEFAULT 8,
  "spellSlots"  JSONB NOT NULL DEFAULT '{}',
  "spells"      JSONB NOT NULL DEFAULT '[]',
  "traits"         JSONB NOT NULL DEFAULT '[]',
  "position"       JSONB,
  "sorceryPoints"  JSONB,
  "kiPoints"       JSONB,
  "hitDiceUsed"    INTEGER NOT NULL DEFAULT 0,
  "skillProficiencies" JSONB NOT NULL DEFAULT '[]',
  "equipment"      JSONB NOT NULL DEFAULT '[]',
  "gold"           INTEGER NOT NULL DEFAULT 40,
  "activeEffects"  JSONB NOT NULL DEFAULT '[]',
  "createdAt"   TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Política pública temporária (sem autenticação)
-- Troque depois por políticas baseadas em user_id quando adicionar auth
CREATE POLICY "public_read" ON characters FOR SELECT USING (true);
CREATE POLICY "public_insert" ON characters FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON characters FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON characters FOR DELETE USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Migrações (para tabelas já existentes)
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "hitDiceUsed"        INTEGER NOT NULL DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "skillProficiencies" JSONB   NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "equipment"          JSONB   NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "gold"               INTEGER NOT NULL DEFAULT 40;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "activeEffects"      JSONB   NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "asiChoices"         JSONB   NOT NULL DEFAULT '{}';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "actionUses"         JSONB   NOT NULL DEFAULT '{}';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "featureChoices"     JSONB   NOT NULL DEFAULT '{}';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "sorceryPoints"      JSONB;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "kiPoints"           JSONB;
-- v2: stats derivados e toggles de features
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "speed"              INTEGER NOT NULL DEFAULT 30;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "activeToggles"      JSONB   NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "proficiencies"      JSONB   NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "position"           JSONB;

-- v4: combat status
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "tempHp"                 INTEGER NOT NULL DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "concentrationSpellId"   TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "conditions"             JSONB   NOT NULL DEFAULT '[]';

-- ── v3: Sessões de jogo e estado de turno (base para Realtime multiplayer) ───

CREATE TABLE IF NOT EXISTS game_sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  "roundNumber"  INTEGER NOT NULL DEFAULT 1,
  "activeCharacterId" UUID,
  "createdAt"  TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_characters (
  session_id   UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, character_id)
);

CREATE TABLE IF NOT EXISTS turn_states (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id           UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  character_id         UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  "roundNumber"        INTEGER NOT NULL DEFAULT 1,
  "actionsTotal"       INTEGER NOT NULL DEFAULT 1,
  "actionsUsed"        INTEGER NOT NULL DEFAULT 0,
  "bonusActionsTotal"  INTEGER NOT NULL DEFAULT 1,
  "bonusActionsUsed"   INTEGER NOT NULL DEFAULT 0,
  "reactionsTotal"     INTEGER NOT NULL DEFAULT 1,
  "reactionsUsed"      INTEGER NOT NULL DEFAULT 0,
  "movementTotal"      INTEGER NOT NULL DEFAULT 30,
  "movementUsed"       INTEGER NOT NULL DEFAULT 0,
  "position"           JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}',
  "lastMovementTerrain" TEXT NOT NULL DEFAULT 'normal',
  "isActive"           BOOLEAN NOT NULL DEFAULT FALSE,
  "updatedAt"          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, character_id)
);

ALTER TABLE turn_states ADD COLUMN IF NOT EXISTS "position"            JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}';
ALTER TABLE turn_states ADD COLUMN IF NOT EXISTS "lastMovementTerrain" TEXT  NOT NULL DEFAULT 'normal';

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE turn_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all_gs"  ON game_sessions      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_sc"  ON session_characters  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_ts"  ON turn_states         FOR ALL USING (true) WITH CHECK (true);
