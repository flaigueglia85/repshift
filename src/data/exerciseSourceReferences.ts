import '../exerciseSourceReferences.css';

export interface ExerciseSourceReference {
  source: 'free-exercise-db' | 'wger';
  sourceId: string;
  license: string;
  referenceOnly: boolean;
  imageUrls: string[];
}

const freeDbImage = (exerciseId: string, index: number) =>
  `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId}/${index}.jpg`;

const freeDb = (sourceId: string): ExerciseSourceReference => ({
  source: 'free-exercise-db', sourceId, license: 'Unlicense / public domain dedication', referenceOnly: true,
  imageUrls: [freeDbImage(sourceId, 0), freeDbImage(sourceId, 1)],
});

export const exerciseSourceReferences: Partial<Record<string, ExerciseSourceReference>> = {
  barbell_bench_press: freeDb('Barbell_Bench_Press_-_Medium_Grip'), dumbbell_bench_press: freeDb('Dumbbell_Bench_Press'), push_up: freeDb('Pushups'), overhead_press: freeDb('Military_Press'), dumbbell_shoulder_press: freeDb('Dumbbell_Shoulder_Press'), lateral_raise: freeDb('Side_Lateral_Raise'), pull_up: freeDb('Pullups'), lat_pulldown: freeDb('Wide-Grip_Lat_Pulldown'), barbell_row: freeDb('Bent_Over_Barbell_Row'), one_arm_dumbbell_row: freeDb('One-Arm_Dumbbell_Row'), cable_row: freeDb('Seated_Cable_Rows'), barbell_squat: freeDb('Barbell_Squat'), goblet_squat: freeDb('Goblet_Squat'), leg_press: freeDb('Leg_Press'), romanian_deadlift: freeDb('Romanian_Deadlift'), dumbbell_romanian_deadlift: freeDb('Dumbbell_Stiff_Leg_Deadlift'), leg_curl: freeDb('Lying_Leg_Curls'), leg_extension: freeDb('Leg_Extensions'), dumbbell_lunge: freeDb('Dumbbell_Lunges'), barbell_curl: freeDb('Barbell_Curl'), dumbbell_curl: freeDb('Dumbbell_Bicep_Curl'), cable_triceps_pushdown: freeDb('Triceps_Pushdown_-_Rope_Attachment'), standing_calf_raise: freeDb('Standing_Calf_Raises'), plank: freeDb('Plank'),
  incline_barbell_bench_press: freeDb('Barbell_Incline_Bench_Press_-_Medium_Grip'),
  incline_dumbbell_bench_press: freeDb('Incline_Dumbbell_Press'),
  machine_chest_press: freeDb('Machine_Bench_Press'),
  pec_deck_fly: freeDb('Butterfly'),
  cable_chest_fly: freeDb('Cable_Crossover'),
  assisted_pull_up: freeDb('Assisted_Chin-Up'),
  chest_supported_row: freeDb('Chest-Supported_Dumbbell_Row'),
  face_pull: freeDb('Face_Pull'),
  reverse_pec_deck: freeDb('Reverse_Machine_Flyes'),
  hack_squat: freeDb('Hack_Squat'),
  smith_machine_squat: freeDb('Smith_Machine_Squat'),
  seated_leg_curl: freeDb('Seated_Leg_Curl'),
  hip_thrust_machine: freeDb('Barbell_Hip_Thrust'),
  machine_calf_raise: freeDb('Standing_Calf_Raises'),
  preacher_curl_machine: freeDb('Preacher_Curl'),
  hammer_curl: freeDb('Hammer_Curls'),
  overhead_cable_triceps_extension: freeDb('Cable_Rope_Overhead_Triceps_Extension'),
  assisted_dip: freeDb('Bench_Dips'),
};