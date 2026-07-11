import type { Scenario } from '../types';
import { deleteScenario } from '../storage';

export function ListScenarios({
  scenarios,
  onEdit,
  onView,
  onRefresh,
}: {
  scenarios: Scenario[];
  onEdit: (s: Scenario | null) => void;
  onView: (s: Scenario) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Your Scenarios</h1>
          <p className="muted">Simulate life decisions</p>
        </div>
        <button type="button" className="btn primary" onClick={() => onEdit(null)}>
          + New Scenario
        </button>
      </header>

      {scenarios.length === 0 ? (
        <div className="empty">
          <p>No scenarios yet.</p>
          <p className="muted">Create a scenario to simulate a job change, move, or major purchase.</p>
          <button type="button" className="btn primary" onClick={() => onEdit(null)}>
            Create First Scenario
          </button>
        </div>
      ) : (
        <ul className="item-list">
          {scenarios.map((s) => {
            const netChange = (s.newIncome - s.newExpenses) - (s.baseIncome - s.baseExpenses);
            return (
              <li key={s.id} className="item-row">
                <div className="item-meta">
                  <strong>{s.name}</strong>
                  <span className="tags">
                    <span className="tag">Monthly Change: ${netChange > 0 ? '+' : ''}{netChange}</span>
                    <span className="tag subtle">Cost: ${s.upfrontCost}</span>
                  </span>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn ghost" onClick={() => onView(s)}>
                    View
                  </button>
                  <button type="button" className="btn ghost" onClick={() => onEdit(s)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn ghost danger"
                    onClick={async () => {
                      if (!confirm(`Delete scenario "${s.name}"?`)) return;
                      await deleteScenario(s.id);
                      onRefresh();
                    }}
                  >
                    Del
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
