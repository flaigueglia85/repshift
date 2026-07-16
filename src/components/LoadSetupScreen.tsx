import { useMemo, useState } from 'react';
import { calculatePlateSolution, defaultPlates } from '../storage/loadSetupStorage';
import type { LoadSetupProfile, PlateInventoryItem } from '../types/loadSetup';
import type { MessageKey } from '../i18n/messages';

interface Props {
  current: LoadSetupProfile | null;
  t: (key: MessageKey, variables?: Record<string, string>) => string;
  onBack: () => void;
  onSave: (draft: Omit<LoadSetupProfile, 'id' | 'createdAt' | 'updatedAt' | 'revision' | 'schemaVersion'>) => void;
}

export default function LoadSetupScreen({ current, t, onBack, onSave }: Props) {
  const [barbellWeightKg, setBarbellWeightKg] = useState(current?.barbellWeightKg ?? 20);
  const [plates, setPlates] = useState<PlateInventoryItem[]>(current?.plates ?? defaultPlates);
  const [dumbbellMode, setDumbbellMode] = useState<LoadSetupProfile['dumbbellMode']>(current?.dumbbellMode ?? 'both');
  const [dumbbellStepKg, setDumbbellStepKg] = useState(current?.dumbbellStepKg ?? 2);
  const [maxDumbbellKg, setMaxDumbbellKg] = useState(current?.maxDumbbellKg ?? 40);
  const [machineIncrementKg, setMachineIncrementKg] = useState(current?.machineIncrementKg ?? 5);
  const [cableIncrementKg, setCableIncrementKg] = useState(current?.cableIncrementKg ?? 2.5);
  const [targetKg, setTargetKg] = useState(80);

  const solution = useMemo(() => calculatePlateSolution(targetKg, barbellWeightKg, plates), [targetKg, barbellWeightKg, plates]);
  const adjustPlate = (weightKg: number, delta: number) => setPlates((items) => items.map((item) => item.weightKg === weightKg ? { ...item, quantity: Math.max(0, Math.min(20, item.quantity + delta)) } : item));

  return <section className="hero-card equipment-screen">
    <button className="back-button" onClick={onBack}>‹ {t('back')}</button>
    <span className="eyebrow">{t('loadSetup')}</span><h1>{t('loadSetupTitle')}</h1><p>{t('loadSetupBody')}</p>

    <div className="load-section"><div className="equipment-heading"><strong>{t('barbellWeight')}</strong><span>{barbellWeightKg} kg</span></div>
      <div className="choice-row">{[10,15,20].map((value)=><button key={value} className={barbellWeightKg===value?'choice-chip selected':'choice-chip'} onClick={()=>setBarbellWeightKg(value)}>{value} kg</button>)}</div>
    </div>

    <div className="load-section"><div className="equipment-heading"><strong>{t('plateInventory')}</strong><span>{plates.reduce((sum,item)=>sum+item.quantity,0)} {t('pairsAvailable')}</span></div>
      <div className="plate-list">{plates.map((plate)=><div className="plate-row" key={plate.weightKg}><span className="plate-disc">{plate.weightKg}</span><strong>{plate.weightKg} kg</strong><div className="mini-stepper"><button onClick={()=>adjustPlate(plate.weightKg,-2)}>−</button><span>{plate.quantity}</span><button onClick={()=>adjustPlate(plate.weightKg,2)}>+</button></div></div>)}</div>
    </div>

    <div className="load-section"><div className="equipment-heading"><strong>{t('dumbbells')}</strong></div>
      <div className="choice-row">{(['fixed','adjustable','both'] as const).map((mode)=><button key={mode} className={dumbbellMode===mode?'choice-chip selected':'choice-chip'} onClick={()=>setDumbbellMode(mode)}>{t(mode)}</button>)}</div>
      <div className="compact-grid"><label><span>{t('dumbbellStep')}</span><input type="number" min="0.5" step="0.5" value={dumbbellStepKg} onChange={(e)=>setDumbbellStepKg(Number(e.target.value))}/></label><label><span>{t('maxDumbbell')}</span><input type="number" min="2" step="1" value={maxDumbbellKg} onChange={(e)=>setMaxDumbbellKg(Number(e.target.value))}/></label></div>
    </div>

    <div className="compact-grid load-section"><label><span>{t('machineIncrement')}</span><input type="number" min="0.5" step="0.5" value={machineIncrementKg} onChange={(e)=>setMachineIncrementKg(Number(e.target.value))}/></label><label><span>{t('cableIncrement')}</span><input type="number" min="0.5" step="0.5" value={cableIncrementKg} onChange={(e)=>setCableIncrementKg(Number(e.target.value))}/></label></div>

    <div className="calculator-card"><span>{t('plateCalculator')}</span><div className="target-row"><label><span>{t('targetWeight')}</span><input type="number" min={barbellWeightKg} step="2.5" value={targetKg} onChange={(e)=>setTargetKg(Number(e.target.value))}/></label><strong>{solution.achievedKg} kg</strong></div><div className="plate-solution"><small>{t('perSide')}</small><b>{solution.perSide.length ? solution.perSide.map((value)=>`${value} kg`).join(' + ') : '—'}</b><em>{solution.differenceKg===0?t('exactMatch'):t('closestBelow')}</em></div></div>

    <button className="primary-button sticky-action" onClick={()=>onSave({barbellWeightKg,plates,dumbbellMode,dumbbellStepKg,maxDumbbellKg,machineIncrementKg,cableIncrementKg})}>{t('saveLoads')}</button>
  </section>;
}
