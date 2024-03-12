// imports 
import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { updatePassword } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json'; 
import { fetchUserAttributes } from 'aws-amplify/auth';
import { updateUserAttributes } from 'aws-amplify/auth';
import { confirmUserAttribute } from 'aws-amplify/auth';
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

// https://docs.amplify.aws/javascript/build-a-backend/auth/manage-user-profile/
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
    // handleUpdateUserAttributeNextSteps(output);
    // Handle next steps
  } catch (error) {
    console.log(error);
  }
}

/* function handleUpdateUserAttributeNextSteps(output) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case 'CONFIRM_ATTRIBUTE_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
      );
      // Collect the confirmation code from the user and pass to confirmUserAttribute.
      break;
    case 'DONE':
      console.log(`attribute was successfully updated.`);
      break;
  }
} */

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


export async function handleConfirmUserAttribute({
  userAttributeKey,
  confirmationCode
}) {
  try {
    await confirmUserAttribute({ userAttributeKey, confirmationCode });
  } catch (error) {
    console.log(error);
  }
}

// https://docs.amplify.aws/react/build-a-backend/auth/manage-passwords/
export async function handleUpdatePassword(oldPassword, newPassword) {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (err) {
    console.log(err);
  }
}