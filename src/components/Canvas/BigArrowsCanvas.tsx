import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  Node as FlowNode,
  Edge as FlowEdge,
  Connection,
  OnConnect,
  NodeMouseHandler,
  EdgeMouseHandler,
  NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useArrowsStore from '../../store/useArrowsStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import ExpandedArrow from './ExpandedArrow';
import Breadcrumbs from '../Controls/Breadcrumbs';

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

interface BigArrowsCanvasProps {
  onNodeSelect: (nodeId: string) => void;
  onArrowSelect: (arrowId: string) => void;
}

const BigArrowsCanvas: React.FC<BigArrowsCanvasProps> = ({
  onNodeSelect,
  onArrowSelect,
}) => {
  const { 
    frames, 
    currentFrameId, 
    expandedArrowId,
    collapseArrow,
    createArrow,
    updateNode
  } = useArrowsStore();
  
  const currentFrame = frames[currentFrameId];
  
  // Convert to ReactFlow format
  const nodes: FlowNode[] = useMemo(() => {
    return currentFrame.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      draggable: true,
      data: { 
        ...node, 
        label: node.content, 
        content: node.content,
        description: node.data?.description 
      },
    }));
  }, [currentFrame.nodes]);
  
  const edges: FlowEdge[] = useMemo(() => {
    return currentFrame.arrows.map(arrow => ({
      id: arrow.id,
      source: arrow.source,
      target: arrow.target,
      type: arrow.type,
      data: { 
        ...arrow, 
        hasSubFrame: arrow.hasSubFrame 
      },
    }));
  }, [currentFrame.arrows]);
  
  // Handle new connections
  const onConnect: OnConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      createArrow(currentFrameId, {
        source: connection.source,
        target: connection.target,
        type: 'logical',
        hasSubFrame: false,
      });
    }
  }, [currentFrameId, createArrow]);
  
  // Handle node click for editing
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    onNodeSelect(node.id);
  }, [onNodeSelect]);
  
  // Handle edge click for editing
  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    onArrowSelect(edge.id);
  }, [onArrowSelect]);
  
  // Handle node drag to update position in store
  const onNodeDragStop: NodeDragHandler = useCallback((event, node) => {
    updateNode(currentFrameId, node.id, { position: node.position });
  }, [currentFrameId, updateNode]);
  
  return (
    <div className="frame-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background color="#6366f1" gap={16} />
        <Controls />
        <MiniMap />
        
        <Panel position="top-left" className="z-10">
          <div className="bg-primary-dark p-3 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-1">{currentFrame.title}</h2>
            {currentFrame.description && (
              <p className="text-sm text-gray-300">{currentFrame.description}</p>
            )}
            <Breadcrumbs />
          </div>
        </Panel>
      </ReactFlow>
      
      {expandedArrowId && (
        <ExpandedArrow
          arrowId={expandedArrowId}
          onClose={collapseArrow}
        />
      )}
    </div>
  );
};

export default BigArrowsCanvas;