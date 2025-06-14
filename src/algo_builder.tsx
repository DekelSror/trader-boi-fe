import React, { useState, useRef } from 'react';
import { DndProvider, useDrag   } from 'react-dnd';
import type { DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from '@monaco-editor/react';
import type { Algo, AlgoParam, AlgoRule, AlgoCondition, AlgoAction } from './models';
import './theme.css';

const ItemTypes = {
  CONDITION: 'condition',
  ACTION: 'action',
};


const ConditionBlock: React.FC<{
  condition: AlgoCondition;
  index: number;
  onUpdate: (index: number, condition: AlgoCondition) => void;
  onRemove: (index: number) => void;
}> = ({ condition, index, onUpdate, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CONDITION,
    item: { type: ItemTypes.CONDITION, id: `condition-${index}` },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className="algo-builder-block"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <input
          className="algo-builder-input algo-builder-arg-input"
          style={{ minWidth: 0, flex: 2 }}
          value={condition.left}
          onChange={(e) => onUpdate(index, { ...condition, left: e.target.value })}
          placeholder="Left"
        />
        <select
          className="algo-builder-input"
          style={{ flex: 2 }}
          value={condition.op}
          onChange={(e) => onUpdate(index, { ...condition, op: e.target.value })}
        >
          <option value=">">Greater than</option>
          <option value="<">Less than</option>
          <option value="==">Equals</option>
          <option value="!=">Not equals</option>
        </select>
        <input
          className="algo-builder-input algo-builder-arg-input"
          style={{ minWidth: 0, flex: 2 }}
          value={String(condition.right)}
          onChange={(e) => onUpdate(index, { ...condition, right: e.target.value })}
          placeholder="Right"
        />
        <button 
          className="algo-builder-button algo-builder-button-danger"
          style={{ flex: 1 }}
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const ActionBlock: React.FC<{
  action: AlgoAction;
  onUpdate: (action: AlgoAction) => void;
}> = ({ action, onUpdate }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ACTION,
    item: { type: ItemTypes.ACTION, id: 'action' },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className="algo-builder-block"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <select
        className="algo-builder-input"
        value={action}
        onChange={(e) => onUpdate(e.target.value as AlgoAction)}
      >
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
    </div>
  );
};

const ParamBlock: React.FC<{
  param: AlgoParam;
  index: number;
  onUpdate: (index: number, param: AlgoParam) => void;
  onRemove: (index: number) => void;
}> = ({ param, index, onUpdate, onRemove }) => {
  const addArg = () => {
    onUpdate(index, {
      ...param,
      init_args: [...param.init_args, null]
    });
  };

  const removeArg = (argIndex: number) => {
    const newArgs = param.init_args.filter((_, i) => i !== argIndex);
    onUpdate(index, {
      ...param,
      init_args: newArgs
    });
  };

  const updateArg = (argIndex: number, value: string) => {
    const newArgs = [...param.init_args];
    const parsedValue = !isNaN(Number(value)) ? Number(value) : value;
    newArgs[argIndex] = parsedValue;
    onUpdate(index, {
      ...param,
      init_args: newArgs
    });
  };

  return (
    <div className="algo-builder-block">
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <input
          className="algo-builder-input"
          value={param.param_type}
          onChange={(e) => onUpdate(index, { ...param, param_type: e.target.value })}
          placeholder="Parameter Type"
        />
      </div>
      
      <div className="algo-builder-arg-list">
        <h4 style={{ margin: '0 0 var(--space-sm) 0' }}>Arguments:</h4>
        {param.init_args.map((arg, argIndex) => (
          <div key={argIndex} className="algo-builder-arg-item">
            <input
              className="algo-builder-input algo-builder-arg-input"
              value={String(arg)}
              onChange={(e) => updateArg(argIndex, e.target.value)}
              placeholder="Argument value"
            />
            <button 
              className="algo-builder-button algo-builder-button-danger"
              onClick={() => removeArg(argIndex)}
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          className="algo-builder-button algo-builder-button-primary"
          onClick={addArg}
        >
          Add Argument
        </button>
      </div>

      <button 
        className="algo-builder-button algo-builder-button-danger algo-builder-button-full"
        onClick={() => onRemove(index)}
      >
        Remove Parameter
      </button>
    </div>
  );
};

const AlgoBuilder: React.FC = () => {
  const [algo, setAlgo] = useState<Algo>({
    title: '',
    params: [],
    rules: [],
  });

  const addParam = () => {
    setAlgo({
      ...algo,
      params: [
        ...algo.params,
        {
          param_type: '',
          init_args: [],
        },
      ],
    });
  };

  const addRule = () => {
    setAlgo({
      ...algo,
      rules: [
        ...algo.rules,
        {
          conditions: [{ left: '', op: '>', right: '' }],
          action: 'BUY',
        },
      ],
    });
  };

  const addCondition = (ruleIndex: number) => {
    const newRules = [...algo.rules];
    newRules[ruleIndex] = {
      ...newRules[ruleIndex],
      conditions: [
        ...newRules[ruleIndex].conditions,
        { left: '', op: '>', right: '' },
      ],
    };
    setAlgo({ ...algo, rules: newRules });
  };

  const removeCondition = (ruleIndex: number, condIndex: number) => {
    const newRules = [...algo.rules];
    newRules[ruleIndex] = {
      ...newRules[ruleIndex],
      conditions: newRules[ruleIndex].conditions.filter((_, i) => i !== condIndex),
    };
    setAlgo({ ...algo, rules: newRules });
  };

  const updateCondition = (ruleIndex: number, condIndex: number, condition: AlgoCondition) => {
    const newRules = [...algo.rules];
    const newConds = [...newRules[ruleIndex].conditions];
    newConds[condIndex] = condition;
    newRules[ruleIndex] = {
      ...newRules[ruleIndex],
      conditions: newConds,
    };
    setAlgo({ ...algo, rules: newRules });
  };

  const updateParam = (index: number, param: AlgoParam) => {
    const newParams = [...algo.params];
    newParams[index] = param;
    setAlgo({ ...algo, params: newParams });
  };

  const updateRule = (index: number, rule: AlgoRule) => {
    const newRules = [...algo.rules];
    newRules[index] = rule;
    setAlgo({ ...algo, rules: newRules });
  };

  const removeParam = (index: number) => {
    const newParams = algo.params.filter((_, i) => i !== index);
    setAlgo({ ...algo, params: newParams });
  };

  const removeRule = (index: number) => {
    const newRules = algo.rules.filter((_, i) => i !== index);
    setAlgo({ ...algo, rules: newRules });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:13000/api/algos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(algo),
      });
      if (!response.ok) throw new Error('Failed to submit algo');
      alert('Algo submitted successfully!');
    } catch (error) {
      alert('Failed to submit algo: ' + error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="algo-builder">
        <h2>Algo Builder</h2>
        
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <input
            className="algo-builder-input"
            type="text"
            value={algo.title}
            onChange={(e) => setAlgo({ ...algo, title: e.target.value })}
            placeholder="Algo Title"
          />
        </div>

        <div className="algo-builder-section">
          <div className="algo-builder-column">
            <h3>Parameters</h3>
            {algo.params.map((param, index) => (
              <ParamBlock
                key={index}
                param={param}
                index={index}
                onUpdate={updateParam}
                onRemove={removeParam}
              />
            ))}
            <button 
              className="algo-builder-button algo-builder-button-primary algo-builder-button-full"
              onClick={addParam}
            >
              Add Parameter
            </button>
          </div>

          <div className="algo-builder-column">
            <h3>Rules</h3>
            {algo.rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} style={{ marginBottom: 'var(--space-md)' }}>
                {rule.conditions.map((cond, condIndex) => (
                  <ConditionBlock
                    key={condIndex}
                    condition={cond}
                    index={condIndex}
                    onUpdate={(i, condition) => updateCondition(ruleIndex, i, condition)}
                    onRemove={(i) => removeCondition(ruleIndex, i)}
                  />
                ))}
                <button
                  className="algo-builder-button algo-builder-button-primary"
                  style={{ marginBottom: 'var(--space-sm)' }}
                  onClick={() => addCondition(ruleIndex)}
                >
                  Add Condition
                </button>
                <ActionBlock
                  action={rule.action}
                  onUpdate={(action) =>
                    updateRule(ruleIndex, { ...rule, action })
                  }
                />
                <button
                  className="algo-builder-button algo-builder-button-danger algo-builder-button-full"
                  onClick={() => removeRule(ruleIndex)}
                >
                  Remove Rule
                </button>
              </div>
            ))}
            <button 
              className="algo-builder-button algo-builder-button-primary algo-builder-button-full"
              onClick={addRule}
            >
              Add Rule
            </button>
          </div>
        </div>

        <div className="algo-builder-preview">
          <h3>JSON Preview</h3>
          <Editor
            height="200px"
            defaultLanguage="json"
            value={JSON.stringify(algo, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
          />
        </div>

        <button
          className="algo-builder-button algo-builder-button-primary algo-builder-button-full"
          onClick={handleSubmit}
        >
          Submit Algo
        </button>
      </div>
    </DndProvider>
  );
};

export default AlgoBuilder; 