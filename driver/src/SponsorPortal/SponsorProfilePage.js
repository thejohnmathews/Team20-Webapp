import ProfilePage from '../ProfilePage';
import SponsorAppBar from './SponsorAppBar';

export default function DriverProfilePage() {

  return (
    <div>
      <SponsorAppBar />
      <ProfilePage userType='sponsor'/>
    </div>
  );
}