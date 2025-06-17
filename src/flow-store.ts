import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from 'reactflow';
import { nanoid } from 'nanoid';
import type { AlgoCondition, AlgoAction } from './models';

// This is a union of all possible data types for our nodes
export type NodeData = {
  // Common properties can go here
};

export type ConditionNodeData = NodeData & AlgoCondition;
export type ActionNodeData = NodeData & { action: AlgoAction };

export type AlgoNodeData = ConditionNodeData | ActionNodeData;

export type RFState = {
  nodes: Node<AlgoNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: 'condition' | 'action') => void;
  updateNode: (nodeId: string, data: Partial<AlgoNodeData>) => void;
};

export const useFlowStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'cond-1',
      type: 'condition',
      position: { x: 50, y: 50 },
      data: { left: 'price', op: '>', right: 100 },
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 50, y: 250 },
      data: { action: 'BUY' },
    },
  ],
  edges: [{ id: 'e-cond-1-action-1', source: 'cond-1', target: 'action-1' }],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (type: 'condition' | 'action') => {
    const newNode: Node<AlgoNodeData> = {
      id: nanoid(),
      type,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data:
        type === 'condition'
          ? { left: '', op: '>', right: '' }
          : { action: 'BUY' },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  updateNode: (nodeId: string, data: Partial<AlgoNodeData>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
})); 