import { useEffect, useState } from 'react';
import { getUsers } from '../../services/dataService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getUsers().then(d => { setUsers(d); setLoading(false); }); }, []);

  return (
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <h3 className="text-sm font-semibold text-accent-yellow mb-2">Users {loading && <span className="text-gray-500 text-xs">Loading...</span>}</h3>
      <ul className="space-y-2 text-xs">
        {users.map(u => (
          <li key={u.phone} className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="flex justify-between"><span>{u.name}</span><span className="text-gray-400">{u.role}</span></div>
            <div className="text-gray-400">Phone: {u.phone}</div>
            <div className="text-gray-400">Vehicle: {u.vehicleId || '—'}</div>
            <div className="text-gray-500 text-[10px]">Safety Score: {u.safetyScore} • Created: {new Date(u.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
        {!loading && users.length===0 && <li className="text-gray-500">No users.</li>}
      </ul>
    </div>
  );
};

export default UserList;
