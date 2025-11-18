import React from 'react';
import DriverCard from './DriverCard';

const DriversGrid = ({ drivers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers.map((d) => (
        <DriverCard key={d.id} driver={d} />
      ))}
    </div>
  );
};

export default DriversGrid;
