import React, { useState, useEffect } from 'react';
import useArrowsStore from '../../store/useArrowsStore';

interface NodePanelProps {
  nodeId: string;
  onClose: () => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ nodeId, onClose }) => {
  const { frames, currentFrameId, updateNode, deleteNode } = useArrowsStore();
  
  const frame = frames[currentFrameId];
  const node = frame.nodes.find(n => n.id === nodeId);
  
  const [content, setContent] = useState('');
  const [type, setType] = useState<'proposition' | 'axiom' | 'assumption'>('proposition');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (node) {
      setContent(node.content);
      setType(node.type);
      setDescription(node.data?.description || '');
    }
  }, [node]);
  
  const handleSave = () => {
    if (node) {
      updateNode(currentFrameId, nodeId, {
        content,
        type,
        data: {
          ...node.data,
          description,
        },
      });
      onClose();
    }
  };
  
  const handleDelete = () => {
    deleteNode(currentFrameId, nodeId);
    onClose();
  };
  
  if (!node) return null;
  
  return (
    <div className="bg-primary-dark p-4 rounded-lg shadow-lg w-80">
      <h3 className="text-lg font-bold mb-4">Edit Node</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={type}
          onChange={e => setType(e.target.value as any)}
        >
          <option value="proposition">Proposition</option>
          <option value="axiom">Axiom</option>
          <option value="assumption">Assumption</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <input
          type="text"
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
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

export default NodePanel;