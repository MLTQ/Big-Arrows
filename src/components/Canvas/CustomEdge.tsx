import React from 'react';
import { 
  EdgeProps, 
  getStraightPath,
  getBezierPath
} from 'reactflow';
import classNames from 'classnames';
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
  style = {},
  markerEnd,
  data,
  selected,
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
  
  const handleExpandClick = () => {
    if (data?.hasSubFrame) {
      expandArrow(id);
    }
  };
  
  return (
    <>
      <path
        id={id}
        className={classNames(
          'arrow',
          { 'arrow-expandable': data?.hasSubFrame },
          { 'stroke-2': !selected, 'stroke-3': selected }
        )}
        d={edgePath}
        strokeOpacity={selected ? 1 : 0.8}
        stroke={data?.hasSubFrame ? '#ff6b6b' : '#4da6ff'}
        fill="none"
        markerEnd={markerEnd}
      />
      
      {data?.hasSubFrame && (
        <g
          transform={`translate(${(sourceX + targetX) / 2}, ${(sourceY + targetY) / 2})`}
          onClick={handleExpandClick}
          className="cursor-pointer hover:drop-shadow-lg"
        >
          <circle
            r="8"
            fill="#ff6b6b"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            +
          </text>
        </g>
      )}
    </>
  );
};

export default CustomEdge;