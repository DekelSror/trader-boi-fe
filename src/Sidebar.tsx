import React from 'react';
import { useFlowStore } from './flow-store';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { addNode, exportToAlgo, title, setTitle } = useFlowStore();

  const handleSave = async () => {
    const algo = exportToAlgo();
    // NOTE: we're not supporting params in this view yet
    const payload = { ...algo, params: [] };

    try {
      const response = await fetch('http://localhost:13000/api/algos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save algo');
      alert('Algo saved successfully!');
    } catch (error) {
      alert('Failed to save algo: ' + error);
    }
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Toolbar</h3>
      <div className="sidebar-content">
        <input
          type="text"
          className="sidebar-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Algo Title"
        />
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
        <button
          className="sidebar-button sidebar-button-primary"
          onClick={handleSave}
        >
          Save Algo
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 