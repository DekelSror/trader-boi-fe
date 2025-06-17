import React from 'react';
import { useFlowStore } from './flow-store';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { addNode } = useFlowStore();

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Toolbar</h3>
      <div className="sidebar-content">
        <p>You can drag these nodes to the canvas.</p>
        <button
          className="sidebar-button"
          onClick={() => addNode('condition')}
        >
          Add Condition Node
        </button>
        <button
          className="sidebar-button"
          onClick={() => addNode('action')}
        >
          Add Action Node
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 