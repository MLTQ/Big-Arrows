import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { Node, Arrow, Frame } from '../types';
import exampleData from '../data/exampleData';

interface ArrowsState {
  frames: Record<string, Frame>;
  currentFrameId: string;
  expandedArrowId: string | null;
  breadcrumbs: string[]; // Track navigation path
  
  // Navigation actions
  expandArrow: (arrowId: string) => void;
  collapseArrow: () => void;
  navigateToFrame: (frameId: string) => void;
  navigateBack: () => void;
  
  // Editing actions
  createNode: (frameId: string, node: Partial<Node>) => string;
  updateNode: (frameId: string, nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (frameId: string, nodeId: string) => void;
  createArrow: (frameId: string, arrow: Partial<Arrow>) => string;
  updateArrow: (frameId: string, arrowId: string, updates: Partial<Arrow>) => void;
  deleteArrow: (frameId: string, arrowId: string) => void;
  
  // Frame actions
  createFrame: (frame: Partial<Frame>) => string;
  createSubFrame: (arrowId: string, frame: Partial<Frame>) => string;
}

const useArrowsStore = create<ArrowsState>()(
  immer((set, get) => ({
    frames: exampleData.frames,
    currentFrameId: 'main',
    expandedArrowId: null,
    breadcrumbs: ['main'],
    
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
    
    navigateToFrame: (frameId: string) => {
      if (get().frames[frameId]) {
        set(state => {
          state.currentFrameId = frameId;
          state.expandedArrowId = null;
          
          // Update breadcrumbs
          if (!state.breadcrumbs.includes(frameId)) {
            state.breadcrumbs.push(frameId);
          } else {
            state.breadcrumbs = state.breadcrumbs.slice(
              0, 
              state.breadcrumbs.indexOf(frameId) + 1
            );
          }
        });
      }
    },
    
    navigateBack: () => {
      const { breadcrumbs } = get();
      if (breadcrumbs.length > 1) {
        const prevFrameId = breadcrumbs[breadcrumbs.length - 2];
        set(state => {
          state.currentFrameId = prevFrameId;
          state.expandedArrowId = null;
          state.breadcrumbs.pop();
        });
      }
    },
    
    // Basic CRUD operations
    createNode: (frameId: string, node: Partial<Node>) => {
      const newNodeId = nanoid();
      const newNode: Node = {
        id: newNodeId,
        type: 'proposition',
        content: '',
        position: { x: 100, y: 100 },
        ...node,
      };
      
      set(state => {
        if (state.frames[frameId]) {
          state.frames[frameId].nodes.push(newNode);
        }
      });
      
      return newNodeId;
    },
    
    updateNode: (frameId: string, nodeId: string, updates: Partial<Node>) => {
      set(state => {
        const frame = state.frames[frameId];
        if (frame) {
          const nodeIndex = frame.nodes.findIndex(n => n.id === nodeId);
          if (nodeIndex !== -1) {
            frame.nodes[nodeIndex] = {
              ...frame.nodes[nodeIndex],
              ...updates,
            };
          }
        }
      });
    },
    
    deleteNode: (frameId: string, nodeId: string) => {
      set(state => {
        const frame = state.frames[frameId];
        if (frame) {
          // Remove the node
          frame.nodes = frame.nodes.filter(n => n.id !== nodeId);
          
          // Remove any arrows connected to this node
          frame.arrows = frame.arrows.filter(
            a => a.source !== nodeId && a.target !== nodeId
          );
        }
      });
    },
    
    createArrow: (frameId: string, arrow: Partial<Arrow>) => {
      const newArrowId = nanoid();
      const newArrow: Arrow = {
        id: newArrowId,
        source: '',
        target: '',
        type: 'logical',
        hasSubFrame: false,
        ...arrow,
      };
      
      set(state => {
        if (state.frames[frameId]) {
          state.frames[frameId].arrows.push(newArrow);
        }
      });
      
      return newArrowId;
    },
    
    updateArrow: (frameId: string, arrowId: string, updates: Partial<Arrow>) => {
      set(state => {
        const frame = state.frames[frameId];
        if (frame) {
          const arrowIndex = frame.arrows.findIndex(a => a.id === arrowId);
          if (arrowIndex !== -1) {
            frame.arrows[arrowIndex] = {
              ...frame.arrows[arrowIndex],
              ...updates,
            };
          }
        }
      });
    },
    
    deleteArrow: (frameId: string, arrowId: string) => {
      set(state => {
        const frame = state.frames[frameId];
        if (frame) {
          // Find arrow first to check if it has a sub-frame
          const arrow = frame.arrows.find(a => a.id === arrowId);
          
          // Remove the arrow
          frame.arrows = frame.arrows.filter(a => a.id !== arrowId);
          
          // If arrow had a sub-frame, should we delete it too?
          // For now we'll keep orphaned frames, but you might want to clean them up
        }
      });
    },
    
    createFrame: (frame: Partial<Frame>) => {
      const newFrameId = nanoid();
      const newFrame: Frame = {
        id: newFrameId,
        title: 'New Frame',
        description: '',
        nodes: [],
        arrows: [],
        level: 0,
        ...frame,
      };
      
      set(state => {
        state.frames[newFrameId] = newFrame;
      });
      
      return newFrameId;
    },
    
    createSubFrame: (arrowId: string, frame: Partial<Frame>) => {
      const { frames, currentFrameId } = get();
      const currentFrame = frames[currentFrameId];
      const arrow = currentFrame.arrows.find(a => a.id === arrowId);
      
      if (!arrow) return '';
      
      const newFrameId = nanoid();
      const newFrame: Frame = {
        id: newFrameId,
        title: 'New Sub-Frame',
        description: '',
        nodes: [],
        arrows: [],
        parentArrowId: arrowId,
        level: currentFrame.level + 1,
        ...frame,
      };
      
      set(state => {
        // Add the new frame
        state.frames[newFrameId] = newFrame;
        
        // Update the arrow to reference this frame
        const frameIndex = Object.keys(state.frames).indexOf(currentFrameId);
        if (frameIndex !== -1) {
          const arrowIndex = state.frames[currentFrameId].arrows.findIndex(
            a => a.id === arrowId
          );
          
          if (arrowIndex !== -1) {
            state.frames[currentFrameId].arrows[arrowIndex].hasSubFrame = true;
            state.frames[currentFrameId].arrows[arrowIndex].subFrameId = newFrameId;
          }
        }
      });
      
      return newFrameId;
    },
  }))
);

export default useArrowsStore;