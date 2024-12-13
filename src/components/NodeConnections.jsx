import React from 'react';

const NodeConnections = ({ nodes }) => {
  return (
    <svg 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none' 
      }}
    >
      {nodes.filter(node => node.parentId).map(node => {
        const parentNode = nodes.find(n => n.id === node.parentId);
        if (!parentNode) return null;

        return (
          <line
            key={`connection-${node.id}`}
            x1={parentNode.x + 50}  
            y1={parentNode.y + 25}
            x2={node.x + 50}
            y2={node.y + 25}
            stroke="blue"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      })}
    </svg>
  );
};

export default NodeConnections;