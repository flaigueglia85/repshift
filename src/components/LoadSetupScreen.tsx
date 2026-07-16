import { useMemo, useState } from 'react';
import { equipmentCatalog } from '../data/equipmentCatalog';
import { loadEquipmentProfile } from '../storage/equipmentStorage';
import { calculateDumbbellPlateSolution, calculatePlateSolution, createMachineConfig, defaultPlates } from '../storage/loadSetupStorage';
import type { LoadSetupProfile, MachineLoadConfig, PlateInventoryItem } from '../types/loadSetup';
import type { MessageKey } from '../i18n/messages';
import '../loadSetupEnhancements.css';

interface Props {
  current: LoadSetupProfile | null;
  t: (key: MessageKey, variables?: Record<string, string>) => string;
  onBack: () => void;
  onSave: (draft: Omit<LoadSetupProfile, 'id' | 'createdAt' | 'updatedAt' | 'revision' | 'schemaVersion'>) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function LoadTestCard({ title, target, setTarget, min, max, step, achieved, perSide, exact, sideLabel, note, t }: {
  title: string; target: number; setTarget: (value: number) => void; min: number; max: number; step: number;
  achieved: number; perSide: number[]; exact: boolean; sideLabel: string; note?: string;
  t: Props['t'];
}) {
  return <div className="calculator-card mobile-load-test">
    <span>{title}</span>
    <div className="load-result-hero">
      <div><small>{t('targetLoad')}</small><strong>{target} kg</strong></div>
      <b>→</b>
      <div><small>{t('availableLoad')}</small><strong>{achieved} kg</strong></div>
    </div>
    <input className="wide-range" type="range" min={min} max={max} step={step} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
    <div className="stepper wide-stepper"><button onClick={() => setTarget(clamp(target - step, min, max))}>−</button><button onClick={() => setTarget(clamp(target + step, min, max))}>+</button></div>
    <div className="plate-solution"><small>{sideLabel}</small><b>{perSide.length ? perSide.map((value) => `${value} kg`).join(' + ') : '—'}</b><em>{exact ? t('exactMatch') : t('closestBelow')}</em>{note && <small className="solution-note">{note}</small>}</div>
  </div>;
}

export default function LoadSetupScreen({ current, t, onBack, onSave }: Props) {
  const machines = useMemo(() => {
    const selectedIds = loadEquipmentProfile()?.selectedEquipmentIds ?? [];
    return equipmentCatalog.filter((item) => selectedIds.includes(item.id) && (item.category === 'machines' || item.category === 'cables'));
  }, []);

  const [barbellWeightKg, setBarbellWeightKg] = useState(current?.barbellWeightKg ?? 20);
  const [plates, setPlates] = useState<PlateInventoryItem[]>(current?.plates ?? defaultPlates);
  const [dumbbellMode, setDumbbellMode] = useState<LoadSetupProfile['dumbbellMode']>(current?.dumbbellMode ?? 'both');
  const [dumbbellStepKg, setDumbbellStepKg] = useState(current?.dumbbellStepKg ?? 2);
  const [maxDumbbellKg, setMaxDumbbellKg] = useState(current?.maxDumbbellKg ?? 40);
  const [includeAdjustableDumbbellHandleWeight, setIncludeAdjustableDumbbellHandleWeight] = useState(current?.includeAdjustableDumbbellHandleWeight ?? false);
  const [adjustableDumbbellHandleKg, setAdjustableDumbbellHandleKg] = useState(current?.adjustableDumbbellHandleKg ?? 2.5);
  const [cableIncrementKg, setCableIncrementKg] = useState(current?.cableIncrementKg ?? 2.5);
  const [machineConfigs, setMachineConfigs] = useState<MachineLoadConfig[]>(() => machines.map((machine) => current?.machineConfigs.find((item) => item.equipmentId === machine.id) ?? createMachineConfig(machine.id, machine.loadingType === 'plate_loaded' ? 'plate_loaded' : 'weight_stack')));
  const [targetKg, setTargetKg] = useState(80);
  const [dumbbellTargetKg, setDumbbellTargetKg] = useState(20);

  const solution = useMemo(() => calculatePlateSolution(targetKg, barbellWeightKg, plates), [targetKg, barbellWeightKg, plates]);
  const effectiveHandleWeight = includeAdjustableDumbbellHandleWeight ? adjustableDumbbellHandleKg : 0;
  const dumbbellSolution = useMemo(() => calculateDumbbellPlateSolution(dumbbellTargetKg, effectiveHandleWeight, plates), [dumbbellTargetKg, effectiveHandleWeight, plates]);
  const adjustPlatePairs = (weightKg: number, deltaPairs: number) => setPlates((items) => items.map((item) => item.weightKg === weightKg ? { ...item, quantity: clamp(item.quantity + deltaPairs * 2, 0, 20) } : item));
  const updateMachine = (equipmentId: string, patch: Partial<MachineLoadConfig>) => setMachineConfigs((items) => items.map((item) => item.equipmentId === equipmentId ? { ...item, ...patch } : item));
  const usesAdjustableDumbbells = dumbbellMode === 'adjustable' || dumbbellMode === 'both';

  return <section className="hero-card equipment-screen load-screen">
    <button className="back-button" onClick={onBack}>‹ {t('back')}</button>
    <span className="eyebrow">{t('loadSetup')}</span><h1>{t('loadSetupTitle')}</h1><p>{t('loadSetupBody')}</p>

    <div className="load-section mobile-control-card"><div className="control-header"><div><small>{t('barbellWeight')}</small><strong>{barbellWeightKg} kg</strong></div></div><input className="wide-range" type="range" min="5" max="25" step="1" value={barbellWeightKg} onChange={(e) => setBarbellWeightKg(Number(e.target.value))} /><div className="stepper wide-stepper"><button onClick={() => setBarbellWeightKg((value) => clamp(value - 1, 5, 25))}>−</button><button onClick={() => setBarbellWeightKg((value) => clamp(value + 1, 5, 25))}>+</button></div></div>

    <div className="load-section"><div className="equipment-heading"><strong>{t('plateInventory')}</strong><span>{plates.reduce((sum, item) => sum + item.quantity / 2, 0)} {t('pairsAvailable')}</span></div><div className="plate-list">{plates.map((plate) => <div className="plate-row mobile-plate-row" key={plate.weightKg}><span className="plate-disc">{plate.weightKg}</span><div className="plate-copy"><strong>{plate.weightKg} kg</strong><small>{plate.quantity / 2} {t('pairs')}</small></div><div className="mini-stepper"><button onClick={() => adjustPlatePairs(plate.weightKg, -1)}>−</button><span>{plate.quantity / 2}</span><button onClick={() => adjustPlatePairs(plate.weightKg, 1)}>+</button></div><input className="plate-range" type="range" min="0" max="10" step="1" value={plate.quantity / 2} onChange={(e) => setPlates((items) => items.map((item) => item.weightKg === plate.weightKg ? { ...item, quantity: Number(e.target.value) * 2 } : item))} /></div>)}</div></div>

    <div className="load-section"><div className="equipment-heading"><strong>{t('dumbbells')}</strong></div><div className="choice-row">{(['fixed', 'adjustable', 'both'] as const).map((mode) => <button key={mode} className={dumbbellMode === mode ? 'choice-chip selected' : 'choice-chip'} onClick={() => setDumbbellMode(mode)}>{t(mode)}</button>)}</div><div className="mobile-control-grid"><div className="mobile-control-card"><div className="control-header"><div><small>{t('dumbbellStep')}</small><strong>{dumbbellStepKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="5" step="0.5" value={dumbbellStepKg} onChange={(e) => setDumbbellStepKg(Number(e.target.value))} /><div className="stepper wide-stepper"><button onClick={() => setDumbbellStepKg((value) => clamp(value - 0.5, 0.5, 5))}>−</button><button onClick={() => setDumbbellStepKg((value) => clamp(value + 0.5, 0.5, 5))}>+</button></div></div><div className="mobile-control-card"><div className="control-header"><div><small>{t('maxDumbbell')}</small><strong>{maxDumbbellKg} kg</strong></div></div><input className="wide-range" type="range" min="5" max="80" step="1" value={maxDumbbellKg} onChange={(e) => setMaxDumbbellKg(Number(e.target.value))} /><div className="stepper wide-stepper"><button onClick={() => setMaxDumbbellKg((value) => clamp(value - 1, 5, 80))}>−</button><button onClick={() => setMaxDumbbellKg((value) => clamp(value + 1, 5, 80))}>+</button></div></div></div>
      {usesAdjustableDumbbells && <><button className={includeAdjustableDumbbellHandleWeight ? 'setting-toggle active' : 'setting-toggle'} onClick={() => setIncludeAdjustableDumbbellHandleWeight((value) => !value)}><div><strong>{t('includeHandleWeight')}</strong><small>{t('includeHandleWeightHint')}</small></div><span aria-hidden="true"><i /></span></button>{includeAdjustableDumbbellHandleWeight && <div className="mobile-control-card dumbbell-handle-card"><div className="control-header"><div><small>{t('adjustableDumbbellHandle')}</small><strong>{adjustableDumbbellHandleKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="10" step="0.5" value={adjustableDumbbellHandleKg} onChange={(e) => setAdjustableDumbbellHandleKg(Number(e.target.value))} /><div className="stepper wide-stepper"><button onClick={() => setAdjustableDumbbellHandleKg((value) => clamp(value - 0.5, 0.5, 10))}>−</button><button onClick={() => setAdjustableDumbbellHandleKg((value) => clamp(value + 0.5, 0.5, 10))}>+</button></div></div>}
      <LoadTestCard title={t('dumbbellPlateCalculator')} target={dumbbellTargetKg} setTarget={setDumbbellTargetKg} min={1} max={80} step={0.5} achieved={dumbbellSolution.achievedKg} perSide={dumbbellSolution.perSide} exact={dumbbellSolution.differenceKg === 0} sideLabel={t('perHandleSide')} note={t('fourPlateRule')} t={t} /></>}
    </div>

    {machines.length > 0 && <div className="load-section"><div className="equipment-heading"><strong>{t('machineConfiguration')}</strong><span>{machines.length}</span></div><p className="section-help">{t('machineConfigurationHint')}</p><div className="machine-config-list">{machines.map((machine) => { const config = machineConfigs.find((item) => item.equipmentId === machine.id) ?? createMachineConfig(machine.id, 'weight_stack'); return <article className="machine-config-card" key={machine.id}><div className="machine-title"><span className="equipment-symbol">{machine.icon}</span><strong>{t(machine.nameKey as MessageKey)}</strong></div><div className="segmented-control machine-mode"><button className={config.loadingMode === 'weight_stack' ? 'active' : ''} onClick={() => updateMachine(machine.id, { loadingMode: 'weight_stack', startingResistanceKg: 0 })}>{t('weightStack')}<small>{t('weightStackHint')}</small></button><button className={config.loadingMode === 'plate_loaded' ? 'active' : ''} onClick={() => updateMachine(machine.id, { loadingMode: 'plate_loaded' })}>{t('plateLoaded')}<small>{t('plateLoadedHint')}</small></button></div><div className="machine-values"><div><small>{t('loadIncrement')}</small><strong>{config.incrementKg} kg</strong><div className="mini-stepper"><button onClick={() => updateMachine(machine.id, { incrementKg: clamp(config.incrementKg - 0.5, 0.5, 20) })}>−</button><button onClick={() => updateMachine(machine.id, { incrementKg: clamp(config.incrementKg + 0.5, 0.5, 20) })}>+</button></div></div>{config.loadingMode === 'plate_loaded' && <div><small>{t('startingResistance')}</small><strong>{config.startingResistanceKg} kg</strong><div className="mini-stepper"><button onClick={() => updateMachine(machine.id, { startingResistanceKg: clamp(config.startingResistanceKg - 1, 0, 100) })}>−</button><button onClick={() => updateMachine(machine.id, { startingResistanceKg: clamp(config.startingResistanceKg + 1, 0, 100) })}>+</button></div></div>}</div></article>; })}</div></div>}

    <div className="load-section mobile-control-card"><div className="control-header"><div><small>{t('cableIncrement')}</small><strong>{cableIncrementKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="10" step="0.5" value={cableIncrementKg} onChange={(e) => setCableIncrementKg(Number(e.target.value))} /><div className="stepper wide-stepper"><button onClick={() => setCableIncrementKg((value) => clamp(value - 0.5, 0.5, 10))}>−</button><button onClick={() => setCableIncrementKg((value) => clamp(value + 0.5, 0.5, 10))}>+</button></div></div>

    <LoadTestCard title={t('plateCalculator')} target={targetKg} setTarget={setTargetKg} min={barbellWeightKg} max={300} step={0.5} achieved={solution.achievedKg} perSide={solution.perSide} exact={solution.differenceKg === 0} sideLabel={t('perSide')} t={t} />
    <button className="primary-button sticky-action" onClick={() => onSave({ barbellWeightKg, plates, dumbbellMode, dumbbellStepKg, maxDumbbellKg, includeAdjustableDumbbellHandleWeight, adjustableDumbbellHandleKg, cableIncrementKg, machineConfigs })}>{t('saveLoads')}</button>
  </section>;
}
