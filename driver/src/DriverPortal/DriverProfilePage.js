import DriverAppBar from './DriverAppBar';
import ProfilePage from '../ProfilePage';

export default function DriverProfilePage({inheritedSub}) {

  return (
    <div>
      <DriverAppBar inheritedSub={inheritedSub}/>
      <ProfilePage inheritedSub={inheritedSub} userType='driver'/>
    </div>
  );
}
