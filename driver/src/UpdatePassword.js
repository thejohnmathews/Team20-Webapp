import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { handleUpdatePassword } from './CognitoAPI';

const UpdatePassword = ({ open, handleClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);

  const UpdatePassword = async () => {
    try {
      await handleUpdatePassword(oldPassword, newPassword);
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
