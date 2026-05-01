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
  "sorceryPoints"  JSONB,
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
