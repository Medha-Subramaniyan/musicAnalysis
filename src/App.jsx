import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingAndSelector from './components/LandingAndSelector';
import CuratedPlaylist from './components/CuratedPlaylist';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
  const [step, setStep] = useState("landing");
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  const handleCurate = (selectedGenres, selectedMoods) => {
    setGenres(selectedGenres);
    setMoods(selectedMoods);
    setStep("playlist");
  };

  const handleBack = () => {
    setStep("landing");
  };

  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/" element={
          step === "landing" ? (
            <LandingAndSelector onCurate={handleCurate} />
          ) : (
            <CuratedPlaylist selectedGenres={genres} selectedMoods={moods} onBack={handleBack} />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 