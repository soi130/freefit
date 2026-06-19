import type { ExerciseMetric } from '../types';

export interface TemplateExercise {
  name: string;
  metric: ExerciseMetric;
  sets: number;
  target: string; // human-readable target, e.g. "7–8", "45 sec", "15 min"
}

export type TemplateGroup = 'Custom' | 'Upper' | 'Lower' | 'Core';

export interface WorkoutTemplate {
  id: string;
  group: TemplateGroup;
  name: string;
  estMinLow: number;
  estMinHigh: number;
  exercises: TemplateExercise[];
}

const r = (name: string, sets: number, target: string): TemplateExercise => ({
  name,
  metric: 'reps',
  sets,
  target,
});
const t = (name: string, sets: number, target: string): TemplateExercise => ({
  name,
  metric: 'time',
  sets,
  target,
});
const cardio = (name: string, target: string): TemplateExercise => ({
  name,
  metric: 'cardio',
  sets: 1,
  target,
});
const rounds = (name: string, sets: number, target: string): TemplateExercise => ({
  name,
  metric: 'rounds',
  sets,
  target,
});

export const TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'upper-1',
    group: 'Upper',
    name: 'Upper 1 — Horizontal Push/Pull Focus',
    estMinLow: 50,
    estMinHigh: 60,
    exercises: [
      r('Bench Press Machine', 4, '7–8'),
      r('Seated Row', 4, '7–8'),
      r('Incline Dumbbell Press', 3, '7–8'),
      r('Lat Pulldown', 3, '7–8'),
      r('Dumbbell Shoulder Press', 3, '7–8'),
      r('Dumbbell Curl', 3, '7–8'),
    ],
  },
  {
    id: 'upper-2',
    group: 'Upper',
    name: 'Upper 2 — Shoulder & Upper Back Focus',
    estMinLow: 50,
    estMinHigh: 60,
    exercises: [
      r('Incline Barbell Press', 4, '7–8'),
      r('Wide Grip Lat Pulldown', 4, '7–8'),
      r('Dumbbell Shoulder Press', 4, '7–8'),
      r('Seated Row', 3, '7–8'),
      r('Dumbbell Lateral Raise', 3, '8'),
      r('Dumbbell Hammer Curl', 3, '7–8'),
    ],
  },
  {
    id: 'upper-3',
    group: 'Upper',
    name: 'Upper 3 — Strength Focus',
    estMinLow: 50,
    estMinHigh: 60,
    exercises: [
      r('Bench Press Machine', 5, '7'),
      r('Barbell Row', 5, '7'),
      r('Incline Dumbbell Press', 3, '7–8'),
      r('Lat Pulldown', 3, '7–8'),
      r('Arnold Press', 3, '7–8'),
      r('Dumbbell Curl', 3, '7–8'),
    ],
  },
  {
    id: 'lower-1',
    group: 'Lower',
    name: 'Lower 1 — Squat Dominant',
    estMinLow: 55,
    estMinHigh: 60,
    exercises: [
      r('Barbell Back Squat', 5, '7'),
      r('Romanian Deadlift', 4, '7–8'),
      r('Leg Extension', 3, '8'),
      r('Walking Lunge', 3, '8 each leg'),
      r('Standing Calf Raise', 4, '8'),
    ],
  },
  {
    id: 'lower-2',
    group: 'Lower',
    name: 'Lower 2 — Posterior Chain Focus',
    estMinLow: 50,
    estMinHigh: 60,
    exercises: [
      r('Romanian Deadlift', 5, '7'),
      r('Goblet Squat', 4, '8'),
      r('Leg Extension', 4, '8'),
      r('Bulgarian Split Squat', 3, '8 each leg'),
      r('Calf Raise', 4, '8'),
    ],
  },
  {
    id: 'lower-3',
    group: 'Lower',
    name: 'Lower 3 — Athletic Lower Body',
    estMinLow: 50,
    estMinHigh: 60,
    exercises: [
      r('Front Squat', 4, '7–8'),
      r('Romanian Deadlift', 4, '7–8'),
      r('Step Up', 3, '8 each leg'),
      r('Leg Extension', 3, '8'),
      r('Bodyweight Squat', 3, '8'),
      r('Calf Raise', 4, '8'),
    ],
  },
  {
    id: 'core-1',
    group: 'Core',
    name: 'Core 1 — Anti-Extension',
    estMinLow: 40,
    estMinHigh: 50,
    exercises: [
      r('Roman Chair Back Extension', 4, '10'),
      t('Front Plank', 4, '45 sec'),
      r('Dead Bug', 3, '10 each side'),
      r('Stability Ball Rollout', 3, '10'),
      cardio('Treadmill Walk', '15 min'),
    ],
  },
  {
    id: 'core-2',
    group: 'Core',
    name: 'Core 2 — Rotation & Stability',
    estMinLow: 45,
    estMinHigh: 50,
    exercises: [
      r('Russian Twist', 4, '12'),
      t('Side Plank', 3, '30 sec each side'),
      t('Roman Chair Hold', 3, '30 sec'),
      r('Stability Ball Crunch', 3, '12'),
      rounds('Dumbbell Farmer Carry', 4, '4 rounds'),
      cardio('Treadmill Walk', '15 min'),
    ],
  },
  {
    id: 'core-3',
    group: 'Core',
    name: 'Core 3 — Functional Core',
    estMinLow: 45,
    estMinHigh: 50,
    exercises: [
      r('Bench Knee Raise', 4, '10'),
      r('Stability Ball Pike', 3, '10'),
      r('Bird Dog', 3, '10 each side'),
      r('Roman Chair Back Extension', 4, '10'),
      t('Plank', 3, '60 sec'),
      cardio('Treadmill Walk', '15 min'),
    ],
  },
];

export const TEMPLATE_GROUPS: TemplateGroup[] = ['Upper', 'Lower', 'Core'];

// Display order + labels for the picker (custom courses on top).
export const PICKER_GROUPS: { group: TemplateGroup; label: string }[] = [
  { group: 'Custom', label: 'My courses' },
  { group: 'Upper', label: 'Upper' },
  { group: 'Lower', label: 'Lower' },
  { group: 'Core', label: 'Core' },
];

export function templateById(id: string): WorkoutTemplate | undefined {
  return TEMPLATES.find((tpl) => tpl.id === id);
}

// Leading integer of a target string ("7–8" → 7, "45 sec" → 45), or undefined.
export function targetCount(target: string): number | undefined {
  const m = target.match(/\d+/);
  return m ? Number(m[0]) : undefined;
}

// "4 × 7–8" for set-based exercises; the bare target for cardio/rounds.
export function targetLabel(ex: TemplateExercise): string {
  return ex.metric === 'cardio' || ex.metric === 'rounds' ? ex.target : `${ex.sets} × ${ex.target}`;
}
