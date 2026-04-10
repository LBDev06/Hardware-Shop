import { HardwareType } from "./product-category";

export type SpecValueType = 'number' | 'text' | 'boolean';

export interface SpecConstraints {
  min?: number;
  max?: number;
  allowedValues?: readonly string[];
}

export interface SpecDefinition {
  key: string;
  label: string;
  type: SpecValueType;
  unit?: string;
  required: boolean;
  constraints?: SpecConstraints;
}

export const SPEC_REGISTRY: Record<HardwareType, readonly SpecDefinition[]> = {
  GPU: [
    { key: 'vram', label: 'Memória (VRAM)', type: 'number', unit: 'GB', required: true },
    { key: 'tdp', label: 'TDP', type: 'number', unit: 'W', required: true },
    {
      key: 'interface', label: 'Interface', type: 'text', required: true,
      constraints: { allowedValues: ['PCIe 3.0', 'PCIe 4.0', 'PCIe 5.0'] }
    },
    {
      key: 'memoryType', label: 'Tipo de Memória', type: 'text', required: false,
      constraints: { allowedValues: ['GDDR5', 'GDDR6', 'GDDR6X', 'HBM2', 'HBM3'] }
    },
  ],
  CPU: [
    { key: 'socket', label: 'Socket', type: 'text', required: true },
    {
      key: 'cores', label: 'Cores', type: 'number', required: true,
      constraints: { min: 1 }
    },
    {
      key: 'threads', label: 'Threads', type: 'number', required: true,
      constraints: { min: 1 }
    },
    { key: 'tdp', label: 'TDP', type: 'number', unit: 'W', required: true },
    {
      key: 'baseFrequency', label: 'Frequência Base', type: 'number', unit: 'GHz', required: true,
      constraints: { min: 0.1 }
    },
  ],
  Motherboard: [
    { key: 'socket', label: 'Socket', type: 'text', required: true },
    {
      key: 'formFactor', label: 'Fator de Forma', type: 'text', required: true,
      constraints: { allowedValues: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'] }
    },
    { key: 'chipset', label: 'Chipset', type: 'text', required: true },
    {
      key: 'ramSlots', label: 'Slots de RAM', type: 'number', required: true,
      constraints: { min: 1, max: 8 }
    },
  ],
  RAM: [
    {
      key: 'type', label: 'Tipo', type: 'text', required: true,
      constraints: { allowedValues: ['DDR3', 'DDR4', 'DDR5'] }
    },
    {
      key: 'capacity', label: 'Capacidade', type: 'number', unit: 'GB', required: true,
      constraints: { min: 1 }
    },
    {
      key: 'frequency', label: 'Frequência', type: 'number', unit: 'MHz', required: true,
      constraints: { min: 800 }
    },
  ],
  Storage: [
    {
      key: 'capacity', label: 'Capacidade', type: 'number', unit: 'GB', required: true,
      constraints: { min: 1 }
    },
    {
      key: 'type', label: 'Tipo', type: 'text', required: true,
      constraints: { allowedValues: ['HDD', 'SSD SATA', 'SSD NVMe'] }
    },
    {
      key: 'interface', label: 'Interface', type: 'text', required: true,
      constraints: { allowedValues: ['SATA III', 'PCIe 3.0', 'PCIe 4.0', 'PCIe 5.0'] }
    },
  ],
  PSU: [
    {
      key: 'wattage', label: 'Potência', type: 'number', unit: 'W', required: true,
      constraints: { min: 100 }
    },
    {
      key: 'certification', label: 'Certificação', type: 'text', required: true,
      constraints: { allowedValues: ['80 Plus', '80 Plus Bronze', '80 Plus Silver', '80 Plus Gold', '80 Plus Platinum', '80 Plus Titanium'] }
    },
    { key: 'modular', label: 'Modular', type: 'boolean', required: true },
  ],
} as const;
