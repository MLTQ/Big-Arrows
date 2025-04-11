---
tags:
  - framework
  - implementation
  - getting-started
  - prototype
---

# Big Arrows: Implementation Roadmap (Continued)

### Step 8: Create Breadcrumbs Navigation

Create `src/components/Controls/Breadcrumbs.tsx`:

```tsx
import React from 'react';
import useArrowsStore from '../../store/useArrowsStore';

const Breadcrumbs: React.FC = () => {
  const { frames, breadcrumbs, navigateToFrame } = useArrowsStore();
  
  return (
    <div className="flex items-center text-sm text-gray-300 mt-2 flex-wrap">
      <span className="mr-1">Path:</span>
      {breadcrumbs.map((frameId, index) => {
        const frame = frames[frameId];
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={frameId}>
            <button
              className={`hover:text-white ${isLast ? 'font-bold text-white' : ''}`}
              onClick={() => navigateToFrame(frameId)}
            >
              {frame.title}
            </button>
            {!isLast && <span className="mx-1">›</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
```

### Step 9: Create Node Panel for Editing

Create `src/components/Controls/NodePanel.tsx`:

```tsx
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
```

### Step 10: Create Arrow Panel for Editing

Create `src/components/Controls/ArrowPanel.tsx`:

```tsx
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
```

### Step 11: Create Toolbar Component

Create `src/components/Controls/Toolbar.tsx`:

```tsx
import React from 'react';
import useArrowsStore from '../../store/useArrowsStore';

const Toolbar: React.FC = () => {
  const { currentFrameId, createNode, navigateBack } = useArrowsStore();
  
  const handleAddNode = () => {
    createNode(currentFrameId, {
      content: 'New Proposition',
      position: { x: 200, y: 200 },
    });
  };
  
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-10">
      <button
        className="bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700"
        onClick={handleAddNode}
        title="Add Node"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
      <button
        className="bg-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-700"
        onClick={navigateBack}
        title="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Toolbar;
```

### Step 12: Create Main App Component

Finally, create the main App component in `src/App.tsx`:

```tsx
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
```

### Step 13: Update the Canvas Component to Support Node and Arrow Selection

Modify `src/components/Canvas/BigArrowsCanvas.tsx` to support selection:

```tsx
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
    createArrow
  } = useArrowsStore();
  
  const currentFrame = frames[currentFrameId];
  
  // Convert to ReactFlow format
  const nodes: FlowNode[] = useMemo(() => {
    return currentFrame.nodes.map(node => ({
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
```

## Running and Testing the Prototype

Once you've implemented all the components, you can run the prototype with:

```bash
npm run dev
```

This will start the development server, and you should be able to access the Big Arrows prototype at http://localhost:5173/.

## Next Steps After Initial Implementation

1. **Testing and Bug Fixes**
   - Test navigation between frames
   - Test expanding arrows
   - Test node and arrow creation
   - Fix any issues that arise

2. **UI Enhancements**
   - Improve visual styling
   - Add animations for transitions
   - Add keyboard shortcuts

3. **Feature Additions**
   - Add import/export functionality
   - Implement local storage persistence
   - Add more node and arrow types

4. **Documentation**
   - Create user documentation
   - Add tooltips and help text
   - Document the codebase

## Deployment

When ready to share the prototype:

```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Deploy to GitHub Pages or similar static hosting
```

## Resources

- [React Flow Documentation](https://reactflow.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Animation Examples](https://www.framer.com/motion/examples/)

## Conclusion

This implementation roadmap provides a detailed step-by-step guide to create a working prototype of the Big Arrows framework. By following these steps, you'll have a functional demonstration that showcases the core concepts of fractal argumentation and expandable arrows.

The modular approach allows for future expansion and refinement of the system, with each component handling a specific aspect of the functionality. As the project evolves, additional features can be added incrementally without major refactoring.
