import { Frame } from '../types';

// Sample climate change argument structure
const exampleData: { frames: Record<string, Frame> } = {
  frames: {
    'main': {
      id: 'main',
      title: 'Climate Change Policy Argument',
      description: 'Top-level argument structure',
      level: 0,
      nodes: [
        {
          id: 'scientific-evidence',
          type: 'proposition',
          content: 'Scientific Evidence',
          position: { x: 250, y: 100 },
          data: { description: 'Established Knowledge' }
        },
        {
          id: 'carbon-tax',
          type: 'proposition',
          content: 'Carbon Tax Policy',
          position: { x: 650, y: 100 },
          data: { description: 'Proposed Solution' }
        },
        {
          id: 'economic-analysis',
          type: 'proposition',
          content: 'Economic Analysis',
          position: { x: 250, y: 300 },
          data: { description: 'Impact Assessment' }
        },
        {
          id: 'implementation-plan',
          type: 'proposition',
          content: 'Implementation Plan',
          position: { x: 650, y: 300 },
          data: { description: 'Strategic Approach' }
        }
      ],
      arrows: [
        {
          id: 'arrow-scientific-to-carbon',
          source: 'scientific-evidence',
          target: 'carbon-tax',
          type: 'logical',
          hasSubFrame: true,
          subFrameId: 'scientific-carbon'
        },
        {
          id: 'arrow-scientific-to-economic',
          source: 'scientific-evidence',
          target: 'economic-analysis',
          type: 'supportive',
          hasSubFrame: false
        },
        {
          id: 'arrow-economic-to-implementation',
          source: 'economic-analysis',
          target: 'implementation-plan',
          type: 'causal',
          hasSubFrame: false
        },
        {
          id: 'arrow-carbon-to-implementation',
          source: 'carbon-tax',
          target: 'implementation-plan',
          type: 'logical',
          hasSubFrame: false
        }
      ]
    },
    'scientific-carbon': {
      id: 'scientific-carbon',
      title: 'Scientific Evidence → Carbon Tax',
      description: 'Arguments linking scientific evidence to carbon tax policy',
      parentArrowId: 'arrow-scientific-to-carbon',
      level: 1,
      nodes: [
        {
          id: 'human-co2',
          type: 'proposition',
          content: 'Human Activity → CO2 Increase',
          position: { x: 150, y: 100 },
          data: {}
        },
        {
          id: 'co2-temp',
          type: 'proposition',
          content: 'CO2 Increase → Temperature Rise',
          position: { x: 400, y: 100 },
          data: {}
        },
        {
          id: 'climate-models',
          type: 'proposition',
          content: 'Climate Models',
          position: { x: 150, y: 250 },
          data: {}
        },
        {
          id: 'carbon-reduction',
          type: 'proposition',
          content: 'Need for Carbon Reduction',
          position: { x: 400, y: 250 },
          data: {}
        },
        {
          id: 'carbon-tax-emissions',
          type: 'proposition',
          content: 'Carbon Tax → Emissions Reduction',
          position: { x: 275, y: 400 },
          data: {}
        }
      ],
      arrows: [
        {
          id: 'arrow-human-to-co2',
          source: 'human-co2',
          target: 'co2-temp',
          type: 'causal',
          hasSubFrame: false
        },
        {
          id: 'arrow-co2-to-reduction',
          source: 'co2-temp',
          target: 'carbon-reduction',
          type: 'logical',
          hasSubFrame: false
        },
        {
          id: 'arrow-models-to-reduction',
          source: 'climate-models',
          target: 'carbon-reduction',
          type: 'supportive',
          hasSubFrame: true,
          subFrameId: 'climate-models-detail'
        },
        {
          id: 'arrow-reduction-to-tax',
          source: 'carbon-reduction',
          target: 'carbon-tax-emissions',
          type: 'logical',
          hasSubFrame: false
        }
      ]
    },
    'climate-models-detail': {
      id: 'climate-models-detail',
      title: 'Climate Models',
      description: 'Details on climate modeling',
      parentArrowId: 'arrow-models-to-reduction',
      level: 2,
      nodes: [
        {
          id: 'physics',
          type: 'axiom',
          content: 'Atmospheric Physics',
          position: { x: 100, y: 100 },
          data: {}
        },
        {
          id: 'data',
          type: 'proposition',
          content: 'Historical Data',
          position: { x: 300, y: 100 },
          data: {}
        },
        {
          id: 'models',
          type: 'proposition',
          content: 'Simulation Models',
          position: { x: 200, y: 200 },
          data: {}
        }
      ],
      arrows: [
        {
          id: 'arrow-physics-to-models',
          source: 'physics',
          target: 'models',
          type: 'supportive',
          hasSubFrame: false
        },
        {
          id: 'arrow-data-to-models',
          source: 'data',
          target: 'models',
          type: 'supportive',
          hasSubFrame: false
        }
      ]
    }
  }
};

export default exampleData;