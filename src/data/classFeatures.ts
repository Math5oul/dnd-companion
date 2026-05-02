export interface TraitOption {
  id: string;
  name: string;
  description: string;
}

export interface ClassFeature {
  id: string;
  name: string;
  description: string;
  /** 'auto' = granted automatically; 'choice' = player picks one option */
  type: 'auto' | 'choice';
  options?: TraitOption[];
  /** Skill IDs available to pick. Empty array = any proficient skill (for expertise). */
  pickSkills?: string[];
  /** How many skills to pick (default 1) */
  pickCount?: number;
  /** 'proficiency' = grants new proficiency; 'expertise' = doubles existing proficiency */
  pickType?: 'proficiency' | 'expertise';
}

export interface LevelFeatures {
  level: number;
  features: ClassFeature[];
}

export const CLASS_FEATURES: Record<string, LevelFeatures[]> = {
  // ─────────────── BARBARIAN ───────────────
  barbarian: [
    {
      level: 1,
      features: [
        {
          id: 'barbarian_rage',
          name: 'Fúria (2/descanso longo)',
          description: 'Ação bônus para entrar em fúria. Durante a fúria: vantagem em testes de Força, resistência a dano contundente/cortante/perfurante e +2 de dano corpo-a-corpo. Dura 1 minuto. Usos aumentam com o nível.',
          type: 'auto',
        },
        {
          id: 'barbarian_unarmored_defense',
          name: 'Defesa Sem Armadura',
          description: 'Sem armadura, sua CA = 10 + mod. Destreza + mod. Constituição.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'barbarian_reckless_attack',
          name: 'Ataque Imprudente',
          description: 'No primeiro ataque do turno, você pode atacar com vantagem. Até o início do próximo turno, ataques contra você também têm vantagem.',
          type: 'auto',
        },
        {
          id: 'barbarian_danger_sense',
          name: 'Sentido de Perigo',
          description: 'Vantagem em jogadas de resistência de Destreza contra efeitos que você possa ver (armadilhas, magias, etc.), desde que não esteja incapacitado.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'barbarian_primal_path',
          name: 'Caminho Primitivo',
          description: 'Escolha o arquétipo que define sua fúria. Você ganha features do caminho nos níveis 3, 6, 10 e 14.',
          type: 'choice',
          options: [
            { id: 'path_berserker', name: 'Berserker', description: 'Fúria em violência pura. Frenesi: ataques de bônus em fúria; Presença Intimidadora; sem cansaço exaustivo no nível 10.' },
            { id: 'path_totem', name: 'Guerreiro Totêmico', description: 'Vínculo espiritual com um animal (Urso, Águia ou Lobo). Poderes totêmicos nos níveis 3, 6 e 10.' },
            { id: 'path_zealot', name: 'Zelota', description: 'Fervor divino. Armas Sagradas: dano radiante/necrótico em fúria. Presença Divina. Ressurreição gratuita no nível 14.' },
            { id: 'path_storm_herald', name: 'Arauto da Tempestade', description: 'Aura de tempestade em fúria: Ártico (gelo), Deserto (fogo) ou Mar (raio). Melhora com o nível.' },
            { id: 'path_ancestral_guardian', name: 'Guardião Ancestral', description: 'Espíritos ancestrais dificultam inimigos que atacam aliados. Invoca espíritos para proteger o grupo.' },
            { id: 'path_wild_magic', name: 'Magia Selvagem', description: 'A fúria desencadeia surtos mágicos aleatórios. Ganha pontos de ki e magias com a fúria.' },
          ],
        },
        {
          id: 'barbarian_primal_knowledge',
          name: 'Conhecimento Primitivo',
          description: 'Você ganha proficiência em uma habilidade à sua escolha: Lidar com Animais, Atletismo, Intimidação, Natureza, Percepção ou Sobrevivência.',
          type: 'auto',
          pickSkills: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
          pickCount: 1,
          pickType: 'proficiency',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'barbarian_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'barb_asi4_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'barb_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'barb_asi4_str1con1', name: '+1 Força / +1 Constituição', description: 'Aumenta Força e Constituição em 1 cada.' },
            { id: 'barb_asi4_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × seu nível atual e +2 por nível futuro.' },
            { id: 'barb_asi4_feat_grappler', name: 'Talento: Lutador', description: 'Vantagem em ataques contra criaturas que você está agarrando; pode usar ação para imobilizá-la.' },
            { id: 'barb_asi4_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0; pode atacar quem ataca aliados adjacentes.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'barbarian_extra_attack',
          name: 'Ataque Extra',
          description: 'Você pode atacar duas vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
        {
          id: 'barbarian_fast_movement',
          name: 'Movimento Acelerado',
          description: 'Seu deslocamento aumenta em 3 metros (10 pés) enquanto você não usa armadura pesada.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'barbarian_path_feature_6',
          name: 'Feature do Caminho Primitivo (Nível 6)',
          description: 'Você ganha a segunda feature do Caminho Primitivo escolhido no nível 3. (Berserker: Presença Intimidadora | Totêmico: Aspecto Totêmico | Zelota: Guerreiro de Deus | Arauto: Aura Aprimorada | etc.)',
          type: 'auto',
        },
        {
          id: 'barbarian_rage_3',
          name: 'Fúria (3/descanso longo)',
          description: 'Você agora tem 3 usos de Fúria por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'barbarian_feral_instinct',
          name: 'Instinto Selvagem',
          description: 'Vantagem nas jogadas de iniciativa. Se for surpreendido no início do combate, pode entrar em fúria e agir normalmente no primeiro turno.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'barbarian_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'barb_asi8_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'barb_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'barb_asi8_str1con1', name: '+1 Força / +1 Constituição', description: 'Aumenta Força e Constituição em 1 cada.' },
            { id: 'barb_asi8_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
            { id: 'barb_asi8_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano; ataque bônus após crítico ou matar.' },
            { id: 'barb_asi8_feat_polearm', name: 'Talento: Mestre de Armas de Haste', description: 'Ataque de bônus com a extremidade da arma; ataques de oportunidade ao entrar em alcance.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'barbarian_brutal_critical_1',
          name: 'Crítico Brutal (1 dado)',
          description: 'Em um ataque crítico corpo-a-corpo, role um dado de dano da arma adicional ao calcular o dano extra.',
          type: 'auto',
        },
        {
          id: 'barbarian_rage_bonus_3',
          name: 'Bônus de Fúria +3',
          description: 'O bônus de dano durante a Fúria aumenta para +3.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'barbarian_path_feature_10',
          name: 'Feature do Caminho Primitivo (Nível 10)',
          description: 'Você ganha a terceira feature do Caminho Primitivo. (Berserker: Intimidação Assustadora | Totêmico: Caminhante Totêmico | Zelota: Proteção Zelota | Arauto: Escudo Elemental | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'barbarian_relentless_rage',
          name: 'Fúria Implacável',
          description: 'Se cair a 0 HP enquanto em fúria, faça um teste de Constituição (CD 10, +5 por uso anterior). Se passar, cai a 1 HP.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'barbarian_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'barb_asi12_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'barb_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'barb_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'barb_asi12_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
            { id: 'barb_asi12_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido; sem vantagem de criaturas ocultas.' },
            { id: 'barb_asi12_feat_athlete', name: 'Talento: Atleta', description: '+1 Força ou Destreza; levantar sem custo de movimento; escalar sem penalidade.' },
          ],
        },
        {
          id: 'barbarian_rage_4',
          name: 'Fúria (4/descanso longo)',
          description: 'Você agora tem 4 usos de Fúria por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'barbarian_brutal_critical_2',
          name: 'Crítico Brutal (2 dados)',
          description: 'Em um ataque crítico corpo-a-corpo, role dois dados de dano adicionais (em vez de um).',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'barbarian_path_feature_14',
          name: 'Feature do Caminho Primitivo (Nível 14)',
          description: 'Você ganha a quarta e última feature do Caminho Primitivo. (Berserker: Presença Assassina | Totêmico: Comunhão Totêmica | Zelota: Existência Além da Morte | Arauto: Tempestade da Fúria | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'barbarian_persistent_rage',
          name: 'Fúria Persistente',
          description: 'Sua fúria só termina antecipadamente se você ficar inconsciente. Não termina mais por falta de ação/ataque.',
          type: 'auto',
        },
        {
          id: 'barbarian_rage_bonus_4',
          name: 'Bônus de Fúria +4',
          description: 'O bônus de dano durante a Fúria aumenta para +4.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'barbarian_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'barb_asi16_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'barb_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'barb_asi16_str1con1', name: '+1 Força / +1 Constituição', description: 'Aumenta Força e Constituição em 1 cada.' },
            { id: 'barb_asi16_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano; ataque bônus após crítico.' },
            { id: 'barb_asi16_feat_resilient', name: 'Talento: Resiliente (Sabedoria)', description: '+1 Sabedoria e proficiência em resistência de Sabedoria.' },
            { id: 'barb_asi16_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
        {
          id: 'barbarian_rage_5',
          name: 'Fúria (5/descanso longo)',
          description: 'Você agora tem 5 usos de Fúria por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'barbarian_brutal_critical_3',
          name: 'Crítico Brutal (3 dados)',
          description: 'Em um ataque crítico corpo-a-corpo, role três dados de dano adicionais.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'barbarian_indomitable_might',
          name: 'Força Indomável',
          description: 'Se o resultado de um teste de Força for menor do que sua pontuação de Força, use o valor do atributo em vez do resultado do dado.',
          type: 'auto',
        },
        {
          id: 'barbarian_rage_6',
          name: 'Fúria (6/descanso longo)',
          description: 'Você agora tem 6 usos de Fúria por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'barbarian_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'barb_asi19_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'barb_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'barb_asi19_str1con1', name: '+1 Força / +1 Constituição', description: 'Aumenta Força e Constituição em 1 cada.' },
            { id: 'barb_asi19_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
            { id: 'barb_asi19_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração; pode conjurar como ataque de oportunidade.' },
            { id: 'barb_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte/descanso longo: relance qualquer d20 e escolha qual usar.' },
          ],
        },
        {
          id: 'barbarian_rage_bonus_4b',
          name: 'Bônus de Fúria +4 (confirmado)',
          description: 'O bônus de dano de Fúria permanece em +4 neste nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'barbarian_primal_champion',
          name: 'Campeão Primitivo',
          description: 'Apoteose da força bárbara: sua pontuação de Força aumenta em 4 e sua pontuação de Constituição aumenta em 4. O máximo desses atributos agora é 24.',
          type: 'auto',
        },
        {
          id: 'barbarian_rage_unlimited',
          name: 'Fúria Ilimitada',
          description: 'Você tem usos ilimitados de Fúria.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── BARD ───────────────
  bard: [
    {
      level: 1,
      features: [
        {
          id: 'bard_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Bardo usando Carisma. CD de magia = 8 + bônus de proficiência + mod. Carisma.',
          type: 'auto',
        },
        {
          id: 'bard_bardic_inspiration_d6',
          name: 'Inspiração Bárdica (d6)',
          description: 'Ação bônus: conceda a uma criatura que possa ouvi-lo um dado d6. Ela pode rolar e adicionar o resultado a qualquer teste, ataque ou resistência em 10 minutos. Usos = mod. Carisma/descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'bard_jack_of_all_trades',
          name: 'Pau para Toda Obra',
          description: 'Adicione metade do bônus de proficiência (arredondado para baixo) em qualquer teste de habilidade onde não tem proficiência.',
          type: 'auto',
        },
        {
          id: 'bard_song_of_rest_d6',
          name: 'Canção do Repouso (d6)',
          description: 'Durante descanso curto, você e aliados que ouçam recuperam +1d6 HP ao gastar Dados de Vida.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'bard_college',
          name: 'Colégio Bárdico',
          description: 'Escolha o colégio que define sua arte. Você ganha features do colégio nos níveis 3, 6 e 14.',
          type: 'choice',
          options: [
            { id: 'college_lore', name: 'Colégio do Saber', description: 'Conhecimento profundo. Ganha 3 proficiências de habilidade; Palavras Cortantes impõem desvantagem em inimigos.' },
            { id: 'college_valor', name: 'Colégio do Valor', description: 'Bardo-guerreiro. Proficiência com armas marciais e armaduras médias; Inspiração Bárdica pode ser usada em dano.' },
            { id: 'college_glamour', name: 'Colégio do Glamour', description: 'Magia feérica. Inspiração Glamourosa concede HP temporário; Manto de Inspiração permite movimento aos aliados.' },
            { id: 'college_swords', name: 'Colégio das Espadas', description: 'Artista marcial. Usa Inspiração em Floreios de combate para ataques especiais e manobras.' },
            { id: 'college_whispers', name: 'Colégio dos Sussurros', description: 'Espião e manipulador. Punhal Psíquico causa dano extra; pode roubar a identidade de criaturas mortas.' },
            { id: 'college_creation', name: 'Colégio da Criação', description: 'Cria objetos com a Nota da Criação e anima um Boneco de Desempenho como parceiro.' },
            { id: 'college_eloquence', name: 'Colégio da Eloquência', description: 'Orador magistral. Palavras Perfuantes garantem mínimo 10 em Persuasão/Enganação; sempre distribui Inspiração.' },
          ],
        },
        {
          id: 'bard_expertise',
          name: 'Especialização',
          description: 'Escolha 2 habilidades ou ferramentas com proficiência — seu bônus de proficiência é dobrado para elas.',
          type: 'auto',
          pickSkills: [],
          pickCount: 2,
          pickType: 'expertise',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'bard_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'bard_asi4_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'bard_asi4_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'bard_asi4_cha1dex1', name: '+1 Carisma / +1 Destreza', description: 'Aumenta Carisma e Destreza em 1 cada.' },
            { id: 'bard_asi4_feat_actor', name: 'Talento: Ator', description: '+1 Carisma; vantagem em Enganação/Atuação ao se disfarçar; pode imitar vozes.' },
            { id: 'bard_asi4_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Após 10 min de discurso, até 6 aliados ganham HP temporário = nível + mod. Carisma.' },
            { id: 'bard_asi4_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte: relance qualquer d20 e escolha o resultado.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'bard_bardic_inspiration_d8',
          name: 'Inspiração Bárdica (d8)',
          description: 'Seu dado de Inspiração Bárdica sobe de d6 para d8.',
          type: 'auto',
        },
        {
          id: 'bard_font_of_inspiration',
          name: 'Fonte de Inspiração',
          description: 'Você recupera todos os usos de Inspiração Bárdica ao terminar um descanso curto ou longo (antes só no descanso longo).',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'bard_countercharm',
          name: 'Contra-encanto',
          description: 'Ação: inicie uma performance. Até o fim do turno, aliados em 9 metros têm vantagem em resistências contra ser Enfeitiçado ou Amedrontado.',
          type: 'auto',
        },
        {
          id: 'bard_college_feature_6',
          name: 'Feature do Colégio Bárdico (Nível 6)',
          description: 'Você ganha a segunda feature do Colégio escolhido no nível 3. (Saber: Segredos Mágicos Adicionais | Valor: Ataque Extra | Glamour: Manto de Majestade | Espadas: Estilo de Luta Extra | Sussurros: Manto de Sussurros | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'bard_spells_4th',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível e pode aprender magias de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'bard_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'bard_asi8_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'bard_asi8_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'bard_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'bard_asi8_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração; conjure magias como ataques de oportunidade.' },
            { id: 'bard_asi8_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 Constituição e proficiência em resistência de Constituição.' },
            { id: 'bard_asi8_feat_mobile', name: 'Talento: Ágil', description: '+3m de deslocamento; Dash não provoca oportunidade.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'bard_song_of_rest_d8',
          name: 'Canção do Repouso (d8)',
          description: 'O dado de recuperação durante descanso curto sobe de d6 para d8.',
          type: 'auto',
        },
        {
          id: 'bard_spells_5th',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bard_bardic_inspiration_d10',
          name: 'Inspiração Bárdica (d10)',
          description: 'Seu dado de Inspiração Bárdica sobe para d10.',
          type: 'auto',
        },
        {
          id: 'bard_expertise_2',
          name: 'Especialização (2ª)',
          description: 'Escolha mais 2 habilidades ou ferramentas com proficiência para dobrar o bônus de proficiência.',
          type: 'auto',
          pickSkills: [],
          pickCount: 2,
          pickType: 'expertise',
        },
        {
          id: 'bard_magical_secrets_10',
          name: 'Segredos Mágicos',
          description: 'Aprenda 2 magias de qualquer classe (incluindo Druida, Clérigo, Mago, etc.). Contam como magias de Bardo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'bard_spells_6th',
          name: 'Magias de 6° Nível',
          description: 'Você ganha acesso a espaços de magia de 6° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'bard_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'bard_asi12_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'bard_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'bard_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'bard_asi12_feat_actor', name: 'Talento: Ator', description: '+1 Carisma; vantagem em Enganação/Atuação ao se disfarçar.' },
            { id: 'bard_asi12_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Aliados ganham HP temporário após discurso de 10 min.' },
            { id: 'bard_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'bard_song_of_rest_d10',
          name: 'Canção do Repouso (d10)',
          description: 'O dado de recuperação durante descanso curto sobe de d8 para d10.',
          type: 'auto',
        },
        {
          id: 'bard_spells_7th',
          name: 'Magias de 7° Nível',
          description: 'Você ganha acesso a espaços de magia de 7° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'bard_magical_secrets_14',
          name: 'Segredos Mágicos (2ª)',
          description: 'Aprenda mais 2 magias de qualquer classe.',
          type: 'auto',
        },
        {
          id: 'bard_college_feature_14',
          name: 'Feature do Colégio Bárdico (Nível 14)',
          description: 'Você ganha a terceira feature do Colégio. (Saber: Incomparável | Valor: Magia de Batalha | Glamour: Unbreakable Majesty | Espadas: Maestria de Floreio | Sussurros: Presença Assombrosa | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'bard_bardic_inspiration_d12',
          name: 'Inspiração Bárdica (d12)',
          description: 'Seu dado de Inspiração Bárdica atinge o máximo: d12.',
          type: 'auto',
        },
        {
          id: 'bard_spells_8th',
          name: 'Magias de 8° Nível',
          description: 'Você ganha acesso a espaços de magia de 8° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'bard_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'bard_asi16_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'bard_asi16_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'bard_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'bard_asi16_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'bard_asi16_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance de magias de ataque; ignore cobertura.' },
            { id: 'bard_asi16_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'bard_song_of_rest_d12',
          name: 'Canção do Repouso (d12)',
          description: 'O dado de recuperação durante descanso curto atinge o máximo: d12.',
          type: 'auto',
        },
        {
          id: 'bard_spells_9th',
          name: 'Magias de 9° Nível',
          description: 'Você ganha acesso ao ápice da magia: espaços de 9° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'bard_magical_secrets_18',
          name: 'Segredos Mágicos (3ª)',
          description: 'Aprenda mais 2 magias de qualquer classe — totalizando 6 magias roubadas de outras tradições.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'bard_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'bard_asi19_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'bard_asi19_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'bard_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'bard_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'bard_asi19_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Aliados ganham HP temporário após discurso de 10 min.' },
            { id: 'bard_asi19_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bard_superior_inspiration',
          name: 'Inspiração Superior',
          description: 'Ao rolar iniciativa sem nenhum uso de Inspiração Bárdica, você ganha 1 uso imediatamente.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── CLERIC ───────────────
  cleric: [
    {
      level: 1,
      features: [
        {
          id: 'cleric_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Clérigo usando Sabedoria. Prepara magias diariamente = mod. Sabedoria + nível de Clérigo.',
          type: 'auto',
        },
        {
          id: 'cleric_divine_domain',
          name: 'Domínio Divino',
          description: 'Escolha o domínio divino de seu deus. Concede magias de domínio (sempre preparadas) e features nos níveis 1, 2, 6, 8 e 17.',
          type: 'choice',
          options: [
            { id: 'domain_life', name: 'Domínio da Vida', description: 'Cura poderosa. Disciple of Life (+2 + nível da magia em curas); armadura pesada; Preserve Life com Channel Divinity.' },
            { id: 'domain_light', name: 'Domínio da Luz', description: 'Chamas radiantes. Warding Flare impõe desvantagem em atacantes; Radiance of the Dawn com Channel Divinity.' },
            { id: 'domain_trickery', name: 'Domínio do Engano', description: 'Ilusão e trapaça. Bênção do Trapaceiro dá vantagem em Furtividade a aliado; Invoke Duplicity cria cópia ilusória.' },
            { id: 'domain_war', name: 'Domínio da Guerra', description: 'Guerreiro sagrado. Armadura pesada + armas marciais; War Priest: ataques como ação bônus; Guided Strike com Channel Divinity.' },
            { id: 'domain_knowledge', name: 'Domínio do Conhecimento', description: 'Sabedoria divina. Proficiência e expertise em 2 habilidades; Knowledge of the Ages com Channel Divinity.' },
            { id: 'domain_nature', name: 'Domínio da Natureza', description: 'Guardião natural. Truque de Druida; Acolyte of Nature; Charm Animals and Plants com Channel Divinity.' },
            { id: 'domain_tempest', name: 'Domínio da Tempestade', description: 'Poder das tempestades. Armadura pesada; Wrath of the Storm como reação; Destructive Wrath com Channel Divinity.' },
            { id: 'domain_death', name: 'Domínio da Morte', description: 'Poder da morte (subclasse sombria). Reaper usa truques em múltiplos alvos; Touch of Death drena HP.' },
            { id: 'domain_order', name: 'Domínio da Ordem', description: 'Lei e controle. Voice of Authority permite ataque de aliado; Order\'s Demand com Channel Divinity encanta.' },
            { id: 'domain_peace', name: 'Domínio da Paz', description: 'Protetor da harmonia. Emboldening Bond conecta aliados; Balm of Peace cura ao se mover.' },
            { id: 'domain_twilight', name: 'Domínio do Crepúsculo', description: 'Guardião entre o dia e a noite. Eyes of Night; Vigilant Blessing; Twilight Sanctuary com Channel Divinity.' },
          ],
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'cleric_channel_divinity_1',
          name: 'Canalizar Divindade (1×/descanso)',
          description: 'Uma vez por descanso curto, canalize energia divina. Todo Clérigo pode usar Turn Undead. Seu Domínio concede uma opção adicional.',
          type: 'auto',
        },
        {
          id: 'cleric_domain_feature_2',
          name: 'Feature do Domínio Divino (Nível 2)',
          description: 'Você ganha a feature de Channel Divinity do seu Domínio (ex: Preserve Life, Invoke Duplicity, Guided Strike, etc.).',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'cleric_spells_2nd',
          name: 'Magias de 2° Nível',
          description: 'Você ganha acesso a espaços de magia de 2° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'cleric_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'cleric_asi4_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'cleric_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'cleric_asi4_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'cleric_asi4_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração; magias como ataque de oportunidade.' },
            { id: 'cleric_asi4_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'cleric_asi4_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Aliados ganham HP temporário após discurso de 10 min.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'cleric_destroy_undead_half',
          name: 'Destruir Mortos-Vivos (ND 1/2)',
          description: 'Quando usa Turn Undead, mortos-vivos de ND 1/2 ou inferior são destruídos automaticamente.',
          type: 'auto',
        },
        {
          id: 'cleric_spells_3rd',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'cleric_channel_divinity_2',
          name: 'Canalizar Divindade (2×/descanso)',
          description: 'Agora você pode usar Canalizar Divindade duas vezes por descanso curto.',
          type: 'auto',
        },
        {
          id: 'cleric_domain_feature_6',
          name: 'Feature do Domínio Divino (Nível 6)',
          description: 'Segunda feature do seu Domínio. (Vida: Blessed Healer | Luz: Improved Flare | Engano: Cloak of Shadows | Guerra: War God\'s Blessing | Conhecimento: Read Thoughts | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'cleric_spells_4th',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'cleric_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'cleric_asi8_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'cleric_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'cleric_asi8_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'cleric_asi8_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'cleric_asi8_feat_polearm', name: 'Talento: Mestre de Armas de Haste', description: 'Ataque de bônus + ataques de oportunidade ao entrar em alcance.' },
            { id: 'cleric_asi8_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
          ],
        },
        {
          id: 'cleric_destroy_undead_1',
          name: 'Destruir Mortos-Vivos (ND 1)',
          description: 'Turn Undead agora destrói mortos-vivos de ND 1 ou inferior.',
          type: 'auto',
        },
        {
          id: 'cleric_domain_feature_8',
          name: 'Feature do Domínio Divino (Nível 8)',
          description: 'Terceira feature do Domínio, geralmente poderosa. (Vida: Divine Strike +1d8 radiante | Luz: Potent Spellcasting | Guerra: Divine Strike +1d8 do tipo do deus | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'cleric_spells_5th',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'cleric_divine_intervention',
          name: 'Intervenção Divina',
          description: 'Uma vez por semana, implore ao seu deus por ajuda. Chance de sucesso = nível de Clérigo %. Se funcionar, o DM escolhe o efeito. Ao nível 20, funciona sempre.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'cleric_destroy_undead_2',
          name: 'Destruir Mortos-Vivos (ND 2)',
          description: 'Turn Undead agora destrói mortos-vivos de ND 2 ou inferior.',
          type: 'auto',
        },
        {
          id: 'cleric_spells_6th',
          name: 'Magias de 6° Nível',
          description: 'Você ganha acesso a espaços de magia de 6° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'cleric_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'cleric_asi12_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'cleric_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'cleric_asi12_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'cleric_asi12_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'cleric_asi12_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'cleric_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'cleric_spells_7th',
          name: 'Magias de 7° Nível',
          description: 'Você ganha acesso a espaços de magia de 7° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'cleric_destroy_undead_3',
          name: 'Destruir Mortos-Vivos (ND 3)',
          description: 'Turn Undead agora destrói mortos-vivos de ND 3 ou inferior.',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'cleric_spells_8th',
          name: 'Magias de 8° Nível',
          description: 'Você ganha acesso a espaços de magia de 8° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'cleric_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'cleric_asi16_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'cleric_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'cleric_asi16_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'cleric_asi16_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura; aprenda truque de ataque.' },
            { id: 'cleric_asi16_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
            { id: 'cleric_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'cleric_destroy_undead_4',
          name: 'Destruir Mortos-Vivos (ND 4)',
          description: 'Turn Undead agora destrói mortos-vivos de ND 4 ou inferior.',
          type: 'auto',
        },
        {
          id: 'cleric_domain_feature_17',
          name: 'Feature do Domínio Divino (Nível 17)',
          description: 'Quarta e última feature do Domínio, geralmente a mais poderosa. (Vida: Supreme Healing | Luz: Corona of Light | Guerra: Avatar of Battle | Engano: Improved Duplicity | etc.)',
          type: 'auto',
        },
        {
          id: 'cleric_spells_9th',
          name: 'Magias de 9° Nível',
          description: 'Você ganha acesso aos espaços de magia de 9° nível — o pináculo da magia divina.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'cleric_channel_divinity_3',
          name: 'Canalizar Divindade (3×/descanso)',
          description: 'Agora você pode usar Canalizar Divindade três vezes por descanso curto.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'cleric_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'cleric_asi19_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'cleric_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'cleric_asi19_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'cleric_asi19_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'cleric_asi19_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'cleric_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'cleric_divine_intervention_improved',
          name: 'Intervenção Divina Aprimorada',
          description: 'Ao usar Intervenção Divina, ela funciona automaticamente — sem necessidade de teste. Após usar, aguarde 7 dias para usar novamente.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── DRUID ───────────────
  druid: [
    {
      level: 1,
      features: [
        {
          id: 'druid_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Druida usando Sabedoria. Prepara magias diariamente = mod. Sabedoria + nível. Druidas não usam armaduras metálicas.',
          type: 'auto',
        },
        {
          id: 'druid_druidic',
          name: 'Druidico',
          description: 'Você conhece a linguagem secreta dos druidas. Pode esconder mensagens em qualquer discurso. Identifica plantas, animais e clima naturalmente.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'druid_wild_shape',
          name: 'Forma Selvagem (ND 1/4, sem voo/natação)',
          description: 'Duas vezes por descanso curto, transforme-se em uma besta que já viu (ND máx. 1/4, sem voo ou nado). Mantém os HP da forma; ao cair, retorna à forma original.',
          type: 'auto',
        },
        {
          id: 'druid_circle',
          name: 'Círculo Druídico',
          description: 'Escolha o círculo que define sua conexão com a natureza. Você ganha features do círculo nos níveis 2, 6, 10 e 14.',
          type: 'choice',
          options: [
            { id: 'circle_land', name: 'Círculo da Terra', description: 'Conectado a um terreno sagrado. Recupera espaços de magia com Repouso Natural; aprende magias extras do terreno escolhido.' },
            { id: 'circle_moon', name: 'Círculo da Lua', description: 'Mestre da transformação. Combat Wild Shape; formas de ND 1 no nível 2; elementais no nível 10.' },
            { id: 'circle_stars', name: 'Círculo das Estrelas', description: 'Poder estelar. Mapa Estrelado como foco; Forma Estrelada com bônus variados; Presságio Cósmico no nível 6.' },
            { id: 'circle_spores', name: 'Círculo dos Esporos', description: 'Decomposição e renovação. Halo of Spores; Symbiotic Entity aumenta HP; anima mortos com esporos.' },
            { id: 'circle_wildfire', name: 'Círculo do Fogo Selvagem', description: 'Fogo criativo. Invoca Espírito de Fogo Selvagem; Enhanced Bond aprimora magias de fogo e cura.' },
            { id: 'circle_shepherd', name: 'Círculo do Pastor', description: 'Protetor de bestas. Fala com bestas/vegetais; invoca aliados poderosos com Convocar Espírito Totêmico.' },
            { id: 'circle_dreams', name: 'Círculo dos Sonhos', description: 'Ligação com o Feywild. Balm of the Summer Court cura aliados; Hearth of Moonlight protege acampamentos.' },
          ],
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'druid_spells_2nd',
          name: 'Magias de 2° Nível',
          description: 'Você ganha acesso a espaços de magia de 2° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'druid_wild_shape_swim',
          name: 'Forma Selvagem (ND 1/2, com natação)',
          description: 'Agora pode assumir formas de ND 1/2 e beasts com velocidade de natação.',
          type: 'auto',
        },
        {
          id: 'druid_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'druid_asi4_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'druid_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'druid_asi4_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'druid_asi4_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração; magias como ataque de oportunidade.' },
            { id: 'druid_asi4_feat_mobile', name: 'Talento: Ágil', description: '+3m de deslocamento; Dash não provoca oportunidade.' },
            { id: 'druid_asi4_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'druid_spells_3rd',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'druid_circle_feature_6',
          name: 'Feature do Círculo Druídico (Nível 6)',
          description: 'Segunda feature do seu Círculo. (Terra: Land\'s Stride | Lua: Primal Strike | Estrelas: Presságio Cósmico | Esporos: Fungal Infestation | Fogo Selvagem: Cauterizing Flames | Pastor: Mighty Summoner | Sonhos: Hidden Paths)',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'druid_spells_4th',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'druid_wild_shape_fly',
          name: 'Forma Selvagem (ND 1, com voo)',
          description: 'Agora pode assumir formas de ND 1 e beasts com velocidade de voo.',
          type: 'auto',
        },
        {
          id: 'druid_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'druid_asi8_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'druid_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'druid_asi8_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'druid_asi8_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'druid_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'druid_asi8_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'druid_spells_5th',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'druid_circle_feature_10',
          name: 'Feature do Círculo Druídico (Nível 10)',
          description: 'Terceira feature do Círculo. (Terra: Nature\'s Ward | Lua: Elemental Wild Shape | Estrelas: Twinkling Constellations | Esporos: Spreading Spores | Fogo Selvagem: Blazing Revival | Pastor: Guardian of the Forest | Sonhos: Walker in Dreams)',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'druid_spells_6th',
          name: 'Magias de 6° Nível',
          description: 'Você ganha acesso a espaços de magia de 6° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'druid_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'druid_asi12_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'druid_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'druid_asi12_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'druid_asi12_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'druid_asi12_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'druid_asi12_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance de magias de ataque; ignore cobertura.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'druid_spells_7th',
          name: 'Magias de 7° Nível',
          description: 'Você ganha acesso a espaços de magia de 7° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'druid_circle_feature_14',
          name: 'Feature do Círculo Druídico (Nível 14)',
          description: 'Quarta e última feature do Círculo. (Terra: Nature\'s Sanctuary | Lua: Thousand Forms | Estrelas: Full of Stars | Esporos: Fungal Body | Fogo Selvagem: Firestorm | Pastor: Faithful Summons | Sonhos: Endless Dream)',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'druid_spells_8th',
          name: 'Magias de 8° Nível',
          description: 'Você ganha acesso a espaços de magia de 8° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'druid_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'druid_asi16_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'druid_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'druid_asi16_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'druid_asi16_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'druid_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'druid_asi16_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'druid_spells_9th',
          name: 'Magias de 9° Nível',
          description: 'Você ganha acesso ao ápice da magia druídica: espaços de 9° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'druid_timeless_body',
          name: 'Corpo Atemporal',
          description: 'Sua magia druídica preserva seu corpo. Você envelhece 10× mais devagar e não precisa de comida ou água.',
          type: 'auto',
        },
        {
          id: 'druid_beast_spells',
          name: 'Magias de Besta',
          description: 'Agora você pode conjurar magias de Druida enquanto está na Forma Selvagem, mesmo se precisar de componentes somáticos ou verbais.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'druid_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'druid_asi19_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'druid_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'druid_asi19_wis1con1', name: '+1 Sabedoria / +1 Constituição', description: 'Aumenta Sabedoria e Constituição em 1 cada.' },
            { id: 'druid_asi19_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'druid_asi19_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'druid_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'druid_archdruid',
          name: 'Arquidruida',
          description: 'Você pode usar Forma Selvagem um número ilimitado de vezes. Além disso, pode ignorar os componentes verbais e somáticos de suas magias de Druida enquanto em Forma Selvagem.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── FIGHTER ───────────────
  fighter: [
    {
      level: 1,
      features: [
        {
          id: 'fighter_fighting_style',
          name: 'Estilo de Luta',
          description: 'Escolha um estilo de combate que define sua especialização marcial.',
          type: 'choice',
          options: [
            { id: 'fighter_style_archery', name: 'Arqueirismo', description: '+2 nas jogadas de ataque com armas à distância.' },
            { id: 'fighter_style_defense', name: 'Defesa', description: '+1 na CA enquanto usar qualquer armadura.' },
            { id: 'fighter_style_dueling', name: 'Duelo', description: '+2 no dano com arma corpo-a-corpo em uma mão e nenhuma outra arma.' },
            { id: 'fighter_style_great_weapon', name: 'Combate com Arma Grande', description: 'Relance 1s e 2s no dado de dano de armas de duas mãos.' },
            { id: 'fighter_style_protection', name: 'Proteção', description: 'Reação: imponha desvantagem em ataques contra aliados adjacentes (requer escudo).' },
            { id: 'fighter_style_two_weapon', name: 'Duas Armas', description: 'Adicione o modificador de atributo ao dano do ataque extra com duas armas.' },
            { id: 'fighter_style_blind_fighting', name: 'Combate às Cegas', description: 'Visão cega de 3 metros — pode "ver" criaturas invisíveis nesse raio.' },
            { id: 'fighter_style_interception', name: 'Interceptação', description: 'Reação: reduza o dano a um aliado em 1d10 + bônus de proficiência.' },
          ],
        },
        {
          id: 'fighter_second_wind',
          name: 'Segundo Fôlego',
          description: 'Ação bônus: uma vez por descanso curto, recupere 1d10 + nível de Guerreiro em HP.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'fighter_action_surge_1',
          name: 'Surto de Ação (1×)',
          description: 'Uma vez por descanso curto, tome uma ação adicional além da ação normal e ação bônus.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'fighter_archetype',
          name: 'Arquétipo Marcial',
          description: 'Escolha o arquétipo que define seu estilo de combate avançado. Você ganha features nos níveis 3, 7, 10, 15 e 18.',
          type: 'choice',
          options: [
            { id: 'archetype_champion', name: 'Campeão', description: 'Crítico em 19-20 (18-20 no nível 15). Atletismo/Acrobacia aprimorado; estilo de luta adicional no nível 10.' },
            { id: 'archetype_battle_master', name: 'Mestre de Batalha', description: '4 dados de superioridade d8 e 3 manobras táticas. Manobras como Disarming Attack, Precision Attack, Rally e outras.' },
            { id: 'archetype_eldritch_knight', name: 'Cavaleiro Arcano', description: 'Magia de Mago (Abjuração/Evocação). Weapon Bond vincula arma; War Magic para atacar e conjurar.' },
            { id: 'archetype_samurai', name: 'Samurai', description: 'Fighting Spirit: vantagem nos ataques + HP temporário 3×/descanso longo. Elegante: proficiência em Persuasão.' },
            { id: 'archetype_arcane_archer', name: 'Arqueiro Arcano', description: 'Arcane Shot com efeitos mágicos (Banishing, Bursting, Grasping, Shadow, Seeking, etc.) 2×/descanso curto.' },
            { id: 'archetype_cavalier', name: 'Cavaleiro', description: 'Guerreiro montado. Born to the Saddle; Unwavering Mark marca inimigos para ataques bônus.' },
            { id: 'archetype_psi_warrior', name: 'Guerreiro Psiônico', description: 'Usa dados psiônicos para ataques telequinéticos, escudo protetor e movimentos mentais.' },
            { id: 'archetype_rune_knight', name: 'Cavaleiro de Runas', description: 'Inscreve runas gigantes em armas/armaduras para efeitos mágicos; pode crescer de tamanho.' },
          ],
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'fighter_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi4_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi4_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi4_str1dex1', name: '+1 Força / +1 Destreza', description: 'Aumenta Força e Destreza em 1 cada.' },
            { id: 'fighter_asi4_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano; ataque bônus após crítico ou matar.' },
            { id: 'fighter_asi4_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'fighter_asi4_feat_polearm', name: 'Talento: Mestre de Armas de Haste', description: 'Ataque de bônus + ataques de oportunidade ao entrar em alcance.' },
            { id: 'fighter_asi4_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; sem desvantagem em longa distância; -5 ataque por +10 dano.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'fighter_extra_attack_2',
          name: 'Ataque Extra (2 ataques)',
          description: 'Você pode atacar duas vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'fighter_asi_6',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi6_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi6_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi6_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi6_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'fighter_asi6_feat_crossbow', name: 'Talento: Especialista em Besta', description: 'Ignore Loading; sem desvantagem em corpo-a-corpo; ataque de bônus.' },
            { id: 'fighter_asi6_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'fighter_archetype_feature_7',
          name: 'Feature do Arquétipo Marcial (Nível 7)',
          description: 'Segunda feature do seu Arquétipo. (Campeão: Remarkable Athlete | Mestre de Batalha: Manobra Adicional | Cavaleiro Arcano: War Magic | Samurai: Elegant Courtier | Arqueiro Arcano: Curving Shot | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'fighter_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi8_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi8_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi8_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'fighter_asi8_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'fighter_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'fighter_indomitable_1',
          name: 'Indomável (1×)',
          description: 'Uma vez por descanso longo, relance uma jogada de resistência com falha. Você deve usar o novo resultado.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'fighter_archetype_feature_10',
          name: 'Feature do Arquétipo Marcial (Nível 10)',
          description: 'Terceira feature do Arquétipo. (Campeão: Additional Fighting Style | Mestre de Batalha: Manobra Extra + d10 | Cavaleiro Arcano: Eldritch Strike | Samurai: Tireless Spirit | Arqueiro Arcano: Ever-Ready Shot | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'fighter_extra_attack_3',
          name: 'Ataque Extra (3 ataques)',
          description: 'Você agora pode atacar três vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'fighter_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi12_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi12_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'fighter_asi12_feat_polearm', name: 'Talento: Mestre de Armas de Haste', description: 'Ataque de bônus + ataques de oportunidade ao entrar em alcance.' },
            { id: 'fighter_asi12_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'fighter_indomitable_2',
          name: 'Indomável (2×)',
          description: 'Agora você pode usar Indomável duas vezes por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'fighter_asi_14',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi14_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi14_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi14_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi14_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'fighter_asi14_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'fighter_asi14_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'fighter_archetype_feature_15',
          name: 'Feature do Arquétipo Marcial (Nível 15)',
          description: 'Quarta feature do Arquétipo. (Campeão: Superior Critical 18-20 | Mestre de Batalha: Manobra Extra + d10 | Cavaleiro Arcano: Arcane Charge | Samurai: Rapid Strike | Arqueiro Arcano: 2 Arcane Shots adicionais | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'fighter_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi16_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi16_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi16_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'fighter_asi16_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; sem desvantagem em longa distância.' },
            { id: 'fighter_asi16_feat_resilient', name: 'Talento: Resiliente (Sabedoria)', description: '+1 Sabedoria e proficiência em resistência de Sabedoria.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'fighter_action_surge_2',
          name: 'Surto de Ação (2×)',
          description: 'Agora você pode usar Surto de Ação duas vezes por descanso curto.',
          type: 'auto',
        },
        {
          id: 'fighter_indomitable_3',
          name: 'Indomável (3×)',
          description: 'Agora você pode usar Indomável três vezes por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'fighter_archetype_feature_18',
          name: 'Feature do Arquétipo Marcial (Nível 18)',
          description: 'Quinta e última feature do Arquétipo. (Campeão: Survivor — regenera HP por turno | Mestre de Batalha: d12 de superioridade | Cavaleiro Arcano: Improved War Magic | Samurai: Strength Before Death | Arqueiro Arcano: Ever-Ready Shot aprimorado | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'fighter_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'fighter_asi19_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'fighter_asi19_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'fighter_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'fighter_asi19_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'fighter_asi19_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'fighter_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'fighter_extra_attack_4',
          name: 'Ataque Extra (4 ataques)',
          description: 'O ápice da maestria marcial: você pode atacar quatro vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── MONK ───────────────
  monk: [
    {
      level: 1,
      features: [
        {
          id: 'monk_unarmored_defense',
          name: 'Defesa Sem Armadura',
          description: 'Sem armadura ou escudo, sua CA = 10 + mod. Destreza + mod. Sabedoria.',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d4',
          name: 'Artes Marciais (d4)',
          description: 'Use DEX para ataques desarmados e armas monásticas. Dado de dano mínimo: d4. Após atacar com arma monástica, pode fazer um ataque desarmado como ação bônus.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'monk_ki_2',
          name: 'Ki (2 pontos)',
          description: '2 pontos de ki por descanso curto. Flurry of Blows (1 ki: 2 socos bônus), Patient Defense (1 ki: Dodge), Step of the Wind (1 ki: Dash ou Disengage bônus).',
          type: 'auto',
        },
        {
          id: 'monk_unarmored_movement_10ft',
          name: 'Movimento Sem Armadura (+3m)',
          description: 'Seu deslocamento aumenta 3 metros sem armadura ou escudo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'monk_tradition',
          name: 'Tradição Monástica',
          description: 'Escolha a tradição que define sua filosofia e técnicas. Você ganha features nos níveis 3, 6, 11 e 17.',
          type: 'choice',
          options: [
            { id: 'tradition_open_hand', name: 'Mão Aberta', description: 'Mestre do corpo. Técnicas do Open Hand: derrube, empurre ou negue reações com Flurry of Blows. Wholeness of Body cura 3× nível no descanso longo.' },
            { id: 'tradition_shadow', name: 'Sombra', description: 'Guerreiro das trevas. Shadow Arts: conjure Darkness, Darkvision, Pass Without Trace e Silence com ki. Shadow Step: teleporte nas sombras.' },
            { id: 'tradition_four_elements', name: 'Quatro Elementos', description: 'Canaliza os elementos. Disciplinas elementais: Breath of Winter, Fangs of the Fire Snake, Fist of Unbroken Air e outras com ki.' },
            { id: 'tradition_kensei', name: 'Kensei', description: 'Mestre de armas específicas (ranged ou melee). Armas Kensei como armas monásticas; One with the Blade para dano mágico.' },
            { id: 'tradition_mercy', name: 'Misericórdia', description: 'Cura e destrói com as mesmas mãos. Hand of Harm e Hand of Healing com ki; Physician\'s Touch cura e remove condições.' },
            { id: 'tradition_astral_self', name: 'Eu Astral', description: 'Manifesta braços e forma astral. Arms of the Astral Self: bônus WIS em ataques, alcance extra e dano de força.' },
            { id: 'tradition_drunken_master', name: 'Mestre Bêbado', description: 'Estilo errático e imprevisível. Bonus Proficiencies; Tipsy Sway: esquiva enquanto ataca.' },
            { id: 'tradition_sun_soul', name: 'Alma Solar', description: 'Projeta energia radiante. Radiant Sun Bolt: ataque à distância (DEX); Searing Arc Strike com ki.' },
          ],
        },
        {
          id: 'monk_deflect_missiles',
          name: 'Defletir Projéteis',
          description: 'Reação: reduza dano de projétil em 1d10 + DEX + nível. Se reduzir a 0, pode arremessar de volta (1 ki) causando 1d6 + DEX de dano.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'monk_slow_fall',
          name: 'Queda Lenta',
          description: 'Reação: reduza dano de queda em 5 × nível de Monge.',
          type: 'auto',
        },
        {
          id: 'monk_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'monk_asi4_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'monk_asi4_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'monk_asi4_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'monk_asi4_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'monk_asi4_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'monk_asi4_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'monk_extra_attack',
          name: 'Ataque Extra',
          description: 'Você pode atacar duas vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
        {
          id: 'monk_stunning_strike',
          name: 'Golpe Atordoante',
          description: 'Ao acertar ataque corpo-a-corpo, gaste 1 ki. Alvo: teste de CON (CD = 8 + prof + DEX/STR) ou fica Atordoado até o fim do seu próximo turno.',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d6',
          name: 'Artes Marciais (d6)',
          description: 'Seu dado de Artes Marciais sobe de d4 para d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'monk_ki_empowered_strikes',
          name: 'Golpes Imbuídos de Ki',
          description: 'Seus ataques desarmados são considerados mágicos para fins de superar resistência e imunidade.',
          type: 'auto',
        },
        {
          id: 'monk_unarmored_movement_15ft',
          name: 'Movimento Sem Armadura (+4,5m)',
          description: 'Seu bônus de deslocamento sobe para +4,5m (15 pés).',
          type: 'auto',
        },
        {
          id: 'monk_tradition_feature_6',
          name: 'Feature da Tradição Monástica (Nível 6)',
          description: 'Segunda feature da sua Tradição. (Mão Aberta: Wholeness of Body | Sombra: Shadow Step | Quatro Elementos: Disciplinas extras | Kensei: One with the Blade | Misericórdia: Physician\'s Touch | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'monk_evasion',
          name: 'Evasão',
          description: 'Quando sujeito a efeitos que pedem resistência de DEX para metade do dano: sem dano se passar, metade se falhar.',
          type: 'auto',
        },
        {
          id: 'monk_stillness_of_mind',
          name: 'Imobilidade da Mente',
          description: 'Ação: termine o efeito de Enfeitiçado ou Amedrontado em você mesmo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'monk_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'monk_asi8_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'monk_asi8_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'monk_asi8_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'monk_asi8_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'monk_asi8_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'monk_asi8_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'monk_unarmored_movement_20ft',
          name: 'Movimento Sem Armadura (+6m)',
          description: 'Seu bônus de deslocamento sobe para +6m (20 pés). Agora pode correr sobre superfícies verticais e líquidos sem cair.',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d6_2',
          name: 'Ki (9 pontos)',
          description: 'Você agora tem 9 pontos de ki por descanso curto.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'monk_purity_of_body',
          name: 'Pureza do Corpo',
          description: 'Sua maestria em ki torna você imune a doenças e venenos.',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d8',
          name: 'Artes Marciais (d8)',
          description: 'Seu dado de Artes Marciais sobe de d6 para d8.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'monk_tradition_feature_11',
          name: 'Feature da Tradição Monástica (Nível 11)',
          description: 'Terceira feature da sua Tradição. (Mão Aberta: Tranquility | Sombra: Cloak of Shadows | Quatro Elementos: Elementos avançados | Kensei: Sharpen the Blade | Misericórdia: Flurry of Healing and Harm | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'monk_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'monk_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'monk_asi12_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'monk_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'monk_asi12_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'monk_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'monk_asi12_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'monk_tongue_sun_moon',
          name: 'Língua do Sol e da Lua',
          description: 'Você pode se comunicar com qualquer criatura que tenha um idioma. Compreensão e fala universal.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'monk_diamond_soul',
          name: 'Alma de Diamante',
          description: 'Proficiência em todas as jogadas de resistência. Além disso, ao falhar uma resistência, gaste 1 ki para relançar e usar o novo resultado.',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d10',
          name: 'Artes Marciais (d10)',
          description: 'Seu dado de Artes Marciais sobe de d8 para d10.',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'monk_timeless_body',
          name: 'Corpo Atemporal',
          description: 'Seu ki sustenta seu corpo. Você não precisa mais de comida ou água e não sofre desvantagens por velhice. Ainda envelhece, mas de forma imperceptível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'monk_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'monk_asi16_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'monk_asi16_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'monk_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'monk_asi16_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'monk_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'monk_asi16_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'monk_tradition_feature_17',
          name: 'Feature da Tradição Monástica (Nível 17)',
          description: 'Quarta e última feature da Tradição. (Mão Aberta: Quivering Palm — matança instantânea | Sombra: Opportunist | Quatro Elementos: Eternal Mountain Defense | Kensei: Unerring Accuracy | Misericórdia: Hand of Ultimate Mercy | Eu Astral: Awakened Astral Self | etc.)',
          type: 'auto',
        },
        {
          id: 'monk_martial_arts_d12',
          name: 'Artes Marciais (d12)',
          description: 'Seu dado de Artes Marciais atinge o máximo: d12.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'monk_empty_body',
          name: 'Corpo Vazio',
          description: '4 ki: fique Invisível por 1 minuto + resistência a todo dano exceto força. 8 ki: conjure Astral Projection em você mesmo (sem material).',
          type: 'auto',
        },
        {
          id: 'monk_unarmored_movement_25ft',
          name: 'Movimento Sem Armadura (+7,5m)',
          description: 'Seu bônus de deslocamento atinge o máximo: +7,5m (25 pés).',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'monk_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'monk_asi19_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'monk_asi19_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'monk_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'monk_asi19_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'monk_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'monk_asi19_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'monk_perfect_self',
          name: 'Ser Perfeito',
          description: 'Ao rolar iniciativa com 0 pontos de ki restantes, você recupera 4 pontos de ki imediatamente.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── PALADIN ───────────────
  paladin: [
    {
      level: 1,
      features: [
        {
          id: 'paladin_divine_sense',
          name: 'Sentido Divino',
          description: 'Ação: detecte presença de Celestiais, Mortos-Vivos ou Demônios em 18m até o fim do próximo turno. Usos = 1 + mod. Carisma por descanso longo.',
          type: 'auto',
        },
        {
          id: 'paladin_lay_on_hands',
          name: 'Imposição de Mãos',
          description: 'Pool de cura = 5 × nível. Ação: cure qualquer quantidade de HP do pool, ou gaste 5 HP para curar uma doença ou veneno.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'paladin_fighting_style',
          name: 'Estilo de Luta',
          description: 'Escolha um estilo de combate sagrado.',
          type: 'choice',
          options: [
            { id: 'paladin_style_defense', name: 'Defesa', description: '+1 na CA enquanto usar armadura.' },
            { id: 'paladin_style_dueling', name: 'Duelo', description: '+2 no dano com arma corpo-a-corpo em uma mão.' },
            { id: 'paladin_style_great_weapon', name: 'Combate com Arma Grande', description: 'Relance 1s e 2s no dado de dano de armas de duas mãos.' },
            { id: 'paladin_style_protection', name: 'Proteção', description: 'Reação: imponha desvantagem em ataque contra aliado adjacente (requer escudo).' },
            { id: 'paladin_style_blessed_warrior', name: 'Guerreiro Abençoado', description: 'Aprenda 2 truques de Clérigo. Carisma é seu atributo de conjuração para eles.' },
            { id: 'paladin_style_blind_fighting', name: 'Combate às Cegas', description: 'Visão cega de 3m — enxerga criaturas invisíveis no raio.' },
          ],
        },
        {
          id: 'paladin_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Paladino usando Carisma. Prepara magias = mod. Carisma + metade do nível de Paladino.',
          type: 'auto',
        },
        {
          id: 'paladin_divine_smite',
          name: 'Golpe Divino',
          description: 'Ao acertar um ataque corpo-a-corpo, gaste espaço de magia: +2d8 radiante (+1d8 por nível do espaço acima do 1°). +1d8 extra contra Mortos-Vivos/Demônios.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'paladin_divine_health',
          name: 'Saúde Divina',
          description: 'Você é imune a doenças.',
          type: 'auto',
        },
        {
          id: 'paladin_sacred_oath',
          name: 'Juramento Sagrado',
          description: 'Escolha o juramento que define seus ideais. Concede magias de juramento (sempre preparadas), Channel Divinity e features nos níveis 3, 7, 15 e 20.',
          type: 'choice',
          options: [
            { id: 'oath_devotion', name: 'Devoção', description: 'Cavaleiro justo e honrado. Sacred Weapon e Turn the Unholy com Channel Divinity. Aura de Devoção: imunidade a Enfeitiçado.' },
            { id: 'oath_ancients', name: 'Ancestrais', description: 'Protege a luz e a natureza. Nature\'s Wrath e Turn the Faithless. Aura Anciã: resistência a dano de magias.' },
            { id: 'oath_vengeance', name: 'Vingança', description: 'Caçador implacável. Vow of Enmity (vantagem) e Abjure Enemy (assustado). Perseguição sem limite.' },
            { id: 'oath_conquest', name: 'Conquista', description: 'Semeia terror. Conquering Presence (área de medo) e Guided Strike. Aura de Conquista: criaturas assustadas paralisadas.' },
            { id: 'oath_redemption', name: 'Redenção', description: 'Reformador pacifista. Emissary of Peace (+5 Persuasão) e Rebuke the Violent (dano refletido).' },
            { id: 'oath_glory', name: 'Glória', description: 'Inspira grandeza. Inspiring Smite distribui HP temporário; Peerless Athlete aprimora testes físicos.' },
            { id: 'oath_watchers', name: 'Vigilantes', description: 'Guardião contra ameaças extra-planares. Abjure the Extraplanar; +ini contra criaturas de outros planos.' },
            { id: 'oath_oathbreaker', name: 'Quebrador de Juramentos', description: 'Paladino sombrio que rompeu seus votos. Reanimação de mortos-vivos e aura de medo.' },
          ],
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'paladin_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'paladin_asi4_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'paladin_asi4_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'paladin_asi4_str1cha1', name: '+1 Força / +1 Carisma', description: 'Aumenta Força e Carisma em 1 cada.' },
            { id: 'paladin_asi4_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano; ataque bônus após crítico.' },
            { id: 'paladin_asi4_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'paladin_asi4_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Aliados ganham HP temporário após discurso de 10 min.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'paladin_extra_attack',
          name: 'Ataque Extra',
          description: 'Você pode atacar duas vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'paladin_aura_of_protection',
          name: 'Aura de Proteção (3m)',
          description: 'Você e aliados amigáveis em 3 metros adicionam seu modificador de Carisma (mínimo +1) em todas as jogadas de resistência, desde que você não esteja incapacitado.',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'paladin_oath_feature_7',
          name: 'Feature do Juramento Sagrado (Nível 7)',
          description: 'Primeira aura do seu Juramento. (Devoção: Aura de Devoção — imune a Enfeitiçado | Ancestrais: Aura Anciã — resistência a dano de magias | Vingança: Relentless Avenger | Conquista: Aura de Conquista | Redenção: Aura de Guardian | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'paladin_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'paladin_asi8_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'paladin_asi8_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'paladin_asi8_str1cha1', name: '+1 Força / +1 Carisma', description: 'Aumenta Força e Carisma em 1 cada.' },
            { id: 'paladin_asi8_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'paladin_asi8_feat_war_caster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração.' },
            { id: 'paladin_asi8_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'paladin_spells_3rd',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'paladin_aura_of_courage',
          name: 'Aura de Coragem (3m)',
          description: 'Você e aliados amigáveis em 3 metros não podem ser Amedrontados enquanto você não estiver incapacitado.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'paladin_improved_divine_smite',
          name: 'Golpe Divino Aprimorado',
          description: 'Sempre que acertar um ataque corpo-a-corpo com arma, cause +1d8 de dano radiante adicional (além do Golpe Divino normal).',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'paladin_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'paladin_asi12_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'paladin_asi12_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'paladin_asi12_str1cha1', name: '+1 Força / +1 Carisma', description: 'Aumenta Força e Carisma em 1 cada.' },
            { id: 'paladin_asi12_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'paladin_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'paladin_asi12_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'paladin_spells_4th',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'paladin_cleansing_touch',
          name: 'Toque Purificador',
          description: 'Ação: termine um efeito de magia em você ou em um aliado voluntário que toque. Usos = mod. Carisma (mínimo 1) por descanso longo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'paladin_oath_feature_15',
          name: 'Feature do Juramento Sagrado (Nível 15)',
          description: 'Segunda feature avançada do seu Juramento. (Devoção: Holy Nimbus | Ancestrais: Undying Sentinel | Vingança: Soul of Vengeance | Conquista: Invincible Conqueror | Redenção: Emissary of Redemption | Gloria: Glorious Defense | etc.)',
          type: 'auto',
        },
        {
          id: 'paladin_spells_5th',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'paladin_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'paladin_asi16_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'paladin_asi16_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'paladin_asi16_str1cha1', name: '+1 Força / +1 Carisma', description: 'Aumenta Força e Carisma em 1 cada.' },
            { id: 'paladin_asi16_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'paladin_asi16_feat_sentinel', name: 'Talento: Sentinela', description: 'Ataques de oportunidade reduzem deslocamento a 0.' },
            { id: 'paladin_asi16_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'paladin_aura_improvement',
          name: 'Auras Ampliadas (9m)',
          description: 'O raio da Aura de Proteção e da Aura de Coragem (e aura do Juramento) se expande de 3 metros para 9 metros.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'paladin_aura_improvement_note',
          name: 'Auras plenamente ativas',
          description: 'Todas as suas auras agora cobrem 9 metros ao redor de você.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'paladin_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'paladin_asi19_str2', name: '+2 Força', description: 'Aumenta Força em 2 pontos.' },
            { id: 'paladin_asi19_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'paladin_asi19_str1cha1', name: '+1 Força / +1 Carisma', description: 'Aumenta Força e Carisma em 1 cada.' },
            { id: 'paladin_asi19_feat_gwm', name: 'Talento: Mestre de Armas Grandes', description: '-5 ataque por +10 dano.' },
            { id: 'paladin_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'paladin_asi19_feat_inspiring', name: 'Talento: Líder Inspirador', description: 'Aliados ganham HP temporário após discurso de 10 min.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'paladin_oath_capstone',
          name: 'Feature do Juramento Sagrado (Nível 20) — Capstone',
          description: 'O ápice do seu Juramento. (Devoção: Avatar de Devoção — auréola sagrada 30m, imunidade encantamento/medo | Ancestrais: Elder Champion — regenera 10 HP/turno, conjura magias em ação bônus | Vingança: Avenging Angel — asas de voo 18m, aura de medo | Conquista: Conquering Presence área ampliada | Redenção: Emissary of Redemption final | etc.)',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── RANGER ───────────────
  ranger: [
    {
      level: 1,
      features: [
        {
          id: 'ranger_favored_enemy',
          name: 'Inimigo Favorito',
          description: 'Escolha um tipo de criatura. Vantagem em Sobrevivência para rastrear e em Inteligência para recordar informações sobre elas. Aprende um idioma desse tipo.',
          type: 'choice',
          options: [
            { id: 'enemy_beasts', name: 'Bestas', description: 'Animais selvagens e criaturas naturais.' },
            { id: 'enemy_undead', name: 'Mortos-Vivos', description: 'Zumbis, esqueletos, vampiros e similares.' },
            { id: 'enemy_humanoids', name: 'Humanoides (2 tipos)', description: 'Goblins, orcs, humanos e outras raças humanoides. Escolha 2 raças.' },
            { id: 'enemy_dragons', name: 'Dragões', description: 'Dragões verdadeiros e criaturas dracônicas.' },
            { id: 'enemy_fiends', name: 'Demônios/Diabos', description: 'Demônios, diabos e seres dos planos inferiores.' },
            { id: 'enemy_monstrosities', name: 'Monstrosidades', description: 'Criaturas mágicas e aberrantes.' },
            { id: 'enemy_giants', name: 'Gigantes', description: 'Gigantes de todos os tipos e ogros.' },
            { id: 'enemy_fey', name: 'Fadas', description: 'Criaturas do Feywild.' },
          ],
        },
        {
          id: 'ranger_natural_explorer',
          name: 'Explorador Natural',
          description: 'Escolha um terreno favorito. Nele: proficiência dobrada em Natureza/Sobrevivência, sem se perder, rastros ocultos, velocidade normal em terreno difícil, alerta contra surpresas.',
          type: 'choice',
          options: [
            { id: 'terrain_forest', name: 'Floresta', description: 'Mestre das florestas densas.' },
            { id: 'terrain_mountain', name: 'Montanha', description: 'Explorador de terrenos acidentados e altitudes.' },
            { id: 'terrain_swamp', name: 'Pântano', description: 'Sobrevivente de pântanos e alagados.' },
            { id: 'terrain_coast', name: 'Costa', description: 'Navegador e explorador costeiro.' },
            { id: 'terrain_desert', name: 'Deserto', description: 'Guia em terras áridas.' },
            { id: 'terrain_underdark', name: 'Submundo', description: 'Explorador das cavernas e masmorras.' },
            { id: 'terrain_arctic', name: 'Ártico', description: 'Sobrevivente em climas gelados.' },
            { id: 'terrain_grassland', name: 'Planície', description: 'Rastreador nas pastagens abertas.' },
          ],
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'ranger_fighting_style',
          name: 'Estilo de Luta',
          description: 'Escolha um estilo de combate de Patrulheiro.',
          type: 'choice',
          options: [
            { id: 'ranger_style_archery', name: 'Arqueirismo', description: '+2 nas jogadas de ataque com armas à distância.' },
            { id: 'ranger_style_defense', name: 'Defesa', description: '+1 na CA enquanto usar armadura.' },
            { id: 'ranger_style_dueling', name: 'Duelo', description: '+2 dano com arma corpo-a-corpo em uma mão.' },
            { id: 'ranger_style_two_weapon', name: 'Duas Armas', description: 'Adiciona modificador ao dano do ataque extra.' },
            { id: 'ranger_style_blind_fighting', name: 'Combate às Cegas', description: 'Visão cega de 3m — enxerga criaturas invisíveis no raio.' },
            { id: 'ranger_style_thrown_weapon', name: 'Armas de Arremesso', description: 'Pode equipar armas de arremesso como ação bônus; +1 dano com elas.' },
          ],
        },
        {
          id: 'ranger_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Patrulheiro usando Sabedoria. Aprende magias conforme sobe de nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'ranger_archetype',
          name: 'Conclave de Patrulheiro',
          description: 'Escolha o arquétipo que define seu papel como patrulheiro. Features nos níveis 3, 7, 11 e 15.',
          type: 'choice',
          options: [
            { id: 'conclave_hunter', name: 'Caçador', description: 'Nível 3: escolha entre Colossus Slayer, Giant Killer ou Horde Breaker para eliminar alvos específicos.' },
            { id: 'conclave_beast_master', name: 'Mestre das Feras', description: 'Companheiro animal que segue comandos e luta ao seu lado. Pode montar e atacar junto.' },
            { id: 'conclave_gloom_stalker', name: 'Espreitador das Sombras', description: 'Mestre do escuro: Dread Ambusher (+1 ataque na surpresa), invisível para darkvision no escuro, +1d8 no primeiro ataque.' },
            { id: 'conclave_horizon_walker', name: 'Andante do Horizonte', description: 'Guardião dos planos. Detect Portal; Planar Warrior: +1d8 de força; Misty Step com Sabedoria.' },
            { id: 'conclave_monster_slayer', name: 'Caçador de Monstros', description: 'Hunter\'s Sense detecta imunidades/resistências; Slayer\'s Prey marca alvo para +1d6.' },
            { id: 'conclave_fey_wanderer', name: 'Errante Feérico', description: 'Toca feérico. Dreadful Strikes +1d4 psíquico; bônus em Enganação/Persuasão/Percepção = WIS.' },
            { id: 'conclave_swarmkeeper', name: 'Guardião do Enxame', description: 'Enxame de espíritos ao redor. Gathered Swarm: empurre, transporte ou cause dano extra nos ataques.' },
          ],
        },
        {
          id: 'ranger_primeval_awareness',
          name: 'Consciência Primeva',
          description: 'Gaste espaço de magia para detectar inimigos favoritos em 1,5 km (concentração, 1 min por nível do espaço). Não revela localização exata.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ranger_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'ranger_asi4_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'ranger_asi4_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'ranger_asi4_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'ranger_asi4_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; sem desvantagem em longa distância; -5 ataque +10 dano.' },
            { id: 'ranger_asi4_feat_crossbow', name: 'Talento: Especialista em Besta', description: 'Ignore Loading; sem desvantagem em corpo-a-corpo; ataque de bônus.' },
            { id: 'ranger_asi4_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'ranger_extra_attack',
          name: 'Ataque Extra',
          description: 'Você pode atacar duas vezes quando toma a ação de Atacar.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'ranger_favored_enemy_2',
          name: 'Inimigo Favorito (2°)',
          description: 'Escolha um segundo tipo de inimigo favorito e aprenda mais um idioma associado.',
          type: 'choice',
          options: [
            { id: 'enemy2_undead', name: 'Mortos-Vivos', description: 'Vantagem em rastrear e recordar sobre mortos-vivos.' },
            { id: 'enemy2_fiends', name: 'Demônios/Diabos', description: 'Vantagem em rastrear e recordar sobre demônios.' },
            { id: 'enemy2_giants', name: 'Gigantes', description: 'Vantagem em rastrear e recordar sobre gigantes.' },
            { id: 'enemy2_dragons', name: 'Dragões', description: 'Vantagem em rastrear e recordar sobre dragões.' },
            { id: 'enemy2_aberrations', name: 'Aberrações', description: 'Vantagem em rastrear e recordar sobre aberrações.' },
            { id: 'enemy2_constructs', name: 'Constructos', description: 'Vantagem em rastrear e recordar sobre constructos.' },
          ],
        },
        {
          id: 'ranger_natural_explorer_2',
          name: 'Explorador Natural (2° terreno)',
          description: 'Escolha um segundo terreno favorito para seus bônus de exploração.',
          type: 'choice',
          options: [
            { id: 'terrain2_forest', name: 'Floresta', description: 'Mestre das florestas.' },
            { id: 'terrain2_mountain', name: 'Montanha', description: 'Explorador de altitudes.' },
            { id: 'terrain2_swamp', name: 'Pântano', description: 'Sobrevivente de pântanos.' },
            { id: 'terrain2_underdark', name: 'Submundo', description: 'Explorador de cavernas.' },
            { id: 'terrain2_arctic', name: 'Ártico', description: 'Sobrevivente em climas gelados.' },
            { id: 'terrain2_grassland', name: 'Planície', description: 'Rastreador nas pastagens.' },
          ],
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'ranger_conclave_feature_7',
          name: 'Feature do Conclave (Nível 7)',
          description: 'Selecione a feature correspondente ao seu Conclave de Patrulheiro.',
          type: 'choice',
          options: [
            { id: 'ranger_l7_hunter', name: 'Caçador — Defensive Tactics', description: 'Escolha: Escape the Horde (sem ataques de oportunidade ao se mover), Multiattack Defense (+4 CA contra ataques adicionais após o primeiro), ou Steel Will (vantagem em resistências de medo).' },
            { id: 'ranger_l7_beast_master', name: 'Mestre das Feras — Exceptional Training', description: 'Ação bônus: ordene ao companheiro que use Dash, Disengage, Dodge ou Help. Ataques do companheiro são mágicos para superar resistências.' },
            { id: 'ranger_l7_gloom_stalker', name: 'Espreitador das Sombras — Iron Mind', description: 'Proficiência em resistências de Sabedoria. Se já tiver, ganha proficiência em INT ou CHA (sua escolha).' },
            { id: 'ranger_l7_horizon_walker', name: 'Andante do Horizonte — Ethereal Step', description: 'Ação bônus: entre no Plano Etéreo até o fim do turno. Você pode atravessar e ver através de objetos sólidos.' },
            { id: 'ranger_l7_monster_slayer', name: 'Caçador de Monstros — Supernatural Defense', description: 'Sempre que o alvo da Slayer\'s Prey forçar resistência ou fizer ataque de corpo contra você, some 1d6 ao resultado.' },
            { id: 'ranger_l7_fey_wanderer', name: 'Errante Feérico — Beguiling Twist', description: 'Resistência a encantamento e medo. Quando uma criatura próxima resistir a seu encantamento/medo, use reação: aplique o efeito em outro alvo em 9m (WIS para resistir).' },
            { id: 'ranger_l7_swarmkeeper', name: 'Guardião do Enxame — Writhing Tide', description: 'O enxame pode carregá-lo: velocidade de voo de 3m por turno como ação bônus por 1 minuto. Recarrega no descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ranger_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'ranger_asi8_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'ranger_asi8_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'ranger_asi8_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'ranger_asi8_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; -5 ataque +10 dano.' },
            { id: 'ranger_asi8_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'ranger_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
        {
          id: 'ranger_lands_stride',
          name: 'Passada da Terra',
          description: 'Terreno difícil não-mágico não custa movimento extra. Passa por vegetação não-mágica sem redução de velocidade e sem receber dano.',
          type: 'auto',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'ranger_spells_3rd',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'ranger_natural_explorer_3',
          name: 'Explorador Natural (3° terreno)',
          description: 'Escolha um terceiro terreno favorito.',
          type: 'choice',
          options: [
            { id: 'terrain3_forest', name: 'Floresta', description: 'Mestre das florestas.' },
            { id: 'terrain3_mountain', name: 'Montanha', description: 'Explorador de altitudes.' },
            { id: 'terrain3_desert', name: 'Deserto', description: 'Guia em terras áridas.' },
            { id: 'terrain3_underdark', name: 'Submundo', description: 'Explorador de cavernas.' },
            { id: 'terrain3_arctic', name: 'Ártico', description: 'Sobrevivente gelado.' },
            { id: 'terrain3_coast', name: 'Costa', description: 'Navegador costeiro.' },
          ],
        },
        {
          id: 'ranger_hide_in_plain_sight',
          name: 'Esconder-se à Vista',
          description: 'Gaste 1 minuto criando uma camuflagem. Enquanto imóvel, bônus +10 em testes de Furtividade. Movimento destrói a camuflagem.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'ranger_conclave_feature_11',
          name: 'Feature do Conclave (Nível 11)',
          description: 'Selecione a feature correspondente ao seu Conclave de Patrulheiro.',
          type: 'choice',
          options: [
            { id: 'ranger_l11_hunter', name: 'Caçador — Multiattack', description: 'Escolha: Volley (ataque à distância em todos em 3m de um ponto) ou Whirlwind Attack (ataque corpo-a-corpo em todas criaturas em alcance).' },
            { id: 'ranger_l11_beast_master', name: 'Mestre das Feras — Beast\'s Defense', description: 'Enquanto o companheiro puder vê-lo, ele tem vantagem em resistências.' },
            { id: 'ranger_l11_gloom_stalker', name: 'Espreitador das Sombras — Stalker\'s Flurry', description: 'Uma vez por turno, ao errar um ataque, você pode atacar novamente imediatamente com a mesma arma.' },
            { id: 'ranger_l11_horizon_walker', name: 'Andante do Horizonte — Distant Strike', description: 'Ao atacar (ação), você pode teletransportar-se até 3m antes de cada ataque. Se atacar alvos diferentes, ganhe um terceiro ataque.' },
            { id: 'ranger_l11_monster_slayer', name: 'Caçador de Monstros — Slayer\'s Counter', description: 'Quando o alvo da Slayer\'s Prey forçar resistência, use reação para atacar esse alvo. O dano do ataque cancela o efeito se acertar.' },
            { id: 'ranger_l11_fey_wanderer', name: 'Errante Feérico — Misty Wanderer', description: 'Você pode conjurar Misty Step sem gastar espaço de magia (WIS vezes por descanso longo). Ao usar, pode levar um aliado voluntário.' },
            { id: 'ranger_l11_swarmkeeper', name: 'Guardião do Enxame — Mighty Swarm', description: 'O enxame pode derrubar criaturas ou impor desvantagem em ataques além do efeito de Gathered Swarm. Raio aumenta para 9m.' },
          ],
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ranger_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'ranger_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'ranger_asi12_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'ranger_asi12_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'ranger_asi12_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; -5 ataque +10 dano.' },
            { id: 'ranger_asi12_feat_resilient', name: 'Talento: Resiliente (Constituição)', description: '+1 CON e proficiência em resistência de CON.' },
            { id: 'ranger_asi12_feat_tough', name: 'Talento: Resistente', description: 'HP máximo aumenta em 2 × nível.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'ranger_spells_4th',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'ranger_favored_enemy_3',
          name: 'Inimigo Favorito (3°)',
          description: 'Escolha um terceiro tipo de inimigo favorito e aprenda mais um idioma associado.',
          type: 'choice',
          options: [
            { id: 'enemy3_undead', name: 'Mortos-Vivos', description: 'Terceiro inimigo favorito.' },
            { id: 'enemy3_fiends', name: 'Demônios/Diabos', description: 'Terceiro inimigo favorito.' },
            { id: 'enemy3_aberrations', name: 'Aberrações', description: 'Mentes alien e aberrantes.' },
            { id: 'enemy3_celestials', name: 'Celestiais', description: 'Anjos e seres dos planos superiores.' },
            { id: 'enemy3_elementals', name: 'Elementais', description: 'Criaturas dos planos elementais.' },
            { id: 'enemy3_plants', name: 'Plantas', description: 'Criaturas vegetais animadas.' },
          ],
        },
        {
          id: 'ranger_vanish',
          name: 'Desaparecer',
          description: 'Você pode usar Esconder como ação bônus. Além disso, não pode ser rastreado por meios não-mágicos.',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'ranger_conclave_feature_15',
          name: 'Feature do Conclave (Nível 15)',
          description: 'Selecione a feature máxima correspondente ao seu Conclave de Patrulheiro.',
          type: 'choice',
          options: [
            { id: 'ranger_l15_hunter', name: 'Caçador — Stand Against the Tide', description: 'Quando um inimigo erra um ataque corpo-a-corpo contra você, use reação: force-o a atacar outra criatura (exceto a si mesmo) em alcance.' },
            { id: 'ranger_l15_beast_master', name: 'Mestre das Feras — Share Spells', description: 'Ao conjurar magia que afeta apenas você, pode fazer ela afetar também o companheiro se ele estiver em 9m.' },
            { id: 'ranger_l15_gloom_stalker', name: 'Espreitador das Sombras — Shadowy Dodge', description: 'Ao ser atacado, use reação para impor desvantagem no ataque sem precisar estar na sombra.' },
            { id: 'ranger_l15_horizon_walker', name: 'Andante do Horizonte — Spectral Defense', description: 'Ao sofrer dano de um ataque, use reação para ter resistência a TODOS os danos daquele ataque.' },
            { id: 'ranger_l15_monster_slayer', name: 'Caçador de Monstros — Slayer\'s Prey (aprimorado)', description: 'Você pode marcar um segundo alvo com Slayer\'s Prey sem gastar ação bônus. Quando o primeiro morrer, o segundo é marcado automaticamente.' },
            { id: 'ranger_l15_fey_wanderer', name: 'Errante Feérico — Fey Reinforcements', description: 'Uma vez por descanso longo, conjure Summon Fey sem gastar espaço de magia nem concentração (1 minuto). Você pode conversar com a criatura convocada.' },
            { id: 'ranger_l15_swarmkeeper', name: 'Guardião do Enxame — Swarming Dispersal', description: 'Ao sofrer dano, use reação: disperse o enxame temporariamente para ter resistência ao dano e teletransportar-se até 9m para espaço não ocupado.' },
          ],
        },
        {
          id: 'ranger_spells_5th',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ranger_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'ranger_asi16_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'ranger_asi16_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'ranger_asi16_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'ranger_asi16_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; -5 ataque +10 dano.' },
            { id: 'ranger_asi16_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'ranger_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'ranger_spells_bonus',
          name: 'Magias Aprimoradas',
          description: 'Suas magias de Patrulheiro de 1° nível tornam-se mais eficientes. Hunter\'s Mark não exige concentração neste nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'ranger_feral_senses',
          name: 'Sentidos Selvagens',
          description: 'Você ganha sentidos sobre-humanos: não sofre desvantagem em ataques contra criaturas invisíveis e pode detectar criaturas invisíveis em 9 metros.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ranger_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'ranger_asi19_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'ranger_asi19_wis2', name: '+2 Sabedoria', description: 'Aumenta Sabedoria em 2 pontos.' },
            { id: 'ranger_asi19_dex1wis1', name: '+1 Destreza / +1 Sabedoria', description: 'Aumenta DEX e WIS em 1 cada.' },
            { id: 'ranger_asi19_feat_sharpshooter', name: 'Talento: Atirador Certeiro', description: 'Ignore cobertura; -5 ataque +10 dano.' },
            { id: 'ranger_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'ranger_asi19_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'ranger_foe_slayer',
          name: 'Exterminador de Inimigos',
          description: 'Uma vez por turno, ao atacar seu Inimigo Favorito, some seu modificador de Sabedoria à jogada de ataque ou ao dano (sua escolha, após ver o resultado).',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── ROGUE ───────────────
  rogue: [
    {
      level: 1,
      features: [
        {
          id: 'rogue_expertise',
          name: 'Especialização',
          description: 'Dobre o bônus de proficiência em duas habilidades ou ferramentas com proficiência. Escolha mais dois em nível 6.',
          type: 'auto',
          pickSkills: [],
          pickCount: 2,
          pickType: 'expertise',
        },
        {
          id: 'rogue_sneak_attack_1d6',
          name: 'Ataque Furtivo (1d6)',
          description: 'Uma vez por turno, 1d6 extra com arma ágil/distância se tiver vantagem ou aliado adjacente.',
          type: 'auto',
        },
        {
          id: 'rogue_thieves_cant',
          name: 'Jargão dos Ladrões',
          description: 'Idioma secreto dos ladrões — mensagens ocultas em conversas e sinais.',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'rogue_cunning_action',
          name: 'Ação Astuta',
          description: 'Ação bônus para Dash, Disengage ou Hide.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_1d6_2',
          name: 'Ataque Furtivo (1d6 — nível 2)',
          description: 'Ataque Furtivo permanece em 1d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'rogue_archetype',
          name: 'Arquétipo de Ladino',
          description: 'Escolha sua especialização. Features nos níveis 3, 9, 13 e 17.',
          type: 'choice',
          options: [
            { id: 'rogue_arch_thief', name: 'Ladrão', description: 'Fast Hands (ação bônus com objetos/ferramentas), Second-Story Work (escalar/saltar), usar itens mágicos no nível 13.' },
            { id: 'rogue_arch_assassin', name: 'Assassino', description: 'Proficiência com kits de disfarce e veneno; Assassinate: vantagem e crítico automático em surpreendidos.' },
            { id: 'rogue_arch_arcane_trickster', name: 'Trickster Arcano', description: 'Conjura magias de Mago (Ilusão/Encantamento) com INT. Mão Mágica animada e Roubo de Magia mais tarde.' },
            { id: 'rogue_arch_swashbuckler', name: 'Espadachim', description: 'Fancy Footwork evita ataques de oportunidade; Rakish Audacity: Furtivo sem aliado em duelos 1v1.' },
            { id: 'rogue_arch_inquisitive', name: 'Inquisitivo', description: 'Ear for Deceit; Insightful Fighting: Ataque Furtivo contra alvo que você estudou.' },
            { id: 'rogue_arch_mastermind', name: 'Mestre das Sombras', description: 'Mestres da manipulação. Master of Tactics: Ajuda a 9 m; Mimetismo de Linguagem.' },
            { id: 'rogue_arch_scout', name: 'Batedora', description: 'Skirmisher (move metade ao ser atacado sem reação gasta); Survivalist: proficiência dupla em Natureza/Sobrevivência.' },
            { id: 'rogue_arch_phantom', name: 'Fantasma', description: 'Steal Essence: pega porção da alma de mortos; Whispers of the Dead: proficiência temporária; Tokens of the Departed.' },
            { id: 'rogue_arch_soulknife', name: 'Lâmina da Alma', description: 'Psychic Blades: materialized blades que usam DEX/STR; Psionic Power com dado de psi (d6→d12).' },
          ],
        },
        {
          id: 'rogue_sneak_attack_2d6',
          name: 'Ataque Furtivo (2d6)',
          description: 'Sobe para 2d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'rogue_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi4_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi4_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi4_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi4_feat_skulker', name: 'Talento: Emboscador', description: 'Esconda-se com luz tênue; errar não revela posição.' },
            { id: 'rogue_asi4_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'rogue_asi4_feat_mobile', name: 'Talento: Ágil', description: '+3m movimento; Dash não provoca oportunidade.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_2d6_l4',
          name: 'Ataque Furtivo (2d6 — nível 4)',
          description: 'Permanece em 2d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'rogue_uncanny_dodge',
          name: 'Esquiva Incansável',
          description: 'Reação para reduzir à metade o dano de um ataque que você consegue ver.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_3d6',
          name: 'Ataque Furtivo (3d6)',
          description: 'Sobe para 3d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'rogue_expertise_2',
          name: 'Especialização (2°)',
          description: 'Escolha mais duas habilidades ou ferramentas para dobrar o bônus de proficiência.',
          type: 'auto',
          pickSkills: [],
          pickCount: 2,
          pickType: 'expertise',
        },
        {
          id: 'rogue_sneak_attack_3d6_l6',
          name: 'Ataque Furtivo (3d6 — nível 6)',
          description: 'Permanece em 3d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'rogue_evasion',
          name: 'Evasão',
          description: 'Quando um efeito de área exige resistência de DEX: se passar, sem dano; se falhar, metade do dano.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_4d6',
          name: 'Ataque Furtivo (4d6)',
          description: 'Sobe para 4d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'rogue_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi8_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi8_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi8_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi8_feat_skulker', name: 'Talento: Emboscador', description: 'Esconda-se com luz tênue.' },
            { id: 'rogue_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
            { id: 'rogue_asi8_feat_resilient', name: 'Talento: Resiliente (CON)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_4d6_l8',
          name: 'Ataque Furtivo (4d6 — nível 8)',
          description: 'Permanece em 4d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'rogue_archetype_feature_9',
          name: 'Feature do Arquétipo (Nível 9)',
          description: 'Selecione a feature correspondente ao seu Arquétipo de Ladino.',
          type: 'choice',
          options: [
            { id: 'rogue_l9_thief', name: 'Ladrão — Supreme Sneak', description: 'Vantagem em Furtividade quando se mover a até metade da velocidade no turno.' },
            { id: 'rogue_l9_assassin', name: 'Assassino — Infiltration Expertise', description: 'Gaste 7 dias e 25 po para criar uma identidade falsa convincente. Com ela, você pode enganar até verificação mágica de identidade.' },
            { id: 'rogue_l9_arcane_trickster', name: 'Trickster Arcano — Magical Ambush', description: 'Se estiver escondido ao conjurar magia, o alvo tem desvantagem na resistência.' },
            { id: 'rogue_l9_swashbuckler', name: 'Espadachim — Elegant Maneuver', description: 'Ação bônus para ter vantagem no próximo Acrobatics ou Athletics no mesmo turno.' },
            { id: 'rogue_l9_inquisitive', name: 'Inquisitivo — Unerring Eye', description: 'Ação: detecte presença de ilusões, disfarces mágicos e transmutações em 9m. Usa WIS vezes por descanso longo.' },
            { id: 'rogue_l9_mastermind', name: 'Mestre das Sombras — Master of Intrigue', description: 'Proficiência em disfarces, falsificação e dois idiomas extras. Você pode imitar o sotaque de um idioma que conheça depois de ouvir por 1 minuto.' },
            { id: 'rogue_l9_scout', name: 'Batedora — Superior Mobility', description: 'Sua velocidade aumenta em 3m. Ao usar a ação Dash, não provoca ataques de oportunidade.' },
            { id: 'rogue_l9_phantom', name: 'Fantasma — Tokens of the Departed', description: 'Ao matar uma criatura, capture um fragmento da alma. Cada token dá vantagem em Death Saves ou proficiência temporária. Máximo WIS tokens simultâneos.' },
            { id: 'rogue_l9_soulknife', name: 'Lâmina da Alma — Soul Blades', description: 'Homing Strikes (gaste 1 dado psi se errar — relance) e Psychic Teleportation (ação bônus: gaste dado psi + lance uma Psychic Blade para teletransportar na distância do dano).' },
          ],
        },
        {
          id: 'rogue_sneak_attack_5d6',
          name: 'Ataque Furtivo (5d6)',
          description: 'Sobe para 5d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'rogue_asi_10',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi10_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi10_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi10_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi10_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
            { id: 'rogue_asi10_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash não provoca oportunidade.' },
            { id: 'rogue_asi10_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_5d6_l10',
          name: 'Ataque Furtivo (5d6 — nível 10)',
          description: 'Permanece em 5d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'rogue_reliable_talent',
          name: 'Talento Confiável',
          description: 'Ao fazer um teste de habilidade com proficiência, trate qualquer resultado de 9 ou menos como 10.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_6d6',
          name: 'Ataque Furtivo (6d6)',
          description: 'Sobe para 6d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'rogue_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi12_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi12_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi12_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi12_feat_skulker', name: 'Talento: Emboscador', description: 'Esconda-se com luz tênue.' },
            { id: 'rogue_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'rogue_asi12_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo e proficiência na resistência.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_6d6_l12',
          name: 'Ataque Furtivo (6d6 — nível 12)',
          description: 'Permanece em 6d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'rogue_archetype_feature_13',
          name: 'Feature do Arquétipo (Nível 13)',
          description: 'Selecione a feature correspondente ao seu Arquétipo de Ladino.',
          type: 'choice',
          options: [
            { id: 'rogue_l13_thief', name: 'Ladrão — Use Magic Device', description: 'Ignore os requerimentos de classe, raça e nível para usar itens mágicos.' },
            { id: 'rogue_l13_assassin', name: 'Assassino — Impostor', description: 'Após estudar uma criatura por 3 horas, você pode replicar suas maneirismos e voz com perfeição — vantagem em Enganação e resistência a detecção mágica de disfarce.' },
            { id: 'rogue_l13_arcane_trickster', name: 'Trickster Arcano — Versatile Trickster', description: 'Ação bônus: use Mágica Mão para distrair uma criatura em 1,5m da mão — você tem vantagem em ataques contra essa criatura neste turno.' },
            { id: 'rogue_l13_swashbuckler', name: 'Espadachim — Daring Fancy', description: 'Vantagem em resistências de medo. Ação bônus: corra até velocidade total sem provocar ataques de oportunidade.' },
            { id: 'rogue_l13_inquisitive', name: 'Inquisitivo — Steady Eye', description: 'Vantagem em Percepção e Investigação se não se mover mais que metade da velocidade no turno.' },
            { id: 'rogue_l13_mastermind', name: 'Mestre das Sombras — Misdirection', description: 'Ação bônus: redirecione a atenção de uma criatura. Ela usa Percepção contra você — se falhar, trate outra criatura adjacente como a origem de sons ou rastros.' },
            { id: 'rogue_l13_scout', name: 'Batedora — Ambush Master', description: 'Vantagem em Iniciativa. Criaturas que você atacar no primeiro turno de combate ficam com desvantagem nas resistências de seus aliados nesse turno.' },
            { id: 'rogue_l13_phantom', name: 'Fantasma — Ghost Walk', description: 'Ação bônus (gaste 1 token): entre em forma espectral por 10 minutos — velocidade de voo de 3m, atravesse criaturas, não pode ser agarrado. Ataques contra você têm desvantagem.' },
            { id: 'rogue_l13_soulknife', name: 'Lâmina da Alma — Psychic Veil', description: 'Ação (gaste 1 dado psi): fique invisível por 1 hora ou até atacar/conjurar/forçar resistência. Recarrega no descanso longo.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_7d6',
          name: 'Ataque Furtivo (7d6)',
          description: 'Sobe para 7d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'rogue_blindsense',
          name: 'Sentido Cego',
          description: 'Se puder ouvir, você detecta a localização de criaturas invisíveis ou ocultas em 3 metros.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_7d6_l14',
          name: 'Ataque Furtivo (7d6 — nível 14)',
          description: 'Permanece em 7d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'rogue_slippery_mind',
          name: 'Mente Escorregadia',
          description: 'Você ganha proficiência em resistências de Sabedoria.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_8d6',
          name: 'Ataque Furtivo (8d6)',
          description: 'Sobe para 8d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'rogue_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi16_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi16_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi16_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi16_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa.' },
            { id: 'rogue_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'rogue_asi16_feat_mobile', name: 'Talento: Ágil', description: '+3m; Dash sem oportunidade.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_8d6_l16',
          name: 'Ataque Furtivo (8d6 — nível 16)',
          description: 'Permanece em 8d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'rogue_archetype_feature_17',
          name: 'Feature do Arquétipo (Nível 17)',
          description: 'Selecione a feature máxima correspondente ao seu Arquétipo de Ladino.',
          type: 'choice',
          options: [
            { id: 'rogue_l17_thief', name: 'Ladrão — Thief\'s Reflexes', description: 'No primeiro turno de combate, você pode agir duas vezes — uma na iniciativa normal e outra com -10 na iniciativa.' },
            { id: 'rogue_l17_assassin', name: 'Assassino — Death Strike', description: 'Ao acertar uma criatura surpreendida, ela deve fazer resistência de CON (CD 8 + DEX + proficiência) ou sofrer o dano em dobro.' },
            { id: 'rogue_l17_arcane_trickster', name: 'Trickster Arcano — Spell Thief', description: 'Reação ao ser alvo de magia: o conjurador deve fazer resistência de CHA ou perde a magia da memória por 8 horas. Você pode conjurá-la uma vez durante esse período.' },
            { id: 'rogue_l17_swashbuckler', name: 'Espadachim — Master Duelist', description: 'Uma vez por descanso curto/longo: ao errar um ataque, relance-o com vantagem.' },
            { id: 'rogue_l17_inquisitive', name: 'Inquisitivo — Eye for Weakness', description: 'Ao usar Insightful Fighting, some 3d6 ao Ataque Furtivo contra esse alvo (além do dado normal).' },
            { id: 'rogue_l17_mastermind', name: 'Mestre das Sombras — Soul of Deceit', description: 'Sua mente não pode ser lida por telepatia. Você pode apresentar pensamentos falsos como verdadeiros — até Truth-Telling magic não funciona.' },
            { id: 'rogue_l17_scout', name: 'Batedora — Sudden Strike', description: 'Ao usar Cunning Action para Hide, você pode fazer um ataque extra como ação bônus com a arma de mão no mesmo turno.' },
            { id: 'rogue_l17_phantom', name: 'Fantasma — Death\'s Friend', description: 'Tokens of the Departed não precisam ser gastos para os benefícios — eles permanecem. Além disso, quando não tiver tokens, você tem visão verdadeira em 3m.' },
            { id: 'rogue_l17_soulknife', name: 'Lâmina da Alma — Rend Mind', description: 'Ao acertar com Psychic Blade: gaste 3 dados psi para forçar resistência de WIS ou o alvo fica atordoado até o fim do próximo turno.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_9d6',
          name: 'Ataque Furtivo (9d6)',
          description: 'Sobe para 9d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'rogue_elusive',
          name: 'Ilusório',
          description: 'Nenhuma jogada de ataque tem vantagem contra você enquanto não estiver incapacitado.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_9d6_l18',
          name: 'Ataque Furtivo (9d6 — nível 18)',
          description: 'Permanece em 9d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'rogue_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'rogue_asi19_dex2', name: '+2 Destreza', description: 'Aumenta Destreza em 2 pontos.' },
            { id: 'rogue_asi19_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'rogue_asi19_dex1int1', name: '+1 Destreza / +1 Inteligência', description: 'Aumenta DEX e INT em 1 cada.' },
            { id: 'rogue_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'rogue_asi19_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa.' },
            { id: 'rogue_asi19_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
        {
          id: 'rogue_sneak_attack_10d6',
          name: 'Ataque Furtivo (10d6)',
          description: 'Sobe para 10d6.',
          type: 'auto',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'rogue_stroke_of_luck',
          name: 'Golpe de Sorte',
          description: 'Se você falhar em uma jogada de ataque, trate como acerto. Se falhar em um teste de habilidade, trate como 20. Recarrega com descanso curto ou longo.',
          type: 'auto',
        },
        {
          id: 'rogue_sneak_attack_10d6_l20',
          name: 'Ataque Furtivo (10d6 — nível 20)',
          description: 'Permanece em 10d6.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── SORCERER ───────────────
  sorcerer: [
    {
      level: 1,
      features: [
        {
          id: 'sorcerer_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Feiticeiro usando Carisma como atributo de conjuração.',
          type: 'auto',
        },
        {
          id: 'sorcerer_origin',
          name: 'Origem Feiticeira',
          description: 'Escolha a origem do seu poder mágico inato. Features nos níveis 1, 6, 14 e 18.',
          type: 'choice',
          options: [
            { id: 'sorc_origin_draconic', name: 'Linhagem Dracônica', description: 'Sangue de dragão. HP+nível; sem armadura CA=13+DEX. Escolha tipo de dragão ancestral.' },
            { id: 'sorc_origin_wild', name: 'Magia Selvagem', description: 'Poder caótico. Tides of Chaos para vantagem; Wild Magic Surge após conjurar magias.' },
            { id: 'sorc_origin_divine_soul', name: 'Alma Divina', description: 'Abençoado pelos deuses. Acesso à lista de magias de Clérigo + cura com pontos de feitiçaria.' },
            { id: 'sorc_origin_shadow', name: 'Magia das Sombras', description: 'Poder do Shadowfell. Darkvision 36m; Eyes of the Dark; Strength of the Grave.' },
            { id: 'sorc_origin_storm', name: 'Feitiçaria da Tempestade', description: 'Nascido de uma tempestade. Wind Speaker; Tempestuous Magic; Heart of the Storm.' },
            { id: 'sorc_origin_aberrant', name: 'Mente Aberrante', description: 'Tocado por entidades cósmicas. Psionic Spells; Telepathic Speech; Warping Implosion.' },
            { id: 'sorc_origin_clockwork', name: 'Alma Mecânica', description: 'Conectado à magia de ordem cósmica. Restore Balance cancela vantagem/desvantagem.' },
          ],
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'sorcerer_font_of_magic',
          name: 'Fonte de Magia',
          description: 'Você tem 2 pontos de feitiçaria (sobe com nível). Converta em espaços de magia (Flexible Casting) ou use para Metamagia.',
          type: 'auto',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'sorcerer_metamagic_1',
          name: 'Metamagia — 1ª Opção',
          description: 'Escolha sua primeira opção de Metamagia.',
          type: 'choice',
          options: [
            { id: 'sorc_meta_careful', name: 'Magia Cuidadosa', description: '1 ponto: criaturas escolhidas passam automaticamente nas jogadas de resistência.' },
            { id: 'sorc_meta_distant', name: 'Magia Distante', description: '1 ponto: dobra o alcance (mínimo 9m se toque).' },
            { id: 'sorc_meta_empowered', name: 'Magia Potencializada', description: '1 ponto: relance até CHA dados de dano (pode combinar com outra Metamagia).' },
            { id: 'sorc_meta_extended', name: 'Magia Estendida', description: '1 ponto: dobra a duração (máx. 24h).' },
            { id: 'sorc_meta_heightened', name: 'Magia Intensificada', description: '3 pontos: um alvo tem desvantagem na primeira jogada de resistência.' },
            { id: 'sorc_meta_quickened', name: 'Magia Acelerada', description: '2 pontos: tempo de conjuração vira ação bônus.' },
            { id: 'sorc_meta_subtle', name: 'Magia Sutil', description: '1 ponto: conjura sem componentes verbais ou somáticos.' },
            { id: 'sorc_meta_twinned', name: 'Magia Geminada', description: 'X pontos (mín. 1): aplica a magia a um segundo alvo.' },
            { id: 'sorc_meta_seeking', name: 'Magia Buscadora', description: '2 pontos: relance um ataque mágico com perda; pode usar mesmo com outra Metamagia.' },
            { id: 'sorc_meta_transmuted', name: 'Magia Transmutada', description: '1 ponto: troca o tipo de dano da magia por outro elemental.' },
          ],
        },
        {
          id: 'sorcerer_metamagic_2',
          name: 'Metamagia — 2ª Opção',
          description: 'Escolha sua segunda opção de Metamagia.',
          type: 'choice',
          options: [
            { id: 'sorc_meta2_careful', name: 'Magia Cuidadosa', description: '1 ponto: aliados passam automaticamente nas resistências.' },
            { id: 'sorc_meta2_distant', name: 'Magia Distante', description: '1 ponto: dobra alcance.' },
            { id: 'sorc_meta2_empowered', name: 'Magia Potencializada', description: '1 ponto: relance dados de dano.' },
            { id: 'sorc_meta2_extended', name: 'Magia Estendida', description: '1 ponto: dobra duração.' },
            { id: 'sorc_meta2_heightened', name: 'Magia Intensificada', description: '3 pontos: desvantagem na resistência.' },
            { id: 'sorc_meta2_quickened', name: 'Magia Acelerada', description: '2 pontos: ação bônus.' },
            { id: 'sorc_meta2_subtle', name: 'Magia Sutil', description: '1 ponto: sem componentes V/S.' },
            { id: 'sorc_meta2_twinned', name: 'Magia Geminada', description: 'X pontos: segundo alvo.' },
            { id: 'sorc_meta2_seeking', name: 'Magia Buscadora', description: '2 pontos: relance ataque mágico.' },
            { id: 'sorc_meta2_transmuted', name: 'Magia Transmutada', description: '1 ponto: troca tipo de dano elemental.' },
          ],
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'sorcerer_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'sorc_asi4_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'sorc_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'sorc_asi4_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'sorc_asi4_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em CD de Concentração; ataque de oportunidade com magias.' },
            { id: 'sorc_asi4_feat_elemental', name: 'Talento: Adepto Elemental', description: 'Ignore resistência a um tipo de dano; 1s viram 2s.' },
            { id: 'sorc_asi4_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'sorcerer_3rd_level_spells',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'sorcerer_origin_feature_6',
          name: 'Feature da Origem (Nível 6)',
          description: 'Selecione a feature correspondente à sua Origem Feiticeira.',
          type: 'choice',
          options: [
            { id: 'sorc_l6_draconic', name: 'Linhagem Dracônica — Elemental Affinity', description: 'Adicione CHA ao dano de magias do tipo do seu dragão ancestral. Gaste 1 ponto de feitiçaria para resistência a esse dano por 1 hora.' },
            { id: 'sorc_l6_wild', name: 'Magia Selvagem — Bend Luck', description: 'Gaste 2 pontos de feitiçaria como reação: adicione ou subtraia 1d4 de qualquer jogada de ataque, teste ou resistência de outra criatura.' },
            { id: 'sorc_l6_divine', name: 'Alma Divina — Empowered Healing', description: 'Gaste 1 ponto de feitiçaria: relance qualquer número de dados de cura de uma magia conjurada por você ou aliado adjacente (uma vez por turno).' },
            { id: 'sorc_l6_shadow', name: 'Magia das Sombras — Hound of Ill Omen', description: 'Gaste 3 pontos: convoque um Cão do Mau Agouro (lobo sombrio) para perseguir um alvo — o alvo tem desvantagem nas jogadas de resistência às suas magias enquanto o cão estiver vivo.' },
            { id: 'sorc_l6_storm', name: 'Feitiçaria da Tempestade — Heart of the Storm', description: 'Resistência a dano de raio e trovão. Ao conjurar magia que cause esses danos, criaturas em 3m recebem dano do mesmo tipo igual a metade do nível do Feiticeiro.' },
            { id: 'sorc_l6_aberrant', name: 'Mente Aberrante — Psionic Spells', description: 'Magias psiônicas adicionais à sua lista (Dissonant Whispers, Tasha\'s Mind Whip, Detect Thoughts, Phantasmal Force, etc.).' },
            { id: 'sorc_l6_clockwork', name: 'Alma Mecânica — Bastion of Law', description: 'Gaste 1–5 pontos de feitiçaria: crie uma barreira em uma criatura, absorvendo 1d8 de dano por ponto gasto até o próximo descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'sorcerer_4th_level_spells',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'sorcerer_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'sorc_asi8_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'sorc_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'sorc_asi8_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'sorc_asi8_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'sorc_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'sorc_asi8_feat_resilient', name: 'Talento: Resiliente (CON)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'sorcerer_5th_level_spells',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'sorcerer_metamagic_3',
          name: 'Metamagia — 3ª Opção',
          description: 'Escolha uma terceira opção de Metamagia.',
          type: 'choice',
          options: [
            { id: 'sorc_meta3_careful', name: 'Magia Cuidadosa', description: '1 ponto: aliados passam nas resistências.' },
            { id: 'sorc_meta3_distant', name: 'Magia Distante', description: '1 ponto: dobra alcance.' },
            { id: 'sorc_meta3_empowered', name: 'Magia Potencializada', description: '1 ponto: relance dados de dano.' },
            { id: 'sorc_meta3_heightened', name: 'Magia Intensificada', description: '3 pontos: desvantagem na resistência.' },
            { id: 'sorc_meta3_quickened', name: 'Magia Acelerada', description: '2 pontos: ação bônus.' },
            { id: 'sorc_meta3_subtle', name: 'Magia Sutil', description: '1 ponto: sem componentes V/S.' },
            { id: 'sorc_meta3_twinned', name: 'Magia Geminada', description: 'X pontos: segundo alvo.' },
            { id: 'sorc_meta3_transmuted', name: 'Magia Transmutada', description: '1 ponto: troca tipo de dano elemental.' },
          ],
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'sorcerer_6th_level_spells',
          name: 'Magias de 6° Nível',
          description: 'Você ganha acesso a espaços de magia de 6° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'sorcerer_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'sorc_asi12_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'sorc_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'sorc_asi12_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'sorc_asi12_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'sorc_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'sorc_asi12_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura; aprenda truque de ataque.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'sorcerer_7th_level_spells',
          name: 'Magias de 7° Nível',
          description: 'Você ganha acesso a espaços de magia de 7° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'sorcerer_origin_feature_14',
          name: 'Feature da Origem (Nível 14)',
          description: 'Selecione a feature correspondente à sua Origem Feiticeira.',
          type: 'choice',
          options: [
            { id: 'sorc_l14_draconic', name: 'Linhagem Dracônica — Dragon Wings', description: 'Você pode gastar 1 ação bônus para manifestar asas de dragão e ganhar velocidade de voo igual à de movimento. As asas desaparecem ao usar armadura.' },
            { id: 'sorc_l14_wild', name: 'Magia Selvagem — Controlled Chaos', description: 'Ao rolar na tabela de Wild Magic Surge, role dois resultados e escolha qual usar.' },
            { id: 'sorc_l14_divine', name: 'Alma Divina — Otherworldly Wings', description: 'Você pode usar ação bônus para manifestar asas etéreas (celestiais ou infernais) com velocidade de voo de 18m. Você pode dispensá-las a qualquer momento.' },
            { id: 'sorc_l14_shadow', name: 'Magia das Sombras — Shadow Walk', description: 'Quando estiver em escuridão ou luz fraca, você pode usar ação bônus para se teletransportar para outro espaço de escuridão/luz fraca que possa ver em até 36m.' },
            { id: 'sorc_l14_storm', name: 'Feitiçaria da Tempestade — Storm\'s Fury', description: 'Ao ser atingido por ataque corpo-a-corpo, use reação: o atacante sofre 2d6 de dano de raio e é empurrado até 6m (resistência de CON para anular o empurrão).' },
            { id: 'sorc_l14_aberrant', name: 'Mente Aberrante — Warping Implosion', description: 'Ação: teletransporte para espaço em 30m; cada criatura em 9m do local original sofre 3d10 de força e é puxada para o lugar (resistência de STR anula).' },
            { id: 'sorc_l14_clockwork', name: 'Alma Mecânica — Trance of Order', description: 'Ação bônus: entre em transe por 1 minuto. Resultados de 9 ou menos em d20 viram 10; você não pode ter desvantagem. Recarrega no descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'sorcerer_8th_level_spells',
          name: 'Magias de 8° Nível',
          description: 'Você ganha acesso a espaços de magia de 8° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'sorcerer_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'sorc_asi16_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'sorc_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'sorc_asi16_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'sorc_asi16_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'sorc_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'sorc_asi16_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'sorcerer_9th_level_spells',
          name: 'Magias de 9° Nível',
          description: 'Você ganha acesso a espaços de magia de 9° nível.',
          type: 'auto',
        },
        {
          id: 'sorcerer_metamagic_4',
          name: 'Metamagia — 4ª Opção',
          description: 'Escolha uma quarta opção de Metamagia.',
          type: 'choice',
          options: [
            { id: 'sorc_meta4_careful', name: 'Magia Cuidadosa', description: '1 ponto.' },
            { id: 'sorc_meta4_distant', name: 'Magia Distante', description: '1 ponto.' },
            { id: 'sorc_meta4_empowered', name: 'Magia Potencializada', description: '1 ponto.' },
            { id: 'sorc_meta4_heightened', name: 'Magia Intensificada', description: '3 pontos.' },
            { id: 'sorc_meta4_quickened', name: 'Magia Acelerada', description: '2 pontos.' },
            { id: 'sorc_meta4_subtle', name: 'Magia Sutil', description: '1 ponto.' },
            { id: 'sorc_meta4_twinned', name: 'Magia Geminada', description: 'X pontos.' },
            { id: 'sorc_meta4_transmuted', name: 'Magia Transmutada', description: '1 ponto.' },
          ],
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'sorcerer_origin_feature_18',
          name: 'Feature da Origem (Nível 18)',
          description: 'Selecione a feature máxima correspondente à sua Origem Feiticeira.',
          type: 'choice',
          options: [
            { id: 'sorc_l18_draconic', name: 'Linhagem Dracônica — Draconic Presence', description: 'Ação + 5 pontos: emane uma aura de 18m de medo ou fascínio por 1 minuto (concentração). Criaturas que falharem em WIS ficam assustadas ou encantadas.' },
            { id: 'sorc_l18_wild', name: 'Magia Selvagem — Spell Bombardment', description: 'Ao rolar dano de magia: para cada dado que resultar no valor máximo, role-o novamente e some o resultado (uma vez por conjuração).' },
            { id: 'sorc_l18_divine', name: 'Alma Divina — Unearthly Recovery', description: 'Ação bônus quando tiver metade ou menos do HP máximo: recupere HP igual a metade do HP máximo. Recarrega no descanso longo.' },
            { id: 'sorc_l18_shadow', name: 'Magia das Sombras — Shadow Form', description: 'Ação + 6 pontos: transforme-se em uma forma sombria por 1 minuto. Resistência a todos os danos exceto psíquico e de força; movimento de 3m em espaços com obscurecimento.' },
            { id: 'sorc_l18_storm', name: 'Feitiçaria da Tempestade — Wind Soul', description: 'Imunidade a raio e trovão. Velocidade de voo de 18m. Ação + 1 ponto: conceda voo de 9m a até 3 aliados por 1 hora.' },
            { id: 'sorc_l18_aberrant', name: 'Mente Aberrante — Aberrant Form', description: 'Você pode usar ação bônus para assumir forma aberrante: resistência a dano psíquico, visão verdadeira 18m, tentáculos que podem segurar criaturas. Dura 10 minutos.' },
            { id: 'sorc_l18_clockwork', name: 'Alma Mecânica — Clockwork Cavalcade', description: 'Ação: invoque espíritos mecânicos numa esfera de 9m. Eles reparam estruturas, restauram até 100 HP distribuídos entre criaturas na área e neutralizam magias até 6° nível. Recarrega no descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'sorcerer_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'sorc_asi19_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'sorc_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'sorc_asi19_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'sorc_asi19_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'sorc_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'sorc_asi19_feat_elemental', name: 'Talento: Adepto Elemental', description: 'Ignore resistência elemental; 1s→2s.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'sorcerer_sorcerous_restoration',
          name: 'Restauração Feiticeira',
          description: 'Ao terminar um descanso curto, você recupera 4 pontos de feitiçaria gastos.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── WARLOCK ───────────────
  warlock: [
    {
      level: 1,
      features: [
        {
          id: 'warlock_patron',
          name: 'Patrono Sobrenatural',
          description: 'Escolha a entidade com quem fez seu pacto. Features nos níveis 1, 6, 10 e 14.',
          type: 'choice',
          options: [
            { id: 'wlock_patron_archfey', name: 'O Arquifada', description: 'Fey Presence: encantar/assustar em 3m; Misty Escape: teletransporte quando atingido; Beguiling Defenses; Dark Delirium.' },
            { id: 'wlock_patron_fiend', name: 'O Demônio', description: 'Dark One\'s Blessing: HP temp ao matar; Dark One\'s Own Luck; Fiendish Resilience; Hurl Through Hell.' },
            { id: 'wlock_patron_great_old_one', name: 'O Grande Ancião', description: 'Awakened Mind: telepacia 18m; Entropic Ward; Thought Shield; Create Thrall.' },
            { id: 'wlock_patron_celestial', name: 'O Celestial', description: 'Healing Light: cura com dado de cura; Radiant Soul; Celestial Resistance; Searing Vengeance.' },
            { id: 'wlock_patron_hexblade', name: 'O Senhor da Lâmina', description: 'Hex Warrior: usa CHA em ataques de uma arma; Hexblade\'s Curse; Accursed Specter; Master of Hexes.' },
            { id: 'wlock_patron_fathomless', name: 'O Insondável', description: 'Tentacle of the Deeps: tentáculo de combate; Gift of the Sea; Oceanic Soul; Guardian Coil; Grasping Tentacles; Fathomless Plunge.' },
            { id: 'wlock_patron_genie', name: 'O Gênio', description: 'Vessel of the Genie: espaço extra-dimensional; Elemental Gift; Sanctuary Vessel; Limited Wish.' },
          ],
        },
        {
          id: 'warlock_pact_magic',
          name: 'Magia do Pacto',
          description: 'Espaços de magia que se recuperam em descanso curto. Nível dos espaços sobe: 1 (nív.1-2), 2 (nív.3-4), 3 (nív.5-6), 4 (nív.7-8), 5 (nív.9-20).',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'warlock_invocations_2',
          name: 'Invocações Abissais (2)',
          description: 'Escolha 2 invocações que aprimoram suas habilidades.',
          type: 'choice',
          options: [
            { id: 'wlock_inv_agonizing', name: 'Eldritch Blast Agonizante', description: 'Adicione CHA ao dano de Eldritch Blast.' },
            { id: 'wlock_inv_armor_shadows', name: 'Armadura de Sombras', description: 'Mage Armor em si mesmo à vontade.' },
            { id: 'wlock_inv_devil_sight', name: 'Visão do Diabo', description: 'Visão no escuro mágico a 36m.' },
            { id: 'wlock_inv_eldritch_spear', name: 'Lança Abisal', description: 'Eldritch Blast alcance 90m.' },
            { id: 'wlock_inv_repelling', name: 'Expulsão Abisal', description: 'Eldritch Blast empurra 3m.' },
            { id: 'wlock_inv_grasp_hadar', name: 'Tentáculos de Hadar', description: 'Eldritch Blast puxa 3m para você.' },
            { id: 'wlock_inv_fiendish_vigor', name: 'Vigor Infernal', description: 'False Life de 1° à vontade.' },
            { id: 'wlock_inv_eyes_runekeeper', name: 'Olhos do Guardião de Runas', description: 'Leia qualquer escrita.' },
            { id: 'wlock_inv_mask_many_faces', name: 'Máscara de Muitos Rostos', description: 'Disguise Self à vontade.' },
            { id: 'wlock_inv_misty_visions', name: 'Visões Nubladas', description: 'Silent Image à vontade.' },
          ],
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'warlock_pact_boon',
          name: 'Dádiva do Pacto',
          description: 'Escolha o tipo de dádiva que seu patrono concede.',
          type: 'choice',
          options: [
            { id: 'wlock_boon_blade', name: 'Pacto da Lâmina', description: 'Crie arma de pacto em qualquer forma. Convocada como ação bônus; considerada mágica.' },
            { id: 'wlock_boon_chain', name: 'Pacto da Corrente', description: 'Familiar especial (quasit, pseudodragon, imp, sprite) que pode atacar como ação bônus.' },
            { id: 'wlock_boon_tome', name: 'Pacto do Grimório', description: 'Grimório com 3 truques de qualquer lista. Book of Ancient Secrets dá rituais.' },
            { id: 'wlock_boon_talisman', name: 'Pacto do Talismã', description: '+1d4 em testes de atributo com falha para o portador; invocações do talismã disponíveis.' },
          ],
        },
        {
          id: 'warlock_2nd_level_spells',
          name: 'Espaços de 2° Nível',
          description: 'Seus espaços de magia do Pacto sobem para 2° nível.',
          type: 'auto',
        },
        {
          id: 'warlock_invocations_3',
          name: 'Invocação Adicional (nível 3)',
          description: 'Escolha uma invocação adicional. Total: 3.',
          type: 'choice',
          options: [
            { id: 'wlock_inv3_book_secrets', name: 'Livro dos Segredos Antigos', description: 'Requer Pacto do Grimório. Ritual casting de 2 rituais, aprenda mais com tempo.' },
            { id: 'wlock_inv3_thirsting_blade', name: 'Lâmina Sedenta (nív.5)', description: 'Requer Pacto da Lâmina. Ataque duplo com arma do pacto.' },
            { id: 'wlock_inv3_chains_carceri', name: 'Correntes de Carceri (nív.15)', description: 'Hold Monster à vontade contra certos tipos de criaturas.' },
            { id: 'wlock_inv3_lance_lethargy', name: 'Lança da Letargia', description: 'Eldritch Blast reduz velocidade do alvo em 3m.' },
            { id: 'wlock_inv3_gaze_2minds', name: 'Olhar das Duas Mentes', description: 'Use ação; percepções de humanoide voluntário; concentração.' },
            { id: 'wlock_inv3_agonizing', name: 'Eldritch Blast Agonizante', description: 'Adicione CHA ao dano.' },
            { id: 'wlock_inv3_repelling', name: 'Expulsão Abisal', description: 'Empurra 3m.' },
            { id: 'wlock_inv3_mire_mind', name: 'Atoleiro da Mente (nív.5)', description: 'Slow à vontade.' },
          ],
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'warlock_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wlock_asi4_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'wlock_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wlock_asi4_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'wlock_asi4_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wlock_asi4_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura.' },
            { id: 'wlock_asi4_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'warlock_3rd_level_spells',
          name: 'Espaços de 3° Nível',
          description: 'Seus espaços de magia do Pacto sobem para 3° nível.',
          type: 'auto',
        },
        {
          id: 'warlock_invocations_5',
          name: 'Invocação Adicional (nível 5)',
          description: 'Escolha uma invocação adicional. Total: 5.',
          type: 'choice',
          options: [
            { id: 'wlock_inv5_thirsting', name: 'Lâmina Sedenta', description: 'Requer Pacto da Lâmina. Ataque duplo.' },
            { id: 'wlock_inv5_mire_mind', name: 'Atoleiro da Mente', description: 'Slow à vontade.' },
            { id: 'wlock_inv5_sign_ill_omen', name: 'Sinal do Mau Agouro', description: 'Bestow Curse à vontade.' },
            { id: 'wlock_inv5_dreadful_word', name: 'Palavra Terrível', description: 'Confusion uma vez por descanso longo.' },
            { id: 'wlock_inv5_sculptor_flesh', name: 'Escultor da Carne', description: 'Flesh to Stone uma vez por descanso longo.' },
            { id: 'wlock_inv5_agonizing', name: 'Eldritch Blast Agonizante', description: 'Adicione CHA ao dano.' },
          ],
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'warlock_patron_feature_6',
          name: 'Feature do Patrono (Nível 6)',
          description: 'Selecione a feature correspondente ao seu Patrono Sobrenatural.',
          type: 'choice',
          options: [
            { id: 'wlock_l6_archfey', name: 'O Arquifada — Misty Escape', description: 'Ao sofrer dano, use reação: fique invisível e teletransporte-se até 18m. A invisibilidade dura até o início do próximo turno ou até atacar/conjurar. Recarrega no descanso curto.' },
            { id: 'wlock_l6_fiend', name: 'O Demônio — Dark One\'s Own Luck', description: 'Ao fazer teste de atributo ou resistência, some 1d10 ao resultado. Recarrega no descanso curto.' },
            { id: 'wlock_l6_goo', name: 'O Grande Ancião — Entropic Ward', description: 'Reação quando um ataque acertar você: imponha desvantagem no ataque (antes do resultado). Se o ataque errar, você tem vantagem no próximo ataque contra essa criatura. Recarrega no descanso curto.' },
            { id: 'wlock_l6_celestial', name: 'O Celestial — Radiant Soul', description: 'Resistência a dano radiante. Ao conjurar magia que cause dano radiante ou de fogo, adicione seu modificador de CHA ao dano em um alvo.' },
            { id: 'wlock_l6_hexblade', name: 'O Senhor da Lâmina — Accursed Specter', description: 'Ao matar um humanoide, você pode invocá-lo como um espectro amaldiçoado. O espectro luta por você até o amanhecer seguinte.' },
            { id: 'wlock_l6_fathomless', name: 'O Insondável — Oceanic Soul', description: 'Resistência a dano de frio. Você pode se comunicar telepáticamente com qualquer criatura que possa respirar água.' },
            { id: 'wlock_l6_genie', name: 'O Gênio — Elemental Gift', description: 'Resistência a um tipo de dano (baseado no tipo do gênio). Como ação bônus, ganhe velocidade de voo de 9m por 10 minutos. Usa CHA vezes por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'warlock_invocations_7',
          name: 'Invocação Adicional (nível 7)',
          description: 'Escolha uma invocação adicional. Total: 6.',
          type: 'choice',
          options: [
            { id: 'wlock_inv7_bewitching_whispers', name: 'Sussurros Enfeitiçantes', description: 'Compulsion uma vez por descanso longo.' },
            { id: 'wlock_inv7_sculptor_flesh', name: 'Escultor da Carne', description: 'Polymorph uma vez por descanso longo.' },
            { id: 'wlock_inv7_ghostly_gaze', name: 'Olhar Fantasmal', description: 'Visão através de paredes (concentração, 1 minuto).' },
            { id: 'wlock_inv7_trickster_escape', name: 'Fuga do Trickster', description: 'Freedom of Movement em si mesmo uma vez por descanso longo.' },
            { id: 'wlock_inv7_agonizing', name: 'Eldritch Blast Agonizante', description: 'Adicione CHA ao dano.' },
            { id: 'wlock_inv7_repelling', name: 'Expulsão Abisal', description: 'Empurra alvo 3m.' },
          ],
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'warlock_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wlock_asi8_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'wlock_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wlock_asi8_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'wlock_asi8_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wlock_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wlock_asi8_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
        {
          id: 'warlock_4th_level_spells',
          name: 'Espaços de 4° Nível',
          description: 'Seus espaços de magia do Pacto sobem para 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'warlock_invocations_9',
          name: 'Invocação Adicional (nível 9)',
          description: 'Escolha uma invocação adicional. Total: 7.',
          type: 'choice',
          options: [
            { id: 'wlock_inv9_ascendant_step', name: 'Passo Ascendente', description: 'Levitate em si mesmo à vontade.' },
            { id: 'wlock_inv9_otherworldly_leap', name: 'Salto Extraplanar', description: 'Jump em si mesmo à vontade.' },
            { id: 'wlock_inv9_whispers_grave', name: 'Sussurros do Túmulo', description: 'Speak with Dead à vontade.' },
            { id: 'wlock_inv9_gift_ever_living', name: 'Dom do Ser Eterno', description: 'Ao rolar HP em descanso, use valor máximo dado do familiar/arma do pacto.' },
            { id: 'wlock_inv9_agonizing', name: 'Eldritch Blast Agonizante', description: 'CHA ao dano.' },
            { id: 'wlock_inv9_minions_chaos', name: 'Minions do Caos (nív.9)', description: 'Conjure Elemental uma vez por descanso longo.' },
          ],
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'warlock_patron_feature_10',
          name: 'Feature do Patrono (Nível 10)',
          description: 'Selecione a feature correspondente ao seu Patrono Sobrenatural.',
          type: 'choice',
          options: [
            { id: 'wlock_l10_archfey', name: 'O Arquifada — Beguiling Defenses', description: 'Imunidade a ser encantado. Quando uma criatura tentar encantá-lo, você pode usar reação para fazê-la fazer resistência de WIS ou ficar encantada por você por 1 minuto.' },
            { id: 'wlock_l10_fiend', name: 'O Demônio — Fiendish Resilience', description: 'Após um descanso curto ou longo, escolha um tipo de dano. Você tem resistência a esse tipo até a próxima escolha.' },
            { id: 'wlock_l10_goo', name: 'O Grande Ancião — Thought Shield', description: 'Seus pensamentos não podem ser lidos por telepatia. Resistência a dano psíquico. Quando alguém causar dano psíquico a você, sofre a mesma quantidade de volta.' },
            { id: 'wlock_l10_celestial', name: 'O Celestial — Celestial Resistance', description: 'Você ganha resistência a dano necrótico e radiante.' },
            { id: 'wlock_l10_hexblade', name: 'O Senhor da Lâmina — Master of Hexes', description: 'Ao matar um alvo marcado com Hex, você pode mover a maldição para uma nova criatura em 9m sem gastar espaço de magia.' },
            { id: 'wlock_l10_fathomless', name: 'O Insondável — Guardian Coil', description: 'O Tentáculo das Profundezas pode proteger você ou um aliado: ao sofrer dano, use reação para que o tentáculo reduza o dano em 1d8.' },
            { id: 'wlock_l10_genie', name: 'O Gênio — Sanctuary Vessel', description: 'Ao entrar no Vessel do Gênio, até 5 criaturas aliadas podem entrar junto. Criaturas que descansarem curto dentro recuperam HP extra igual ao bônus de proficiência.' },
          ],
        },
        {
          id: 'warlock_5th_level_spells',
          name: 'Espaços de 5° Nível',
          description: 'Seus espaços de magia do Pacto sobem para 5° nível e permanecem assim até o nível 20.',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'warlock_mystic_arcanum_6',
          name: 'Arcano Místico (6° Nível)',
          description: 'Escolha uma magia de 6° nível da lista de Warlock. Pode conjurá-la uma vez por descanso longo sem espaço de magia.',
          type: 'auto',
        },
        {
          id: 'warlock_invocations_11',
          name: 'Invocação Adicional (nível 11)',
          description: 'Escolha uma invocação adicional. Total: 8.',
          type: 'choice',
          options: [
            { id: 'wlock_inv11_shroud_shadow', name: 'Manto das Sombras', description: 'Invisibility em si mesmo à vontade.' },
            { id: 'wlock_inv11_master_myriad_forms', name: 'Mestre das Mil Formas', description: 'Alter Self à vontade.' },
            { id: 'wlock_inv11_visions_distant', name: 'Visões de Reinos Distantes', description: 'Arcane Eye à vontade.' },
            { id: 'wlock_inv11_chains_carceri', name: 'Correntes de Carceri', description: 'Hold Monster à vontade contra certos tipos.' },
            { id: 'wlock_inv11_agonizing', name: 'Eldritch Blast Agonizante', description: 'CHA ao dano.' },
            { id: 'wlock_inv11_thirsting', name: 'Lâmina Sedenta', description: 'Ataque duplo com arma do pacto.' },
          ],
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'warlock_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wlock_asi12_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'wlock_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wlock_asi12_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'wlock_asi12_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wlock_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wlock_asi12_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'warlock_mystic_arcanum_7',
          name: 'Arcano Místico (7° Nível)',
          description: 'Escolha uma magia de 7° nível da lista de Warlock. Uma vez por descanso longo sem espaço.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'warlock_patron_feature_14',
          name: 'Feature do Patrono (Nível 14)',
          description: 'Selecione a feature máxima correspondente ao seu Patrono Sobrenatural.',
          type: 'choice',
          options: [
            { id: 'wlock_l14_archfey', name: 'O Arquifada — Dark Delirium', description: 'Ação: envolva uma criatura em ilusão de 1 minuto (concentração). Ela fica incapacitada e desorientada; não pode ver criaturas além de 3m. WIS CD para resistir no final de cada turno.' },
            { id: 'wlock_l14_fiend', name: 'O Demônio — Hurl Through Hell', description: 'Ao acertar um ataque: teletransporte o alvo para um plano infernal. No início do seu próximo turno ele retorna e sofre 10d10 de dano psíquico (sem resistência). Recarrega no descanso longo.' },
            { id: 'wlock_l14_goo', name: 'O Grande Ancião — Create Thrall', description: 'Toque em um humanoide incapacitado: ele fica encantado por você permanentemente, a menos que você o dispense ou ele receba Remove Curse. Você tem link telepático com cada thrall.' },
            { id: 'wlock_l14_celestial', name: 'O Celestial — Searing Vengeance', description: 'Ao recuperar HP de Death Saving Throw, você pode se levantar e irradiar luz: cada criatura em 9m sofre 2d8 + CHA de dano radiante e fica cega até o fim do próximo turno.' },
            { id: 'wlock_l14_hexblade', name: 'O Senhor da Lâmina — Master of Hexes (aprimorado)', description: 'Hexblade\'s Curse recarrega no descanso curto. Além disso, ao matar o alvo da maldição, recupera HP igual ao nível + CHA.' },
            { id: 'wlock_l14_fathomless', name: 'O Insondável — Grasping Tentacles', description: 'Conjure Evard\'s Black Tentacles uma vez por descanso longo sem gastar espaço. Você tem resistência ao dano de contenção e não sofre desvantagem em ataques quando na área.' },
            { id: 'wlock_l14_genie', name: 'O Gênio — Limited Wish', description: 'Declare desejo de um efeito de magia de 6° nível ou menor de qualquer lista. O gênio concede o efeito sem componentes. Recarrega em 1d4 descansos longos.' },
          ],
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'warlock_mystic_arcanum_8',
          name: 'Arcano Místico (8° Nível)',
          description: 'Escolha uma magia de 8° nível da lista de Warlock. Uma vez por descanso longo sem espaço.',
          type: 'auto',
        },
        {
          id: 'warlock_invocations_15',
          name: 'Invocação Adicional (nível 15)',
          description: 'Escolha uma invocação adicional. Total: 9.',
          type: 'choice',
          options: [
            { id: 'wlock_inv15_shroud_shadow', name: 'Manto das Sombras', description: 'Invisibility em si mesmo à vontade.' },
            { id: 'wlock_inv15_chains_carceri', name: 'Correntes de Carceri', description: 'Hold Monster à vontade.' },
            { id: 'wlock_inv15_master_forms', name: 'Mestre das Mil Formas', description: 'Alter Self à vontade.' },
            { id: 'wlock_inv15_visions', name: 'Visões de Reinos Distantes', description: 'Arcane Eye à vontade.' },
            { id: 'wlock_inv15_agonizing', name: 'Eldritch Blast Agonizante', description: 'CHA ao dano.' },
            { id: 'wlock_inv15_lifedrinker', name: 'Bebedor de Vida (nív.12)', description: 'Requer Pacto da Lâmina. Dano necrótico extra = mod CHA nos ataques da arma.' },
          ],
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'warlock_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wlock_asi16_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'wlock_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wlock_asi16_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'wlock_asi16_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wlock_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wlock_asi16_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'warlock_mystic_arcanum_9',
          name: 'Arcano Místico (9° Nível)',
          description: 'Escolha uma magia de 9° nível da lista de Warlock. Uma vez por descanso longo sem espaço.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'warlock_invocations_18',
          name: 'Invocação Adicional (nível 18)',
          description: 'Escolha uma invocação adicional. Total: 10.',
          type: 'choice',
          options: [
            { id: 'wlock_inv18_shroud_shadow', name: 'Manto das Sombras', description: 'Invisibility à vontade.' },
            { id: 'wlock_inv18_master_forms', name: 'Mestre das Mil Formas', description: 'Alter Self à vontade.' },
            { id: 'wlock_inv18_agonizing', name: 'Eldritch Blast Agonizante', description: 'CHA ao dano.' },
            { id: 'wlock_inv18_lifedrinker', name: 'Bebedor de Vida', description: 'Dano necrótico extra = mod CHA.' },
            { id: 'wlock_inv18_visions', name: 'Visões de Reinos Distantes', description: 'Arcane Eye à vontade.' },
            { id: 'wlock_inv18_chains', name: 'Correntes de Carceri', description: 'Hold Monster à vontade.' },
          ],
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'warlock_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wlock_asi19_cha2', name: '+2 Carisma', description: 'Aumenta Carisma em 2 pontos.' },
            { id: 'wlock_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wlock_asi19_cha1con1', name: '+1 Carisma / +1 Constituição', description: 'Aumenta CHA e CON em 1 cada.' },
            { id: 'wlock_asi19_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wlock_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wlock_asi19_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'warlock_eldritch_master',
          name: 'Mestre Abisal',
          description: 'Você pode pedir a seu patrono para restaurar todos os seus espaços de magia do Pacto. Requer 1 minuto de súplica. Recarrega com descanso longo.',
          type: 'auto',
        },
      ],
    },
  ],

  // ─────────────── WIZARD ───────────────
  wizard: [
    {
      level: 1,
      features: [
        {
          id: 'wizard_spellcasting',
          name: 'Conjuração de Magias',
          description: 'Conjura magias de Mago usando Inteligência. Grimório com 6 magias de 1° nível; aprende 2 novas por nível.',
          type: 'auto',
        },
        {
          id: 'wizard_arcane_recovery',
          name: 'Recuperação Arcana',
          description: 'Uma vez por descanso longo, após descanso curto, recupere espaços totalizando metade do nível (arred. para cima, máx. 5° nível cada).',
          type: 'auto',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wizard_arcane_tradition',
          name: 'Tradição Arcana',
          description: 'Escolha a escola de magia ou tradição. Features nos níveis 2, 6, 10 e 14.',
          type: 'choice',
          options: [
            { id: 'wiz_school_evocation', name: 'Evocação', description: 'Sculpt Spells: aliados em área de efeito passam automaticamente; Potent Cantrip; Empowered Evocation; Overchannel.' },
            { id: 'wiz_school_abjuration', name: 'Abjuração', description: 'Arcane Ward: escudo de HP ao conjurar Abjuração; Projected Ward; Improved Abjuration; Spell Resistance.' },
            { id: 'wiz_school_conjuration', name: 'Conjuração', description: 'Minor Conjuration; Benign Transposition; Focused Conjuration; Durable Summons.' },
            { id: 'wiz_school_divination', name: 'Adivinhação', description: 'Portent: 2 dados pré-rolados por dia; Expert Divination; The Third Eye; Greater Portent.' },
            { id: 'wiz_school_enchantment', name: 'Encantamento', description: 'Hypnotic Gaze; Instinctive Charm; Split Enchantment; Alter Memories.' },
            { id: 'wiz_school_illusion', name: 'Ilusão', description: 'Improved Minor Illusion; Malleable Illusions; Illusory Self; Illusory Reality.' },
            { id: 'wiz_school_necromancy', name: 'Necromancia', description: 'Grim Harvest; Undead Thralls; Inured to Undeath; Command Undead.' },
            { id: 'wiz_school_transmutation', name: 'Transmutação', description: 'Minor Alchemy; Transmuter\'s Stone; Shapechanger; Master Transmuter.' },
            { id: 'wiz_school_chronurgy', name: 'Cronurgia', description: 'Chronal Shift: reroll de qualquer jogada próxima; Temporal Awareness; Momentary Stasis; Convergent Future.' },
            { id: 'wiz_school_bladesinging', name: 'Canto da Lâmina', description: 'Bladesong: CA+INT bônus, +10 velocidade, vantagem em Acrobatics; Extra Attack (nív.6); Song of Defense; Song of Victory.' },
            { id: 'wiz_school_order_of_scribes', name: 'Ordem dos Escribas', description: 'Wizardly Quill; Awakened Spellbook; Manifest Mind; Master Scrivener; One with the Word.' },
            { id: 'wiz_school_war_magic', name: 'Magia de Guerra', description: 'Arcane Deflection; Tactical Wit (+INT em Iniciativa); Power Surge; Durable Magic; Deflecting Shroud.' },
          ],
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'wizard_2nd_level_spells',
          name: 'Magias de 2° Nível',
          description: 'Você ganha acesso a espaços de magia de 2° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'wizard_asi_4',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wiz_asi4_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'wiz_asi4_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wiz_asi4_int1con1', name: '+1 Inteligência / +1 Constituição', description: 'Aumenta INT e CON em 1 cada.' },
            { id: 'wiz_asi4_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração; ataque de oportunidade com magias.' },
            { id: 'wiz_asi4_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura.' },
            { id: 'wiz_asi4_feat_keen_mind', name: 'Talento: Mente Perspicaz', description: '+1 INT; memória fotográfica; sempre sabe direção norte.' },
          ],
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'wizard_3rd_level_spells',
          name: 'Magias de 3° Nível',
          description: 'Você ganha acesso a espaços de magia de 3° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'wizard_tradition_feature_6',
          name: 'Feature da Tradição (Nível 6)',
          description: 'Segunda feature da Tradição Arcana. (Evocação: Potent Cantrip | Abjuração: Projected Ward | Adivinhação: Expert Divination | Ilusão: Malleable Illusions | Necromancia: Undead Thralls | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'wizard_4th_level_spells',
          name: 'Magias de 4° Nível',
          description: 'Você ganha acesso a espaços de magia de 4° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wizard_asi_8',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wiz_asi8_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'wiz_asi8_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wiz_asi8_int1con1', name: '+1 Inteligência / +1 Constituição', description: 'Aumenta INT e CON em 1 cada.' },
            { id: 'wiz_asi8_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wiz_asi8_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wiz_asi8_feat_resilient', name: 'Talento: Resiliente (CON)', description: '+1 CON e proficiência em resistência de CON.' },
          ],
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'wizard_5th_level_spells',
          name: 'Magias de 5° Nível',
          description: 'Você ganha acesso a espaços de magia de 5° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'wizard_tradition_feature_10',
          name: 'Feature da Tradição (Nível 10)',
          description: 'Terceira feature da Tradição Arcana. (Evocação: Empowered Evocation | Abjuração: Improved Abjuration | Adivinhação: The Third Eye | Ilusão: Illusory Self | Necromancia: Inured to Undeath | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'wizard_6th_level_spells',
          name: 'Magias de 6° Nível',
          description: 'Você ganha acesso a espaços de magia de 6° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'wizard_asi_12',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wiz_asi12_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'wiz_asi12_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wiz_asi12_int1con1', name: '+1 Inteligência / +1 Constituição', description: 'Aumenta INT e CON em 1 cada.' },
            { id: 'wiz_asi12_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wiz_asi12_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wiz_asi12_feat_spell_sniper', name: 'Talento: Atirador de Magias', description: 'Dobra alcance; ignore cobertura.' },
          ],
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'wizard_7th_level_spells',
          name: 'Magias de 7° Nível',
          description: 'Você ganha acesso a espaços de magia de 7° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'wizard_tradition_feature_14',
          name: 'Feature da Tradição (Nível 14)',
          description: 'Quarta e última feature da Tradição. (Evocação: Overchannel — maximize dano sem custo, mas dano necrótico ao usar em seguida | Abjuração: Spell Resistance | Adivinhação: Greater Portent | Ilusão: Illusory Reality | Necromancia: Command Undead | etc.)',
          type: 'auto',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'wizard_8th_level_spells',
          name: 'Magias de 8° Nível',
          description: 'Você ganha acesso a espaços de magia de 8° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'wizard_asi_16',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wiz_asi16_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'wiz_asi16_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wiz_asi16_int1con1', name: '+1 Inteligência / +1 Constituição', description: 'Aumenta INT e CON em 1 cada.' },
            { id: 'wiz_asi16_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wiz_asi16_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wiz_asi16_feat_alert', name: 'Talento: Alerta', description: '+5 iniciativa; não surpreendido.' },
          ],
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'wizard_9th_level_spells',
          name: 'Magias de 9° Nível',
          description: 'Você ganha acesso ao pináculo da magia — espaços de 9° nível.',
          type: 'auto',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'wizard_spell_mastery',
          name: 'Maestria de Magia',
          description: 'Escolha uma magia de 1° e uma de 2° nível do grimório. Conjure-as sem gastar espaço (no nível mais baixo). Troque escolhas com 8h de estudo.',
          type: 'auto',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'wizard_asi_19',
          name: 'Melhoria de Atributo',
          description: 'Aumente um atributo em +2 ou dois em +1 (máx. 20), ou adquira um talento.',
          type: 'choice',
          options: [
            { id: 'wiz_asi19_int2', name: '+2 Inteligência', description: 'Aumenta Inteligência em 2 pontos.' },
            { id: 'wiz_asi19_con2', name: '+2 Constituição', description: 'Aumenta Constituição em 2 pontos.' },
            { id: 'wiz_asi19_int1con1', name: '+1 Inteligência / +1 Constituição', description: 'Aumenta INT e CON em 1 cada.' },
            { id: 'wiz_asi19_feat_warcaster', name: 'Talento: Conjurador de Guerra', description: 'Vantagem em Concentração.' },
            { id: 'wiz_asi19_feat_lucky', name: 'Talento: Sortudo', description: '3 pontos de sorte.' },
            { id: 'wiz_asi19_feat_resilient', name: 'Talento: Resiliente', description: '+1 atributo + proficiência em resistência.' },
          ],
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'wizard_signature_spells',
          name: 'Magias Assinatura',
          description: 'Escolha duas magias de 3° nível do grimório como suas assinaturas. Conjure cada uma delas uma vez sem espaço. Ambas recarregam no descanso curto.',
          type: 'auto',
        },
      ],
    },
  ],
};

export function getFeaturesForLevel(classId: string, level: number): ClassFeature[] {
  const classFeatures = CLASS_FEATURES[classId];
  if (!classFeatures) return [];
  const levelData = classFeatures.find((lf) => lf.level === level);
  return levelData?.features ?? [];
}

/**
 * Returns a map of optionId -> optionName for every choice option in the given class.
 * Used to look up the display names of previously selected traits.
 */
export function getOptionNameMapForClass(classId: string): Map<string, string> {
  const map = new Map<string, string>();
  const classData = CLASS_FEATURES[classId];
  if (!classData) return map;
  classData.forEach((levelData) => {
    levelData.features.forEach((feature) => {
      feature.options?.forEach((opt) => {
        map.set(opt.id, opt.name);
      });
    });
  });
  return map;
}

/**
 * Parses ASI choice option IDs and accumulates the total ability score bonuses
 * from all chosen ASI traits. Only options whose ID contains '_asi' and end in
 * a pattern like 'str2', 'dex1wis1', 'cha1con1', etc. are counted.
 * Options that end in a feat name (no trailing digit group) are skipped.
 *
 * Examples of IDs that yield bonuses:
 *   barb_asi4_str2       → { strength: 2 }
 *   sorc_asi4_cha1con1   → { charisma: 1, constitution: 1 }
 *   wiz_asi8_int2        → { intelligence: 2 }
 *
 * Examples that are ignored:
 *   barb_asi4_feat_grappler  (feat — no digit groups in last segment)
 *   barbarian_rage           (no '_asi' in id)
 */
const ABBREV_TO_ABILITY: Record<string, 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'> = {
  str: 'strength',
  dex: 'dexterity',
  con: 'constitution',
  int: 'intelligence',
  wis: 'wisdom',
  cha: 'charisma',
};

type AbilityKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
type AbilityBonus = Partial<Record<AbilityKey, number>>;

/** Known feats that grant +1 to a specific ability score (not encoded in the ID suffix) */
const FEAT_KNOWN_BONUSES: Record<string, AbilityBonus> = {
  // Resiliente (CON) — most classes
  bard_asi8_feat_resilient:    { constitution: 1 },
  bard_asi16_feat_resilient:   { constitution: 1 },
  cleric_asi4_feat_resilient:  { constitution: 1 },
  cleric_asi12_feat_resilient: { constitution: 1 },
  cleric_asi19_feat_resilient: { constitution: 1 },
  druid_asi4_feat_resilient:   { constitution: 1 },
  druid_asi12_feat_resilient:  { constitution: 1 },
  druid_asi19_feat_resilient:  { constitution: 1 },
  monk_asi12_feat_resilient:   { constitution: 1 },
  paladin_asi16_feat_resilient: { constitution: 1 },
  ranger_asi12_feat_resilient: { constitution: 1 },
  rogue_asi8_feat_resilient:   { constitution: 1 },
  rogue_asi12_feat_resilient:  { constitution: 1 },
  rogue_asi19_feat_resilient:  { constitution: 1 },
  sorc_asi8_feat_resilient:    { constitution: 1 },
  sorc_asi16_feat_resilient:   { constitution: 1 },
  wlock_asi8_feat_resilient:   { constitution: 1 },
  wlock_asi12_feat_resilient:  { constitution: 1 },
  wlock_asi19_feat_resilient:  { constitution: 1 },
  wiz_asi8_feat_resilient:     { constitution: 1 },
  wiz_asi19_feat_resilient:    { constitution: 1 },
  // Resiliente (SAB) — barbarian, fighter
  barb_asi16_feat_resilient:     { wisdom: 1 },
  fighter_asi16_feat_resilient:  { wisdom: 1 },
  // Atleta (+1 STR)
  barb_asi12_feat_athlete:     { strength: 1 },
};

export function computeAsiTotals(
  traits: string[],
  asiChoices?: Record<string, Partial<Record<AbilityKey, number>>>,
): Partial<Record<'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma', number>> {
  const totals: Partial<Record<AbilityKey, number>> = {};

  // Collect which _asiN patterns are covered by asiChoices (to skip old trait parsing for those)
  const coveredAsiPatterns = new Set<string>();
  if (asiChoices) {
    for (const [featureId, bonuses] of Object.entries(asiChoices)) {
      // featureId e.g. 'barbarian_asi4' → extract '_asi4'
      const m = featureId.match(/_asi\d+/);
      if (m) coveredAsiPatterns.add(m[0]);
      for (const [ability, value] of Object.entries(bonuses) as [AbilityKey, number][]) {
        if (value) totals[ability] = (totals[ability] ?? 0) + value;
      }
    }
  }

  traits.forEach((traitId) => {
    // Check known-feat bonuses map first (only if not covered by asiChoices)
    const coveredByChoice = [...coveredAsiPatterns].some((pat) => traitId.includes(pat));
    if (coveredByChoice) return;

    const known = FEAT_KNOWN_BONUSES[traitId];
    if (known) {
      for (const [ability, value] of Object.entries(known) as [AbilityKey, number][]) {
        totals[ability] = (totals[ability] ?? 0) + value;
      }
      return;
    }

    if (!traitId.includes('_asi')) return;
    const parts = traitId.split('_');
    const statPart = parts[parts.length - 1]; // e.g. 'str2', 'cha1con1'
    const regex = /([a-z]+)(\d+)/g;
    let match;
    while ((match = regex.exec(statPart)) !== null) {
      const ability = ABBREV_TO_ABILITY[match[1]];
      if (ability) totals[ability] = (totals[ability] ?? 0) + parseInt(match[2]);
    }
  });
  return totals;
}
