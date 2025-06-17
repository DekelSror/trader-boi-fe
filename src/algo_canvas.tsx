import React from 'react';
import ReactFlow, { Controls, Background, type Viewport } from 'reactflow';
import 'reactflow/dist/style.css';
import './algo_canvas.css';

import { useFlowStore, type RFState } from './flow-store';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import Sidebar from './Sidebar';

const nodeTypes = {
  condition: ConditionNode,
  action: ActionNode,
};

const AlgoCanvas: React.FC = () => {
  const nodes = useFlowStore((state: RFState) => state.nodes);
  const edges = useFlowStore((state: RFState) => state.edges);
  const onNodesChange = useFlowStore((state: RFState) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state: RFState) => state.onEdgesChange);
  const onConnect = useFlowStore((state: RFState) => state.onConnect);
  const viewport = useFlowStore((state: RFState) => state.viewport);
  const setViewport = useFlowStore((state: RFState) => state.setViewport);
  
  const onMove = (_event: MouseEvent | TouchEvent | WheelEvent | undefined, viewport: Viewport) => {
    setViewport(viewport);
  }

  return (
    <div className="algo-canvas-container">
      <Sidebar />
      <div className="algo-canvas-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onMove={onMove}
          defaultViewport={viewport}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default React.memo(AlgoCanvas);