import { useMemo, useState } from 'react';
import { generateGuidedTemplates, describeTemplate } from '../data/guidedPlanEngine';
import { loadWorkoutTemplates, saveWorkoutTemplates } from '../storage/workoutStorage';
import type { EquipmentProfile } from '../types/equipment';
import type { ExperienceLevel, GuidedPlanPreferences, TrainingGoal } from '../types/trainingPlan';
import '../guidedPlan.css';

interface Props{locale:'it'|'en';equipmentProfile:EquipmentProfile|null;onBack:()=>void;onCreated:()=>void}

export default function GuidedPlanScreen({locale,equipmentProfile,onBack,onCreated}:Props){
 const [goal,setGoal]=useState<TrainingGoal>('hypertrophy');
 const [days,setDays]=useState<GuidedPlanPreferences['daysPerWeek']>(4);
 const [minutes,setMinutes]=useState<GuidedPlanPreferences['sessionMinutes']>(60);
 const [experience,setExperience]=useState<ExperienceLevel>('intermediate');
 const preferences={goal,daysPerWeek:days,sessionMinutes:minutes,experience};
 const preview=useMemo(()=>generateGuidedTemplates(preferences,equipmentProfile,locale),[goal,days,minutes,experience,equipmentProfile,locale]);
 const save=()=>{const current=loadWorkoutTemplates();saveWorkoutTemplates([...preview,...current]);onCreated()};
 const goals:TrainingGoal[]=['hypertrophy','strength','recomposition'];
 const levels:ExperienceLevel[]=['beginner','intermediate','advanced'];
 return <section className="guided-plan-screen">
  <div className="guided-plan-top"><button onClick={onBack}>‹</button><div><small>{locale==='it'?'PIANO GUIDATO':'GUIDED PLAN'}</small><strong>{locale==='it'?'Costruiamo il tuo percorso':'Build your training path'}</strong></div><span>✦</span></div>
  <div className="guided-plan-hero"><h1>{locale==='it'?'Una scheda che parte da te':'A plan built around you'}</h1><p>{locale==='it'?'Frequenza, tempo, obiettivo e attrezzatura determinano esercizi, volume e recuperi.':'Frequency, time, goal and equipment shape exercise choice, volume and rest.'}</p></div>
  <div className="guided-section"><small>{locale==='it'?'OBIETTIVO':'GOAL'}</small><div className="guided-choice-grid">{goals.map(x=><button key={x} className={goal===x?'active':''} onClick={()=>setGoal(x)}>{x==='hypertrophy'?(locale==='it'?'Ipertrofia':'Hypertrophy'):x==='strength'?(locale==='it'?'Forza':'Strength'):(locale==='it'?'Ricomposizione':'Recomposition')}</button>)}</div></div>
  <div className="guided-section"><small>{locale==='it'?'GIORNI A SETTIMANA':'DAYS PER WEEK'}</small><div className="guided-number-rail">{([2,3,4,5,6] as const).map(x=><button key={x} className={days===x?'active':''} onClick={()=>setDays(x)}>{x}</button>)}</div></div>
  <div className="guided-section"><small>{locale==='it'?'DURATA SESSIONE':'SESSION LENGTH'}</small><div className="guided-number-rail">{([30,45,60,75,90] as const).map(x=><button key={x} className={minutes===x?'active':''} onClick={()=>setMinutes(x)}>{x}<em>min</em></button>)}</div></div>
  <div className="guided-section"><small>{locale==='it'?'ESPERIENZA':'EXPERIENCE'}</small><div className="guided-choice-grid">{levels.map(x=><button key={x} className={experience===x?'active':''} onClick={()=>setExperience(x)}>{x==='beginner'?(locale==='it'?'Base':'Beginner'):x==='intermediate'?(locale==='it'?'Intermedio':'Intermediate'):(locale==='it'?'Avanzato':'Advanced')}</button>)}</div></div>
  <div className="guided-preview"><div><small>{locale==='it'?'ANTEPRIMA PIANO':'PLAN PREVIEW'}</small><strong>{preview.length} {locale==='it'?'giornate generate':'days generated'}</strong></div>{preview.map((template,index)=><article key={template.id}><span>{index+1}</span><div><strong>{template.name}</strong><small>{describeTemplate(template,locale)}</small><em>{template.exercises.length} {locale==='it'?'esercizi':'exercises'}</em></div></article>)}</div>
  <button className="guided-create" onClick={save}>✦ {locale==='it'?'Crea il piano':'Create plan'}</button>
 </section>
}
