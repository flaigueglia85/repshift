import { exerciseCatalog } from './exerciseCatalog';
import { getExerciseName } from './exerciseNames';
import type { EquipmentProfile } from '../types/equipment';
import type { GuidedPlanPreferences } from '../types/trainingPlan';
import type { WorkoutExerciseDraft, WorkoutTemplate } from '../types/workout';

const uid=()=>crypto.randomUUID?.()??`${Date.now()}-${Math.random()}`;
const splits:Record<number,string[][]>={
  2:[['chest','back','shoulders','quadriceps','hamstrings'],['chest','back','biceps','triceps','glutes']],
  3:[['chest','shoulders','triceps'],['back','biceps'],['quadriceps','hamstrings','glutes','calves']],
  4:[['chest','shoulders','triceps'],['back','biceps'],['quadriceps','glutes','calves'],['hamstrings','back','shoulders']],
  5:[['chest','triceps'],['back','biceps'],['quadriceps','calves'],['shoulders','triceps'],['hamstrings','glutes','back']],
  6:[['chest','triceps'],['back','biceps'],['quadriceps','calves'],['shoulders','triceps'],['hamstrings','glutes'],['back','chest','biceps']],
};

function available(exerciseId:string,equipment:EquipmentProfile|null){
  const ex=exerciseCatalog.find(x=>x.id===exerciseId);if(!ex)return false;
  const selected=equipment?.selectedEquipmentIds??[];
  return ex.requiredEquipment.every(id=>selected.includes(id));
}

function scoreExercise(id:string,dayMuscles:string[],used:Set<string>){
  const ex=exerciseCatalog.find(x=>x.id===id);if(!ex)return-999;
  let score=dayMuscles.includes(ex.primaryMuscle)?8:0;
  score+=ex.secondaryMuscles.filter(x=>dayMuscles.includes(x)).length*2;
  if(ex.movementPattern==='isolation')score-=1;
  if(used.has(id))score-=8;
  return score;
}

export function generateGuidedTemplates(preferences:GuidedPlanPreferences,equipment:EquipmentProfile|null,locale:'it'|'en'):WorkoutTemplate[]{
  const dayMuscles=splits[preferences.daysPerWeek]??splits[3];
  const exerciseCount=preferences.sessionMinutes<=30?4:preferences.sessionMinutes<=45?5:preferences.sessionMinutes<=60?6:7;
  const reps=preferences.goal==='strength'?5:preferences.goal==='hypertrophy'?10:8;
  const sets=preferences.experience==='beginner'?3:preferences.experience==='intermediate'?4:4;
  const rest=preferences.goal==='strength'?150:preferences.goal==='hypertrophy'?90:75;
  const used=new Set<string>();
  const now=new Date().toISOString();

  return dayMuscles.map((muscles,index)=>{
    const candidates=exerciseCatalog
      .filter(ex=>available(ex.id,equipment)&&[ex.primaryMuscle,...ex.secondaryMuscles].some(m=>muscles.includes(m)))
      .sort((a,b)=>scoreExercise(b.id,muscles,used)-scoreExercise(a.id,muscles,used));
    const chosen=candidates.slice(0,exerciseCount);
    chosen.forEach(ex=>used.add(ex.id));
    const exercises:WorkoutExerciseDraft[]=chosen.map(ex=>({id:uid(),exerciseId:ex.id,sets,targetReps:reps,targetLoadKg:20,restSeconds:rest}));
    const focus=muscles.slice(0,2).map(m=>m[0].toUpperCase()+m.slice(1)).join(' + ');
    return{id:uid(),name:locale==='it'?`Giorno ${index+1} · ${focus}`:`Day ${index+1} · ${focus}`,exercises,createdAt:now,updatedAt:now};
  });
}

export function describeTemplate(template:WorkoutTemplate,locale:'it'|'en'){
  return template.exercises.slice(0,3).map(x=>getExerciseName(x.exerciseId,locale)).join(' · ');
}
