import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import classNames from 'classnames';

const CustomNode: React.FC<NodeProps> = ({ 
  data, 
  isConnectable,
  selected, 
  dragging
}) => {
  const nodeType = data.type || 'proposition';
  
  return (
    <div 
      className={classNames(
        'node',
        `node-${nodeType}`,
        { 'ring-2 ring-white': selected },
        { 'cursor-grabbing': dragging },
        'cursor-grab'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="text-white text-center">
        <div className="font-medium">{data.content}</div>
        {data.description && (
          <div className="text-xs mt-1 text-node-light">[{data.description}]</div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CustomNode;