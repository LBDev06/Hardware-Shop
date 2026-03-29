import { HardwareType } from "./product-category";

export interface HardwareSpec {
  name: string;          
  value: string | number; 
  unit?: string;          
}

const HARDWARE_SPEC_RULES: Record<HardwareType, string[]> = {
  'GPU': ['Memória (VRAM)', 'TDP', 'Interface'],
  'CPU': ['Socket', 'Cores', 'Threads', 'TDP', 'Frequência Base'],
  'Motherboard': ['Socket', 'Fator de Forma', 'Chipset', 'Slots de RAM'],
  'RAM': ['Tipo', 'Capacidade', 'Frequência'],
  'Storage': ['Potência', 'Certificação', 'Modular'],
  'PSU': ['Wats'],
};

export class ProductSpecs {
  private readonly _items: HardwareSpec[];

  private constructor(items: HardwareSpec[]) {
    this._items = items;
  }

  public static create(
    items: HardwareSpec[],
    category: HardwareType 
  ): ProductSpecs {
    
    
    const formattedItems = items.map(item => ({
      ...item,
      name: item.name.trim()
    }));

    const requiredSpecs = HARDWARE_SPEC_RULES[category];

    if (!requiredSpecs) {
      throw new Error(`Regras de especificação não definidas para a categoria: ${category}`);
    }

    const providedSpecNames = formattedItems.map(item => item.name.toLowerCase());
    
    const missingSpecs = requiredSpecs.filter(
      reqSpec => !providedSpecNames.includes(reqSpec.toLowerCase())
    );

    if (missingSpecs.length > 0) {
      throw new Error(
        `Especificações ausentes para a categoria ${category}. Faltam: ${missingSpecs.join(', ')}`
      );
    }

    formattedItems.forEach(item => {
      if (item.value === null || item.value === undefined || item.value === '') {
        throw new Error(`A especificação "${item.name}" precisa ter um valor preenchido.`);
      }
    });

    const uniqueSpecs = new Map(formattedItems.map(item => [item.name.toLowerCase(), item]));

    return new ProductSpecs(Array.from(uniqueSpecs.values()));
  }

  get items(): HardwareSpec[] {
    return [...this._items];
  }
}