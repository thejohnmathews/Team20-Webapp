import ProfilePage from '../ProfilePage';
import SponsorAppBar from './SponsorAppBar';

export default function DriverProfilePage({inheritedSub}) {
  console.log(inheritedSub)
  return (
    <div>
      <SponsorAppBar inheritedSub={inheritedSub}/>
      <ProfilePage userType='sponsor' inheritedSub={inheritedSub}/>
    </div>
  );
}