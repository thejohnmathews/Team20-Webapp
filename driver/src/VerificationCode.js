import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { handleConfirmUserAttribute } from './CognitoAPI'; // Import your Cognito API function

const VerificationCode = ({ open, handleClose, userAttributeKey }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState(null);

  const ConfirmUserAttribute = async () => {
    try {
      await handleConfirmUserAttribute('email', confirmationCode);
      handleClose();
    } catch (error) {
      setError(error.message || 'Error confirming user attribute. Please try again.');
    }
  };

  const handleCancel = () => {
    setError(null);
    setConfirmationCode('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Confirmation Code</DialogTitle>
      <DialogContent>
        <TextField
          label="Confirmation Code"
          fullWidth
          margin="normal"
          variant="outlined"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={ConfirmUserAttribute} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationCode;