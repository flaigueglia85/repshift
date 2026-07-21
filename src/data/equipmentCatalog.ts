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
  { id:'chest_press_machine',nameKey:'categoryMachines',displayName:{it:'Chest press machine',en:'Chest press machine'},category:'machines',loadingType:'weight_stack',icon:'▣' },
  { id:'pec_deck_machine',nameKey:'categoryMachines',displayName:{it:'Pec deck / reverse fly',en:'Pec deck / reverse fly'},category:'machines',loadingType:'weight_stack',icon:'◖◗' },
  { id:'assisted_pullup_dip_machine',nameKey:'categoryMachines',displayName:{it:'Trazioni e dip assistite',en:'Assisted pull-up and dip'},category:'machines',loadingType:'weight_stack',icon:'⇅' },
  { id:'chest_supported_row_machine',nameKey:'categoryMachines',displayName:{it:'Rematore chest-supported',en:'Chest-supported row'},category:'machines',loadingType:'weight_stack',icon:'⇠' },
  { id:'hack_squat_machine',nameKey:'categoryMachines',displayName:{it:'Hack squat machine',en:'Hack squat machine'},category:'machines',loadingType:'plate_loaded',icon:'◿' },
  { id:'smith_machine',nameKey:'categoryMachines',displayName:{it:'Smith machine',en:'Smith machine'},category:'machines',loadingType:'plate_loaded',icon:'⌗' },
  { id:'seated_leg_curl_machine',nameKey:'categoryMachines',displayName:{it:'Leg curl seduto',en:'Seated leg curl'},category:'machines',loadingType:'weight_stack',icon:'∩' },
  { id:'hip_thrust_machine',nameKey:'categoryMachines',displayName:{it:'Hip thrust machine',en:'Hip thrust machine'},category:'machines',loadingType:'plate_loaded',icon:'⌃' },
  { id:'calf_raise_machine',nameKey:'categoryMachines',displayName:{it:'Calf raise machine',en:'Calf raise machine'},category:'machines',loadingType:'weight_stack',icon:'⇧' },
  { id:'preacher_curl_machine',nameKey:'categoryMachines',displayName:{it:'Preacher curl machine',en:'Preacher curl machine'},category:'machines',loadingType:'weight_stack',icon:'∪' },
];

export const equipmentPresets = {
  commercial_gym: equipmentCatalog.map((item) => item.id),
  home_gym: ['barbell', 'dumbbells', 'adjustable_dumbbells', 'bench', 'rack', 'pullup_bar', 'bands'],
  minimal: ['dumbbells', 'pullup_bar', 'bands'],
} as const;