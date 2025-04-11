// Basic types for nodes and arrows
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
  description?: string;
  nodes: Node[];
  arrows: Arrow[];
  parentArrowId?: string;
  level: number; // Nesting level
}