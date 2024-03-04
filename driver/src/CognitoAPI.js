// imports 
import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json'; 
import { fetchUserAttributes } from 'aws-amplify/auth';
Amplify.configure(config);

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
