import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import './nodes.css';
import { type ActionNodeData, useFlowStore } from '../flow-store';

const ActionNode: React.FC<NodeProps<ActionNodeData>> = ({ id, data }) => {
  const { updateNode } = useFlowStore();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNode(id, { action: e.target.value as 'BUY' | 'SELL' });
  };

  return (
    <div className="custom-node action-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-header">Action</div>
      <div className="node-content">
        <select
          className="nodrag"
          value={data.action}
          onChange={handleSelectChange}
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
      </div>
    </div>
  );
};

export default memo(ActionNode); 