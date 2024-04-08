import AboutPage from "../AboutPage";
import SponsorAppBar from "./SponsorAppBar";

export default function AdminAbout({inheritedSub}){


	return(
		<div>
			<SponsorAppBar inheritedSub={inheritedSub}/>
			<AboutPage/>
		</div>
	)
}