import { create } from 'zustand'
import type { RunningAlgo } from './types'
import { ALGO_CONTROLLER_API } from './types'

interface AlgoStore {
  algos: RunningAlgo[]
  fetchAlgos: () => Promise<void>
  startAlgo: (name: string) => Promise<void>
  stopAlgo: (name: string) => Promise<void>
}

type RawAlgo = {
  module_name?: string;
  name: string;
  actions: string[];
  state: 'running' | 'stopped' | 'error';
}

export const useAlgoStore = create<AlgoStore>((set) => ({
  algos: [],
  fetchAlgos: async () => {
    const res = await fetch(ALGO_CONTROLLER_API)
    const data: RawAlgo[] = await res.json()
    set({
      algos: data.map((a) => ({
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