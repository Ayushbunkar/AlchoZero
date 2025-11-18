import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';

const Topbar = ({ onSearch }) => {
  const { query, setQuery } = useSearch();
  const handle = (v) => {
    setQuery(v);
    if (onSearch) onSearch(v);
  };
  return (
    <div className="w-full p-4 bg-transparent flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center bg-white/5 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-300" />
            <input value={query} onChange={(e) => handle(e.target.value)} placeholder="Search drivers, vehicle, ID..." className="bg-transparent ml-2 w-full text-sm outline-none" />
          </motion.div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/7"><Bell size={16} /></button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/7"><User size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
