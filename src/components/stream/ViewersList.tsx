import React from 'react';
import { Users } from 'lucide-react';

interface ViewersListProps {
  viewers: string[];
}

export const ViewersList: React.FC<ViewersListProps> = ({ viewers }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-medium text-white">Current Viewers</h3>
      </div>
      <div className="space-y-2">
        {viewers.map((viewer, index) => (
          <div key={index} className="flex items-center space-x-2 text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{viewer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};