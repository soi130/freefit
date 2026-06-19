import { settingsRepo } from './repositories';
import type { WorkoutTemplate } from '../data/templates';

// Custom courses are stored as a JSON blob in the settings store, so they need
// no schema migration and are included in the JSON backup automatically.
const CUSTOM_KEY = 'customTemplates';

export const customTemplatesRepo = {
  async all(): Promise<WorkoutTemplate[]> {
    const raw = await settingsRepo.get(CUSTOM_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as WorkoutTemplate[]) : [];
    } catch {
      return [];
    }
  },
  async add(tpl: WorkoutTemplate): Promise<void> {
    const list = await customTemplatesRepo.all();
    await settingsRepo.set(CUSTOM_KEY, JSON.stringify([...list, tpl]));
  },
  async remove(id: string): Promise<void> {
    const list = await customTemplatesRepo.all();
    await settingsRepo.set(CUSTOM_KEY, JSON.stringify(list.filter((t) => t.id !== id)));
  },
};
