# D&D Companion

Aplicativo mobile/web para acompanhar personagens de Dungeons & Dragons 5ª Edição.

---

## Parte 1 — Para Desenvolvedores

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) SDK ~54 + React Native 0.81 |
| Roteamento | [expo-router](https://expo.github.io/router) v6 (file-based routing) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs/) v5 |
| Backend / banco | [Supabase](https://supabase.com) (PostgreSQL + REST API) |
| Linguagem | TypeScript |
| Execução web | React Native Web + react-dom |

---

### Estrutura de pastas

```
app/                         # Rotas (expo-router)
├── _layout.tsx              # Layout raiz (tema, GestureHandler)
├── index.tsx                # Tela inicial — lista de personagens
├── create/
│   ├── step1-name.tsx       # Wizard: nome do personagem
│   ├── step2-race.tsx       # Wizard: escolha de raça
│   ├── step3-class.tsx      # Wizard: escolha de classe
│   ├── step4-abilities.tsx  # Wizard: rolagem e distribuição de atributos
│   └── step5-review.tsx     # Wizard: revisão e salvamento
└── character/
    ├── [id].tsx             # Ficha do personagem (HP, magias, atributos)
    └── spells/
        └── [id].tsx         # Gerenciador de grimório

src/
├── components/
│   └── ConfirmModal.tsx     # Modal de confirmação reutilizável (cross-platform)
├── data/
│   ├── races.ts             # 8 raças com bônus de atributos e traços
│   ├── classes.ts           # 12 classes com spell slots por nível e limites de magias
│   └── spells.ts            # 65 magias (cantrips ao nível 5) com dados de dano
├── lib/
│   ├── dice.ts              # Utilitários de dados (rollDie, rollDamage, getModifier…)
│   └── supabase.ts          # Cliente Supabase (localStorage na web, SecureStore no mobile)
├── store/
│   └── characterStore.ts    # Store Zustand com todos os personagens e ações
└── types/
    └── character.ts         # Interfaces TypeScript (Character, CharacterDraft, SpellSlots…)

supabase/
└── schema.sql               # DDL para criar a tabela no Supabase
```

---

### Pré-requisitos

- Node.js 18+
- npm 9+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Expo Go no celular (opcional, para testar em Android/iOS)

---

### Configuração e execução

#### 1. Instalar dependências

```bash
npm install
```

#### 2. Configurar o Supabase

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

Execute o seguinte SQL no **SQL Editor** do Supabase para criar a tabela:

```sql
-- Criar tabela principal
CREATE TABLE IF NOT EXISTS characters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  race         TEXT NOT NULL,
  "className"  TEXT NOT NULL,
  level        INTEGER NOT NULL DEFAULT 1,
  hp           INTEGER NOT NULL,
  "maxHp"      INTEGER NOT NULL,
  "abilityScores" JSONB NOT NULL,
  "spellSlots" JSONB NOT NULL DEFAULT '{}',
  spells       JSONB NOT NULL DEFAULT '[]',
  "createdAt"  TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existia sem a coluna spells:
ALTER TABLE characters ADD COLUMN IF NOT EXISTS spells JSONB NOT NULL DEFAULT '[]';
```

#### 3. Executar

```bash
# Web (browser)
npm run web
# ou
npx expo start --web

# Android via Expo Go
npm run android

# iOS via Expo Go
npm run ios

# Qualquer plataforma (scan QR code)
npm start
```

---

### Decisões de arquitetura

- **Alert.alert substituído por ConfirmModal**: o `Alert.alert` do React Native é no-op no browser; todos os diálogos de confirmação usam um `Modal` nativo que funciona em ambas as plataformas.
- **SecureStore vs localStorage**: o cliente Supabase usa `expo-secure-store` no mobile e `localStorage` na web, detectado via `Platform.OS`.
- **Seleção de dados por índice**: na tela de distribuição de atributos, a seleção rastreia o índice do dado no array (não o valor) para evitar conflitos quando dois dados têm o mesmo número.
- **Limites de magias por nível**: cada classe em `classes.ts` define `knownCantrips[]` e `knownSpells[]` indexados pelo nível do personagem (1–5), seguindo as tabelas oficiais do D&D 5e.

---

## Parte 2 — Para Jogadores

### O que é

D&D Companion é um aplicativo para jogadores de **Dungeons & Dragons 5ª Edição** acompanharem seus personagens durante as sessões. Funciona no **navegador** e no **celular** (Android/iOS via Expo Go).

---

### O que ele faz

- **Criação de personagem guiada** em 5 passos
- **Ficha digital** com HP, atributos, spell slots e grimório
- **Rolagem de dados automática** ao usar magias
- **Level up** com ganho de HP calculado automaticamente
- **Descanso longo** para recuperar HP e spell slots
- **Grimório personalizado** com controle de quantas magias/truques o personagem pode conhecer
- **Compartilhamento** da ficha como texto

---

### Como usar

#### Criando um personagem

1. Na tela inicial, toque em **"+ Novo Personagem"**
2. **Passo 1 — Nome**: escreva o nome do personagem
3. **Passo 2 — Raça**: escolha entre 8 raças (Humano, Elfo, Anão, Halfling, Gnomo, Meio-Elfo, Draconato, Tiefling). Cada uma mostra os bônus de atributos que concede
4. **Passo 3 — Classe**: escolha entre 12 classes (Bárbaro, Bardo, Clérigo, Druida, Guerreiro, Monge, Paladino, Patrulheiro, Ladino, Feiticeiro, Bruxo, Mago)
5. **Passo 4 — Atributos**:
   - Toque em **"Rolar Dados"** para gerar 6 valores (método 4d6 descarta o menor)
   - Toque em um **dado** (valor dourado) para selecioná-lo
   - Toque em um **atributo** (Força, Destreza…) para atribuir o valor selecionado
   - Repita até preencher os 6 atributos
   - Você pode re-atribuir: selecione outro dado e toque no atributo que quer substituir
6. **Passo 5 — Revisão**: confira tudo e toque em **"Criar Personagem"**

---

#### Usando a ficha

**HP (Pontos de Vida)**
- Use os botões **− 1 / − 5** para aplicar dano
- Use os botões **+ 1 / + 5** para curar
- A barra de HP muda de cor: verde (saudável) → amarelo → vermelho (crítico)

**Magias**
- A seção **Magias** mostra seus truques e magias organizados por nível de slot
- Cada linha exibe o nome da magia e o dano (ex: `🎲 8d6 fogo`)
- **Toque numa magia** para conjurá-la:
  - O slot do nível correspondente é consumido automaticamente
  - O resultado da rolagem aparece na linha (ex: `24 [3+6+5+2+8+4+7+1] fogo`) por 4 segundos
  - Truques não consomem slots
  - Magias ficam acinzentadas quando não há slots disponíveis
- Os **pontos roxos** acima de cada grupo indicam quantos slots restam

**Gerenciar Grimório**
- Toque em **"📖 Gerenciar Grimório"** (na seção Ações)
- Você verá todas as magias disponíveis para a sua classe e nível
- Toque em uma magia para **adicionar ou remover** do seu grimório
- O app respeita os **limites oficiais** de truques e magias conhecidos por nível (exibidos no topo da tela)

**Outras ações**
- **🌙 Descanso Longo**: recupera todos os HP e spell slots
- **⬆️ Level Up**: avança um nível; o HP aumenta com a rolagem do dado de vida + modificador de Constituição
- **🔗 Compartilhar**: gera um resumo em texto da ficha para enviar no WhatsApp, Discord, etc.
- **🗑️ Deletar Personagem**: remove o personagem permanentemente (pede confirmação)

**Voltando à lista**
- Use o botão **← Voltar** ou o gesto de voltar do dispositivo
- A lista na tela inicial é atualizada automaticamente ao voltar

---

### Magias com rolagem automática

As seguintes magias têm dados de dano pré-configurados e rolam automaticamente ao toque:

| Tipo | Exemplos |
|---|---|
| Truques (escalam com nível) | Raio de Fogo, Raio de Gelo, Explosão Mística, Chama Sagrada, Toque Gelado |
| Nível 1 | Míssil Mágico, Mãos Flamejantes, Onda de Trovão, Infligir Ferimentos |
| Nível 2 | Estilhaçar, Raio Escaldante, Raio de Lua, Arma Espiritual |
| Nível 3 | Bola de Fogo, Raio, Invocar Relâmpago, Guardiões Espirituais |
| Nível 4 | Praga, Tempestade de Gelo |
| Nível 5 | Cone de Frio |

> **Truques escaláveis**: magias marcadas com escalonamento dobram seus dados nos níveis 5, 11 e 17 do personagem, seguindo as regras do D&D 5e.
