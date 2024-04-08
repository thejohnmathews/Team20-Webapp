import AboutPage from "../AboutPage";
import DriverAppBar from "./DriverAppBar";

export default function DriverAbout({inheritedSub}){


	return(
		<div>
			<DriverAppBar inheritedSub={inheritedSub}/>
			<AboutPage/>
		</div>
	)
}