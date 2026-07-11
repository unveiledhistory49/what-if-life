import { useState } from 'react';
import type { Scenario } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function ScenarioResult({
  scenario,
  onBack,
  onEdit,
}: {
  scenario: Scenario;
  onBack: () => void;
  onEdit: () => void;
}) {
  const [years, setYears] = useState<1 | 5 | 10>(5);

  const baseNet = scenario.baseIncome - scenario.baseExpenses;
  const newNet = scenario.newIncome - scenario.newExpenses;

  // Generate Net Worth Data
  const labels = Array.from({ length: years * 12 + 1 }, (_, i) => `Month ${i}`);
  const baseData = labels.map((_, i) => scenario.baseNetWorth + (baseNet * i));
  const newData = labels.map((_, i) => scenario.baseNetWorth - scenario.upfrontCost + (newNet * i));

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Current Path',
        data: baseData,
        borderColor: '#8b93a7',
        backgroundColor: '#8b93a7',
        tension: 0.1,
      },
      {
        label: 'Hypothetical Path',
        data: newData,
        borderColor: '#6ee7b7',
        backgroundColor: '#6ee7b7',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: { ticks: { callback: (val: any) => '$' + val.toLocaleString() } }
    }
  };

  // Time Allocation (weekly)
  // Total week hours = 168. Sleep = 56. Leaving 112 hours.
  const SLEEP = 56;
  const TOTAL = 168;

  const getFreeTime = (work: number, commute: number, chores: number) => {
    return Math.max(0, TOTAL - SLEEP - work - commute - chores);
  };

  const baseFree = getFreeTime(scenario.baseWorkHours, scenario.baseCommuteHours, scenario.baseChoresHours);
  const newFree = getFreeTime(scenario.newWorkHours, scenario.newCommuteHours, scenario.newChoresHours);

  const timeChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'right' as const } }
  };

  const baseTimeData = {
    labels: ['Work', 'Commute', 'Chores', 'Free Time', 'Sleep'],
    datasets: [{
      data: [scenario.baseWorkHours, scenario.baseCommuteHours, scenario.baseChoresHours, baseFree, SLEEP],
      backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#6ee7b7', '#8b93a7'],
      borderWidth: 0,
    }]
  };

  const newTimeData = {
    labels: ['Work', 'Commute', 'Chores', 'Free Time', 'Sleep'],
    datasets: [{
      data: [scenario.newWorkHours, scenario.newCommuteHours, scenario.newChoresHours, newFree, SLEEP],
      backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#6ee7b7', '#8b93a7'],
      borderWidth: 0,
    }]
  };

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <button type="button" className="btn ghost" style={{padding: '0 0 0.5rem 0'}} onClick={onBack}>← Back</button>
          <h1>{scenario.name}</h1>
          <p className="muted">Results & Projections</p>
        </div>
        <button type="button" className="btn ghost" onClick={onEdit}>Edit Inputs</button>
      </header>

      <div className="filters">
        <select className="input" value={years} onChange={(e) => setYears(Number(e.target.value) as 1 | 5 | 10)}>
          <option value={1}>1 Year Projection</option>
          <option value={5}>5 Year Projection</option>
          <option value={10}>10 Year Projection</option>
        </select>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-num">${baseNet.toLocaleString()}</span>
          <span className="stat-label">Current Monthly Net</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">${newNet.toLocaleString()}</span>
          <span className="stat-label">New Monthly Net</span>
        </div>
      </div>

      <div className="card stack-gap">
        <h2>Net Worth Trajectory</h2>
        <Line options={lineOptions} data={lineChartData} />
      </div>

      <div className="form-row">
        <div className="card stack-gap">
          <h2>Current Time</h2>
          <Pie data={baseTimeData} options={timeChartOptions} />
        </div>
        <div className="card stack-gap">
          <h2>New Time</h2>
          <Pie data={newTimeData} options={timeChartOptions} />
        </div>
      </div>
    </section>
  );
}
