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
  useEffect(()=>setMountIndex(0),[exerciseId,targetKg]);
  const exercise=exerciseCatalog.find(item=>item.id===exerciseId);
  const baseGuidance=useMemo(()=>buildLoadGuidance(exercise,targetKg,loadSetup),[exerciseId,targetKg,loadSetup]);
  const guidance=withMountOption(baseGuidance,mountIndex);
  const previous=previousExerciseId?buildLoadGuidance(exerciseCatalog.find(item=>item.id===previousExerciseId),previousTargetKg??0,loadSetup):null;
  const transition=buildTransitionInstruction(previous,guidance,locale);
  const summary=locale==='it'?guidance.summaryIt:guidance.summaryEn;
  const note=locale==='it'?guidance.noteIt:guidance.noteEn;

  return <aside className={compact?'exercise-load-guide compact':'exercise-load-guide'}>
    <div className="load-guide-title"><span>◉</span><div><small>{locale==='it'?'MONTAGGIO CARICO':'LOAD SETUP'}</small><strong>{guidance.achievedKg>0?`${guidance.achievedKg} kg ${locale==='it'?'totali':'total'}`:locale==='it'?'Corpo libero':'Bodyweight'}</strong></div>{guidance.exact&&guidance.kind!=='bodyweight'&&<b>✓</b>}</div>
    <p>{summary}</p>
    {guidance.implementCount===2&&<div className="load-split-note"><small>{locale==='it'?'CARICO DIVISO':'SPLIT LOAD'}</small><strong>{guidance.achievedKg} kg totali = {guidance.perImplementKg} kg + {guidance.perImplementKg} kg</strong></div>}
    {guidance.mountOptions.length>1&&<div className="mount-options"><small>{locale==='it'?'SCEGLI IL MONTAGGIO PIÙ COMODO':'CHOOSE YOUR PREFERRED SETUP'}</small><div>{guidance.mountOptions.map((option,index)=><button key={`${option.perSide.join('-')}-${index}`} className={mountIndex===index?'active':''} onClick={()=>setMountIndex(index)}>{locale==='it'?option.labelIt:option.labelEn}</button>)}</div></div>}
    {note&&<em>{note}</em>}
    {transition&&<div className="load-transition"><small>{locale==='it'?'CAMBIO DAL PRECEDENTE':'CHANGE FROM PREVIOUS'}</small><strong>{transition}</strong></div>}
  </aside>;
}
