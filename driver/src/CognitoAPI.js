// imports 
import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json'; 
import { fetchUserAttributes } from 'aws-amplify/auth';
import { updateUserAttributes } from 'aws-amplify/auth';
Amplify.configure(config);

// useFetchUserAttributes(): used to grab attributes from user pool & constantly update
export function useFetchUserAttributes(){

  const [userAttributes, setUserAttributes] = useState(null);
  useEffect(() => {
    async function handleFetchUserAttributes() {
      try {
        const userAttributes = await fetchUserAttributes();
        setUserAttributes(userAttributes);
        console.log(userAttributes);
      } catch (error) {
        console.log("Error fetching Cognito User Attributes");
      }
    }
  
    handleFetchUserAttributes();
  }, []);

  return userAttributes;
}

export async function handleUpdateUserAttributes(

  updatedGivenName,
  updatedFamilyName,
  updatedPhone,
  updatedUsername
) {
  try {
    const attributes = await updateUserAttributes({
      userAttributes: {
        given_name: updatedGivenName,
        family_name: updatedFamilyName,
        'custom:Phone': updatedPhone,
        preferred_username: updatedUsername,
      },
    });
    console.log(attributes);
    // Handle next steps
  } catch (error) {
    console.log(error);
  }
}