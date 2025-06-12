import { useEffect, useState } from 'react'
import type { Trade } from './models'
import { TRADE_HUB_WS_URL } from './models'
import { useAlgoStore } from './store'
import './theme.css';

function TradeFeed({ trades }: { trades: Trade[] }) {
  return (
    <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-main)' }}>
      <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', fontSize: 'var(--font-size-lg)' }}>Market Trades</h2>
      <div style={{ maxHeight: 400, minHeight: 200, overflow: 'auto', border: '2px solid var(--color-primary-light)', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-bg)', boxShadow: '0 2px 8px var(--color-shadow)', padding: 'var(--space-sm)' }}>
        {trades.length === 0 ? (
          <div style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-lg)', padding: 'var(--space-lg)', textAlign: 'center' }}>No trades yet.</div>
        ) : (
          trades.map((t, i) => (
            <div key={i} style={{ fontSize: 'var(--font-size-lg)', padding: 'var(--space-sm)', borderBottom: '1px solid var(--color-primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><b>{t.symbol}</b> {t.side} {t.volume}@{t.price}</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{new Date(t.timestamp).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AlgoList({ algos, onStart, onStop }: { algos: { name: string; actions: string[]; state: string }[]; onStart: (name: string) => void; onStop: (name: string) => void }) {
  return (
    <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-main)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 'var(--font-size-lg)' }}>Your Algos</h2>
      <div style={{ maxHeight: 400, overflow: 'auto', border: '2px solid var(--color-primary-light)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg)', boxShadow: '0 2px 8px var(--color-shadow)', padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {algos.map((algo) => (
          <div key={algo.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', background: 'var(--color-card-bg)', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 4px var(--color-border)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{algo.name}</span>
              <span style={{
                background: algo.state === 'running' ? 'var(--color-success)' : algo.state === 'stopped' ? 'var(--color-muted)' : 'var(--color-danger)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                padding: '2px 12px',
                fontSize: 'var(--font-size-base)',
                fontWeight: 500,
                width: 'fit-content',
                marginTop: 2,
              }}>{algo.state}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <button onClick={() => onStart(algo.name)} style={{ background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: 'var(--font-size-lg)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-xs)', border: 'none', padding: 'var(--space-xs) var(--space-md)' }}>Start</button>
              <button onClick={() => onStop(algo.name)} style={{ background: 'var(--color-danger)', color: '#fff', fontWeight: 600, fontSize: 'var(--font-size-lg)', borderRadius: 'var(--radius-sm)', border: 'none', padding: 'var(--space-xs) var(--space-md)' }}>Stop</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlgoActions({ actions }: { actions: {name: string, action: string}[] }) {
  return (
    <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-main)' }}>
      <h2 style={{ color: 'var(--color-purple)', textAlign: 'center', fontSize: 'var(--font-size-lg)' }}>Algo Actions</h2>
      <div style={{ maxHeight: 400, overflow: 'auto', border: '2px solid var(--color-purple-light)', borderRadius: 'var(--radius-lg)', background: '#faf5ff', boxShadow: '0 2px 8px var(--color-shadow-purple)', minHeight: 200, padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {actions && actions.length > 0 ? actions.map((act, idx) => (
          <span key={act.name + act.action + idx} style={{ color: 'var(--color-purple)', fontWeight: 500, fontSize: 'var(--font-size-base)' }}>{act.name} <span style={{ color: 'var(--color-muted)' }}>|</span> {act.action}</span>
        )) : <span style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-lg)', textAlign: 'center' }}>No algo actions yet.</span>}
      </div>
    </div>
  )
}

function MarketManagerPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const algos = useAlgoStore((s) => s.algos)
  const fetchAlgos = useAlgoStore((s) => s.fetchAlgos)
  const startAlgo = useAlgoStore((s) => s.startAlgo)
  const stopAlgo = useAlgoStore((s) => s.stopAlgo)

  // Connect to trade websocket
  useEffect(() => {
    const ws = new WebSocket(TRADE_HUB_WS_URL)
    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data) as Trade
      setTrades((prev) => [trade, ...prev.slice(0, 49)])
    }
    return () => ws.close()
  }, [])

  // Fetch algos on mount
  useEffect(() => {
    fetchAlgos()
  }, [fetchAlgos])

  const handleStart = async (name: string) => {
    await startAlgo(name)
    fetchAlgos()
  }
  const handleStop = async (name: string) => {
    await stopAlgo(name)
    fetchAlgos()
  }

  function allAlgoActions() {
    let algo_actions: {name: string, action: string}[] = []
    algos.forEach(algo => {
      algo_actions = algo_actions.concat(algo.actions.map(a => ({name: algo.name, action: a})))
    })
    return algo_actions
  }

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--space-lg)',
        width: '100%',
        alignItems: 'start',
      }}>
        <TradeFeed trades={trades} />
        <AlgoList algos={algos} onStart={handleStart} onStop={handleStop} />
        <AlgoActions actions={allAlgoActions()}/>
      </div>
    </>
  )
}

export default MarketManagerPage