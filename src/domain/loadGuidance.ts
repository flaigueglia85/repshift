import { calculateDumbbellPlateSolution, calculatePlateSolution } from '../storage/loadSetupStorage';
import type { ExerciseDefinition } from '../types/exercise';
import type { LoadSetupProfile } from '../types/loadSetup';

export type LoadGuidanceKind = 'barbell' | 'adjustable_dumbbell' | 'fixed_dumbbell' | 'plate_machine' | 'stack' | 'bodyweight' | 'unknown';

export interface LoadGuidance {
  kind: LoadGuidanceKind;
  requestedKg: number;
  achievedKg: number;
  exact: boolean;
  equipmentId: string | null;
  perSide: number[];
  summaryIt: string;
  summaryEn: string;
  noteIt?: string;
  noteEn?: string;
}

const roundToIncrement = (target: number, start: number, increment: number) => {
  if (increment <= 0) return target;
  const steps = Math.max(0, Math.round((target - start) / increment));
  return Math.round((start + steps * increment) * 100) / 100;
};

const formatPlates = (plates: number[]) => plates.length ? plates.map((weight) => `${weight} kg`).join(' + ') : 'nessun disco';
const formatPlatesEn = (plates: number[]) => plates.length ? plates.map((weight) => `${weight} kg`).join(' + ') : 'no plates';

export function buildLoadGuidance(exercise: ExerciseDefinition | undefined, targetKg: number, setup: LoadSetupProfile | null): LoadGuidance {
  if (!exercise) return { kind:'unknown',requestedKg:targetKg,achievedKg:targetKg,exact:true,equipmentId:null,perSide:[],summaryIt:`Imposta ${targetKg} kg`,summaryEn:`Set ${targetKg} kg` };
  if (!exercise.requiredEquipment.length) return { kind:'bodyweight',requestedKg:targetKg,achievedKg:0,exact:true,equipmentId:null,perSide:[],summaryIt:'Corpo libero',summaryEn:'Bodyweight' };
  if (!setup) return { kind:'unknown',requestedKg:targetKg,achievedKg:targetKg,exact:true,equipmentId:exercise.requiredEquipment[0]??null,perSide:[],summaryIt:`Imposta ${targetKg} kg`,summaryEn:`Set ${targetKg} kg`,noteIt:'Configura prima i carichi per ottenere istruzioni di montaggio.',noteEn:'Configure your loads first to get setup instructions.' };

  const equipmentId = exercise.requiredEquipment.find((id) => id !== 'bench' && id !== 'rack') ?? exercise.requiredEquipment[0] ?? null;

  if (equipmentId === 'barbell') {
    const solution = calculatePlateSolution(targetKg, setup.barbellWeightKg, setup.plates);
    return { kind:'barbell',requestedKg:targetKg,achievedKg:solution.achievedKg,exact:Math.abs(solution.differenceKg)<0.001,equipmentId,perSide:solution.perSide,summaryIt:`Bilanciere ${setup.barbellWeightKg} kg · per lato: ${formatPlates(solution.perSide)}`,summaryEn:`${setup.barbellWeightKg} kg bar · each side: ${formatPlatesEn(solution.perSide)}`,noteIt:Math.abs(solution.differenceKg)<0.001?undefined:`Carico disponibile più vicino: ${solution.achievedKg} kg`,noteEn:Math.abs(solution.differenceKg)<0.001?undefined:`Closest available load: ${solution.achievedKg} kg` };
  }

  if (equipmentId === 'dumbbells' || equipmentId === 'adjustable_dumbbells') {
    const adjustable = setup.dumbbellMode === 'adjustable' || setup.dumbbellMode === 'both' || equipmentId === 'adjustable_dumbbells';
    if (adjustable) {
      const handle = setup.includeAdjustableDumbbellHandleWeight ? setup.adjustableDumbbellHandleKg : 0;
      const solution = calculateDumbbellPlateSolution(targetKg, handle, setup.plates);
      return { kind:'adjustable_dumbbell',requestedKg:targetKg,achievedKg:solution.achievedKg,exact:Math.abs(solution.differenceKg)<0.001,equipmentId,perSide:solution.perSide,summaryIt:`Ogni manubrio: impugnatura ${handle} kg · per lato ${formatPlates(solution.perSide)}`,summaryEn:`Each dumbbell: ${handle} kg handle · each side ${formatPlatesEn(solution.perSide)}`,noteIt:Math.abs(solution.differenceKg)<0.001?undefined:`Carico realizzabile: ${solution.achievedKg} kg per manubrio`,noteEn:Math.abs(solution.differenceKg)<0.001?undefined:`Achievable load: ${solution.achievedKg} kg per dumbbell` };
    }
    const achieved = Math.min(setup.maxDumbbellKg, roundToIncrement(targetKg, 0, setup.dumbbellStepKg));
    return { kind:'fixed_dumbbell',requestedKg:targetKg,achievedKg:achieved,exact:Math.abs(achieved-targetKg)<0.001,equipmentId,perSide:[],summaryIt:`Prendi due manubri da ${achieved} kg`,summaryEn:`Use two ${achieved} kg dumbbells`,noteIt:achieved===targetKg?undefined:`Taglio disponibile più vicino al target`,noteEn:achieved===targetKg?undefined:`Closest available dumbbell size` };
  }

  const machine = setup.machineConfigs.find((item) => item.equipmentId === equipmentId);
  if (machine?.loadingMode === 'plate_loaded') {
    const solution = calculatePlateSolution(targetKg, machine.startingResistanceKg, setup.plates);
    return { kind:'plate_machine',requestedKg:targetKg,achievedKg:solution.achievedKg,exact:Math.abs(solution.differenceKg)<0.001,equipmentId,perSide:solution.perSide,summaryIt:`Resistenza macchina ${machine.startingResistanceKg} kg · per lato: ${formatPlates(solution.perSide)}`,summaryEn:`Machine resistance ${machine.startingResistanceKg} kg · each side: ${formatPlatesEn(solution.perSide)}`,noteIt:Math.abs(solution.differenceKg)<0.001?undefined:`Carico disponibile: ${solution.achievedKg} kg`,noteEn:Math.abs(solution.differenceKg)<0.001?undefined:`Available load: ${solution.achievedKg} kg` };
  }

  const increment = machine?.incrementKg ?? (equipmentId === 'cable_station' ? setup.cableIncrementKg : 5);
  const start = machine?.startingResistanceKg ?? 0;
  const achieved = roundToIncrement(targetKg, start, increment);
  return { kind:'stack',requestedKg:targetKg,achievedKg:achieved,exact:Math.abs(achieved-targetKg)<0.001,equipmentId,perSide:[],summaryIt:`Seleziona ${achieved} kg sul pacco pesi`,summaryEn:`Select ${achieved} kg on the weight stack`,noteIt:`Incrementi configurati: ${increment} kg`,noteEn:`Configured increment: ${increment} kg` };
}

export function buildTransitionInstruction(previous: LoadGuidance | null, current: LoadGuidance, locale: 'it'|'en') {
  if (!previous || previous.kind !== current.kind || previous.equipmentId !== current.equipmentId) return null;
  if ((current.kind === 'barbell' || current.kind === 'plate_machine') && previous.perSide.length + current.perSide.length > 0) {
    const counts = (values:number[]) => values.reduce<Record<string,number>>((acc,value)=>{const key=String(value);acc[key]=(acc[key]??0)+1;return acc;},{});
    const before=counts(previous.perSide), after=counts(current.perSide); const add:string[]=[]; const remove:string[]=[];
    new Set([...Object.keys(before),...Object.keys(after)]).forEach((key)=>{const delta=(after[key]??0)-(before[key]??0);if(delta>0)add.push(`${delta}×${key} kg`);if(delta<0)remove.push(`${Math.abs(delta)}×${key} kg`);});
    if (!add.length&&!remove.length) return locale==='it'?'Nessun cambio dischi necessario.':'No plate changes needed.';
    return locale==='it'?`${remove.length?`Togli per lato ${remove.join(' + ')}. `:''}${add.length?`Aggiungi per lato ${add.join(' + ')}.`:''}`:`${remove.length?`Remove per side ${remove.join(' + ')}. `:''}${add.length?`Add per side ${add.join(' + ')}.`:''}`;
  }
  if (Math.abs(previous.achievedKg-current.achievedKg)<0.001) return locale==='it'?'Mantieni lo stesso carico.':'Keep the same load.';
  return locale==='it'?`Passa da ${previous.achievedKg} a ${current.achievedKg} kg.`:`Change from ${previous.achievedKg} to ${current.achievedKg} kg.`;
}
