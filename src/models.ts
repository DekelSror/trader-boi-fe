// for market view

export type Trade = {
    timestamp: number
    price: number
    volume: number
    side: string
    condition: string
    symbol: string
}

// for algo manager

export type RunningAlgo = {
    name: string
    actions: string[]
    state: 'running' | 'stopped' | 'error'
}


// for algo builder

export type AlgoCondition = {
    left: string
    op: string
    right: string | number
}

export type AlgoAction = 'BUY' | 'SELL'

export type AlgoRule = {
    conditions: AlgoCondition[]
    action: AlgoAction
}

export type AlgoParam = {
    param_type: string
    init_args: (string | number | null)[]
}

// sent to BE
export type Algo = {
    title: string
    params: AlgoParam[]
    rules: AlgoRule[]
}

export const TRADE_HUB_WS_URL = 'ws://localhost:12000'
export const ALGO_CONTROLLER_API = 'http://localhost:13000/api/algos'