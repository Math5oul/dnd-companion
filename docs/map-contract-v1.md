# Contrato de Integracao com Mapa (v1)

Este documento define o payload inicial para integracao entre a ficha e o app de mapa.

## Status atual

- Contrato tecnico implementado no core da ficha.
- Bundle v1 disponivel via store para consumo externo.
- App de mapa ainda nao esta em implementacao neste repositorio.

## Objetivo

Entregar um bundle unico com tres blocos:

- CharacterSnapshot
- TurnStateSnapshot
- ActionCatalog

## Origem dos dados

- CharacterSnapshot: derivado de Character + calculos efetivos
- TurnStateSnapshot: derivado de TurnState
- ActionCatalog: derivado de buildCombatActions

Builder de referencia:

- src/lib/mapContract.ts

Tipos de referencia:

- src/types/mapContract.ts

Pontos de acesso no store:

- src/store/characterStore.ts#getMapContractBundle(characterId)
- src/store/characterStore.ts#getActiveMapContractBundle()

## Estrutura

```ts
interface MapContractBundle {
  version: 'v1';
  generatedAt: string;
  character: CharacterSnapshot;
  turn: TurnStateSnapshot | null;
  actionCatalog: ActionCatalogItem[];
}
```

## Notas de versao

- version fixa em v1 para permitir evolucao sem quebrar consumidores.
- Campos de position ainda opcionais e atualmente null por padrao.
- O contrato e gerado como snapshot e nao faz sincronizacao em tempo real por websocket nesta versao.

## Eventos recomendados

Eventos de dominio para sincronizacao futura:

- turn.started
- action.used
- movement.spent
- condition.applied

## Proximos passos

1. Integrar emissao/eventos do MapContractBundle no fluxo de turno.
2. Incluir posicao real (x, y, z) no estado de combate.
3. Adicionar validacao de schema no consumidor do mapa.
4. Evoluir para v2 com metadados de encounter e sincronizacao incremental.
