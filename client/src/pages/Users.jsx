import UserList from '../components/dashboard/UserList';

const Users = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-accent-yellow mb-3">Users</h2>
      <UserList />
    </div>
  );
};

export default Users;
