import React, { useEffect, useState } from 'react';
import SponsorAppBar from './SponsorAppBar';

export default function AccountManagementPage() {
  

  const [toggleForm, setToggleForm] = useState(false)
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/sponsorOrg/1")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])


  return (
    <div>
    <SponsorAppBar/>
    <h1 className="profile-header">Organization Info</h1>
      <div>
        <p  className="profile-info">Name: {data.sponsorOrgName}</p>
        <p  className="profile-info">Description:</p>
        <p className='profile-info'>{data.sponsorOrgDescription}</p>
      </div>
      <button onClick={() => setToggleForm(!toggleForm)}>Edit Information</button>
      {toggleForm && 
        <form id='sponsorInfo' method='POST' action='http://localhost:8081/accountManagement/sponsorOrgUpdate/1'>
          <h1>Edit Sponsor Information</h1>
          <label htmlFor="sponsorName">Sponsor Name:</label>
          <input type='text' id="sponsorName" name="sponsorName" placeholder={data.sponsorOrgName} required></input>
          <br></br>
          <label htmlFor="sponsorName">Sponsor Description:</label>
          <input type='text' id="sponsorDescription" name="sponsorDescription" placeholder={data.sponsorOrgDescription} required></input>
          <input type='submit'></input>
        </form>}
    </div>
  );
}