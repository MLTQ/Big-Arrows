import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node as FlowNode,
  Edge as FlowEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useArrowsStore from '../../store/useArrowsStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

interface ExpandedArrowProps {
  arrowId: string;
  onClose: () => void;
}

const nodeTypes = {
  proposition: CustomNode,
  axiom: CustomNode,
  assumption: CustomNode,
};

const edgeTypes = {
  logical: CustomEdge,
  causal: CustomEdge,
  supportive: CustomEdge,
};

const ExpandedArrow: React.FC<ExpandedArrowProps> = ({ 
  arrowId, 
  onClose 
}) => {
  const { frames, currentFrameId } = useArrowsStore();
  const currentFrame = frames[currentFrameId];
  const arrow = currentFrame.arrows.find(a => a.id === arrowId);
  
  if (!arrow?.hasSubFrame || !arrow.subFrameId) return null;
  
  const subFrame = frames[arrow.subFrameId];
  
  // Convert to ReactFlow format for the sub-frame
  const nodes: FlowNode[] = useMemo(() => {
    return subFrame.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { 
        ...node, 
        label: node.content, 
        content: node.content,
        description: node.data?.description 
      },
    }));
  }, [subFrame.nodes]);
  
  const edges: FlowEdge[] = useMemo(() => {
    return subFrame.arrows.map(arrow => ({
      id: arrow.id,
      source: arrow.source,
      target: arrow.target,
      type: arrow.type,
      data: { 
        ...arrow, 
        hasSubFrame: arrow.hasSubFrame 
      },
    }));
  }, [subFrame.arrows]);
  
  const handleNavigateToFrame = () => {
    useArrowsStore.getState().navigateToFrame(subFrame.id);
  };
  
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="expanded-frame w-3/4 h-3/4 max-w-4xl max-h-4xl overflow-hidden">
        <div className="p-3 bg-primary-dark flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">
            {subFrame.title}
          </h3>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 p-2 rounded text-white text-sm"
              onClick={handleNavigateToFrame}
            >
              Open Full Screen
            </button>
            <button 
              className="bg-red-500 p-2 rounded text-white text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="w-full h-[calc(100%-48px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Background color="#6366f1" gap={16} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default ExpandedArrow;