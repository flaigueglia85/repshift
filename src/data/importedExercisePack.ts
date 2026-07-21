import type { ExerciseDefinition } from '../types/exercise';
import type { ExerciseEditorialContent } from './exerciseContent';

export const importedExerciseNames: Record<string,{it:string;en:string}> = {
  incline_barbell_bench_press:{it:'Panca inclinata bilanciere',en:'Incline barbell bench press'},
  incline_dumbbell_bench_press:{it:'Panca inclinata manubri',en:'Incline dumbbell bench press'},
  machine_chest_press:{it:'Chest press machine',en:'Machine chest press'},
  pec_deck_fly:{it:'Pec deck',en:'Pec deck fly'},
  cable_chest_fly:{it:'Croci ai cavi',en:'Cable chest fly'},
  assisted_pull_up:{it:'Trazioni assistite',en:'Assisted pull-up'},
  chest_supported_row:{it:'Rematore chest-supported',en:'Chest-supported row'},
  face_pull:{it:'Face pull',en:'Face pull'},
  reverse_pec_deck:{it:'Reverse pec deck',en:'Reverse pec deck'},
  hack_squat:{it:'Hack squat',en:'Hack squat'},
  smith_machine_squat:{it:'Squat alla Smith machine',en:'Smith machine squat'},
  seated_leg_curl:{it:'Leg curl seduto',en:'Seated leg curl'},
  hip_thrust_machine:{it:'Hip thrust machine',en:'Hip thrust machine'},
  machine_calf_raise:{it:'Calf raise machine',en:'Machine calf raise'},
  preacher_curl_machine:{it:'Curl preacher machine',en:'Machine preacher curl'},
  hammer_curl:{it:'Hammer curl',en:'Hammer curl'},
  overhead_cable_triceps_extension:{it:'Estensioni tricipiti sopra la testa ai cavi',en:'Overhead cable triceps extension'},
  assisted_dip:{it:'Dip assistite',en:'Assisted dip'},
};

const e=(id:string,primaryMuscle:ExerciseDefinition['primaryMuscle'],secondaryMuscles:ExerciseDefinition['secondaryMuscles'],movementPattern:ExerciseDefinition['movementPattern'],requiredEquipment:string[],difficulty:ExerciseDefinition['difficulty'],icon:string,alternativeIds:string[]):ExerciseDefinition=>({id,nameKey:id,primaryMuscle,secondaryMuscles,movementPattern,requiredEquipment,difficulty,icon,tipKey:'exerciseTipControlled',mistakeKey:'exerciseMistakeMomentum',alternativeIds});

export const importedExercises: ExerciseDefinition[] = [
  e('incline_barbell_bench_press','chest',['triceps','shoulders'],'horizontal_push',['barbell','bench','rack'],'intermediate','▱',['incline_dumbbell_bench_press','machine_chest_press']),
  e('incline_dumbbell_bench_press','chest',['triceps','shoulders'],'horizontal_push',['dumbbells','bench'],'beginner','◩',['incline_barbell_bench_press','machine_chest_press']),
  e('machine_chest_press','chest',['triceps','shoulders'],'horizontal_push',['chest_press_machine'],'beginner','▣',['barbell_bench_press','dumbbell_bench_press']),
  e('pec_deck_fly','chest',['shoulders'],'isolation',['pec_deck_machine'],'beginner','◖◗',['cable_chest_fly']),
  e('cable_chest_fly','chest',['shoulders'],'isolation',['cable_station'],'beginner','><',['pec_deck_fly']),
  e('assisted_pull_up','back',['biceps'],'vertical_pull',['assisted_pullup_dip_machine'],'beginner','⇡',['pull_up','lat_pulldown']),
  e('chest_supported_row','back',['biceps','shoulders'],'horizontal_pull',['chest_supported_row_machine'],'beginner','⇠',['barbell_row','cable_row']),
  e('face_pull','shoulders',['back'],'horizontal_pull',['cable_station'],'beginner','↞',['reverse_pec_deck']),
  e('reverse_pec_deck','shoulders',['back'],'isolation',['pec_deck_machine'],'beginner','◗◖',['face_pull']),
  e('hack_squat','quadriceps',['glutes','hamstrings'],'squat',['hack_squat_machine'],'beginner','◿',['leg_press','barbell_squat']),
  e('smith_machine_squat','quadriceps',['glutes','hamstrings','core'],'squat',['smith_machine'],'intermediate','⌗',['barbell_squat','hack_squat']),
  e('seated_leg_curl','hamstrings',[],'isolation',['seated_leg_curl_machine'],'beginner','∩',['leg_curl','romanian_deadlift']),
  e('hip_thrust_machine','glutes',['hamstrings','core'],'hinge',['hip_thrust_machine'],'beginner','⌃',['romanian_deadlift']),
  e('machine_calf_raise','calves',[],'isolation',['calf_raise_machine'],'beginner','⇧',['standing_calf_raise']),
  e('preacher_curl_machine','biceps',[],'isolation',['preacher_curl_machine'],'beginner','∪',['barbell_curl','dumbbell_curl']),
  e('hammer_curl','biceps',[],'isolation',['dumbbells'],'beginner','◆',['dumbbell_curl']),
  e('overhead_cable_triceps_extension','triceps',[],'isolation',['cable_station'],'beginner','⇡',['cable_triceps_pushdown']),
  e('assisted_dip','triceps',['chest','shoulders'],'vertical_push',['assisted_pullup_dip_machine'],'beginner','⇣',['close_grip_push_up']),
];

const content=(it:string,en:string,tipIt:string,tipEn:string,mistakeIt:string,mistakeEn:string):ExerciseEditorialContent=>({description:{it,en},tip:{it:tipIt,en:tipEn},mistake:{it:mistakeIt,en:mistakeEn}});

export const importedExerciseContent: Record<string,ExerciseEditorialContent> = {
  incline_barbell_bench_press:content('Spinta inclinata per enfatizzare la parte alta del petto mantenendo una progressione stabile.','An incline press emphasizing the upper chest with stable load progression.','Mantieni scapole stabili e porta il bilanciere verso la parte alta del petto.','Keep the shoulder blades set and lower the bar toward the upper chest.','Non alzare troppo l’inclinazione trasformandola in una military press.','Do not set the bench so steep that it becomes a shoulder press.'),
  incline_dumbbell_bench_press:content('Variante inclinata con libertà di traiettoria e lavoro indipendente dei due lati.','An incline dumbbell press with a freer path and independent loading.','Tieni i polsi sopra i gomiti e chiudi sopra la linea del petto alto.','Keep wrists over elbows and finish above the upper chest line.','Evita gomiti completamente aperti e manubri troppo bassi.','Avoid fully flared elbows and lowering the dumbbells too deep.'),
  machine_chest_press:content('Spinta guidata per il petto, ideale per accumulare volume con elevata stabilità.','A supported chest press suited to stable, high-volume training.','Regola il sedile per avere le maniglie circa a metà petto.','Set the seat so the handles align around mid-chest.','Non staccare le scapole dallo schienale per chiudere la ripetizione.','Do not lift the shoulder blades from the pad to finish the rep.'),
  pec_deck_fly:content('Adduzione guidata delle braccia per isolare il petto con tensione continua.','A guided arm adduction exercise for continuous chest tension.','Mantieni il petto alto e chiudi con i gomiti senza urtare i supporti.','Keep the chest tall and bring the elbows together without crashing the pads.','Non perdere posizione delle spalle nella fase di allungamento.','Do not let the shoulders roll forward in the stretched position.'),
  cable_chest_fly:content('Croci ai cavi con tensione continua e traiettoria facilmente personalizzabile.','Cable flyes with constant tension and an adjustable path.','Mantieni una lieve flessione dei gomiti e abbraccia davanti al petto.','Keep a soft elbow bend and hug the arms together in front of the chest.','Non trasformare il movimento in una spinta piegando molto i gomiti.','Do not turn it into a press by bending the elbows excessively.'),
  assisted_pull_up:content('Trazione verticale assistita per sviluppare la tecnica prima delle trazioni libere.','An assisted vertical pull for building toward unassisted pull-ups.','Inizia abbassando le scapole e usa solo l’assistenza necessaria.','Start by depressing the shoulder blades and use only the assistance required.','Non rimbalzare sul supporto né ridurre l’escursione.','Do not bounce on the support or shorten the range.'),
  chest_supported_row:content('Rematore con torace supportato che limita lo slancio e concentra il lavoro sulla schiena.','A chest-supported row that limits momentum and focuses work on the back.','Tieni il torace sul pad e porta i gomiti verso dietro senza sollevare le spalle.','Keep the chest on the pad and drive the elbows back without shrugging.','Non staccare il busto dal supporto per muovere più peso.','Do not lift the torso from the pad to move more weight.'),
  face_pull:content('Tirata al viso per deltoidi posteriori, parte alta della schiena e controllo scapolare.','A face-level cable pull for rear delts, upper back and scapular control.','Tira la corda verso occhi e tempie separando le estremità.','Pull the rope toward the eyes and temples while separating the ends.','Non usare carichi che obbligano a inclinare il busto indietro.','Do not use loads that force the torso to lean back.'),
  reverse_pec_deck:content('Apertura inversa guidata per deltoidi posteriori e parte alta della schiena.','A guided reverse fly for the rear delts and upper back.','Appoggia il petto e guida il movimento con i gomiti.','Keep the chest supported and lead the motion with the elbows.','Non chiudere le scapole con uno slancio brusco.','Do not snap the shoulder blades together with momentum.'),
  hack_squat:content('Squat guidato che permette di caricare quadricipiti e glutei con grande stabilità.','A guided squat for loading the quadriceps and glutes with high stability.','Mantieni schiena e bacino aderenti e segui la linea delle ginocchia.','Keep the back and hips supported and track the knees over the feet.','Non scendere oltre il punto in cui il bacino si stacca dal supporto.','Do not descend beyond the point where the pelvis leaves the pad.'),
  smith_machine_squat:content('Squat su traiettoria guidata utile per variare appoggio e distribuire il carico.','A guided-path squat that allows stance and loading variations.','Posiziona i piedi in modo che la traiettoria resti stabile e controllata.','Place the feet so the guided path remains stable and controlled.','Non forzare una posizione innaturale solo per seguire la barra.','Do not force an unnatural stance just to follow the bar path.'),
  seated_leg_curl:content('Leg curl seduto per allenare i femorali in posizione allungata.','A seated leg curl that trains the hamstrings from a lengthened position.','Allinea ginocchio e perno e mantieni le cosce ferme sotto il supporto.','Align the knee with the pivot and keep the thighs fixed under the pad.','Non sollevare il bacino durante la chiusura.','Do not lift the hips during the curl.'),
  hip_thrust_machine:content('Estensione d’anca guidata per glutei con setup rapido e stabile.','A supported hip-extension movement for stable glute loading.','Chiudi il movimento contraendo i glutei senza iperestendere la schiena.','Finish by squeezing the glutes without hyperextending the lower back.','Non spingere con la zona lombare al posto delle anche.','Do not drive through the lower back instead of the hips.'),
  machine_calf_raise:content('Flessione plantare guidata per allenare i polpacci con carico progressivo.','A guided plantar-flexion exercise for progressively loading the calves.','Scendi in controllo e raggiungi una contrazione completa in alto.','Lower under control and reach a full contraction at the top.','Non rimbalzare nella parte bassa del movimento.','Do not bounce out of the bottom position.'),
  preacher_curl_machine:content('Curl guidato con braccio supportato per isolare i bicipiti.','A supported machine curl for isolating the biceps.','Mantieni il braccio aderente al pad e controlla la completa estensione.','Keep the upper arm on the pad and control the full extension.','Non sollevare le spalle o staccare i gomiti dal supporto.','Do not shrug or lift the elbows from the pad.'),
  hammer_curl:content('Curl a presa neutra per bicipiti e muscoli dell’avambraccio.','A neutral-grip curl for the biceps and forearm flexors.','Mantieni i pollici verso l’alto e i gomiti fermi ai fianchi.','Keep the thumbs up and the elbows fixed by the sides.','Non oscillare i manubri con il busto.','Do not swing the dumbbells with the torso.'),
  overhead_cable_triceps_extension:content('Estensione sopra la testa per allenare il tricipite in posizione allungata.','An overhead extension that trains the triceps in a lengthened position.','Tieni i gomiti stretti e lascia flettere solo l’articolazione del gomito.','Keep the elbows narrow and move only through elbow flexion and extension.','Non aprire i gomiti né inarcare la schiena.','Do not flare the elbows or arch the lower back.'),
  assisted_dip:content('Dip assistita per sviluppare tricipiti e petto con carico scalabile.','An assisted dip for scalable triceps and chest loading.','Mantieni le spalle basse e scendi finché conservi controllo.','Keep the shoulders down and descend only as far as control allows.','Non rimbalzare in basso né perdere stabilità scapolare.','Do not bounce at the bottom or lose scapular stability.'),
};