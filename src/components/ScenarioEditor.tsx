import { useState } from 'react';
import type { Scenario } from '../types';
import { saveScenario, uid } from '../storage';

export function ScenarioEditor({
  scenario,
  onCancel,
  onSave,
}: {
  scenario: Scenario | null;
  onCancel: () => void;
  onSave: (s: Scenario) => void;
}) {
  const [name, setName] = useState(scenario?.name ?? '');

  // Baseline
  const [baseNetWorth, setBaseNetWorth] = useState(scenario?.baseNetWorth ?? 50000);
  const [baseIncome, setBaseIncome] = useState(scenario?.baseIncome ?? 5000);
  const [baseExpenses, setBaseExpenses] = useState(scenario?.baseExpenses ?? 3000);
  const [baseWorkHours, setBaseWorkHours] = useState(scenario?.baseWorkHours ?? 40);
  const [baseCommuteHours, setBaseCommuteHours] = useState(scenario?.baseCommuteHours ?? 5);
  const [baseChoresHours, setBaseChoresHours] = useState(scenario?.baseChoresHours ?? 10);

  // Changes
  const [newIncome, setNewIncome] = useState(scenario?.newIncome ?? 5000);
  const [newExpenses, setNewExpenses] = useState(scenario?.newExpenses ?? 3000);
  const [upfrontCost, setUpfrontCost] = useState(scenario?.upfrontCost ?? 0);
  const [newWorkHours, setNewWorkHours] = useState(scenario?.newWorkHours ?? 40);
  const [newCommuteHours, setNewCommuteHours] = useState(scenario?.newCommuteHours ?? 5);
  const [newChoresHours, setNewChoresHours] = useState(scenario?.newChoresHours ?? 10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Scenario name is required');
      return;
    }
    setSaving(true);
    setError('');
    
    try {
      const s: Scenario = {
        id: scenario?.id ?? uid('scn_'),
        name: name.trim(),
        createdAt: scenario?.createdAt ?? new Date().toISOString(),
        baseNetWorth: Number(baseNetWorth),
        baseIncome: Number(baseIncome),
        baseExpenses: Number(baseExpenses),
        baseWorkHours: Number(baseWorkHours),
        baseCommuteHours: Number(baseCommuteHours),
        baseChoresHours: Number(baseChoresHours),
        newIncome: Number(newIncome),
        newExpenses: Number(newExpenses),
        newWorkHours: Number(newWorkHours),
        newCommuteHours: Number(newCommuteHours),
        newChoresHours: Number(newChoresHours),
        upfrontCost: Number(upfrontCost),
      };
      await saveScenario(s);
      onSave(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>{scenario ? 'Edit Scenario' : 'New Scenario'}</h1>
        </div>
      </header>

      <form className="form" onSubmit={submit}>
        <label>
          Scenario Name
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Move to NYC, New Job" autoFocus />
        </label>

        <div className="card stack-gap">
          <h2>Baseline (Current)</h2>
          <div className="form-row">
            <label>Net Worth ($)<input type="number" className="input" value={baseNetWorth} onChange={e => setBaseNetWorth(Number(e.target.value))} /></label>
            <label>Monthly Income ($)<input type="number" className="input" value={baseIncome} onChange={e => setBaseIncome(Number(e.target.value))} /></label>
          </div>
          <div className="form-row">
            <label>Monthly Expenses ($)<input type="number" className="input" value={baseExpenses} onChange={e => setBaseExpenses(Number(e.target.value))} /></label>
            <label>Work Hours / Wk<input type="number" className="input" value={baseWorkHours} onChange={e => setBaseWorkHours(Number(e.target.value))} /></label>
          </div>
          <div className="form-row">
            <label>Commute Hours / Wk<input type="number" className="input" value={baseCommuteHours} onChange={e => setBaseCommuteHours(Number(e.target.value))} /></label>
            <label>Chores Hours / Wk<input type="number" className="input" value={baseChoresHours} onChange={e => setBaseChoresHours(Number(e.target.value))} /></label>
          </div>
        </div>

        <div className="card stack-gap">
          <h2>Hypothetical Change</h2>
          <div className="form-row">
            <label>Upfront Cost ($)<input type="number" className="input" value={upfrontCost} onChange={e => setUpfrontCost(Number(e.target.value))} /></label>
            <label>New Monthly Income ($)<input type="number" className="input" value={newIncome} onChange={e => setNewIncome(Number(e.target.value))} /></label>
          </div>
          <div className="form-row">
            <label>New Monthly Exp. ($)<input type="number" className="input" value={newExpenses} onChange={e => setNewExpenses(Number(e.target.value))} /></label>
            <label>New Work Hrs / Wk<input type="number" className="input" value={newWorkHours} onChange={e => setNewWorkHours(Number(e.target.value))} /></label>
          </div>
          <div className="form-row">
            <label>New Commute / Wk<input type="number" className="input" value={newCommuteHours} onChange={e => setNewCommuteHours(Number(e.target.value))} /></label>
            <label>New Chores / Wk<input type="number" className="input" value={newChoresHours} onChange={e => setNewChoresHours(Number(e.target.value))} /></label>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : 'Calculate'}
          </button>
        </div>
      </form>
    </section>
  );
}
