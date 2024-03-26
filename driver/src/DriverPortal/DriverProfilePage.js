import DriverAppBar from './DriverAppBar';
import ProfilePage from '../ProfilePage';

export default function DriverProfilePage() {

  return (
    <div>
      <DriverAppBar />
      <ProfilePage userType='driver'/>
    </div>
  );
}
