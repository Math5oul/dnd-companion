/** Calcula o modificador de atributo D&D 5e */
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Formata o modificador com sinal (+3, -1, +0) */
export function formatModifier(score: number): string {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Rola 4d6 e descarta o menor (método padrão de D&D) */
export function rollAbilityScore(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((sum, n) => sum + n, 0);
}

/** Gera um conjunto completo de 6 atributos */
export function rollAbilitySet(): number[] {
  return Array.from({ length: 6 }, () => rollAbilityScore());
}

/** Rola um dado de n lados */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** Calcula HP inicial: dado de vida máximo + mod de constituição */
export function calculateStartingHp(hitDie: number, constitutionScore: number): number {
  return hitDie + getModifier(constitutionScore);
}

/**
 * Rola uma string de dano tipo "8d6 fogo", "3×2d6", "+1d6", "1d4+1", "2d8+4d6"
 * Retorna o total rolado e um label descritivo.
 */
export function rollDamage(damageStr: string): { total: number; detail: string } {
  // extrai todos os grupos NdX e somas fixas
  const diceRegex = /(\d+)[d×x](\d+)/gi;
  const fixedRegex = /\+(\d+)(?!d)/g;
  let total = 0;
  const parts: string[] = [];

  let m: RegExpExecArray | null;
  while ((m = diceRegex.exec(damageStr)) !== null) {
    const count = Number(m[1]);
    const sides = Number(m[2]);
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const sum = rolls.reduce((a, b) => a + b, 0);
    total += sum;
    parts.push(`[${rolls.join('+')}]`);
  }
  let f: RegExpExecArray | null;
  while ((f = fixedRegex.exec(damageStr)) !== null) {
    const bonus = Number(f[1]);
    total += bonus;
    parts.push(`+${bonus}`);
  }

  // extrai tipo de dano (palavra após os dados, ex: "fogo", "necrótico")
  const typeMatch = damageStr.match(/[a-záéíóúàâêôãõüçñ\-]+$/i);
  const typeSuffix = typeMatch ? ` ${typeMatch[0]}` : '';

  return { total, detail: parts.join('') + typeSuffix };
}
