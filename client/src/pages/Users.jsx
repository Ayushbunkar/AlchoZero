import UserList from '../components/dashboard/UserList';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';

const Users = () => {
  return (
    <div>
      <Section>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-accent-yellow">Users</h2>
          <Breadcrumbs />
        </div>
      </Section>
      <Section>
        <MotionInView>
          <UserList />
        </MotionInView>
      </Section>
    </div>
  );
};

export default Users;
