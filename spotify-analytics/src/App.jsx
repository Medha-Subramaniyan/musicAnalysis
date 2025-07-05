import React, { useState } from 'react';
import LandingAndSelector from './components/LandingAndSelector';
import CuratedPlaylist from './components/CuratedPlaylist';

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

  return step === "landing" ? (
    <LandingAndSelector onCurate={handleCurate} />
  ) : (
    <CuratedPlaylist selectedGenres={genres} selectedMoods={moods} onBack={handleBack} />
  );
}

export default App; 