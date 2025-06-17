import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Viewport,
} from 'reactflow';
import { nanoid } from 'nanoid';
import type { Algo, AlgoRule, AlgoCondition, AlgoAction } from './types';

// This is a union of all possible data types for our nodes
export type NodeData = {
  label?: string;
};

export type ConditionNodeData = NodeData & AlgoCondition;
export type ActionNodeData = NodeData & { action: AlgoAction };

export type AlgoNodeData = ConditionNodeData | ActionNodeData;

export type RFState = {
  title: string;
  nodes: Node<AlgoNodeData>[];
  edges: Edge[];
  viewport?: Viewport;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: 'condition' | 'action') => void;
  updateNode: (nodeId: string, data: Partial<AlgoNodeData>) => void;
  setTitle: (title: string) => void;
  setViewport: (viewport: Viewport) => void;
  exportToAlgo: () => Omit<Algo, 'params'>;
};

export const useFlowStore = create<RFState>()(
  persist(
    (set, get) => ({
      title: 'My Awesome Algo',
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
      viewport: undefined,
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
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        });
      },
      setTitle: (title: string) => {
        set({ title });
      },
      setViewport: (viewport: Viewport) => {
        set({ viewport });
      },
      exportToAlgo: (): Omit<Algo, 'params'> => {
        const { title, nodes, edges } = get();
        
        const rules: AlgoRule[] = [];
        const conditionNodes = nodes.filter((n) => n.type === 'condition');

        for (const condNode of conditionNodes) {
          const outgoingEdge = edges.find((e) => e.source === condNode.id);
          if (!outgoingEdge) continue;

          const targetNode = nodes.find((n) => n.id === outgoingEdge.target);
          if (!targetNode || targetNode.type !== 'action') continue;
          
          const condition: AlgoCondition = {
            left: (condNode.data as ConditionNodeData).left,
            op: (condNode.data as ConditionNodeData).op,
            right: (condNode.data as ConditionNodeData).right,
          };

          const action: AlgoAction = (targetNode.data as ActionNodeData).action;
          
          rules.push({
            conditions: [condition], // NOTE: for now, we only support one condition per rule
            action,
          });
        }

        return {
          title,
          rules,
        };
      },
    }),
    {
      name: 'flow-storage', // name of the item in the storage (must be unique)
    }
  )
); 