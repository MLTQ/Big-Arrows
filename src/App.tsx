import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import BigArrowsCanvas from './components/Canvas/BigArrowsCanvas';
import Toolbar from './components/Controls/Toolbar';
import NodePanel from './components/Controls/NodePanel';
import ArrowPanel from './components/Controls/ArrowPanel';

const App: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);
  
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedArrowId(null);
  };
  
  const handleArrowSelect = (arrowId: string) => {
    setSelectedArrowId(arrowId);
    setSelectedNodeId(null);
  };
  
  const handleClosePanel = () => {
    setSelectedNodeId(null);
    setSelectedArrowId(null);
  };
  
  return (
    <div className="w-screen h-screen bg-background">
      <ReactFlowProvider>
        <BigArrowsCanvas
          onNodeSelect={handleNodeSelect}
          onArrowSelect={handleArrowSelect}
        />
        <Toolbar />
        
        {selectedNodeId && (
          <div className="fixed bottom-4 left-4 z-10">
            <NodePanel
              nodeId={selectedNodeId}
              onClose={handleClosePanel}
            />
          </div>
        )}
        
        {selectedArrowId && (
          <div className="fixed bottom-4 left-4 z-10">
            <ArrowPanel
              arrowId={selectedArrowId}
              onClose={handleClosePanel}
            />
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App;