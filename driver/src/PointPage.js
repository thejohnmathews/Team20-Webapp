import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"

export default function PointPage() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }

  return (
    <div>
        <div>
          <h1 className="about-header">Your Point Dashboard</h1>
        </div>
      </div>
  );
}