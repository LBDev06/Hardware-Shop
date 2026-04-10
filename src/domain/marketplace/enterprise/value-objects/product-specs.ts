import { HardwareType } from "./product-category";
import { SPEC_REGISTRY, SpecDefinition, SpecValueType } from "./spec-definition";

export interface ResolvedSpec {
  key: string;
  label: string;
  type: SpecValueType;
  value: number | string | boolean;
  unit?: string;
}

export type SpecInput = Record<string, number | string | boolean>;

export class ProductSpecs {
  private constructor(private readonly _items: ResolvedSpec[]) {}

  public static create(input: SpecInput, category: HardwareType): ProductSpecs {
    const definitions = SPEC_REGISTRY[category];

    if (!definitions) {
      throw new Error(`Regras de especificação não definidas para a categoria: ${category}`);
    }

    const resolvedSpecs: ResolvedSpec[] = [];
    const providedKeys = new Set(Object.keys(input));

    for (const def of definitions) {
      const rawValue = input[def.key];
      const hasValue = rawValue !== undefined && rawValue !== null && rawValue !== '';

      if (!hasValue && def.required) {
        throw new Error(
          `Especificação obrigatória ausente: "${def.label}" (key: ${def.key}) para a categoria ${category}.`
        );
      }

      if (!hasValue) {
        continue;
      }

      ProductSpecs.validateType(def, rawValue);
      ProductSpecs.validateConstraints(def, rawValue);

      resolvedSpecs.push({
        key: def.key,
        label: def.label,
        type: def.type,
        value: rawValue,
        ...(def.unit && { unit: def.unit }),
      });

      providedKeys.delete(def.key);
    }

    if (providedKeys.size > 0) {
      throw new Error(
        `Especificações desconhecidas para a categoria ${category}: ${Array.from(providedKeys).join(', ')}`
      );
    }

    return new ProductSpecs(resolvedSpecs);
  }

  private static validateType(def: SpecDefinition, value: number | string | boolean): void {
    const typeMap: Record<SpecValueType, string> = {
      number: 'number',
      text: 'string',
      boolean: 'boolean',
    };

    const expectedJsType = typeMap[def.type];

    if (typeof value !== expectedJsType) {
      throw new Error(
        `A especificação "${def.label}" (key: ${def.key}) deve ser do tipo ${def.type}, mas recebeu ${typeof value}.`
      );
    }
  }

  private static validateConstraints(def: SpecDefinition, value: number | string | boolean): void {
    const { constraints } = def;

    if (!constraints) {
      return;
    }

    if (typeof value === 'number') {
      if (constraints.min !== undefined && value < constraints.min) {
        throw new Error(
          `A especificação "${def.label}" deve ter valor mínimo de ${constraints.min}${def.unit ? ` ${def.unit}` : ''}.`
        );
      }

      if (constraints.max !== undefined && value > constraints.max) {
        throw new Error(
          `A especificação "${def.label}" deve ter valor máximo de ${constraints.max}${def.unit ? ` ${def.unit}` : ''}.`
        );
      }
    }

    if (typeof value === 'string' && constraints.allowedValues) {
      if (!constraints.allowedValues.includes(value)) {
        throw new Error(
          `A especificação "${def.label}" deve ser uma das opções: ${constraints.allowedValues.join(', ')}. Recebeu: "${value}".`
        );
      }
    }
  }

  getByKey(key: string): ResolvedSpec | undefined {
    return this._items.find((spec) => spec.key === key);
  }

  getNumericValue(key: string): number | undefined {
    const spec = this.getByKey(key);

    if (spec && spec.type === 'number') {
      return spec.value as number;
    }

    return undefined;
  }

  toFilterableMap(): Map<string, number | string | boolean> {
    return new Map(this._items.map((spec) => [spec.key, spec.value]));
  }

  get items(): ResolvedSpec[] {
    return [...this._items];
  }
}