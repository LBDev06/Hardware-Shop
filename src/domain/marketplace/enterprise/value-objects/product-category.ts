export type HardwareType = 
  | 'CPU' 
  | 'Motherboard' 
  | 'RAM' 
  | 'GPU' 
  | 'Storage' 
  | 'PSU' 

export class ProductCategory {
  private readonly _value: HardwareType;

  private constructor(value: HardwareType) {
    this._value = value;
  }

  public static create(value: string): ProductCategory {

    const normalizedValue = value.trim().toUpperCase() as HardwareType;
    
    const validCategories: HardwareType[] = [
      'CPU',
      'Motherboard',
      'RAM',
      'GPU',
      'Storage',
      'PSU'
    ];

    if (!validCategories.includes(normalizedValue)) {
      throw new Error(`Categoria inválida. Categorias aceitas: ${validCategories.join(', ')}`);
    }

    return new ProductCategory(normalizedValue);
  }

  get value(): HardwareType {
    return this._value;
  }
}