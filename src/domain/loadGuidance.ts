import type { ExerciseDefinition } from '../types/exercise';
import type { LoadSetupProfile, PlateInventoryItem } from '../types/loadSetup';

export type LoadGuidanceKind = 'barbell' | 'adjustable_dumbbell' | 'fixed_dumbbell' | 'plate_machine' | 'stack' | 'bodyweight' | 'unknown';

export interface LoadMountOption {
  perSide: number[];
  labelIt: string;
  labelEn: string;
}

export interface LoadGuidance {
  kind: LoadGuidanceKind;
  requestedKg: number;
  achievedKg: number;
  exact: boolean;
  equipmentId: string | null;
  perSide: number[];
  mountOptions: LoadMountOption[];
  implementCount: number;
  perImplementKg: number;
  summaryIt: string;
  summaryEn: string;
  noteIt?: string;
  noteEn?: string;
}

const round2 = (value:number) => Math.round(value * 100) / 100;
const roundToIncrement = (target:number,start:number,increment:number) => increment <= 0 ? target : round2(start + Math.max(0,Math.round((target-start)/increment))*increment);
const format = (plates:number[],locale:'it'|'en') => plates.length ? plates.map(v=>`${v} kg`).join(' + ') : locale==='it'?'nessun disco':'no plates';

const pairedDumbbellIds = new Set([
  'dumbbell_bench_press','dumbbell_shoulder_press','lateral_raise','dumbbell_romanian_deadlift',
  'dumbbell_lunge','dumbbell_curl'
]);
const singleDumbbellIds = new Set(['one_arm_dumbbell_row','goblet_squat']);

function exerciseImplementCount(exercise:ExerciseDefinition,equipmentId:string|null){
  if (equipmentId!=='dumbbells'&&equipmentId!=='adjustable_dumbbells') return 1;
  if (singleDumbbellIds.has(exercise.id)) return 1;
  if (pairedDumbbellIds.has(exercise.id)) return 2;
  return 2;
}

function enumeratePerSideCombinations(target:number,plates:PlateInventoryItem[],copiesPerSelection:number,maxOptions=6){
  const available=plates
    .filter(p=>p.weightKg>0&&p.quantity>=copiesPerSelection)
    .map(p=>({weight:p.weightKg,max:Math.floor(p.quantity/copiesPerSelection)}))
    .sort((a,b)=>b.weight-a.weight);
  const found:number[][]=[];
  const walk=(index:number,remaining:number,current:number[])=>{
    if(found.length>=80)return;
    if(Math.abs(remaining)<0.001){found.push([...current]);return;}
    if(index>=available.length||remaining<0)return;
    const item=available[index];
    const max=Math.min(item.max,Math.floor((remaining+0.0001)/item.weight));
    for(let count=max;count>=0;count--){
      for(let i=0;i<count;i++)current.push(item.weight);
      walk(index+1,round2(remaining-count*item.weight),current);
      current.splice(current.length-count,count);
    }
  };
  walk(0,round2(target),[]);
  return found
    .sort((a,b)=>a.length-b.length||b[0]-a[0]||b.reduce((s,v)=>s+v,0)-a.reduce((s,v)=>s+v,0))
    .filter((combo,index,list)=>index===list.findIndex(other=>other.join('|')===combo.join('|')))
    .slice(0,maxOptions);
}

function closestMount(targetTotal:number,baseTotal:number,plates:PlateInventoryItem[],copiesPerSelection:number){
  const targetPerSide=Math.max(0,(targetTotal-baseTotal)/2);
  const combinations=enumeratePerSideCombinations(targetPerSide,plates,copiesPerSelection);
  if(combinations.length)return{perSide:combinations[0],options:combinations,achieved:targetTotal,exact:true};
  let best:{perSide:number[];achieved:number}|null=null;
  for(let candidate=targetPerSide;candidate>=0;candidate=round2(candidate-0.25)){
    const options=enumeratePerSideCombinations(candidate,plates,copiesPerSelection);
    if(options.length){best={perSide:options[0],achieved:round2(baseTotal+candidate*2)};break;}
  }
  return{perSide:best?.perSide??[],options:best?[best.perSide]:[[]],achieved:best?.achieved??baseTotal,exact:false};
}

function mountOptions(combos:number[][]):LoadMountOption[]{
  return combos.map((combo,index)=>({
    perSide:combo,
    labelIt:index===0?`Consigliato · ${format(combo,'it')}`:`Alternativa ${index+1} · ${format(combo,'it')}`,
    labelEn:index===0?`Recommended · ${format(combo,'en')}`:`Alternative ${index+1} · ${format(combo,'en')}`
  }));
}

export function withMountOption(guidance:LoadGuidance,index:number):LoadGuidance{
  const option=guidance.mountOptions[index];
  if(!option)return guidance;
  const summaryIt=guidance.kind==='adjustable_dumbbell'
    ? `${guidance.implementCount===2?'Ogni manubrio':'Manubrio'} da ${guidance.perImplementKg} kg · per lato: ${format(option.perSide,'it')}`
    : guidance.kind==='barbell'?`Per lato: ${format(option.perSide,'it')}`
    : guidance.kind==='plate_machine'?`Per lato macchina: ${format(option.perSide,'it')}`:guidance.summaryIt;
  const summaryEn=guidance.kind==='adjustable_dumbbell'
    ? `${guidance.implementCount===2?'Each dumbbell':'Dumbbell'} ${guidance.perImplementKg} kg · each side: ${format(option.perSide,'en')}`
    : guidance.kind==='barbell'?`Each side: ${format(option.perSide,'en')}`
    : guidance.kind==='plate_machine'?`Each machine side: ${format(option.perSide,'en')}`:guidance.summaryEn;
  return {...guidance,perSide:option.perSide,summaryIt,summaryEn};
}

export function buildLoadGuidance(exercise:ExerciseDefinition|undefined,targetKg:number,setup:LoadSetupProfile|null):LoadGuidance{
  const base={requestedKg:targetKg,achievedKg:targetKg,exact:true,equipmentId:null,perSide:[],mountOptions:[],implementCount:1,perImplementKg:targetKg};
  if(!exercise)return{...base,kind:'unknown',summaryIt:`Imposta ${targetKg} kg totali`,summaryEn:`Set ${targetKg} kg total`};
  if(!exercise.requiredEquipment.length)return{...base,kind:'bodyweight',achievedKg:0,perImplementKg:0,summaryIt:'Corpo libero',summaryEn:'Bodyweight'};
  const equipmentId=exercise.requiredEquipment.find(id=>id!=='bench'&&id!=='rack')??exercise.requiredEquipment[0]??null;
  if(!setup)return{...base,kind:'unknown',equipmentId,summaryIt:`Imposta ${targetKg} kg totali`,summaryEn:`Set ${targetKg} kg total`,noteIt:'Configura i carichi per ottenere il montaggio.',noteEn:'Configure loads to get mounting instructions.'};

  if(equipmentId==='barbell'){
    const result=closestMount(targetKg,setup.barbellWeightKg,setup.plates,2);
    const options=mountOptions(result.options);
    return{...base,kind:'barbell',equipmentId,achievedKg:result.achieved,exact:result.exact,perSide:result.perSide,mountOptions:options,perImplementKg:result.achieved,summaryIt:`Totale ${result.achieved} kg · bilanciere ${setup.barbellWeightKg} kg · per lato: ${format(result.perSide,'it')}`,summaryEn:`${result.achieved} kg total · ${setup.barbellWeightKg} kg bar · each side: ${format(result.perSide,'en')}`,noteIt:result.exact?undefined:`Carico realizzabile più vicino: ${result.achieved} kg`,noteEn:result.exact?undefined:`Closest achievable load: ${result.achieved} kg`};
  }

  if(equipmentId==='dumbbells'||equipmentId==='adjustable_dumbbells'){
    const count=exerciseImplementCount(exercise,equipmentId);
    const requestedPer=round2(targetKg/count);
    const adjustable=setup.dumbbellMode==='adjustable'||setup.dumbbellMode==='both'||equipmentId==='adjustable_dumbbells';
    if(adjustable){
      const handle=setup.includeAdjustableDumbbellHandleWeight?setup.adjustableDumbbellHandleKg:0;
      const result=closestMount(requestedPer,handle,setup.plates,count===2?4:2);
      const total=round2(result.achieved*count);
      const options=mountOptions(result.options);
      return{...base,kind:'adjustable_dumbbell',equipmentId,implementCount:count,perImplementKg:result.achieved,achievedKg:total,exact:Math.abs(total-targetKg)<0.001,perSide:result.perSide,mountOptions:options,summaryIt:`Totale ${total} kg · ${count===2?'2 manubri':'1 manubrio'} da ${result.achieved} kg · per lato: ${format(result.perSide,'it')}`,summaryEn:`${total} kg total · ${count===2?'2 dumbbells':'1 dumbbell'} at ${result.achieved} kg · each side: ${format(result.perSide,'en')}`,noteIt:Math.abs(total-targetKg)<0.001?undefined:`Carico totale realizzabile più vicino: ${total} kg`,noteEn:Math.abs(total-targetKg)<0.001?undefined:`Closest achievable total load: ${total} kg`};
    }
    const per=Math.min(setup.maxDumbbellKg,roundToIncrement(requestedPer,0,setup.dumbbellStepKg));
    const total=round2(per*count);
    return{...base,kind:'fixed_dumbbell',equipmentId,implementCount:count,perImplementKg:per,achievedKg:total,exact:Math.abs(total-targetKg)<0.001,summaryIt:`Totale ${total} kg · ${count===2?`prendi 2 manubri da ${per} kg`:`prendi 1 manubrio da ${per} kg`}`,summaryEn:`${total} kg total · ${count===2?`use 2 × ${per} kg dumbbells`:`use 1 × ${per} kg dumbbell`}`,noteIt:Math.abs(total-targetKg)<0.001?undefined:'Taglio disponibile più vicino al carico totale',noteEn:Math.abs(total-targetKg)<0.001?undefined:'Closest available size for the total load'};
  }

  const machine=setup.machineConfigs.find(item=>item.equipmentId===equipmentId);
  if(machine?.loadingMode==='plate_loaded'){
    const result=closestMount(targetKg,machine.startingResistanceKg,setup.plates,2);
    return{...base,kind:'plate_machine',equipmentId,achievedKg:result.achieved,exact:result.exact,perSide:result.perSide,mountOptions:mountOptions(result.options),perImplementKg:result.achieved,summaryIt:`Totale ${result.achieved} kg · resistenza iniziale ${machine.startingResistanceKg} kg · per lato: ${format(result.perSide,'it')}`,summaryEn:`${result.achieved} kg total · starting resistance ${machine.startingResistanceKg} kg · each side: ${format(result.perSide,'en')}`,noteIt:result.exact?undefined:`Carico realizzabile: ${result.achieved} kg`,noteEn:result.exact?undefined:`Achievable load: ${result.achieved} kg`};
  }

  const increment=machine?.incrementKg??(equipmentId==='cable_station'?setup.cableIncrementKg:5);
  const start=machine?.startingResistanceKg??0;
  const achieved=roundToIncrement(targetKg,start,increment);
  return{...base,kind:'stack',equipmentId,achievedKg:achieved,perImplementKg:achieved,exact:Math.abs(achieved-targetKg)<0.001,summaryIt:`Seleziona ${achieved} kg totali sul pacco pesi`,summaryEn:`Select ${achieved} kg total on the weight stack`,noteIt:`Incrementi configurati: ${increment} kg`,noteEn:`Configured increment: ${increment} kg`};
}

export function buildTransitionInstruction(previous:LoadGuidance|null,current:LoadGuidance,locale:'it'|'en'){
  if(!previous||previous.kind!==current.kind||previous.equipmentId!==current.equipmentId)return null;
  if(['barbell','plate_machine','adjustable_dumbbell'].includes(current.kind)&&previous.perSide.length+current.perSide.length>0){
    const counts=(values:number[])=>values.reduce<Record<string,number>>((acc,value)=>{const key=String(value);acc[key]=(acc[key]??0)+1;return acc;},{});
    const before=counts(previous.perSide),after=counts(current.perSide),add:string[]=[],remove:string[]=[];
    new Set([...Object.keys(before),...Object.keys(after)]).forEach(key=>{const delta=(after[key]??0)-(before[key]??0);if(delta>0)add.push(`${delta}×${key} kg`);if(delta<0)remove.push(`${Math.abs(delta)}×${key} kg`);});
    if(!add.length&&!remove.length)return locale==='it'?'Nessun cambio dischi necessario.':'No plate changes needed.';
    return locale==='it'?`${remove.length?`Togli per lato ${remove.join(' + ')}. `:''}${add.length?`Aggiungi per lato ${add.join(' + ')}.`:''}`:`${remove.length?`Remove per side ${remove.join(' + ')}. `:''}${add.length?`Add per side ${add.join(' + ')}.`:''}`;
  }
  if(Math.abs(previous.achievedKg-current.achievedKg)<0.001)return locale==='it'?'Mantieni lo stesso carico totale.':'Keep the same total load.';
  return locale==='it'?`Passa da ${previous.achievedKg} a ${current.achievedKg} kg totali.`:`Change from ${previous.achievedKg} to ${current.achievedKg} kg total.`;
}
