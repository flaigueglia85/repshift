export type EquipmentCategory = 'free_weights' | 'machines' | 'cables' | 'bodyweight' | 'accessories';
export type LoadingType = 'bodyweight' | 'fixed_weight' | 'free_plates' | 'plate_loaded' | 'weight_stack' | 'selectorized' | 'cable_stack' | 'assisted';

export interface EquipmentDefinition {
  id: string;
  nameKey: string;
  category: EquipmentCategory;
  loadingType: LoadingType;
  icon: string;
}

export interface EquipmentProfile {
  id: string;
  selectedEquipmentIds: string[];
  environment: 'commercial_gym' | 'home_gym' | 'minimal';
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  revision: number;
}
