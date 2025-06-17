import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useFlowStore, type ConditionNodeData } from '../flow-store';
import './nodes.css';

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({ id, data }) => {
  const { updateNode } = useFlowStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateNode(id, { [name]: value });
  };

  return (
    <div className="custom-node condition-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-header">Condition</div>
      <div className="node-content">
        <input
          name="left"
          className="nodrag"
          value={data.left}
          onChange={handleInputChange}
          placeholder="Left"
        />
        <select
          name="op"
          className="nodrag"
          value={data.op}
          onChange={handleInputChange}
        >
          <option value=">">Greater than</option>
          <option value="<">Less than</option>
          <option value="==">Equals</option>
          <option value="!=">Not equals</option>
        </select>
        <input
          name="right"
          className="nodrag"
          value={String(data.right)}
          onChange={handleInputChange}
          placeholder="Right"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ConditionNode); 