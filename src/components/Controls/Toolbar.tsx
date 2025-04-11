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