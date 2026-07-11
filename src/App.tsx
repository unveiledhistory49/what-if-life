import { useCallback, useEffect, useState } from 'react'
import type { Scenario } from './types'
import { listScenarios } from './storage'
import { ListScenarios } from './components/ListScenarios'
import { ScenarioEditor } from './components/ScenarioEditor'
import { ScenarioResult } from './components/ScenarioResult'
import './App.css'

export type View = 'list' | 'edit' | 'result';

export default function App() {
  const [view, setView] = useState<View>('list')
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await listScenarios();
      setScenarios(s)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function goHome() {
    setActiveScenario(null)
    setView('list')
    refresh()
  }

  function goEdit(s: Scenario | null) {
    setActiveScenario(s)
    setView('edit')
  }

  function goResult(s: Scenario) {
    setActiveScenario(s)
    setView('result')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={goHome} style={{cursor: 'pointer'}}>
          <span className="brand-mark">WL</span>
          <div>
            <strong>WhatIfLife</strong>
            <span className="brand-sub">decision scenario simulator</span>
          </div>
        </div>
      </header>

      <main className="main">
        {!ready && <p className="muted pad">Loading…</p>}
        {error && <p className="error pad">{error}</p>}
        
        {ready && view === 'list' && (
          <ListScenarios 
            scenarios={scenarios} 
            onEdit={goEdit} 
            onView={goResult}
            onRefresh={refresh}
          />
        )}
        
        {ready && view === 'edit' && (
          <ScenarioEditor 
            scenario={activeScenario}
            onCancel={goHome}
            onSave={(s) => {
              goResult(s);
            }}
          />
        )}

        {ready && view === 'result' && activeScenario && (
          <ScenarioResult 
            scenario={activeScenario}
            onBack={goHome}
            onEdit={() => goEdit(activeScenario)}
          />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main" style={{gridTemplateColumns: 'repeat(1, 1fr)'}}>
          <button
            type="button"
            className={`nav-btn ${view === 'list' ? 'active' : ''}`}
            onClick={goHome}
          >
            <span className="nav-short">Home</span>
          </button>
      </nav>
    </div>
  )
}
