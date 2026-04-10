export const HardwareTypes = [
  'CPU',
  'Motherboard',
  'RAM',
  'GPU',
  'Storage',
  'PSU',
] as const;

export type HardwareType = (typeof HardwareTypes)[number];

export class ProductCategory {
  private constructor(private readonly _value: HardwareType) {}

  public static create(value: string): ProductCategory {
    const trimmedValue = value.trim();
    
    const matchedCategory = HardwareTypes.find(
      (category) => category.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (!matchedCategory) {
      throw new Error(`Categoria inválida. Categorias aceitas: ${HardwareTypes.join(', ')}`);
    }

    return new ProductCategory(matchedCategory);
  }

  get value(): HardwareType {
    return this._value;
  }
}