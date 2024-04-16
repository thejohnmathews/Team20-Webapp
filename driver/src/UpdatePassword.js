import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { handleUpdatePassword } from './CognitoAPI';
import BaseURL from './BaseURL';
import { useFetchUserAttributes } from './CognitoAPI';

const UpdatePassword = ({ open, handleClose }) => {

  const userAttributes = useFetchUserAttributes();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userID, setUserID] = useState('');
  const [error, setError] = useState(null);

    // Get current user from UserInfo RDS table
  if(userAttributes !== null){
      fetch(BaseURL+'/userAttributes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({sub: userAttributes.sub})
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); 
      })
      .then(data => {
          setUserID(data.userData.userID);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }

  const UpdatePassword = async () => {
    try {
      
      if (await handleUpdatePassword(oldPassword, newPassword) !== false){

        // if successful, log password change event
        fetch(BaseURL + '/updatePasswordChange',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userID: userID })
        })
        .then(response => {
            if (response.ok) { 
                
              console.log('Received data:', response);
            } 
            else { 
                console.error('Failed to update table'); 
            }
        })
        .catch(error => {
            console.error('Failed to update table', error);
        });
      }
      else{

        // display update password error message to user
        alert("Wrong Old or New password entered. Failed to update.");
      }

      handleClose();
    } catch (error) {
      setError(error.message || 'Error updating password. Please try again.');
    }
  };

  const handleCancel = () => {
    setError(null);
    setOldPassword('');
    setNewPassword('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={UpdatePassword} color="primary">
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePassword;
