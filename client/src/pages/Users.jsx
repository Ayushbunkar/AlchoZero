import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
// Topbar and FilterBar removed for Users page
import DriversGrid from '../components/dashboardUI/DriversGrid';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { fetchDrivers } from '../services/driversService';

const Users = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery } = useSearch();
  const [filters, setFilters] = useState({ status: '', risk: '', sort: 'Name' });
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const loadingRef = useRef(false);
  const pageSize = 6;

  const load = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    try {
      const list = await fetchDrivers({ q: query || undefined, status: filters.status || undefined });
      // client-side risk filter
      let out = list.slice();
      if (filters.risk && filters.risk !== 'Any') {
        if (filters.risk === 'Low') out = out.filter(d => d.riskScore < 40);
        if (filters.risk === 'Medium') out = out.filter(d => d.riskScore >= 40 && d.riskScore < 70);
        if (filters.risk === 'High') out = out.filter(d => d.riskScore >= 70);
      }
      // sort
      if (filters.sort === 'Name') out.sort((a, b) => a.name.localeCompare(b.name));
      if (filters.sort === 'Risk') out.sort((a, b) => b.riskScore - a.riskScore);
      setDrivers(out);
    } catch (e) {
      setDrivers([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [query, filters.status, filters.risk, filters.sort]);

  useEffect(() => {
    setPage(1);
    load();
  }, [load, refreshKey]);

  // Listen for driver added events
  useEffect(() => {
    const handleDriverAdded = () => {
      setRefreshKey(prev => prev + 1);
    };
    const handleDriverUpdated = () => {
      setRefreshKey(prev => prev + 1);
    };
    const handleDriverDeleted = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('driverAdded', handleDriverAdded);
    window.addEventListener('driverUpdated', handleDriverUpdated);
    window.addEventListener('driverDeleted', handleDriverDeleted);
    return () => {
      window.removeEventListener('driverAdded', handleDriverAdded);
      window.removeEventListener('driverUpdated', handleDriverUpdated);
      window.removeEventListener('driverDeleted', handleDriverDeleted);
    };
  }, []);

  return (
    <div className="p-4">
      <Section className="py-4 mt-[-10] md:py-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-accent-yellow">Drivers</h2>
          <Breadcrumbs />
        </div>
      </Section>

      {/* Search and filters removed by request */}

      <Section>
        <MotionInView>
          {loading ? <div className="text-sm text-gray-400">Loading drivers…</div> : (
            <>
              <DriversGrid drivers={drivers.slice((page - 1) * pageSize, page * pageSize)} />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">Showing {Math.min(drivers.length, (page) * pageSize)} of {drivers.length}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-white/5 rounded">Prev</button>
                  <div className="text-xs">Page {page}</div>
                  <button onClick={() => setPage(p => Math.min(p + 1, Math.ceil(drivers.length / pageSize)))} className="px-3 py-1 bg-white/5 rounded">Next</button>
                </div>
              </div>
            </>
          )}
        </MotionInView>
      </Section>
    </div>
  );
};

export default Users;
