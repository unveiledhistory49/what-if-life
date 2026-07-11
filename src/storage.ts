import type { Scenario } from './types';

const DB_KEY = 'whatiflife_scenarios';

export async function listScenarios(): Promise<Scenario[]> {
  const json = localStorage.getItem(DB_KEY);
  if (!json) return [];
  return JSON.parse(json);
}

export async function saveScenario(s: Scenario): Promise<void> {
  const all = await listScenarios();
  const idx = all.findIndex((x) => x.id === s.id);
  if (idx >= 0) {
    all[idx] = s;
  } else {
    all.push(s);
  }
  localStorage.setItem(DB_KEY, JSON.stringify(all));
}

export async function deleteScenario(id: string): Promise<void> {
  const all = await listScenarios();
  localStorage.setItem(DB_KEY, JSON.stringify(all.filter((x) => x.id !== id)));
}

export function uid(prefix = 'id_') {
  return prefix + Math.random().toString(36).slice(2, 9);
}
