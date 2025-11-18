import React from 'react';
import { motion } from 'framer-motion';
import ShadDropdown from './ShadDropdown';

const FilterBar = ({ filters, setFilters }) => {
  return (
    <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/3 p-3 rounded-lg flex flex-col md:flex-row gap-3 items-center">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <ShadDropdown label="Status" options={[ 'Any', 'Active', 'Warning', 'Inactive', 'Drunk Detected', 'Suspended' ]} value={filters.status} onChange={(v) => setFilters(f => ({ ...f, status: v }))} />
        <ShadDropdown label="Risk" options={[ 'Any', 'Low', 'Medium', 'High' ]} value={filters.risk} onChange={(v) => setFilters(f => ({ ...f, risk: v }))} />
        <ShadDropdown label="Sort" options={[ 'Name', 'Risk', 'Last Updated' ]} value={filters.sort} onChange={(v) => setFilters(f => ({ ...f, sort: v }))} />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => setFilters({ status: '', risk: '', sort: 'Name' })} className="text-xs px-3 py-1 rounded bg-white/5">Reset</button>
      </div>
    </motion.div>
  );
};

export default FilterBar;
