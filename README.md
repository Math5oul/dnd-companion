# ⚔️ D&D Companion

Aplicativo **mobile e web** para acompanhar personagens de Dungeons & Dragons 5ª Edição.  
Construído com Expo + React Native, Zustand e Supabase — funciona no navegador, no Android e no iOS.

---

## Índice

- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e execução](#configuração-e-execução)
- [Decisões de arquitetura](#decisões-de-arquitetura)
- [Funcionalidades](#funcionalidades)
- [Como usar — Guia do Jogador](#como-usar--guia-do-jogador)
- [Magias com rolagem automática](#magias-com-rolagem-automática)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) SDK ~54 + React Native 0.81 |
| Roteamento | [expo-router](https://expo.github.io/router) v6 (file-based) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs/) v5 |
| Backend / banco | [Supabase](https://supabase.com) (PostgreSQL + REST API) |
| Linguagem | TypeScript ~5.9 |
| Execução web | React Native Web + react-dom 19 |

---

## Estrutura de pastas

```
app/                              # Rotas (expo-router)
├── _layout.tsx                   # Layout raiz — tema, GestureHandler, TabBar
├── index.tsx                     # Tela inicial — lista de personagens
├── create/
│   ├── step1-name.tsx            # Wizard: nome do personagem
│   ├── step2-race.tsx            # Wizard: escolha de raça
│   ├── step3-class.tsx           # Wizard: escolha de classe
│   ├── step4-abilities.tsx       # Wizard: rolagem e distribuição de atributos
│   └── step5-review.tsx          # Wizard: revisão e salvamento
└── character/
    ├── [id].tsx                  # Ficha do personagem (HP, atributos, magias, features)
    └── spells/
        └── [id].tsx              # Gerenciador de grimório

src/
├── components/
│   ├── ConfirmModal.tsx          # Modal de confirmação reutilizável (cross-platform)
│   ├── LevelUpModal.tsx          # Modal de level up com rolagem de HP
│   ├── SettingsModal.tsx         # Modal de configurações (tema, idioma, unidades)
│   ├── ShortRestModal.tsx        # Modal de descanso curto com uso de Dados de Vida
│   └── TabBar.tsx                # Barra de abas inferior customizada
├── data/
│   ├── races.ts                  # 9 raças com bônus de atributos e traços
│   ├── classes.ts                # 12 classes com spell slots por nível e limites de magias
│   ├── classFeatures.ts          # Árvore de features/traços por classe e nível (1–20)
│   └── spells.ts                 # ~180 magias (cantrips ao nível 9) com dados de dano
├── lib/
│   ├── dice.ts                   # Utilitários de dados (rollDie, rollDamage, getModifier…)
│   ├── i18n.ts                   # Hook useI18n — expõe t(), language e units
│   ├── supabase.ts               # Cliente Supabase (SecureStore no mobile, localStorage na web)
│   ├── units.ts                  # Conversão de unidades (métrico / imperial) e tipos de dano
│   └── translations/
│       ├── index.ts              # localizeFeatureName, localizeFeatureDesc, localizeSpellName…
│       ├── features.ts           # FEATURE_NAMES_EN + FEATURE_DESCRIPTIONS_EN (~800 entradas)
│       └── spells.ts             # SPELL_NAMES_EN + SPELL_DESCS_EN (~200 magias)
├── store/
│   ├── characterStore.ts         # Store Zustand — CRUD de personagens + todas as ações de jogo
│   ├── settingsStore.ts          # Store de configurações — tema, idioma, sistema de unidades
│   └── tabStore.ts               # Store da aba ativa na ficha do personagem
└── types/
    └── character.ts              # Interfaces TypeScript (Character, CharacterDraft, SpellSlots…)

supabase/
└── schema.sql                    # DDL completo para criar/migrar a tabela no Supabase
```

---

## Pré-requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- Conta no [Supabase](https://supabase.com) (plano gratuito é suficiente)
- **Expo Go** no celular — opcional, para testar em Android/iOS

---

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

Execute o SQL abaixo no **SQL Editor** do Supabase:

```sql
-- Criar tabela principal
CREATE TABLE IF NOT EXISTS characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  race            TEXT NOT NULL,
  "className"     TEXT NOT NULL,
  level           INTEGER NOT NULL DEFAULT 1,
  hp              INTEGER NOT NULL,
  "maxHp"         INTEGER NOT NULL,
  "abilityScores" JSONB NOT NULL,
  "spellSlots"    JSONB NOT NULL DEFAULT '{}',
  spells          JSONB NOT NULL DEFAULT '[]',
  features        JSONB NOT NULL DEFAULT '[]',
  "hitDiceUsed"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW()
);

-- Migrações para tabelas já existentes
ALTER TABLE characters ADD COLUMN IF NOT EXISTS spells        JSONB NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS features      JSONB NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "hitDiceUsed" INTEGER NOT NULL DEFAULT 0;
```

### 3. Executar

```bash
# Navegador web
npm run web
# ou
npx expo start --web

# Android via Expo Go
npm run android

# iOS via Expo Go
npm run ios

# Qualquer plataforma — escanear QR code
npm start
```

---

## Decisões de arquitetura

| Decisão | Motivo |
|---|---|
| `ConfirmModal` em vez de `Alert.alert` | `Alert.alert` é no-op no browser; o modal funciona em todas as plataformas |
| `expo-secure-store` no mobile, `localStorage` na web | Detectado via `Platform.OS`; o cliente Supabase adapta o storage automaticamente |
| Seleção de dados por **índice** | Evita conflitos ao distribuir atributos quando dois dados têm o mesmo valor |
| Limites de magias por nível em `classes.ts` | `knownCantrips[]` e `knownSpells[]` indexados por nível (1–20) seguem as tabelas oficiais |
| Árvorê de features em `classFeatures.ts` | Permite exibir features corretas por classe/nível e rastrear quais o jogador desbloqueou |
| Zustand com persistência via Supabase | Estado local instantâneo + sincronização assíncrona com o banco |
| Sistema de traduções separado (`translations/`) | Mapas `EN` separados dos dados em PT; fallback automático para PT se a chave EN não existir |
| Temas via `THEMES` record em `settingsStore` | Cada tema expõe `bg, surface, accent, text, subtext, border` — todos os componentes consomem o mesmo objeto |

---

## Funcionalidades

### Personagem
- ✅ Criação guiada em 5 passos (nome → raça → classe → atributos → revisão)
- ✅ 9 raças com bônus e traços (Humano, Elfo, Anão, Halfling, Gnomo, Meio-Elfo, Draconato, Tiefling, Meio-Orc)
- ✅ 12 classes com dados de vida, spell slots e progressão de features (1–20)
- ✅ Rolagem de atributos pelo método **4d6 descarta o menor**
- ✅ Modificadores calculados automaticamente para todos os 6 atributos

### Combate e Descanso
- ✅ HP com botões de dano/cura (±1 / ±5) e barra de cor dinâmica
- ✅ **Descanso Curto** — gasta Dados de Vida para recuperar HP
- ✅ **Descanso Longo** — recupera HP total, todos os spell slots e reseta Dados de Vida usados
- ✅ **Level Up** — rolagem automática do dado de vida + modificador de Constituição

### Magias
- ✅ ~180 magias (cantrips ao 9º nível) com nome, descrição e dano
- ✅ Grimório com **limites oficiais** de truques e magias conhecidos por nível/classe
- ✅ Rolagem de dano automática ao conjurar (resultado exibido por 4 segundos)
- ✅ Truques escaláveis nos níveis 5, 11 e 17 do personagem
- ✅ Spell slots consumidos e exibidos em tempo real (pontos coloridos por grupo)

### Features & Traços
- ✅ Árvore completa de features para todas as 12 classes (níveis 1–20)
- ✅ Subclasses: todos os colégios de Bardo, domínios de Clérigo, juramentos de Paladino, caminhos de Bárbaro, conclaves de Patrulheiro, arquétipos de Ladino, linhagens de Feiticeiro, patronos de Bruxo, tradições de Mago e círculos de Druida
- ✅ Invocações Eldritch, Metamagias, Favored Enemies e Fighting Styles

### Configurações e UI
- ✅ **3 temas**: Escuro (`dark`), Sépia (`sepia`), Abismo (`abyss`)
- ✅ **2 idiomas**: Português (`pt`) e Inglês (`en`) — toda a UI, nomes e descrições de magias e features traduzidos
- ✅ **2 sistemas de unidades**: Métrico e Imperial
- ✅ Compartilhar ficha como texto plano (WhatsApp, Discord, etc.)
- ✅ Deleção de personagem com confirmação

---

## Como usar — Guia do Jogador

### Criando um personagem

1. Na tela inicial toque em **"+ Novo Personagem"**
2. **Nome** → escreva o nome do personagem
3. **Raça** → escolha entre 9 raças; cada uma exibe os bônus de atributos que concede
4. **Classe** → escolha entre 12 classes; o dado de vida e as features são exibidos
5. **Atributos**:
   - Toque em **"Rolar Dados"** para gerar 6 valores
   - Toque num **dado** (dourado) para selecioná-lo
   - Toque num **atributo** (Força, Destreza…) para atribuir
   - Você pode re-atribuir a qualquer momento antes de confirmar
6. **Revisão** → confira tudo e toque em **"Criar Personagem"**

---

### Usando a ficha

#### HP (Pontos de Vida)
| Ação | Botão |
|---|---|
| Aplicar dano | **− 1** / **− 5** |
| Curar | **+ 1** / **+ 5** |

A barra muda de cor: ��� saudável → ��� ferido → ��� crítico.

#### Magias
- A seção **Magias** exibe truques e magias organizados por nível de slot
- Cada linha mostra o nome e o dano (ex: `��� 8d6 fogo`)
- **Toque na magia** para conjurar — o slot é consumido automaticamente
- O resultado da rolagem aparece por 4 segundos (ex: `24 [3+6+5+4+6] fogo`)
- Magias ficam acinzentadas quando não há slots disponíveis

#### Gerenciar Grimório
- Toque em **"��� Gerenciar Grimório"**
- Toque numa magia para adicioná-la ou removê-la
- O app impede ultrapassar os limites oficiais de truques e magias conhecidos

#### Features & Traços
- A aba **Traços** exibe todas as features desbloqueadas pelo nível e subclasse do personagem
- Toque numa feature para ver a descrição completa

#### Descanso Curto ���
- Toque em **"��� Descanso Curto"**
- Escolha quantos **Dados de Vida** gastar (máximo = nível do personagem)
- Cada dado rola e recupera HP igual ao resultado + modificador de Constituição
- Dados de Vida gastos são rastreados e recuperados no Descanso Longo

#### Outras ações
| Ação | Efeito |
|---|---|
| ��� **Descanso Longo** | Recupera HP total + todos os spell slots + reseta Dados de Vida usados |
| ⬆️ **Level Up** | Avança um nível; HP aumenta com rolagem do dado de vida + mod. CON |
| ��� **Compartilhar** | Gera resumo em texto para enviar no WhatsApp, Discord, etc. |
| ⚙️ **Configurações** | Altera tema, idioma e sistema de unidades |
| ���️ **Deletar** | Remove o personagem permanentemente (pede confirmação) |

---

## Magias com rolagem automática

| Categoria | Exemplos |
|---|---|
| Truques escaláveis | Fire Bolt, Ray of Frost, Eldritch Blast, Sacred Flame, Chill Touch |
| Nível 1 | Magic Missile, Burning Hands, Thunderwave, Inflict Wounds |
| Nível 2 | Shatter, Scorching Ray, Moonbeam, Spiritual Weapon |
| Nível 3 | Fireball, Lightning Bolt, Call Lightning, Spirit Guardians |
| Nível 4 | Blight, Ice Storm |
| Nível 5 | Cone of Cold |
| Nível 6–9 | Sunbeam, Fire Storm, Incendiary Cloud e outras |

> **Truques escaláveis**: duplicam os dados de dano nos níveis 5, 11 e 17 do personagem, seguindo as regras oficiais do D&D 5e.

---

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: descrição da feature"`
4. Push e abra um Pull Request

---

## Licença

Projeto privado — todos os direitos reservados.  