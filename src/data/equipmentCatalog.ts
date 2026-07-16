import type { EquipmentDefinition } from '../types/equipment';

export const equipmentCatalog: EquipmentDefinition[] = [
  { id: 'barbell', nameKey: 'equipmentBarbell', category: 'free_weights', loadingType: 'free_plates', icon: '▰' },
  { id: 'dumbbells', nameKey: 'equipmentDumbbells', category: 'free_weights', loadingType: 'fixed_weight', icon: '◆' },
  { id: 'adjustable_dumbbells', nameKey: 'equipmentAdjustableDumbbells', category: 'free_weights', loadingType: 'free_plates', icon: '◇' },
  { id: 'bench', nameKey: 'equipmentBench', category: 'accessories', loadingType: 'bodyweight', icon: '▬' },
  { id: 'rack', nameKey: 'equipmentRack', category: 'accessories', loadingType: 'bodyweight', icon: '⌑' },
  { id: 'cable_station', nameKey: 'equipmentCableStation', category: 'cables', loadingType: 'cable_stack', icon: '↕' },
  { id: 'lat_pulldown', nameKey: 'equipmentLatPulldown', category: 'machines', loadingType: 'weight_stack', icon: '⇣' },
  { id: 'leg_press', nameKey: 'equipmentLegPress', category: 'machines', loadingType: 'plate_loaded', icon: '◢' },
  { id: 'leg_extension', nameKey: 'equipmentLegExtension', category: 'machines', loadingType: 'weight_stack', icon: '⌁' },
  { id: 'leg_curl', nameKey: 'equipmentLegCurl', category: 'machines', loadingType: 'weight_stack', icon: '⌒' },
  { id: 'pullup_bar', nameKey: 'equipmentPullupBar', category: 'bodyweight', loadingType: 'bodyweight', icon: '⌐' },
  { id: 'bands', nameKey: 'equipmentBands', category: 'accessories', loadingType: 'assisted', icon: '∞' },
];

export const equipmentPresets = {
  commercial_gym: equipmentCatalog.map((item) => item.id),
  home_gym: ['barbell', 'dumbbells', 'adjustable_dumbbells', 'bench', 'rack', 'pullup_bar', 'bands'],
  minimal: ['dumbbells', 'pullup_bar', 'bands'],
} as const;
