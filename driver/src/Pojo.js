class Application{
	constructor(applicationID, dateOfApplication, applicationStatus, statusReason, userID) {
		this.applicationID = applicationID;
		this.dateOfApplication = dateOfApplication;
		this.applicationStatus = applicationStatus;
		this.statusReason = statusReason;
		this.userID = userID;
	}
}

class Organization{
	constructor(sponsorOrgID, sponsorOrgName, sponsorOrgDescription) {
		this.sponsorOrgID = sponsorOrgID;
		this.sponsorOrgName = sponsorOrgName;
		this.sponsorOrgDescription = sponsorOrgDescription;
	}
}



export { Application, Organization };