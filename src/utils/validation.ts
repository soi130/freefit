export type ValidationResult = { ok: true } | { ok: false; error: string };

const ok: ValidationResult = { ok: true };
const fail = (error: string): ValidationResult => ({ ok: false, error });

export function validateReps(value: number): ValidationResult {
  if (!Number.isFinite(value) || value <= 0) return fail('Reps must be a positive number');
  return ok;
}

export function validateWeight(value: number): ValidationResult {
  if (!Number.isFinite(value) || value < 0) return fail('Weight must be zero or positive');
  return ok;
}

export function validateBodyWeight(value: number): ValidationResult {
  if (!Number.isFinite(value) || value <= 0) return fail('Body weight must be a positive number');
  return ok;
}

export function validateRestSeconds(value: number): ValidationResult {
  if (!Number.isFinite(value) || value < 15) return fail('Rest time must be at least 15 seconds');
  return ok;
}

export function validateName(value: string): ValidationResult {
  if (!value.trim()) return fail('Name cannot be empty');
  return ok;
}
