import { useMemo, useState } from 'react';
import { equipmentCatalog } from '../data/equipmentCatalog';
import { loadEquipmentProfile } from '../storage/equipmentStorage';
import {
  calculateDumbbellPlateSolution,
  calculatePlateSolution,
  createMachineConfig,
  defaultPlates,
} from '../storage/loadSetupStorage';
import type { LoadSetupProfile, MachineLoadConfig, PlateInventoryItem } from '../types/loadSetup';
import type { MessageKey } from '../i18n/messages';
import '../loadSetupEnhancements.css';

interface Props {
  current: LoadSetupProfile | null;
  t: (key: MessageKey, variables?: Record<string, string>) => string;
  onBack: () => void;
  onSave: (draft: Omit<LoadSetupProfile, 'id' | 'createdAt' | 'updatedAt' | 'revision' | 'schemaVersion'>) => void;
}

type LoadTab = 'plates' | 'dumbbells' | 'machines' | 'tests';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function LoadTestCard({ title, target, setTarget, min, max, step, achieved, perSide, exact, sideLabel, note, t }: {
  title: string;
  target: number;
  setTarget: (value: number) => void;
  min: number;
  max: number;
  step: number;
  achieved: number;
  perSide: number[];
  exact: boolean;
  sideLabel: string;
  note?: string;
  t: Props['t'];
}) {
  return <div className="calculator-card mobile-load-test">
    <span>{title}</span>
    <div className="load-result-hero">
      <div><small>{t('targetLoad')}</small><strong>{target} kg</strong></div>
      <b>→</b>
      <div><small>{t('availableLoad')}</small><strong>{achieved} kg</strong></div>
    </div>
    <input className="wide-range" type="range" min={min} max={max} step={step} value={target} onChange={(event) => setTarget(Number(event.target.value))} />
    <div className="stepper wide-stepper">
      <button type="button" onClick={() => setTarget(clamp(target - step, min, max))}>−</button>
      <button type="button" onClick={() => setTarget(clamp(target + step, min, max))}>+</button>
    </div>
    <div className="plate-solution">
      <small>{sideLabel}</small>
      <b>{perSide.length ? perSide.map((value) => `${value} kg`).join(' + ') : '—'}</b>
      <em>{exact ? t('exactMatch') : t('closestBelow')}</em>
      {note && <small className="solution-note">{note}</small>}
    </div>
  </div>;
}

export default function LoadSetupScreen({ current, t, onSave }: Props) {
  const machines = useMemo(() => {
    const selectedIds = loadEquipmentProfile()?.selectedEquipmentIds ?? [];
    return equipmentCatalog.filter((item) => selectedIds.includes(item.id) && (item.category === 'machines' || item.category === 'cables'));
  }, []);

  const [activeTab, setActiveTab] = useState<LoadTab>('plates');
  const [showInfo, setShowInfo] = useState(false);
  const [barbellWeightKg, setBarbellWeightKg] = useState(current?.barbellWeightKg ?? 20);
  const [plates, setPlates] = useState<PlateInventoryItem[]>(current?.plates ?? defaultPlates);
  const [dumbbellMode, setDumbbellMode] = useState<LoadSetupProfile['dumbbellMode']>(current?.dumbbellMode ?? 'both');
  const [dumbbellStepKg, setDumbbellStepKg] = useState(current?.dumbbellStepKg ?? 2);
  const [maxDumbbellKg, setMaxDumbbellKg] = useState(current?.maxDumbbellKg ?? 40);
  const [includeAdjustableDumbbellHandleWeight, setIncludeAdjustableDumbbellHandleWeight] = useState(current?.includeAdjustableDumbbellHandleWeight ?? false);
  const [adjustableDumbbellHandleKg, setAdjustableDumbbellHandleKg] = useState(current?.adjustableDumbbellHandleKg ?? 2.5);
  const [cableIncrementKg, setCableIncrementKg] = useState(current?.cableIncrementKg ?? 2.5);
  const [machineConfigs, setMachineConfigs] = useState<MachineLoadConfig[]>(() => machines.map((machine) =>
    current?.machineConfigs.find((item) => item.equipmentId === machine.id)
      ?? createMachineConfig(machine.id, machine.loadingType === 'plate_loaded' ? 'plate_loaded' : 'weight_stack'),
  ));
  const [targetKg, setTargetKg] = useState(80);
  const [dumbbellTargetKg, setDumbbellTargetKg] = useState(20);

  const solution = useMemo(() => calculatePlateSolution(targetKg, barbellWeightKg, plates), [targetKg, barbellWeightKg, plates]);
  const effectiveHandleWeight = includeAdjustableDumbbellHandleWeight ? adjustableDumbbellHandleKg : 0;
  const dumbbellSolution = useMemo(
    () => calculateDumbbellPlateSolution(dumbbellTargetKg, effectiveHandleWeight, plates),
    [dumbbellTargetKg, effectiveHandleWeight, plates],
  );

  const usesAdjustableDumbbells = dumbbellMode === 'adjustable' || dumbbellMode === 'both';
  const adjustPlatePairs = (weightKg: number, deltaPairs: number) => setPlates((items) => items.map((item) =>
    item.weightKg === weightKg ? { ...item, quantity: clamp(item.quantity + deltaPairs * 2, 0, 20) } : item,
  ));
  const updateMachine = (equipmentId: string, patch: Partial<MachineLoadConfig>) => setMachineConfigs((items) => items.map((item) =>
    item.equipmentId === equipmentId ? { ...item, ...patch } : item,
  ));

  const save = () => onSave({
    barbellWeightKg,
    plates,
    dumbbellMode,
    dumbbellStepKg,
    maxDumbbellKg,
    includeAdjustableDumbbellHandleWeight,
    adjustableDumbbellHandleKg,
    cableIncrementKg,
    machineConfigs,
  });

  const tabs: { id: LoadTab; icon: string; label: MessageKey; hint: MessageKey; tooltip: MessageKey }[] = [
    { id: 'plates', icon: '◉', label: 'tabPlates', hint: 'tabPlatesHint', tooltip: 'tabPlatesTooltip' },
    { id: 'dumbbells', icon: '◆', label: 'tabDumbbells', hint: 'tabDumbbellsHint', tooltip: 'tabDumbbellsTooltip' },
    { id: 'machines', icon: '▦', label: 'tabMachines', hint: 'tabMachinesHint', tooltip: 'machineConfigurationHint' },
    { id: 'tests', icon: '↗', label: 'tabTests', hint: 'tabTestsHint', tooltip: 'tabTestsTooltip' },
  ];
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return <section className="load-screen premium-load-screen">
    <div className="load-command-deck">
      <div className="command-summary">
        <span className="command-orb" aria-hidden="true">{active.icon}</span>
        <div className="command-copy">
          <small>{t('loadSetup')}</small>
          <strong>{t(active.label)}</strong>
          <p>{t(active.hint)}</p>
        </div>
        <button type="button" className="command-info" aria-label={t('help')} onClick={() => setShowInfo((value) => !value)}>i</button>
        <button type="button" className="command-save" onClick={save}><span>✓</span><small>{t('saveLoads')}</small></button>
      </div>

      {showInfo && <div className="command-tooltip" role="tooltip">{t(active.tooltip)}</div>}

      <nav className="load-mode-rail" aria-label={t('loadSections')}>
        {tabs.map((tab) => <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => { setActiveTab(tab.id); setShowInfo(false); }}
        >
          <span>{tab.icon}</span>
          <small>{t(tab.label)}</small>
          <i aria-hidden="true" />
        </button>)}
      </nav>
    </div>

    <div className="load-command-spacer" aria-hidden="true" />

    <div className="load-content-canvas" key={activeTab}>
      {activeTab === 'plates' && <>
        <div className="load-section mobile-control-card hero-control-card">
          <div className="control-header"><div><small>{t('barbellWeight')}</small><strong>{barbellWeightKg} kg</strong></div></div>
          <input className="wide-range" type="range" min="5" max="25" step="1" value={barbellWeightKg} onChange={(event) => setBarbellWeightKg(Number(event.target.value))} />
          <div className="stepper wide-stepper"><button type="button" onClick={() => setBarbellWeightKg((value) => clamp(value - 1, 5, 25))}>−</button><button type="button" onClick={() => setBarbellWeightKg((value) => clamp(value + 1, 5, 25))}>+</button></div>
        </div>
        <div className="load-section plate-inventory-card">
          <div className="equipment-heading"><strong>{t('plateInventory')}</strong><span>{plates.reduce((sum, item) => sum + item.quantity / 2, 0)} {t('pairsAvailable')}</span></div>
          <div className="plate-list compact-plate-list">{plates.map((plate) => <div className="plate-row mobile-plate-row" key={plate.weightKg}>
            <span className="plate-disc">{plate.weightKg}</span>
            <div className="plate-copy"><strong>{plate.weightKg} kg</strong><small>{plate.quantity / 2} {t('pairs')}</small></div>
            <div className="mini-stepper"><button type="button" onClick={() => adjustPlatePairs(plate.weightKg, -1)}>−</button><span>{plate.quantity / 2}</span><button type="button" onClick={() => adjustPlatePairs(plate.weightKg, 1)}>+</button></div>
          </div>)}</div>
        </div>
      </>}

      {activeTab === 'dumbbells' && <div className="load-section dumbbell-config-card">
        <div className="choice-row choice-row-full">{(['fixed', 'adjustable', 'both'] as const).map((mode) => <button type="button" key={mode} className={dumbbellMode === mode ? 'choice-chip selected' : 'choice-chip'} onClick={() => setDumbbellMode(mode)}>{t(mode)}</button>)}</div>
        <div className="mobile-control-grid">
          <div className="mobile-control-card"><div className="control-header"><div><small>{t('dumbbellStep')}</small><strong>{dumbbellStepKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="5" step="0.5" value={dumbbellStepKg} onChange={(event) => setDumbbellStepKg(Number(event.target.value))} /><div className="stepper wide-stepper"><button type="button" onClick={() => setDumbbellStepKg((value) => clamp(value - 0.5, 0.5, 5))}>−</button><button type="button" onClick={() => setDumbbellStepKg((value) => clamp(value + 0.5, 0.5, 5))}>+</button></div></div>
          <div className="mobile-control-card"><div className="control-header"><div><small>{t('maxDumbbell')}</small><strong>{maxDumbbellKg} kg</strong></div></div><input className="wide-range" type="range" min="5" max="80" step="1" value={maxDumbbellKg} onChange={(event) => setMaxDumbbellKg(Number(event.target.value))} /><div className="stepper wide-stepper"><button type="button" onClick={() => setMaxDumbbellKg((value) => clamp(value - 1, 5, 80))}>−</button><button type="button" onClick={() => setMaxDumbbellKg((value) => clamp(value + 1, 5, 80))}>+</button></div></div>
        </div>
        {usesAdjustableDumbbells && <>
          <button type="button" className={includeAdjustableDumbbellHandleWeight ? 'setting-toggle active' : 'setting-toggle'} onClick={() => setIncludeAdjustableDumbbellHandleWeight((value) => !value)}><div><strong>{t('includeHandleWeight')}</strong><small>{t('includeHandleWeightHint')}</small></div><span aria-hidden="true"><i /></span></button>
          {includeAdjustableDumbbellHandleWeight && <div className="mobile-control-card dumbbell-handle-card"><div className="control-header"><div><small>{t('adjustableDumbbellHandle')}</small><strong>{adjustableDumbbellHandleKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="10" step="0.5" value={adjustableDumbbellHandleKg} onChange={(event) => setAdjustableDumbbellHandleKg(Number(event.target.value))} /></div>}
        </>}
      </div>}

      {activeTab === 'machines' && <>
        {machines.length > 0 ? <div className="machine-config-list">{machines.map((machine) => {
          const config = machineConfigs.find((item) => item.equipmentId === machine.id) ?? createMachineConfig(machine.id, 'weight_stack');
          return <article className="machine-config-card" key={machine.id}>
            <div className="machine-title"><span className="equipment-symbol">{machine.icon}</span><strong>{t(machine.nameKey as MessageKey)}</strong></div>
            <div className="segmented-control machine-mode"><button type="button" className={config.loadingMode === 'weight_stack' ? 'active' : ''} onClick={() => updateMachine(machine.id, { loadingMode: 'weight_stack', startingResistanceKg: 0 })}>{t('weightStack')}<small>{t('weightStackHint')}</small></button><button type="button" className={config.loadingMode === 'plate_loaded' ? 'active' : ''} onClick={() => updateMachine(machine.id, { loadingMode: 'plate_loaded' })}>{t('plateLoaded')}<small>{t('plateLoadedHint')}</small></button></div>
            <div className="machine-values"><div><small>{t('loadIncrement')}</small><strong>{config.incrementKg} kg</strong><div className="mini-stepper"><button type="button" onClick={() => updateMachine(machine.id, { incrementKg: clamp(config.incrementKg - 0.5, 0.5, 20) })}>−</button><button type="button" onClick={() => updateMachine(machine.id, { incrementKg: clamp(config.incrementKg + 0.5, 0.5, 20) })}>+</button></div></div>{config.loadingMode === 'plate_loaded' && <div><small>{t('startingResistance')}</small><strong>{config.startingResistanceKg} kg</strong><div className="mini-stepper"><button type="button" onClick={() => updateMachine(machine.id, { startingResistanceKg: clamp(config.startingResistanceKg - 1, 0, 100) })}>−</button><button type="button" onClick={() => updateMachine(machine.id, { startingResistanceKg: clamp(config.startingResistanceKg + 1, 0, 100) })}>+</button></div></div>}</div>
          </article>;
        })}</div> : <div className="empty-tab-state"><span>▦</span><strong>{t('noMachines')}</strong><small>{t('noMachinesHint')}</small></div>}
        <div className="load-section mobile-control-card"><div className="control-header"><div><small>{t('cableIncrement')}</small><strong>{cableIncrementKg} kg</strong></div></div><input className="wide-range" type="range" min="0.5" max="10" step="0.5" value={cableIncrementKg} onChange={(event) => setCableIncrementKg(Number(event.target.value))} /><div className="stepper wide-stepper"><button type="button" onClick={() => setCableIncrementKg((value) => clamp(value - 0.5, 0.5, 10))}>−</button><button type="button" onClick={() => setCableIncrementKg((value) => clamp(value + 0.5, 0.5, 10))}>+</button></div></div>
      </>}

      {activeTab === 'tests' && <>
        <LoadTestCard title={t('plateCalculator')} target={targetKg} setTarget={setTargetKg} min={barbellWeightKg} max={300} step={0.5} achieved={solution.achievedKg} perSide={solution.perSide} exact={solution.differenceKg === 0} sideLabel={t('perSide')} t={t} />
        {usesAdjustableDumbbells && <LoadTestCard title={t('dumbbellPlateCalculator')} target={dumbbellTargetKg} setTarget={setDumbbellTargetKg} min={1} max={80} step={0.5} achieved={dumbbellSolution.achievedKg} perSide={dumbbellSolution.perSide} exact={dumbbellSolution.differenceKg === 0} sideLabel={t('perHandleSide')} note={t('fourPlateRule')} t={t} />}
      </>}
    </div>
  </section>;
}
