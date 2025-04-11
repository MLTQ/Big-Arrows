---
tags:
  - framework
  - technical
  - mvp
  - architecture
---

# Big Arrows: MVP Technical Architecture

This document outlines the technical architecture and implementation plan for building a Minimum Viable Product (MVP) of the Big Arrows framework. The goal is to create a functional prototype that demonstrates the core concept with minimal development effort.

## MVP Scope

For the initial prototype, we'll focus on the following core capabilities:

1. **Basic Visualization**
   - Render nodes and arrows in a visual canvas
   - Support for different node and arrow types
   - Basic styling and visual hierarchy

2. **Fractal Navigation**
   - Ability to expand arrows to reveal nested arguments
   - Support for at least 2 levels of nesting
   - Navigation controls for moving between levels

3. **Simple Editing**
   - Create and edit nodes
   - Create and edit arrows
   - Define sub-arguments within arrows

4. **Demo Dataset**
   - Pre-populated example (climate change argument)
   - Persistence via local storage

## Technical Stack Selection

For the MVP, we'll prioritize rapid development and leverage existing libraries where possible:

### Frontend Framework

**React + TypeScript + Vite**

React provides component-based architecture ideal for building interactive UIs, while TypeScript adds type safety. Vite offers fast development and optimized builds.

```bash
# Project initialization
npm create vite@latest big-arrows -- --template react-ts
cd big-arrows
npm install
```

### Visualization Libraries

For the MVP, we'll use **React Flow** as our primary visualization engine rather than building a custom solution with D3.js. React Flow provides out-of-the-box support for:

- Nodes and edges with custom rendering
- Panning and zooming
- Selection and basic interaction
- Layout algorithms

```bash
# Install React Flow
npm install reactflow
```

### State Management

For a smaller application like our MVP, we'll use a lightweight state management solution:

**Zustand** - Simple, fast state management without boilerplate

```bash
# Install Zustand
npm install zustand immer
```

### Styling

**Tailwind CSS** - For rapid UI development with utility classes

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Additional Dependencies

```bash
# UI Components and Utilities
npm install classnames nanoid framer-motion

# Development Tools
npm install -D eslint prettier eslint-config-prettier
```

## Application Architecture

### Directory Structure

```
src/
├── components/
│   ├── Canvas/
│   │   ├── BigArrowsCanvas.tsx - Main canvas component
│   │   ├── CustomNode.tsx - Node rendering
│   │   ├── CustomEdge.tsx - Arrow rendering
│   │   └── ExpandedArrow.tsx - Expanded arrow with sub-frame
│   ├── Controls/
│   │   ├── Toolbar.tsx - Top toolbar with controls
│   │   ├── NodePanel.tsx - Panel for editing nodes
│   │   └── ArrowPanel.tsx - Panel for editing arrows
│   └── common/
│       ├── Button.tsx - Reusable button component
│       └── Panel.tsx - Reusable panel component
├── store/
│   ├── useArrowsStore.ts - Main state management
│   └── types.ts - TypeScript interfaces
├── data/
│   └── exampleData.ts - Sample data for demo
├── hooks/
│   └── useArrowExpansion.ts - Custom hook for arrow expansion
├── styles/
│   └── tailwind.css - Global styles
└── App.tsx - Main application component
```

### Core Data Model

```typescript
// src/store/types.ts

export interface Node {
  id: string;
  type: 'proposition' | 'axiom' | 'assumption';
  content: string;
  position: { x: number; y: number };
  data?: Record<string, any>;
}

export interface Arrow {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
  type: 'logical' | 'causal' | 'supportive';
  hasSubFrame: boolean;
  subFrameId?: string;
}

export interface Frame {
  id: string;
  title: string;
  nodes: Node[];
  arrows: Arrow[];
  parentArrowId?: string;
}

export interface BigArrowsState {
  frames: Record<string, Frame>;
  currentFrameId: string;
  expandedArrowId: string | null;
  // Actions will be defined in the store
}
```

### State Management

```typescript
// src/store/useArrowsStore.ts

import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { BigArrowsState, Node, Arrow, Frame } from './types';
import exampleData from '../data/exampleData';

const useArrowsStore = create<BigArrowsState>()(
  immer((set, get) => ({
    frames: exampleData.frames,
    currentFrameId: 'main',
    expandedArrowId: null,
    
    // Navigation actions
    expandArrow: (arrowId: string) => {
      const { frames, currentFrameId } = get();
      const currentFrame = frames[currentFrameId];
      const arrow = currentFrame.arrows.find(a => a.id === arrowId);
      
      if (arrow?.hasSubFrame && arrow.subFrameId) {
        set(state => {
          state.expandedArrowId = arrowId;
        });
      }
    },
    
    collapseArrow: () => {
      set(state => {
        state.expandedArrowId = null;
      });
    },
    
    // Node actions
    createNode: (frameId: string, node: Partial<Node>) => {
      const newNode: Node = {
        id: nanoid(),
        type: 'proposition',
        content: '',
        position: { x: 0, y: 0 },
        ...node,
      };
      
      set(state => {
        state.frames[frameId].nodes.push(newNode);
      });
      
      return newNode.id;
    },
    
    // Additional actions will be implemented here...
  }))
);

export default useArrowsStore;
```

### Main Canvas Component

```tsx
// src/components/Canvas/BigArrowsCanvas.tsx

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useArrowsStore from '../../store/useArrowsStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import ExpandedArrow from './ExpandedArrow';

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

const BigArrowsCanvas: React.FC = () => {
  const { frames, currentFrameId, expandedArrowId, expandArrow } = useArrowsStore();
  const currentFrame = frames[currentFrameId];
  
  // Convert our data model to ReactFlow format
  const nodes = useMemo(() => {
    return currentFrame.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { ...node, label: node.content },
    }));
  }, [currentFrame.nodes]);
  
  const edges = useMemo(() => {
    return currentFrame.arrows.map(arrow => ({
      id: arrow.id,
      source: arrow.source,
      target: arrow.target,
      type: arrow.type,
      data: { ...arrow, hasSubFrame: arrow.hasSubFrame },
    }));
  }, [currentFrame.arrows]);
  
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          <h2 className="text-lg font-bold">{currentFrame.title}</h2>
        </Panel>
        
        {expandedArrowId && (
          <ExpandedArrow
            arrowId={expandedArrowId}
            onClose={() => useArrowsStore.getState().collapseArrow()}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default BigArrowsCanvas;
```

### Custom Node Component

```tsx
// src/components/Canvas/CustomNode.tsx

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  // Different styling based on node type
  const getNodeStyles = () => {
    switch (data.type) {
      case 'axiom':
        return 'bg-blue-800 border-blue-400';
      case 'assumption':
        return 'bg-purple-800 border-purple-400';
      default:
        return 'bg-blue-700 border-blue-500';
    }
  };
  
  return (
    <div className={`p-3 rounded-lg border-2 ${getNodeStyles()}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="text-white font-medium">{data.content}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CustomNode;
```

### Custom Edge (Arrow) Component

```tsx
// src/components/Canvas/CustomEdge.tsx

import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import useArrowsStore from '../../store/useArrowsStore';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const expandArrow = useArrowsStore(state => state.expandArrow);
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  return (
    <>
      <path
        id={id}
        className={`stroke-2 ${data?.hasSubFrame ? 'stroke-red-400' : 'stroke-blue-400'}`}
        d={edgePath}
        onClick={() => data?.hasSubFrame && expandArrow(id)}
      />
      {data?.hasSubFrame && (
        <circle
          cx={(sourceX + targetX) / 2}
          cy={(sourceY + targetY) / 2}
          r="8"
          className="fill-red-500 cursor-pointer"
          onClick={() => expandArrow(id)}
        >
          <text
            x={(sourceX + targetX) / 2}
            y={(sourceY + targetY) / 2}
            className="text-white text-xs font-bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            +
          </text>
        </circle>
      )}
    </>
  );
};

export default CustomEdge;
```

### Expanded Arrow Component

```tsx
// src/components/Canvas/ExpandedArrow.tsx

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import useArrowsStore from '../../store/useArrowsStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

interface ExpandedArrowProps {
  arrowId: string;
  onClose: () => void;
}

const ExpandedArrow: React.FC<ExpandedArrowProps> = ({ arrowId, onClose }) => {
  const { frames, currentFrameId } = useArrowsStore();
  const currentFrame = frames[currentFrameId];
  const arrow = currentFrame.arrows.find(a => a.id === arrowId);
  
  if (!arrow?.subFrameId) return null;
  
  const subFrame = frames[arrow.subFrameId];
  
  // Convert to ReactFlow format for the sub-frame
  const nodes = useMemo(() => {
    return subFrame.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { ...node, label: node.content },
    }));
  }, [subFrame.nodes]);
  
  const edges = useMemo(() => {
    return subFrame.arrows.map(arrow => ({
      id: arrow.id,
      source: arrow.source,
      target: arrow.target,
      type: arrow.type,
      data: { ...arrow, hasSubFrame: arrow.hasSubFrame },
    }));
  }, [subFrame.arrows]);
  
  return (
    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-400 border-dashed rounded-lg bg-gray-900 bg-opacity-90 z-10">
      <div className="p-2 flex justify-between items-center bg-gray-800">
        <h3 className="text-white font-medium">{subFrame.title}</h3>
        <button 
          className="text-white bg-red-500 p-1 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      
      <div className="w-full h-[calc(100%-40px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ proposition: CustomNode, axiom: CustomNode }}
          edgeTypes={{ logical: CustomEdge, causal: CustomEdge }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ExpandedArrow;
```

## Implementation Plan

### Phase 1: Setup & Basic Rendering (Week 1)

1. **Project Setup**
   - Initialize React/TypeScript project with Vite
   - Set up ESLint, Prettier, and TypeScript configuration
   - Configure Tailwind CSS

2. **Data Model Implementation**
   - Define TypeScript interfaces for nodes, arrows, and frames
   - Create mock data for testing

3. **Basic Canvas Rendering**
   - Implement ReactFlow integration
   - Create custom node and edge components
   - Set up basic interaction

### Phase 2: Fractal Navigation (Week 2)

1. **State Management**
   - Set up Zustand store
   - Implement frame navigation logic

2. **Expandable Arrows**
   - Create expanded arrow component
   - Implement zoom/focus on expanded arrows
   - Add visual indicators for expandable elements

3. **Navigation Controls**
   - Add breadcrumb navigation
   - Implement zoom and pan controls
   - Create frame-level navigation

### Phase 3: Basic Editing & Polish (Week 3)

1. **Node/Arrow Editing**
   - Create sidebar panels for editing properties
   - Implement basic creation functionality
   - Add drag-and-drop support

2. **Visual Refinement**
   - Improve styling and visuals
   - Add animations for transitions
   - Implement responsive layout

3. **Example Implementation**
   - Create climate change argument example
   - Test with multiple levels of nesting
   - Implement local storage persistence

### Phase 4: Documentation & Deployment (Week 4)

1. **User Documentation**
   - Create basic user guide
   - Add tooltips and help text

2. **Code Documentation**
   - Document key components and functions
   - Create README with setup instructions

3. **Deployment**
   - Build and test production version
   - Deploy to GitHub Pages or Netlify
   - Create shareable demo link

## Next Steps

After MVP:

1. **Enhanced Visual Design**
   - Professional styling and animations
   - Custom theme support
   - Improved layout algorithms

2. **Advanced Editing**
   - Rich text editing for nodes
   - Templates for common argument patterns
   - Collaboration features

3. **Data Persistence**
   - Backend integration
   - Multi-user support
   - Version history

4. **Advanced Features**
   - Automated layout optimization
   - Logical validation
   - Export to different formats

## Getting Started

To begin development:

```bash
# Clone the repository
git clone https://github.com/yourusername/big-arrows.git
cd big-arrows

# Install dependencies
npm install

# Start development server
npm run dev
```

This will start the development server at http://localhost:5173/.
