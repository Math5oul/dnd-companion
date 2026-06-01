# ⚔️ D&D Companion

Aplicativo **mobile e web** para acompanhar personagens de Dungeons & Dragons 5ª Edição.  
Construído com Expo + React Native, Zustand e Supabase — funciona no navegador, Android e iOS.

🚀 **Deploy**: https://dnd-companion-ivory.vercel.app

---

## Índice

- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e execução](#configuração-e-execução)
- [Deploy](#deploy)
- [Decisões de arquitetura](#decisões-de-arquitetura)
- [Funcionalidades](#funcionalidades)
- [Guia do Jogador](#guia-do-jogador)
- [Status de Implementação e Backlog](#status-de-implementação-e-backlog)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) SDK ~54 + React Native 0.81 |
| Roteamento | [expo-router](https://expo.github.io/router) v6 (file-based) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs/) v5 |
| Backend / banco | [Supabase](https://supabase.com) (PostgreSQL + REST API) |
| Linguagem | TypeScript ~5.9 |
| Web | React Native Web + react-dom 19 |
| Deploy | [Vercel](https://vercel.com) |

---

## Estrutura de pastas

```
app/
├── _layout.tsx                   # Layout raiz — tema, GestureHandler, TabBar
├── index.tsx                     # Lista de personagens
├── create/
│   ├── step1-name.tsx
│   ├── step2-race.tsx
│   ├── step3-class.tsx
│   ├── step4-abilities.tsx
│   └── step5-review.tsx
└── character/
    ├── [id].tsx                  # Ficha completa do personagem
    └── spells/
        └── [id].tsx              # Gerenciador de grimório

src/
├── components/
│   ├── CombatPanel.tsx           # Painel de combate unificado (armas, traits, consumíveis)
│   ├── ConfirmModal.tsx
│   ├── EquipmentModal.tsx
│   ├── LevelUpModal.tsx
│   ├── SettingsModal.tsx
│   ├── ShortRestModal.tsx
│   └── TabBar.tsx
├── data/
│   ├── classes.ts                # 12 classes com spell slots e progressão 1–20
│   ├── classFeatures.ts          # Árvore de features/subclasses por classe e nível
│   ├── defaultEquipment.ts       # Catálogo com 35+ itens prontos
│   ├── featureEffects.ts         # Ações de combate geradas por features
│   ├── races.ts                  # 9 raças com bônus e traços
│   ├── skills.ts                 # 18 perícias com proficiência e expertise
│   └── spells.ts                 # ~180 magias (cantrip ao nível 9)
├── lib/
│   ├── buildCombatActions.ts     # Constrói CombatAction[] a partir do Character
│   ├── dice.ts                   # rollDie, rollDamage, getModifier, formatModifier
│   ├── i18n.ts                   # Hook useI18n → { t, language, units }
│   ├── metamagic.ts              # Utilitários de metamagia e spell attack bonus
│   ├── supabase.ts               # Cliente Supabase (SecureStore / localStorage)
│   ├── units.ts                  # Conversão de unidades e tipos de dano/alcance
│   └── translations/
│       ├── features.ts
│       ├── index.ts
│       └── spells.ts
├── store/
│   ├── characterStore.ts         # CRUD + todas as ações de jogo
│   ├── settingsStore.ts          # Tema (5), idioma (2), unidades (2)
│   └── tabStore.ts
└── types/
    ├── character.ts
    ├── combatAction.ts           # CombatAction, CombatModifier, MetamagicOption, AdvDis
    ├── equipment.ts
    └── featureEffect.ts

supabase/
└── schema.sql
```

---

## Pré-requisitos

- **Node.js** 18+
- **npm** 9+
- Conta no [Supabase](https://supabase.com) (plano gratuito é suficiente)
- **Expo Go** no celular — opcional

---

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase

Crie `.env.local` na raiz:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

Execute `supabase/schema.sql` no SQL Editor do Supabase.

### 3. Executar

```bash
npm run web        # navegador
npm run android    # Android via Expo Go
npm run ios        # iOS via Expo Go
npm start          # QR code para qualquer plataforma
```

---

## Deploy

```bash
npx expo export --platform web
vercel dist --prod
```

---

## Decisões de arquitetura

| Decisão | Motivo |
|---|---|
| `ConfirmModal` em vez de `Alert.alert` | `Alert.alert` é no-op no browser |
| `expo-secure-store` / `localStorage` | Detectado via `Platform.OS`; Supabase adapta o storage automaticamente |
| Seleção de dados por **índice** | Evita conflitos ao distribuir atributos com valores iguais |
| `activeEffects` para poções de stat | Bônus sobrevivem à remoção do item do inventário |
| Pesos em lbs internamente | D&D 5e usa libras; UI converte para kg se métrico |
| Zustand + Supabase | Estado local instantâneo + sincronização assíncrona com o banco |
| Temas via `THEMES` record | Cada tema expõe `bg, surface, accent, text, subtext, border` |
| `buildCombatActions` separado | Gera `CombatAction[]` de forma pura; fácil de testar e extender |
| `metamagic.ts` como utilitário puro | Funções puras: `spellAttackBonus`, `spellSaveDC`, `applyMetamagicToDamage`, `detectMetamagic` |

---

## Funcionalidades

### Personagem
- ✅ Criação guiada em 5 passos (nome → raça → classe → atributos → revisão)
- ✅ 9 raças com bônus e traços
- ✅ 12 classes com dados de vida, spell slots e progressão de features (níveis 1–20)
- ✅ Rolagem de atributos pelo método **4d6 descarta o menor**
- ✅ Cards de personagem com todos os 6 atributos, HP, AC e ouro

### Combate
- ✅ **Painel de Combate Unificado** (gaveta colapsável) com 3 grupos:
  - ⚔️ **Ataques de Armas** — armas equipadas com bônus e dano calculados automaticamente
  - ⚡ **Ações de Trait** — ações geradas por features (Ataque Furioso, Divine Smite, etc.)
  - 🧪 **Consumíveis** — itens ativados com cargas restantes
- ✅ Toggle **ADV / Normal / DIS** por ação — rola 2d20 e toma o maior ou menor
- ✅ Modificadores colapsáveis (Fighting Styles, Dueling, Great Weapon Fighting…)
- ✅ Acerto Crítico (20 natural) — dobra dados de dano automaticamente
- ✅ Pips de uso para ações de feature e cargas de consumíveis

### HP e Descanso
- ✅ HP com botões ±1/±5 e barra de cor dinâmica (verde → laranja → vermelho)
- ✅ **Descanso Curto** — gasta Dados de Vida para recuperar HP
- ✅ **Descanso Longo** — recupera HP total, spell slots, Dados de Vida e limpa efeitos temporários
- ✅ **Level Up** — rolagem automática de HP com dado de vida + mod. CON

### Magias
- ✅ ~180 magias (cantrips ao 9º nível) com nome, descrição e dano
- ✅ Grimório com limites oficiais de truques e magias conhecidos
- ✅ Truques escaláveis nos níveis 5, 11 e 17
- ✅ Spell slots consumidos em tempo real com pontos coloridos
- ✅ **Upcast** — magias de nível inferior nos slots superiores com dano ampliado
- ✅ Toggle **ADV / Normal / DIS** por magia de ataque
- ✅ Bônus de spell attack e CD de resistência calculados automaticamente
- ✅ **Metamagia** (Feiticeiro) — chips selecionáveis por magia com custo em SP:
  Acelerada, Geminada, Potencializada, Intensificada, Procurante, Cuidadosa, Distante, Estendida, Sutil, Transmutada
- ✅ Bônus de traits: **Evocação Potencializada** (+INT), **Explosão Agonizante** (+CHA)
- ✅ Pontos de Feitiçaria com Flexible Casting (slots ↔ pontos)

### Features & Traços
- ✅ Árvore completa de features para todas as 12 classes (níveis 1–20)
- ✅ Subclasses de todas as classes
- ✅ Feats (ASI): Atleta, Sortudo, Alerta, Tough, War Caster, Mobile, Sentinel…
- ✅ **ASI Inline Editor** — distribui pontos de atributo diretamente na ficha
- ✅ **Seleção de Perícias** por feature (Primal Knowledge, Expertise de Bardo/Ladino)
- ✅ Invocações Eldritch, Metamagias selecionáveis, Fighting Styles

### Equipamentos e Inventário
- ✅ Duas gavetas: ⚔️ Equipamentos (equipados) e 🎒 Inventário (não equipados + consumíveis)
- ✅ Catálogo com 35+ itens: armas, armaduras (couro → placas), escudos, acessórios mágicos
- ✅ Consumíveis com cargas; poções de status com `activeEffects`
- ✅ Peso de cada item; carga atual vs. capacidade (STR × 15) com cor dinâmica
- ✅ 13 tipos de dano como picklist, traduzidos PT/EN
- ✅ Bônus de AC e atributos aplicados automaticamente ao equipar

### Perícias
- ✅ 18 perícias com rolagem integrada (d20 + modificador)
- ✅ Toggle de proficiência e expertise
- ✅ Gaveta colapsável

### Interface e Configurações
- ✅ **5 temas**: Escuro, Sépia, Abismo, Necro, Onyx
- ✅ **2 idiomas**: Português e Inglês — UI, magias e features completamente traduzidos
- ✅ **2 sistemas de unidades**: Métrico e Imperial
- ✅ Gavetas colapsáveis para Magias, Combate, Equipamentos, Inventário, Traits e Perícias (fechadas por padrão)
- ✅ Compartilhar ficha como texto plano (WhatsApp, Discord, etc.)

---

## Guia do Jogador

### Criando um personagem

1. Toque em **"+ Novo Personagem"**
2. **Nome** → **Raça** → **Classe**
3. **Atributos**: toque em "Rolar Dados" → selecione um dado → toque num atributo para atribuir
4. **Revisão** → **"Criar Personagem"**

### Painel de Combate

- Abra a gaveta **⚔️ Combate**
- Toggle **◈ Normal / ▲ ADV / ▼ DIS** para alterar o tipo de rolagem
- Expanda **▶ N modificadores** para ver quais estão ativos
- **🎲 Rolar** — resultado por 6 segundos; **💥 CRIT!** em dourado dobra os dados

### Magias com Metamagia (Feiticeiro)

1. Abra a gaveta **Magias**
2. Chips de metamagia aparecem abaixo de cada magia com custo em SP
3. Selecione os chips desejados (inacessíveis ficam transparentes)
4. **⚔️ Atacar / Conjurar** — SP consumidos automaticamente

### Descansos

| Ação | Efeito |
|---|---|
| ☀️ Descanso Curto | Rola Dados de Vida para recuperar HP |
| 🌙 Descanso Longo | HP total + todos os slots + reseta efeitos temporários |
| ⬆️ Level Up | Avança nível com rolagem de HP |
| 📤 Compartilhar | Resumo em texto para WhatsApp/Discord |

### Equipamentos

- 🎒 **Inventário** → **"+ Adicionar Item"** → catálogo ou manual
- Toque no ícone de equipar para mover para ⚔️ **Equipamentos**
- Consumíveis: **"🧪 Beber/Usar"** para ativar (aparece no Painel de Combate)

---

## Banco de dados

Colunas principais da tabela `characters`:

```
id              UUID PRIMARY KEY
name, className, level, hp, maxHp
abilityScores   JSONB   -- { strength, dexterity, constitution, intelligence, wisdom, charisma }
spellSlots      JSONB   -- { 1: { total, used }, ... }
spells          JSONB   -- string[] (IDs das magias)
traits          JSONB   -- string[] (IDs das features)
equipment       JSONB   -- Equipment[]
actionUses      JSONB   -- Record<actionId, usesRemaining>
featureChoices  JSONB   -- Record<featureId, skillId[]>
gold            NUMERIC
```

Execute `supabase/schema.sql` para criar ou migrar.

---

## Status de Implementação e Backlog

### Relatórios de cobertura

- `docs/traits-nao-implementados.md` — inventário completo de IDs de traits sem mapeamento direto em `src/data/featureEffects.ts`.
- `docs/faltantes-mecanicas.md` — backlog funcional por classe + pendências para companion completo.

### Como interpretar

- Nem todo ID ausente em `featureEffects` é bug: vários são estruturais (escolhas, ASI, progressão de slot, marcadores de nível).
- Para priorização prática, use o backlog funcional em `docs/faltantes-mecanicas.md`.

### Regenerar inventário de traits sem mapeamento direto

```bash
node <<'NODE'
const fs=require('fs');
const cf=fs.readFileSync('src/data/classFeatures.ts','utf8');
const ff=fs.readFileSync('src/data/featureEffects.ts','utf8');
const classBlockRe=/^\s{2}([a-z_]+):\s*\[(.*?)^\s{2}\],/gms;
const blocks=[]; let m;
while((m=classBlockRe.exec(cf))) blocks.push({cls:m[1],body:m[2]});
const mapped=new Set([...ff.matchAll(/^\s{2}([a-z0-9_]+):\s*\{/gm)].map(x=>x[1]));
const rows=[];
for(const b of blocks){
  const ids=[...b.body.matchAll(/id:\s*'([^']+)'/g)].map(x=>x[1]);
  const uniq=[...new Set(ids)];
  const missing=uniq.filter(id=>mapped.has(id)===false).sort();
  rows.push({cls:b.cls,total:uniq.length,missingCount:missing.length,missing});
}
const lines=[];
lines.push('# Traits sem implementação direta em featureEffects');
lines.push('');
lines.push('Gerado automaticamente comparando IDs de classFeatures com chaves de featureEffects.');
lines.push('');
lines.push('| Classe | IDs totais | Sem mapeamento direto |');
lines.push('|---|---:|---:|');
rows.forEach(r=>lines.push(`| ${r.cls} | ${r.total} | ${r.missingCount} |`));
lines.push('');
for(const r of rows){
  lines.push(`## ${r.cls}`);
  lines.push('');
  r.missing.forEach(id=>lines.push(`- \`${id}\``));
  lines.push('');
}
fs.writeFileSync('docs/traits-nao-implementados.md', lines.join('\n'));
NODE
```

---

## Contribuindo

1. Fork o repositório
2. `git checkout -b feat/minha-feature`
3. `git commit -m "feat: descrição"`
4. Abra um Pull Request

---

## Licença

Projeto privado — todos os direitos reservados.
