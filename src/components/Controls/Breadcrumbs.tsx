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