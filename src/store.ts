import { create } from 'zustand'
import type { RunningAlgo } from './models'
import { ALGO_CONTROLLER_API } from './models'

interface AlgoStore {
  algos: RunningAlgo[]
  fetchAlgos: () => Promise<void>
  startAlgo: (name: string) => Promise<void>
  stopAlgo: (name: string) => Promise<void>
}

export const useAlgoStore = create<AlgoStore>((set) => ({
  algos: [],
  fetchAlgos: async () => {
    const res = await fetch(ALGO_CONTROLLER_API)
    const data = await res.json()
    set({
      algos: data.map((a: any) => ({
        name: a.module_name || a.name,
        actions: a.actions || [],
        state: a.state,
      })),
    })
  },
  startAlgo: async (name: string) => {
    await fetch(`${ALGO_CONTROLLER_API}/${name}/restart`, { method: 'POST' })
    // Optionally re-fetch algos
    set((s) => ({ ...s }))
  },
  stopAlgo: async (name: string) => {
    await fetch(`${ALGO_CONTROLLER_API}/${name}/stop`, { method: 'POST' })
    // Optionally re-fetch algos
    set((s) => ({ ...s }))
  },
})) 