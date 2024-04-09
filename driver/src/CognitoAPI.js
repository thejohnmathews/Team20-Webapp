// CognitoAPI.js - Cognito API calls for this project are all here!

// documentation used:
// https://docs.amplify.aws/javascript/build-a-backend/auth/manage-user-profile/
// https://docs.amplify.aws/react/build-a-backend/auth/manage-passwords/

// imports 
import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json'; 
import { fetchUserAttributes } from 'aws-amplify/auth';
import { updateUserAttributes } from 'aws-amplify/auth';
import { updatePassword } from 'aws-amplify/auth';
Amplify.configure(config);

// useFetchUserAttributes(): used to grab attributes from user pool & constantly update
export function useFetchUserAttributes(){

  const [userAttributes, setUserAttributes] = useState(null);
  useEffect(() => {
    async function handleFetchUserAttributes() {
      //try {
        const userAttributes = await fetchUserAttributes();
        setUserAttributes(userAttributes);
        console.log(userAttributes);
      //} catch (error) {
        //console.log("Error fetching Cognito User Attributes");
      //}
    }
  
    handleFetchUserAttributes();
  }, []);

  return userAttributes;
}


// handleUpdateUserAttributes(): update userAttributes on the Profile Page
export async function handleUpdateUserAttributes(
  updatedEmail,
  updatedGivenName,
  updatedFamilyName,
  updatedPhone,
  updatedUsername,
  updatedAddress,
) {
  try {
    const attributes = await updateUserAttributes({
      userAttributes: {
        email: updatedEmail,
        given_name: updatedGivenName,
        family_name: updatedFamilyName,
        'custom:Phone': updatedPhone,
        preferred_username: updatedUsername,
        address: updatedAddress,
      },
    });
    // Handle next steps
  } catch (error) {
    console.log(error);
  }
}

// handleUpdateAddress(): update just the address Cognito attribute on the Cart Page
export async function handleUpdateAddress(
  updatedAddress,
) {
  try {
    const attributes = await updateUserAttributes({
      userAttributes: {
        address: updatedAddress
      },
    });
    // Handle next steps
  } catch (error) {
    console.log(error);
  }
}

// handleUpdatePassword(): update Cognito password on Profile Page
export async function handleUpdatePassword(oldPassword, newPassword) {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (err) {
    console.log(err);
    return false;
  }
}