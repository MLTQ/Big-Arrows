---
tags:
  - framework
  - technical
  - frontend
  - prototype
  - design-doc
---

# Big Arrows Frontend Prototype: Design Document

## Overview

This document outlines the design and implementation strategy for creating a working prototype of the Big Arrows framework. The prototype will focus on demonstrating the core concept of fractal argumentation with expandable arrows and nested frames.

## Core Requirements

1. **Fractal Navigation**
   - Ability to zoom into arrows to reveal nested arguments
   - Support for multiple levels of nesting (at least 3 levels deep)
   - Clear visual indicators for expandable elements

2. **Visual Representation**
   - Nodes representing statements/propositions
   - Arrows representing relationships between nodes
   - Frames containing sub-arguments when arrows are expanded
   - Visual hierarchy to distinguish different levels

3. **Interactive Features**
   - Zoom in/out of arguments
   - Expand/collapse arrows
   - Pan navigation within the canvas
   - Basic editing capabilities (create/edit nodes and arrows)

## Technology Stack

### Core Technologies

- **React.js** - For building the UI components and managing state
- **TypeScript** - For type-safe development
- **D3.js** - For advanced visualization and force-directed layouts
- **Tailwind CSS** - For styling and responsive design

### Supporting Libraries

- **react-flow** or **react-flow-renderer** - For basic node/edge rendering and interaction
- **zustand** - For state management across components
- **react-zoom-pan-pinch** - For handling zoom and pan interactions
- **framer-motion** - For smooth animations and transitions between states

### Development Tools

- **Vite** - For fast development and optimized production builds
- **ESLint & Prettier** - For code quality and consistency
- **Jest & React Testing Library** - For testing components

## Architecture

### Data Model

```typescript
// Core data types
interface Node {
  id: string;
  type: 'proposition' | 'axiom' | 'assumption' | 'conclusion';
  content: string;
  metadata: {
    description?: string;
    confidence?: number;
    createdAt: Date;
    updatedAt: Date;
  };
  position: { x: number; y: number };
}

interface Arrow {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  type: 'logical' | 'causal' | 'supportive' | 'opposing';
  subFrameId?: string; // ID of the frame containing the sub-argument
  metadata: {
    description?: string;
    confidence?: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface Frame {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  arrows: Arrow[];
  parentArrowId?: string; // ID of the arrow that contains this frame
  level: number; // Nesting level
}
```

### Component Structure

```
BigArrowsApp/
├── Canvas/ - The main workspace
│   ├── FrameView.tsx - Renders the current frame
│   ├── NodeComponent.tsx - Renders individual nodes
│   ├── ArrowComponent.tsx - Renders arrows (expandable)
│   ├── ExpandedArrow.tsx - Renders expanded arrows with sub-frames
│   └── NavigationControls.tsx - Zoom/pan controls
├── Sidebar/
│   ├── FrameNavigator.tsx - Breadcrumb navigation between frames
│   ├── NodeEditor.tsx - Interface for editing node properties
│   └── ArrowEditor.tsx - Interface for editing arrow properties
├── Toolbar/
│   ├── CreationTools.tsx - Tools for creating new nodes/arrows
│   ├── SelectionTools.tsx - Tools for selecting and manipulating elements
│   └── ViewControls.tsx - Controls for adjusting the view
└── Common/
    ├── Modal.tsx - Reusable modal component
    └── ContextMenu.tsx - Context menu for node/arrow operations
```

## UI/UX Design

### Visual Style

- **Color Scheme**
  - Main background: Dark blue/slate (#1a1a2e)
  - Nodes: Gradient blues (#1e3a8a to #3b82f6)
  - Main arrows: Bright blue (#4da6ff)
  - Expanded arrows: Red/purple highlights (#ff6b6b, #bb77dd)
  - Nested elements: Progressively darker purples (#331166, #220033)
  - Text: White (#ffffff) and light blue/purple accents (#a5b4fc, #d8b4fe)

- **Typography**
  - Primary font: Inter or SF Pro Text (sans-serif)
  - Node titles: 14-16px
  - Sub-node text: 10-12px
  - Metadata: 8-10px

- **Visual Elements**
  - Nodes: Rounded rectangles with subtle glow effects
  - Arrows: Solid lines with arrowheads, dashed when expanded
  - Frames: Patterned backgrounds with distinct borders
  - Expansion indicators: Small circular buttons with plus/minus symbols

### Interaction Design

- **Navigation**
  - Click on arrow → Expand/collapse to show/hide sub-frame
  - Double-click on node → Edit node content
  - Scroll/pinch → Zoom in/out
  - Drag on background → Pan the canvas
  - Click on breadcrumb → Navigate to specific frame level

- **Creation**
  - Drag from toolbar → Create new node
  - Drag from node to node → Create new arrow
  - Right-click on arrow → Option to "Add sub-argument"

- **Selection**
  - Click on node/arrow → Show properties in sidebar
  - Shift+click → Multiple selection
  - Escape key → Clear selection

## Implementation Plan

### Phase 1: Basic Framework (2 weeks)
- Set up project with React, TypeScript, and build tools
- Implement basic data model and state management
- Create basic rendering of nodes and arrows
- Implement zoom and pan functionality

### Phase 2: Fractal Expansion (2 weeks)
- Implement expandable arrows
- Create sub-frame rendering
- Build navigation between different levels
- Add visual indicators for expandable elements

### Phase 3: Interaction & Editing (2 weeks)
- Implement node/arrow creation
- Add editing capabilities
- Build property editors in sidebar
- Create context menus for operations

### Phase 4: Visual Refinement (1 week)
- Refine styling and animations
- Implement responsive design
- Add visual cues for better navigation
- Optimize performance for complex graphs

### Phase 5: Demo Example & Testing (1 week)
- Create climate change example dataset
- Test with different complexity levels
- Gather feedback and refine interaction
- Document usage and extensibility

## Deployment Strategy

For the prototype, we'll use a simple deployment approach:

1. **Development**: Local development using Vite
2. **Testing**: Manual testing of interactions and rendering
3. **Deployment**: Static build deployed to GitHub Pages or Netlify
4. **Sharing**: Shareable links for demonstration purposes

## Next Steps

1. **Setup Project Repository**
   - Initialize Git repository
   - Configure build tools and dependencies
   - Set up project structure

2. **Implement Core Components**
   - Start with the basic Canvas and Node/Arrow rendering
   - Focus on the visual representation before adding complex interactions

3. **Data Model Implementation**
   - Define TypeScript interfaces
   - Set up state management
   - Create test datasets for development

## Appendix: Example Implementation Snippets

### Basic Frame Rendering

```tsx
const FrameView: React.FC<{ frame: Frame }> = ({ frame }) => {
  return (
    <div className="frame-container">
      <h2 className="frame-title">{frame.title}</h2>
      <div className="frame-canvas">
        {frame.nodes.map(node => (
          <NodeComponent key={node.id} node={node} />
        ))}
        {frame.arrows.map(arrow => (
          <ArrowComponent key={arrow.id} arrow={arrow} />
        ))}
      </div>
    </div>
  );
};
```

### Expandable Arrow Component

```tsx
const ArrowComponent: React.FC<{ 
  arrow: Arrow,
  onExpand: (arrowId: string) => void 
}> = ({ arrow, onExpand }) => {
  const hasSubFrame = Boolean(arrow.subFrameId);
  
  return (
    <div 
      className={`arrow ${hasSubFrame ? 'expandable' : ''}`}
      onClick={() => hasSubFrame && onExpand(arrow.id)}
    >
      <div className="arrow-line" style={{
        /* Line styling based on arrow type */
      }}>
        {hasSubFrame && (
          <div className="expansion-indicator">+</div>
        )}
      </div>
    </div>
  );
};
```

### State Management Example

```tsx
// Using Zustand for state management
import create from 'zustand';

interface BigArrowsState {
  frames: Record<string, Frame>;
  currentFrameId: string;
  expandedArrowId: string | null;
  
  // Actions
  expandArrow: (arrowId: string) => void;
  collapseArrow: () => void;
  navigateToFrame: (frameId: string) => void;
  createNode: (frameId: string, node: Partial<Node>) => void;
  updateNode: (frameId: string, nodeId: string, updates: Partial<Node>) => void;
  // ... other actions
}

const useBigArrowsStore = create<BigArrowsState>((set, get) => ({
  frames: {},
  currentFrameId: 'root',
  expandedArrowId: null,
  
  expandArrow: (arrowId) => {
    const { frames, currentFrameId } = get();
    const arrow = frames[currentFrameId].arrows.find(a => a.id === arrowId);
    
    if (arrow?.subFrameId) {
      set({ expandedArrowId: arrowId });
    }
  },
  
  collapseArrow: () => {
    set({ expandedArrowId: null });
  },
  
  // Other actions implementations...
}));
```

## Resources and References

- [D3.js Documentation](https://d3js.org/)
- [React Flow Documentation](https://reactflow.dev/)
- [Framer Motion API](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
