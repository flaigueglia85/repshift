import { useEffect, useMemo, useState } from 'react';
import ExerciseLoadGuide from './ExerciseLoadGuide';
import { exerciseCatalog } from '../data/exerciseCatalog';
import { loadActiveWorkoutSession, loadWorkoutSessions, loadWorkoutTemplates, saveActiveWorkoutSession, saveWorkoutSessions, saveWorkoutTemplates } from '../storage/workoutStorage';
import type { LoadSetupProfile } from '../types/loadSetup';
import type { WorkoutExerciseDraft, WorkoutSession, WorkoutTemplate } from '../types/workout';
import '../workoutFlow.css';
import '../liveSliderEnhancements.css';

interface Props { locale: 'it' | 'en'; onExit: () => void; loadSetup: LoadSetupProfile | null; }
type Mode = 'hub' | 'builder' | 'live' | 'history';

const labels: Record<string,{it:string;en:string}> = {
  barbell_bench_press:{it:'Panca piana bilanciere',en:'Barbell bench press'},dumbbell_bench_press:{it:'Panca piana manubri',en:'Dumbbell bench press'},push_up:{it:'Piegamenti',en:'Push-up'},overhead_press:{it:'Military press',en:'Overhead press'},dumbbell_shoulder_press:{it:'Shoulder press manubri',en:'Dumbbell shoulder press'},lateral_raise:{it:'Alzate laterali',en:'Lateral raise'},pull_up:{it:'Trazioni',en:'Pull-up'},lat_pulldown:{it:'Lat machine',en:'Lat pulldown'},barbell_row:{it:'Rematore bilanciere',en:'Barbell row'},one_arm_dumbbell_row:{it:'Rematore manubrio',en:'One-arm dumbbell row'},barbell_squat:{it:'Squat bilanciere',en:'Barbell squat'},goblet_squat:{it:'Goblet squat',en:'Goblet squat'},leg_press:{it:'Leg press',en:'Leg press'},romanian_deadlift:{it:'Stacco rumeno',en:'Romanian deadlift'},leg_curl:{it:'Leg curl',en:'Leg curl'},leg_extension:{it:'Leg extension',en:'Leg extension'},dumbbell_lunge:{it:'Affondi con manubri',en:'Dumbbell lunge'},dumbbell_curl:{it:'Curl manubri',en:'Dumbbell curl'},cable_triceps_pushdown:{it:'Pushdown tricipiti',en:'Cable triceps pushdown'},plank:{it:'Plank',en:'Plank'}
};
const uid=()=>crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const exerciseName=(id:string,locale:'it'|'en')=>labels[id]?.[locale]??id.replaceAll('_',' ');
const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

function lastPerformance(history:WorkoutSession[],exerciseId:string){
  for(const session of history){
    const exercise=session.exercises.find(item=>item.exerciseId===exerciseId);
    const set=exercise?.completedSets.at(-1);
    if(set)return{reps:set.reps,loadKg:set.loadKg};
  }
  return null;
}

export default function WorkoutFlow({locale,onExit,loadSetup}:Props){
  const [mode,setMode]=useState<Mode>(()=>loadActiveWorkoutSession()?'live':'hub');
  const [templates,setTemplates]=useState<WorkoutTemplate[]>(()=>loadWorkoutTemplates());
  const [history,setHistory]=useState<WorkoutSession[]>(()=>loadWorkoutSessions());
  const [active,setActive]=useState<WorkoutSession|null>(()=>loadActiveWorkoutSession());
  const [name,setName]=useState(locale==='it'?'Allenamento A':'Workout A');
  const [draft,setDraft]=useState<WorkoutExerciseDraft[]>([]);
  const [pickerOpen,setPickerOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [currentExercise,setCurrentExercise]=useState(0);
  const [rest,setRest]=useState(0);
  const [previewLoad,setPreviewLoad]=useState(0);
  const [debouncedLoad,setDebouncedLoad]=useState(0);

  useEffect(()=>{if(rest<=0)return;const timer=window.setInterval(()=>setRest(v=>Math.max(0,v-1)),1000);return()=>clearInterval(timer)},[rest]);
  useEffect(()=>{saveActiveWorkoutSession(active)},[active]);
  useEffect(()=>{const timer=window.setTimeout(()=>setDebouncedLoad(previewLoad),180);return()=>clearTimeout(timer)},[previewLoad]);
  useEffect(()=>{
    if(!active)return;
    const exercise=active.exercises[currentExercise];
    if(!exercise)return;
    const currentLast=exercise.completedSets.at(-1);
    const previous=lastPerformance(history,exercise.exerciseId);
    const next=currentLast?.loadKg??previous?.loadKg??exercise.targetLoadKg;
    setPreviewLoad(next);
    setDebouncedLoad(next);
  },[active?.id,currentExercise]);

  const filtered=useMemo(()=>exerciseCatalog.filter(x=>exerciseName(x.id,locale).toLowerCase().includes(query.toLowerCase())).slice(0,30),[query,locale]);
  const updateDraft=(id:string,patch:Partial<WorkoutExerciseDraft>)=>setDraft(rows=>rows.map(row=>row.id===id?{...row,...patch}:row));
  const move=(index:number,delta:number)=>setDraft(rows=>{const next=[...rows];const target=index+delta;if(target<0||target>=next.length)return rows;[next[index],next[target]]=[next[target],next[index]];return next});
  const createRow=(exerciseId:string):WorkoutExerciseDraft=>{const previous=lastPerformance(history,exerciseId);return{id:uid(),exerciseId,sets:3,targetReps:previous?.reps??10,targetLoadKg:previous?.loadKg??20,restSeconds:90}};
  const saveTemplate=()=>{if(!draft.length)return;const now=new Date().toISOString();const template:WorkoutTemplate={id:uid(),name:name.trim()||'Workout',exercises:draft,createdAt:now,updatedAt:now};const next=[template,...templates];setTemplates(saveWorkoutTemplates(next));setMode('hub')};
  const start=(template:WorkoutTemplate)=>{const session:WorkoutSession={id:uid(),templateId:template.id,templateName:template.name,startedAt:new Date().toISOString(),completedAt:null,status:'active',exercises:template.exercises.map(item=>{const previous=lastPerformance(history,item.exerciseId);return{exerciseId:item.exerciseId,plannedSets:item.sets,targetReps:previous?.reps??item.targetReps,targetLoadKg:previous?.loadKg??item.targetLoadKg,restSeconds:item.restSeconds,completedSets:[]}})};setCurrentExercise(0);setActive(session);setMode('live')};
  const completeSet=(reps:number,loadKg:number,rir:number|null)=>{if(!active)return;const index=currentExercise;const exercise=active.exercises[index];const completed={setNumber:exercise.completedSets.length+1,reps,loadKg,rir,completedAt:new Date().toISOString()};const next={...active,exercises:active.exercises.map((item,i)=>i===index?{...item,completedSets:[...item.completedSets,completed]}:item)};setActive(next);setRest(exercise.restSeconds);if(exercise.completedSets.length+1>=exercise.plannedSets&&index<active.exercises.length-1)setCurrentExercise(index+1)};
  const finish=(status:'completed'|'interrupted')=>{if(!active)return;const done={...active,status,completedAt:new Date().toISOString()};const next=[done,...history];setHistory(saveWorkoutSessions(next));setActive(null);setRest(0);setMode('hub')};
  const duration=(session:WorkoutSession)=>Math.max(1,Math.round((new Date(session.completedAt??Date.now()).getTime()-new Date(session.startedAt).getTime())/60000));

  if(mode==='builder')return <section className="workout-screen"><div className="workout-top"><button onClick={()=>setMode('hub')}>‹</button><div><small>{locale==='it'?'NUOVA ROUTINE':'NEW ROUTINE'}</small><strong>{locale==='it'?'Costruisci allenamento':'Build workout'}</strong></div><button className="workout-save" onClick={saveTemplate}>✓</button></div><input className="workout-name" value={name} onChange={e=>setName(e.target.value)}/><div className="builder-list">{draft.map((row,index)=><article className="builder-card" key={row.id}><div className="builder-head"><span>{index+1}</span><strong>{exerciseName(row.exerciseId,locale)}</strong><div><button onClick={()=>move(index,-1)}>↑</button><button onClick={()=>move(index,1)}>↓</button><button onClick={()=>setDraft(x=>x.filter(y=>y.id!==row.id))}>×</button></div></div><div className="builder-fields"><label><small>{locale==='it'?'Serie':'Sets'}</small><input type="number" min="1" max="10" value={row.sets} onChange={e=>updateDraft(row.id,{sets:Number(e.target.value)})}/></label><label><small>Reps</small><input type="number" min="1" max="50" value={row.targetReps} onChange={e=>updateDraft(row.id,{targetReps:clamp(Number(e.target.value),1,50)})}/></label><label><small>Kg</small><input type="number" min="0" max="150" step="0.5" value={row.targetLoadKg} onChange={e=>updateDraft(row.id,{targetLoadKg:clamp(Number(e.target.value),0,150)})}/></label><label><small>{locale==='it'?'Recupero':'Rest'}</small><input type="number" min="15" step="15" value={row.restSeconds} onChange={e=>updateDraft(row.id,{restSeconds:Number(e.target.value)})}/></label></div><ExerciseLoadGuide compact exerciseId={row.exerciseId} targetKg={row.targetLoadKg} loadSetup={loadSetup} locale={locale} previousExerciseId={draft[index-1]?.exerciseId} previousTargetKg={draft[index-1]?.targetLoadKg}/></article>)}</div><button className="add-exercise" onClick={()=>setPickerOpen(true)}>＋ {locale==='it'?'Aggiungi esercizio':'Add exercise'}</button>{pickerOpen&&<div className="workout-sheet-backdrop" onClick={()=>setPickerOpen(false)}><section className="workout-picker" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={locale==='it'?'Cerca esercizio':'Search exercise'}/>{filtered.map(ex=><button key={ex.id} onClick={()=>{setDraft(rows=>[...rows,createRow(ex.id)]);setPickerOpen(false);setQuery('')}}><span>{ex.icon}</span><strong>{exerciseName(ex.id,locale)}</strong><b>＋</b></button>)}</section></div>}</section>;

  if(mode==='live'&&active){const exercise=active.exercises[currentExercise];const previous=active.exercises[currentExercise-1];const last=exercise.completedSets.at(-1);const historic=lastPerformance(history,exercise.exerciseId);const suggestedReps=last?.reps??historic?.reps??exercise.targetReps;const suggestedLoad=last?.loadKg??historic?.loadKg??exercise.targetLoadKg;return <section className="live-workout"><div className="live-header"><div><small>{active.templateName}</small><strong>{currentExercise+1}/{active.exercises.length}</strong></div><button onClick={()=>finish('interrupted')}>{locale==='it'?'Interrompi':'Stop'}</button></div><div className="live-hero"><span>{exerciseCatalog.find(x=>x.id===exercise.exerciseId)?.icon??'◆'}</span><small>{locale==='it'?'ESERCIZIO ATTUALE':'CURRENT EXERCISE'}</small><h1>{exerciseName(exercise.exerciseId,locale)}</h1><p>{exercise.completedSets.length}/{exercise.plannedSets} {locale==='it'?'serie completate':'sets completed'}</p>{!last&&historic&&<em>{locale==='it'?`Ultima volta: ${historic.loadKg} kg × ${historic.reps}`:`Last time: ${historic.loadKg} kg × ${historic.reps}`}</em>}</div><ExerciseLoadGuide exerciseId={exercise.exerciseId} targetKg={debouncedLoad} loadSetup={loadSetup} locale={locale} previousExerciseId={previous?.exerciseId} previousTargetKg={previous?.completedSets.at(-1)?.loadKg??previous?.targetLoadKg}/>{rest>0&&<div className="rest-timer"><small>{locale==='it'?'RECUPERO':'REST'}</small><strong>{Math.floor(rest/60)}:{String(rest%60).padStart(2,'0')}</strong><button onClick={()=>setRest(0)}>{locale==='it'?'Salta':'Skip'}</button></div>}<SetLogger key={`${active.id}-${currentExercise}`} defaultReps={suggestedReps} defaultLoad={suggestedLoad} locale={locale} onLoadChange={setPreviewLoad} onComplete={completeSet}/><div className="live-progress">{active.exercises.map((item,i)=><button key={item.exerciseId+i} className={i===currentExercise?'active':item.completedSets.length>=item.plannedSets?'done':''} onClick={()=>setCurrentExercise(i)}>{i+1}</button>)}</div><button className="finish-workout" onClick={()=>finish('completed')}>✓ {locale==='it'?'Completa allenamento':'Complete workout'}</button></section>}

  if(mode==='history')return <section className="workout-screen"><div className="workout-top"><button onClick={()=>setMode('hub')}>‹</button><div><small>{locale==='it'?'DIARIO':'HISTORY'}</small><strong>{locale==='it'?'Allenamenti recenti':'Recent workouts'}</strong></div><i/></div><div className="history-list">{history.length?history.map(item=><article key={item.id}><span>{item.status==='completed'?'✓':'×'}</span><div><strong>{item.templateName}</strong><small>{new Date(item.startedAt).toLocaleDateString(locale)} · {duration(item)} min · {item.exercises.reduce((sum,x)=>sum+x.completedSets.length,0)} set</small></div></article>):<div className="empty-workout">{locale==='it'?'Nessun allenamento registrato.':'No workouts recorded yet.'}</div>}</div></section>;

  return <section className="workout-hub"><div className="workout-hero"><small>REPSHIFT LIVE</small><h1>{locale==='it'?'Pronto ad allenarti?':'Ready to train?'}</h1><p>{locale==='it'?'Crea una routine, avviala e registra ogni serie senza uscire dal flusso.':'Build a routine, start it and log every set without leaving the flow.'}</p><button onClick={()=>{setDraft([]);setMode('builder')}}>＋ {locale==='it'?'Crea allenamento':'Create workout'}</button></div>{active&&<button className="resume-card" onClick={()=>setMode('live')}><span>▶</span><div><small>{locale==='it'?'SESSIONE IN CORSO':'ACTIVE SESSION'}</small><strong>{active.templateName}</strong></div><b>›</b></button>}<div className="workout-section-title"><strong>{locale==='it'?'Le tue routine':'Your routines'}</strong><button onClick={()=>setMode('history')}>{locale==='it'?'Storico':'History'} ›</button></div><div className="template-list">{templates.map(template=><article key={template.id}><div><small>{template.exercises.length} {locale==='it'?'esercizi':'exercises'}</small><strong>{template.name}</strong><em>{template.exercises.slice(0,3).map(x=>exerciseName(x.exerciseId,locale)).join(' · ')}</em></div><button onClick={()=>start(template)}>▶</button></article>)}{!templates.length&&<div className="empty-workout"><span>✦</span><strong>{locale==='it'?'Nessuna routine ancora':'No routines yet'}</strong><small>{locale==='it'?'Creane una in meno di un minuto.':'Build one in under a minute.'}</small></div>}</div><button className="workout-exit" onClick={onExit}>{locale==='it'?'Torna alla Home':'Back to Home'}</button></section>;
}

function SetLogger({defaultReps,defaultLoad,locale,onLoadChange,onComplete}:{defaultReps:number;defaultLoad:number;locale:'it'|'en';onLoadChange:(load:number)=>void;onComplete:(reps:number,load:number,rir:number|null)=>void}){
 const [reps,setReps]=useState(()=>clamp(defaultReps,1,50));const [load,setLoadState]=useState(()=>clamp(defaultLoad,0,150));const [rir,setRir]=useState<number|null>(2);
 const setLoad=(value:number|((current:number)=>number))=>setLoadState(current=>{const next=clamp(typeof value==='function'?value(current):value,0,150);onLoadChange(next);return next});
 useEffect(()=>{setReps(clamp(defaultReps,1,50));setLoadState(clamp(defaultLoad,0,150));onLoadChange(clamp(defaultLoad,0,150))},[defaultReps,defaultLoad]);
 const repsProgress=`${((reps-1)/49)*100}%`;const loadProgress=`${(load/150)*100}%`;
 return <div className="set-logger"><div className="set-value"><div className="set-value-slider-head"><small>REPS</small><em>{locale==='it'?'scorrimento rapido':'quick slide'}</em></div><div><button onClick={()=>setReps(v=>Math.max(1,v-1))}>−</button><strong>{reps}</strong><button onClick={()=>setReps(v=>Math.min(50,v+1))}>＋</button></div><input className="live-value-slider" style={{'--slider-progress':repsProgress} as React.CSSProperties} aria-label={locale==='it'?'Regola ripetizioni':'Adjust reps'} type="range" min="1" max="50" step="1" value={reps} onChange={e=>setReps(Number(e.target.value))}/><div className="slider-scale"><span>1</span><small>{locale==='it'?'trascina il rombo':'drag the diamond'}</small><span>50</span></div></div><div className="set-value"><div className="set-value-slider-head"><small>KG</small><em>{locale==='it'?'aggiorna il montaggio':'updates load setup'}</em></div><div><button onClick={()=>setLoad(v=>Math.round((v-0.5)*2)/2)}>−</button><strong>{load}</strong><button onClick={()=>setLoad(v=>Math.round((v+0.5)*2)/2)}>＋</button></div><input className="live-value-slider" style={{'--slider-progress':loadProgress} as React.CSSProperties} aria-label={locale==='it'?'Regola carico':'Adjust load'} type="range" min="0" max="150" step="0.5" value={load} onChange={e=>setLoad(Number(e.target.value))}/><div className="slider-scale"><span>0</span><small>{locale==='it'?'trascina il rombo':'drag the diamond'}</small><span>150</span></div></div><div className="rir-row"><small>RIR</small>{[0,1,2,3,4].map(value=><button key={value} className={rir===value?'active':''} onClick={()=>setRir(value)}>{value}</button>)}</div><button className="log-set" onClick={()=>onComplete(reps,load,rir)}>✓ {locale==='it'?'Registra serie':'Log set'}</button></div>
}
