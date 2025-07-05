import React, { useState } from "react";

const GENRES = [
  { label: "Hip-Hop", icon: "fa-microphone" },
  { label: "Rap", icon: "fa-music" },
  { label: "Alt Hip-Hop", icon: "fa-headphones" },
  { label: "Conscious Rap", icon: "fa-brain" },
  { label: "R&B", icon: "fa-heart" },
  { label: "Soul", icon: "fa-fire" },
  { label: "Jazz", icon: "fa-music" },
  { label: "Electronic", icon: "fa-wave-square" },
  { label: "House", icon: "fa-home" },
  { label: "Trap", icon: "fa-bolt" },
  { label: "Neo-Soul", icon: "fa-star" },
  { label: "Soundtrack", icon: "fa-film" },
];

const MOODS = [
  { label: "Energetic", icon: "fa-bolt" },
  { label: "Chill", icon: "fa-leaf" },
  { label: "Confident", icon: "fa-crown" },
  { label: "Melancholic", icon: "fa-cloud-rain" },
  { label: "Nostalgic", icon: "fa-clock-rotate-left" },
  { label: "Groovy", icon: "fa-guitar" },
  { label: "Smooth", icon: "fa-water" },
  { label: "Empowering", icon: "fa-fist-raised" },
  { label: "Reflective", icon: "fa-regular fa-comment-dots" },
  { label: "Atmospheric", icon: "fa-cloud" },
  { label: "Playful", icon: "fa-smile" },
  { label: "Sensual", icon: "fa-heart" },
  { label: "Dark", icon: "fa-moon" },
  { label: "Experimental", icon: "fa-flask" },
  { label: "Thoughtful", icon: "fa-lightbulb" },
  { label: "Hype", icon: "fa-fire" },
  { label: "Serious", icon: "fa-balance-scale" },
];

export default function LandingAndSelector({ onCurate }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
  };

  const canCurate = selectedGenres.length > 0 && selectedMoods.length > 0;

  const handleCurate = () => {
    if (!canCurate) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onCurate) onCurate(selectedGenres, selectedMoods);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      {/* Hero */}
      <section className="pt-8 h-[340px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50"></div>
        <div className="text-center z-10 max-w-2xl mx-auto px-6">
          <h2 className="serif text-4xl md:text-5xl font-semibold text-amber-900 mb-4 italic">
            "Music is the soundtrack to your soul"
          </h2>
          <p className="text-lg text-amber-700 mb-8 leading-relaxed">
            Let me curate the perfect soundscape based on your vibe today
          </p>
        </div>
        <div className="absolute -right-20 -top-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-10 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"></div>
      </section>

      {/* Selection */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Genres */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-amber-900 mb-3">Choose Your Genres</h3>
              <p className="text-amber-700">Select the sounds that speak to you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GENRES.map((g) => (
                <div
                  key={g.label}
                  className={`genre-chip bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer border border-amber-200 vinyl-shadow hover:bg-amber-100/70 ${
                    selectedGenres.includes(g.label) ? "selected" : ""
                  }`}
                  onClick={() => toggleGenre(g.label)}
                >
                  <i className={`fa-solid ${g.icon} text-2xl text-amber-700 mb-2`}></i>
                  <p className="font-medium text-amber-900">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Moods */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-amber-900 mb-3">Set Your Mood</h3>
              <p className="text-amber-700">How are you feeling today?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((m) => (
                <span
                  key={m.label}
                  className={`mood-pill bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full cursor-pointer border border-amber-200 text-amber-900 hover:bg-amber-100/70 transition-all text-center ${
                    selectedMoods.includes(m.label) ? "selected" : ""
                  }`}
                  onClick={() => toggleMood(m.label)}
                >
                  <i className={`${m.icon.startsWith('fa-regular') ? 'far' : 'fa-solid'} ${m.icon.replace('fa-regular ', '')} mr-2`}></i>
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* CTA */}
        <div className="text-center mt-16">
          <button
            className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-300 vinyl-shadow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canCurate || loading}
            onClick={handleCurate}
          >
            <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-magic-wand-sparkles"} mr-3`}></i>
            {loading ? "Creating Your Soundscape..." : "Curate My Soundscape"}
          </button>
          <p className="text-amber-600 mt-4 text-sm">
            Select at least one genre and mood to continue
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-100 to-orange-100 border-t border-amber-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-amber-700 mb-4">Crafted with love by Medha • Powered by Spotify</p>
          <div className="flex justify-center space-x-6">
            <span className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer">
              <i className="fa-brands fa-spotify text-xl"></i>
            </span>
            <span className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer">
              <i className="fa-brands fa-instagram text-xl"></i>
            </span>
            <span className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer">
              <i className="fa-solid fa-share text-xl"></i>
            </span>
          </div>
        </div>
      </footer>
      {/* Custom styles for .selected */}
      <style>{`
        .serif { font-family: 'Crimson Text', serif; }
        .vinyl-shadow { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1); }
        .genre-chip { transition: all 0.3s ease; transform: translateY(0); }
        .genre-chip:hover { transform: translateY(-2px); }
        .mood-pill { transition: all 0.3s ease; }
        .selected { background: linear-gradient(135deg, #D4AF37, #FFD700); color: #2D1810 !important; }
      `}</style>
    </div>
  );
} 