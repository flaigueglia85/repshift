import { useEffect, useMemo, useState } from 'react';
import { exerciseCatalog } from '../data/exerciseCatalog';
import { buildLoadGuidance, buildTransitionInstruction, withMountOption } from '../domain/loadGuidance';
import type { LoadSetupProfile } from '../types/loadSetup';
import '../loadGuideOptions.css';

interface Props {
  exerciseId: string;
  targetKg: number;
  loadSetup: LoadSetupProfile | null;
  locale: 'it' | 'en';
  previousExerciseId?: string;
  previousTargetKg?: number;
  compact?: boolean;
}

export default function ExerciseLoadGuide({ exerciseId, targetKg, loadSetup, locale, previousExerciseId, previousTargetKg, compact = false }: Props) {
  const [mountIndex,setMountIndex]=useState(0);
  const [pickerOpen,setPickerOpen]=useState(false);
  useEffect(()=>{setMountIndex(0);setPickerOpen(false)},[exerciseId,targetKg]);
  const exercise=exerciseCatalog.find(item=>item.id===exerciseId);
  const baseGuidance=useMemo(()=>buildLoadGuidance(exercise,targetKg,loadSetup),[exerciseId,targetKg,loadSetup]);
  const guidance=withMountOption(baseGuidance,mountIndex);
  const previous=previousExerciseId?buildLoadGuidance(exerciseCatalog.find(item=>item.id===previousExerciseId),previousTargetKg??0,loadSetup):null;
  const transition=buildTransitionInstruction(previous,guidance,locale);
  const summary=locale==='it'?guidance.summaryIt:guidance.summaryEn;
  const note=locale==='it'?guidance.noteIt:guidance.noteEn;
  const canVary=['barbell','adjustable_dumbbell','plate_machine'].includes(guidance.kind);

  return <>
    <aside className={compact?'exercise-load-guide compact':'exercise-load-guide'}>
      <div className="load-guide-title"><span>◉</span><div><small>{locale==='it'?'MONTAGGIO CARICO':'LOAD SETUP'}</small><strong>{guidance.achievedKg>0?`${guidance.achievedKg} kg ${locale==='it'?'totali':'total'}`:locale==='it'?'Corpo libero':'Bodyweight'}</strong></div>{guidance.exact&&guidance.kind!=='bodyweight'&&<b>✓</b>}</div>
      <p>{summary}</p>
      {guidance.implementCount===2&&<div className="load-split-note"><small>{locale==='it'?'CARICO DIVISO':'SPLIT LOAD'}</small><strong>{guidance.achievedKg} kg totali = {guidance.perImplementKg} kg + {guidance.perImplementKg} kg</strong></div>}
      {canVary&&<button className="vary-mount-button" type="button" onClick={()=>setPickerOpen(true)}><span>⇄</span><div><strong>{locale==='it'?'Varia montaggio':'Change setup'}</strong><small>{guidance.mountOptions.length>1?(locale==='it'?`${guidance.mountOptions.length} combinazioni disponibili`:`${guidance.mountOptions.length} combinations available`):(locale==='it'?'Verifica le alternative compatibili':'Check compatible alternatives')}</small></div><b>›</b></button>}
      {note&&<em>{note}</em>}
      {transition&&<div className="load-transition"><small>{locale==='it'?'CAMBIO DAL PRECEDENTE':'CHANGE FROM PREVIOUS'}</small><strong>{transition}</strong></div>}
    </aside>

    {pickerOpen&&<div className="mount-picker-backdrop" onClick={()=>setPickerOpen(false)}><section className="mount-picker-sheet" onClick={event=>event.stopPropagation()}>
      <div className="sheet-handle"/>
      <div className="mount-picker-header"><div><small>{locale==='it'?'VARIAZIONI DISPONIBILI':'AVAILABLE VARIATIONS'}</small><strong>{guidance.achievedKg} kg {locale==='it'?'totali':'total'}</strong><p>{locale==='it'?'Solo combinazioni compatibili con i dischi e l’attrezzatura configurati.':'Only combinations compatible with your configured plates and equipment.'}</p></div><button type="button" onClick={()=>setPickerOpen(false)}>×</button></div>
      <div className="mount-picker-list">{guidance.mountOptions.length?guidance.mountOptions.map((option,index)=><button key={`${option.perSide.join('-')}-${index}`} className={mountIndex===index?'selected':''} type="button" onClick={()=>{setMountIndex(index);setPickerOpen(false)}}><span>{mountIndex===index?'✓':index+1}</span><div><small>{index===0?(locale==='it'?'CONSIGLIATO':'RECOMMENDED'):(locale==='it'?`ALTERNATIVA ${index+1}`:`ALTERNATIVE ${index+1}`)}</small><strong>{option.perSide.length?option.perSide.map(value=>`${value} kg`).join(' + '):(locale==='it'?'Nessun disco':'No plates')}</strong><em>{guidance.kind==='adjustable_dumbbell'?(locale==='it'?'per lato di ogni manubrio':'on each side of every dumbbell'):(locale==='it'?'per lato':'per side')}</em></div><b>›</b></button>):<div className="no-mount-options"><span>!</span><strong>{locale==='it'?'Nessuna variazione disponibile':'No alternative setup available'}</strong><small>{locale==='it'?'Con i dischi configurati questo è l’unico montaggio possibile per il carico scelto.':'With your configured plates this is the only possible setup for the selected load.'}</small></div>}</div>
    </section></div>}
  </>;
}
