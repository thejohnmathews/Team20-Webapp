import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }

  return (
        <div>
          <h1>About Us</h1>
          <p>This is a simple About page created using React.</p>
          <Button variant="contained" onClick={back}>back</Button>
        </div>
  );
}