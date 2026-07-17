import type { ExerciseDefinition, ExerciseVisualStage, MovementPattern } from '../types/exercise';

const stageCopy: Record<MovementPattern, Omit<ExerciseVisualStage, 'assetKey'>[]> = {
  horizontal_push: [
    { id:'setup',title:{it:'Assetto',en:'Setup'},cue:{it:'Crea una base stabile e allinea polsi, gomiti e spalle.',en:'Build a stable base and align wrists, elbows and shoulders.'}},
    { id:'execution',title:{it:'Discesa',en:'Lower'},cue:{it:'Controlla la fase eccentrica senza perdere tensione.',en:'Control the eccentric phase without losing tension.'}},
    { id:'finish',title:{it:'Spinta',en:'Press'},cue:{it:'Spingi mantenendo la traiettoria e il tronco stabile.',en:'Press while preserving the path and a stable torso.'}},
  ],
  horizontal_pull: [
    { id:'setup',title:{it:'Allungamento',en:'Reach'},cue:{it:'Posizionati stabile e lascia spazio al movimento scapolare.',en:'Set a stable base and allow room for scapular motion.'}},
    { id:'execution',title:{it:'Tirata',en:'Pull'},cue:{it:'Guida il gomito verso il fianco senza strattonare.',en:'Drive the elbow toward the hip without jerking.'}},
    { id:'finish',title:{it:'Contrazione',en:'Finish'},cue:{it:'Chiudi la tirata senza ruotare o iperestendere il busto.',en:'Finish the pull without rotating or overextending the torso.'}},
  ],
  vertical_push: [
    { id:'setup',title:{it:'Partenza',en:'Start'},cue:{it:'Blocca il tronco e porta il carico in posizione sicura.',en:'Brace the torso and place the load in a safe start position.'}},
    { id:'execution',title:{it:'Spinta',en:'Drive'},cue:{it:'Spingi sopra la testa seguendo una linea compatta.',en:'Press overhead along a compact path.'}},
    { id:'finish',title:{it:'Lockout',en:'Lockout'},cue:{it:'Termina con il carico sopra il centro del corpo.',en:'Finish with the load stacked over the body.'}},
  ],
  vertical_pull: [
    { id:'setup',title:{it:'Presa',en:'Grip'},cue:{it:'Stabilisci la presa e abbassa le scapole prima di tirare.',en:'Set the grip and depress the shoulder blades before pulling.'}},
    { id:'execution',title:{it:'Tirata',en:'Pull'},cue:{it:'Guida i gomiti verso il basso mantenendo il petto aperto.',en:'Drive the elbows down while keeping the chest open.'}},
    { id:'finish',title:{it:'Chiusura',en:'Finish'},cue:{it:'Completa senza slancio e conserva il controllo.',en:'Complete the rep without momentum and retain control.'}},
  ],
  squat: [
    { id:'setup',title:{it:'Assetto',en:'Setup'},cue:{it:'Distribuisci il peso sul piede e crea pressione nel tronco.',en:'Balance pressure through the foot and brace the trunk.'}},
    { id:'execution',title:{it:'Discesa',en:'Descent'},cue:{it:'Scendi mantenendo ginocchia e bacino sulla loro traiettoria.',en:'Descend while keeping knees and hips on track.'}},
    { id:'finish',title:{it:'Risalita',en:'Drive up'},cue:{it:'Spingi il pavimento e risali senza perdere il torace.',en:'Drive through the floor without losing the chest.'}},
  ],
  hinge: [
    { id:'setup',title:{it:'Partenza',en:'Start'},cue:{it:'Sblocca leggermente le ginocchia e stabilizza la schiena.',en:'Unlock the knees slightly and stabilize the spine.'}},
    { id:'execution',title:{it:'Hip hinge',en:'Hip hinge'},cue:{it:'Porta il bacino indietro mantenendo il carico vicino.',en:'Push the hips back while keeping the load close.'}},
    { id:'finish',title:{it:'Estensione',en:'Stand tall'},cue:{it:'Estendi le anche senza iperestendere la zona lombare.',en:'Extend the hips without overextending the lower back.'}},
  ],
  lunge: [
    { id:'setup',title:{it:'Passo',en:'Step'},cue:{it:'Crea una base abbastanza ampia da restare stabile.',en:'Create a stance wide enough to remain stable.'}},
    { id:'execution',title:{it:'Discesa',en:'Lower'},cue:{it:'Scendi verticalmente controllando ginocchio e bacino.',en:'Lower vertically while controlling the knee and hip.'}},
    { id:'finish',title:{it:'Spinta',en:'Return'},cue:{it:'Spingi dal piede anteriore e recupera l’equilibrio.',en:'Drive through the front foot and regain balance.'}},
  ],
  isolation: [
    { id:'setup',title:{it:'Posizione',en:'Position'},cue:{it:'Allinea l’articolazione e stabilizza il resto del corpo.',en:'Align the joint and stabilize the rest of the body.'}},
    { id:'execution',title:{it:'Contrazione',en:'Contract'},cue:{it:'Muovi il carico senza slancio e mantieni la tensione.',en:'Move the load without momentum and keep tension.'}},
    { id:'finish',title:{it:'Ritorno',en:'Return'},cue:{it:'Rientra lentamente senza lasciare cadere il carico.',en:'Return slowly without dropping the load.'}},
  ],
  carry: [
    { id:'setup',title:{it:'Presa',en:'Pick up'},cue:{it:'Afferra il carico con tronco stabile e spalle organizzate.',en:'Take the load with a braced torso and organized shoulders.'}},
    { id:'execution',title:{it:'Camminata',en:'Walk'},cue:{it:'Mantieni passi regolari senza inclinarti lateralmente.',en:'Use even steps without leaning to either side.'}},
    { id:'finish',title:{it:'Appoggio',en:'Set down'},cue:{it:'Arresta il movimento e posa il carico in controllo.',en:'Stop moving and set the load down under control.'}},
  ],
  core: [
    { id:'setup',title:{it:'Assetto',en:'Setup'},cue:{it:'Trova una posizione neutra e crea tensione addominale.',en:'Find a neutral position and build abdominal tension.'}},
    { id:'execution',title:{it:'Controllo',en:'Control'},cue:{it:'Muovi solo ciò che serve senza perdere la posizione.',en:'Move only what is required without losing position.'}},
    { id:'finish',title:{it:'Tenuta',en:'Hold'},cue:{it:'Respira mantenendo il tronco stabile fino alla fine.',en:'Breathe while keeping the trunk stable through the finish.'}},
  ],
};

export function getExerciseVisualStages(exercise: ExerciseDefinition): ExerciseVisualStage[] {
  return stageCopy[exercise.movementPattern].map((stage) => ({
    ...stage,
    assetKey: `exercise/${exercise.id}/${stage.id}`,
  }));
}
