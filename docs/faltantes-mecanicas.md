# Faltantes Mecânicos e Prontidão para Companion Completo

Este documento é o backlog funcional do projeto.

Referência complementar:
- `docs/traits-nao-implementados.md` (inventário completo, automático, de IDs sem mapeamento direto em `featureEffects`).

## Premissas

- Nem todo trait sem chave em `featureEffects` é falha: muitas entradas são estruturais (ex.: wrappers de escolha, progressão de spells/slots, ASI/feats).
- O critério aqui é funcional: o que ainda falta para experiência completa de mesa.

## Pendências por Classe

### Barbarian
- Consolidar seleção de Caminho Primitivo e garantir vínculo com features de nível 6/10/14.
- Cobrir passivas não refletidas explicitamente no fluxo (ex.: Danger Sense, Feral Instinct, Relentless Rage).
- Revisar stack completo de Brutal Critical e Primal Champion em cálculos e UI.

### Bard
- Completar efeitos de suporte/controle fora de dano simples (Countercharm, Font of Inspiration nuances).
- Evoluir seleção e aplicação de Magical Secrets com validação por nível/lista.
- Revisar passivas e upgrades de Bardic Inspiration por tier.

### Cleric
- Implementar escolhas de Domínio com efeitos derivados por nível (2/6/8/17).
- Expandir Destroy Undead e Divine Intervention para lógica rastreável.
- Cobrir passivas e bônus condicionais por domínio no painel de combate/checks.

### Druid
- Implementar ciclos de Círculo (Land/Moon/etc.) com escolhas persistentes.
- Melhorar Wild Shape (restrições por nível, swim/fly unlocks, estatísticas de forma).
- Cobrir Beast Spells/Archdruid e interações de conjuração em forma.

### Fighter
- Fechar todos os Fighting Styles com impacto explícito no combat builder.
- Estruturar arquétipos (Champion/BM/EK etc.) com recursos e recargas.
- Refinar Indomitable e Extra Attack progressivo para múltiplas ações/ataques.

### Monk
- Cobrir tradição escolhida (6/11/17) com efeitos e consumo de ki detalhado.
- Revisar passivas de defesa/mobilidade (Evasion, Purity, Diamond Soul, Empty Body).
- Melhorar gerenciamento de recursos do monge por descanso e por turno.

### Paladin
- Consolidar estilos de luta e passivas gerais (Divine Health, Aura upgrades).
- Expandir features de juramento com efeitos contextuais e duração.
- Cobrir capstone de juramento com estado temporário rastreável.

### Ranger
- Completar escolhas estruturais: Archetype + features 7/11/15.
- Fechar Favored Enemy / Natural Explorer com múltiplas seleções e efeitos contextuais.
- Revisar conclaves que dependem de companheiro e ações indiretas.

### Rogue
- Completar árvore do arquétipo (3/9/13/17) com persistência de escolha.
- Refinar regras contextuais de Sneak Attack (estado, alvo, vantagem, adjacência).
- Cobrir passivas utilitárias fora de combate (Thieves' Cant, infiltração, investigação avançada).

### Sorcerer
- Classe com maior gap atual: origem completa + features 6/14/18.
- Expandir metamagia além do dano (alvo, alcance, duração, salvaguarda).
- Cobrir Sorcerous Restoration e regras completas de resource economy.

### Warlock
- Consolidar consistência entre Patron/Boon/Invocations por nível e pré-requisitos.
- Completar Mystic Arcanum e efeitos de invocações com gating por pacto/nível.
- Revisar capstones e passivas de patrono com estado persistente.

### Wizard
- Implementar escolas arcanas com features por tier (2/6/10/14).
- Cobrir Arcane Recovery, Spell Mastery e Signature Spells com regras completas.
- Expandir passivas de escola que alteram dano, custo, preparação e utilidade.

## Lista de Traits Ainda Não Implementados (Direto em featureEffects)

Lista completa por ID/classe:
- `docs/traits-nao-implementados.md`

Resumo atual (IDs sem mapeamento direto):
- barbarian: 61
- bard: 65
- cleric: 67
- druid: 61
- fighter: 78
- monk: 67
- paladin: 57
- ranger: 101
- rogue: 46
- sorcerer: 117
- warlock: 106
- wizard: 63

## Pendências para Companion Completo (Integração com Mapa)

### Estado de combate para engine de mapa
- Expor estado normalizado de turno por personagem (ação, bônus, reação, movimento restante, condições, concentração).
- Expor ações executáveis com metadados de alcance, tipo de alvo, custo e restrições.
- Expor efeitos ativos com duração/expiração por rodada e vínculo de origem.

### Deslocamento e posicionamento
- Modelo de posição (x,y,z), velocidade por tipo (andar, voar, nadar, escalar) e modificadores temporários.
- Regras de oportunidade/engajamento baseadas em adjacência e ameaça.
- Custos de terreno difícil, obstáculos e efeitos de zona.

### Linha de visão e alcance
- Cálculo determinístico de alcance em grid/medida contínua.
- Integração com cobertura (meia, três-quartos, total).
- Estados de visibilidade (invisível, obscurecido, percepção especial).

### Interação entre jogadores
- Sincronização em tempo real (host ou backend) para ordem de turno, ações e rolagens.
- Estratégia de resolução de conflito (lock otimista/pessimista por turno/ação).
- Log de combate auditável (quem fez o que, quando, com qual resultado).

### APIs de integração (app consumidor do mapa)
- Contrato estável para leitura de ficha/combate (`CharacterSnapshot`, `TurnState`, `ActionCatalog`).
- Eventos de domínio (`turn.started`, `action.used`, `condition.applied`, `movement.spent`).
- Versionamento de schema para compatibilidade entre apps.

### UX e segurança de regra
- Validação de regra em tempo de execução (bloquear ações inválidas por recurso/alcance).
- Indicadores visuais de estados pendentes (escolha de feature, recurso não gasto, efeito expirado).
- Modo árbitro/DM para ajustes manuais com trilha de auditoria.

## Prioridade de Execução (P0, P1, P2)

### P0 (núcleo jogável com mapa)

Status atualizado em 2026-06-01:

- [x] Contrato mínimo companion <-> mapa definido e disponível no core:
	- `CharacterSnapshot`.
	- `TurnStateSnapshot`.
	- `ActionCatalog`.

- [~] Modelo de deslocamento base parcialmente concluído:
	- [x] posição `x,y,z` em personagem/turno.
	- [x] gasto de movimento com suporte a terreno difícil.
	- [ ] velocidade por tipo (andar/voar/nadar/escalar) ainda pendente.

- [~] Validação crítica em runtime parcialmente concluída:
	- [x] bloqueio por recurso disponível (ação/bônus/reação/uso).
	- [x] bloqueio por economia de turno.
	- [ ] bloqueio por alcance/LOS no motor tático ainda pendente.

- [ ] Eventos essenciais de combate ainda pendentes no contrato runtime:
	- `turn.started`.
	- `movement.spent`.
	- `action.used`.
	- `condition.applied`.

Falta para fechar P0:

1. Completar velocidade por tipo no estado tático (`walk/fly/swim/climb`) com consumo correto.
2. Implementar validação de alcance/linha de visão no fluxo de execução de ações.
3. Emitir eventos de domínio do combate para sincronização externa (mapa).
4. Validar integração ponta a ponta do bundle v1 com um consumidor de mapa (mesmo que mock).

### P1 (consistência tática e expansão de classes)
- Adicionar linha de visão e cobertura (meia, três-quartos, total).
- Implementar regras de oportunidade/ameaça por adjacência.
- Fechar classes com maior impacto no combate atual:
	- Sorcerer (origens + metamagia avançada).
	- Warlock (pactos/invocações com pré-requisito).
	- Ranger (archetype e escolhas estruturais).
- Melhorar rastreio de efeitos por duração e origem.

### P2 (completude de companion e qualidade de mesa)
- Completar passivas e capstones restantes por classe.
- Implementar modo árbitro/DM com edição assistida e auditoria completa.
- Adicionar resolução robusta de conflito multiplayer (locks + reconciliação).
- Criar suíte de testes de regressão por regra (movimento, ação, reação, concentração, condições).

## Marco de entrega sugerido

- M1: P0 completo e integração funcional com mapa em combate básico.
- M2: P1 completo com tática avançada e classes críticas estabilizadas.
- M3: P2 completo com experiência de mesa madura e cobertura ampla de regras.
