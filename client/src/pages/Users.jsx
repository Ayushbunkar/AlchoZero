import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
// Topbar and FilterBar removed for Users page
import DriversGrid from '../components/dashboardUI/DriversGrid';
import { useEffect, useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { fetchDrivers } from '../services/driversService';

const Users = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { query, setQuery } = useSearch();
  const [filters, setFilters] = useState({ status: '', risk: '', sort: 'Name' });
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const load = async () => {
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
      if (filters.sort === 'Name') out.sort((a,b) => a.name.localeCompare(b.name));
      if (filters.sort === 'Risk') out.sort((a,b) => b.riskScore - a.riskScore);
      setDrivers(out);
    } catch (e) {
      setDrivers([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { setPage(1); load(); }, [query, filters.status, filters.risk, filters.sort]);

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
                <DriversGrid drivers={drivers.slice((page-1)*pageSize, page*pageSize)} />
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">Showing {Math.min(drivers.length, (page)*pageSize)} of {drivers.length}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white/5 rounded">Prev</button>
                    <div className="text-xs">Page {page}</div>
                    <button onClick={() => setPage(p => Math.min(p+1, Math.ceil(drivers.length / pageSize)))} className="px-3 py-1 bg-white/5 rounded">Next</button>
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
