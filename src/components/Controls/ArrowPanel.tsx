import React, { useState, useEffect } from 'react';
import useArrowsStore from '../../store/useArrowsStore';

interface ArrowPanelProps {
  arrowId: string;
  onClose: () => void;
}

const ArrowPanel: React.FC<ArrowPanelProps> = ({ arrowId, onClose }) => {
  const { 
    frames, 
    currentFrameId, 
    updateArrow, 
    deleteArrow,
    createSubFrame 
  } = useArrowsStore();
  
  const frame = frames[currentFrameId];
  const arrow = frame.arrows.find(a => a.id === arrowId);
  
  const [type, setType] = useState<'logical' | 'causal' | 'supportive'>('logical');
  const [hasSubFrame, setHasSubFrame] = useState(false);
  
  useEffect(() => {
    if (arrow) {
      setType(arrow.type);
      setHasSubFrame(arrow.hasSubFrame);
    }
  }, [arrow]);
  
  const handleSave = () => {
    if (arrow) {
      updateArrow(currentFrameId, arrowId, {
        type,
        hasSubFrame,
      });
      onClose();
    }
  };
  
  const handleDelete = () => {
    deleteArrow(currentFrameId, arrowId);
    onClose();
  };
  
  const handleCreateSubFrame = () => {
    if (arrow) {
      // If already has a sub-frame, just enable it
      if (arrow.subFrameId) {
        updateArrow(currentFrameId, arrowId, {
          hasSubFrame: true,
        });
      } else {
        // Create a new sub-frame
        const sourceNode = frame.nodes.find(n => n.id === arrow.source);
        const targetNode = frame.nodes.find(n => n.id === arrow.target);
        
        const title = sourceNode && targetNode
          ? `${sourceNode.content} → ${targetNode.content}`
          : 'New Sub-Frame';
        
        createSubFrame(arrowId, {
          title,
          description: 'Arguments supporting this relationship',
        });
      }
      
      setHasSubFrame(true);
    }
  };
  
  if (!arrow) return null;
  
  return (
    <div className="bg-primary-dark p-4 rounded-lg shadow-lg w-80">
      <h3 className="text-lg font-bold mb-4">Edit Arrow</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={type}
          onChange={e => setType(e.target.value as any)}
        >
          <option value="logical">Logical</option>
          <option value="causal">Causal</option>
          <option value="supportive">Supportive</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasSubFrame}
            onChange={e => setHasSubFrame(e.target.checked)}
          />
          <span>Has Sub-Frame</span>
        </label>
        
        {!arrow.subFrameId && hasSubFrame && (
          <div className="mt-2 text-sm text-yellow-400">
            Save to create a new sub-frame
          </div>
        )}
        
        {arrow.subFrameId && !hasSubFrame && (
          <div className="mt-2 text-sm text-yellow-400">
            This will hide the sub-frame but not delete it
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          className="bg-red-500 px-3 py-1 rounded text-white"
          onClick={handleDelete}
        >
          Delete
        </button>
        <div className="space-x-2">
          <button
            className="bg-gray-600 px-3 py-1 rounded text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-3 py-1 rounded text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrowPanel;