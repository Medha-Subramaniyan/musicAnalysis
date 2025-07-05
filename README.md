# 🎵 Spotify Music Room

An interactive 3D music room experience that visualizes your Spotify playlist collection and offers personalized music recommendations. Built with React, Three.js, and modern web technologies.

## ✨ Features

- **3D Music Room**: Immersive 3D environment with floating album covers
- **Smart Recommendations**: AI-powered suggestions based on genres and moods
- **Interactive Playlist Builder**: Create and manage custom playlists
- **Spotify Integration**: Direct links to albums and export functionality
- **Vintage Aesthetics**: Beautiful vinyl-inspired design with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spotify-music-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
spotify-music-room/
├── src/
│   ├── components/          # React components
│   │   ├── MusicRoom.jsx    # 3D music room scene
│   │   ├── WelcomeScreen.jsx
│   │   ├── GenreSelector.jsx
│   │   ├── PlaylistBuilder.jsx
│   │   ├── Navigation.jsx
│   │   └── LoadingScreen.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAlbumData.js
│   │   └── useMusicRoomState.js
│   ├── utils/               # Utility functions
│   │   └── cn.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── data/                    # Album data and metadata
├── public/                  # Static assets
│   └── albums/              # Album cover images
├── python/                  # Data processing scripts
└── package.json
```

## 🎨 Design System

### Colors
- **Vinyl**: Warm, vintage-inspired palette
- **Groove**: Blue accent colors for interactive elements
- **Sound**: Purple accent colors for mood-related features

### Typography
- **Font Groove**: Poppins for headings and titles
- **Font Vinyl**: Inter for body text and UI elements

### Components
- Glassmorphism cards with backdrop blur
- Smooth animations with Framer Motion
- Responsive grid layouts
- Custom button styles with hover effects

## 🔧 Customization

### Adding New Albums

1. **Update the data file**:
   ```bash
   # Run the Python script to add metadata
   python python/add_album_metadata.py
   ```

2. **Add album covers**:
   Place album images in `public/albums/` directory

3. **Update metadata**:
   Edit `data/ROOM_playlist_album_image_mapping_with_metadata.json`

### Styling

The project uses Tailwind CSS with custom configurations:
- Custom color palette in `tailwind.config.js`
- Component classes in `src/index.css`
- Responsive breakpoints and animations

## 🎯 Key Components

### MusicRoom (3D Scene)
- Renders album covers in 3D space
- Interactive stereo system
- Dynamic lighting and shadows
- Camera controls and animations

### GenreSelector
- Pill-style genre and mood selection
- Real-time filtering
- Smooth animations and transitions

### PlaylistBuilder
- Drag-and-drop reordering
- Spotify integration
- Export and sharing functionality

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📸 Image Handling & Deployment

### Local Development
- Album cover images are stored locally in `public/albums/`
- Images are referenced via local paths for fast loading

### Production Deployment
- Album covers use Spotify image URLs for deployment compatibility
- Large image files are excluded from Git commits to keep repository size small
- The app automatically falls back to Spotify URLs when local images aren't available

### Committing Code Only
To commit only code files (excluding large assets):

```bash
# Use the provided script
npm run commit

# Or manually
git add .
git commit -m "Update code files"
git push origin main
```

**Note**: The `.gitignore` file is configured to exclude:
- Album cover images (`public/albums/`)
- Large media files
- Build artifacts
- Environment files

This ensures your repository stays lightweight while maintaining full functionality in both local and deployed environments.

## 🔗 Integration with Main Website

This music room is designed to be integrated into a larger portfolio website:

1. **Component Export**: Export `MusicRoom` as a standalone component
2. **Route Integration**: Add as `/music-room` or `/my-soundscape` route
3. **Styling Consistency**: Match your main site's design system
4. **Navigation**: Add to your main site's navigation menu

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Language**: JavaScript/JSX

## 📱 Browser Support
# 🎵 Spotify Music Room

An interactive 3D music room experience that visualizes your Spotify playlist collection and offers personalized music recommendations. Built with React, Three.js, and modern web technologies.

## ✨ Features

- **3D Music Room**: Immersive 3D environment with floating album covers
- **Smart Recommendations**: AI-powered suggestions based on genres and moods
- **Interactive Playlist Builder**: Create and manage custom playlists
- **Spotify Integration**: Direct links to albums and export functionality
- **Vintage Aesthetics**: Beautiful vinyl-inspired design with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spotify-music-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
spotify-music-room/
├── src/
│   ├── components/          # React components
│   │   ├── MusicRoom.jsx    # 3D music room scene
│   │   ├── WelcomeScreen.jsx
│   │   ├── GenreSelector.jsx
│   │   ├── PlaylistBuilder.jsx
│   │   ├── Navigation.jsx
│   │   └── LoadingScreen.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAlbumData.js
│   │   └── useMusicRoomState.js
│   ├── utils/               # Utility functions
│   │   └── cn.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── data/                    # Album data and metadata
├── public/                  # Static assets
│   └── albums/              # Album cover images
├── python/                  # Data processing scripts
└── package.json
```

## 🎨 Design System

### Colors
- **Vinyl**: Warm, vintage-inspired palette
- **Groove**: Blue accent colors for interactive elements
- **Sound**: Purple accent colors for mood-related features

### Typography
- **Font Groove**: Poppins for headings and titles
- **Font Vinyl**: Inter for body text and UI elements

### Components
- Glassmorphism cards with backdrop blur
- Smooth animations with Framer Motion
- Responsive grid layouts
- Custom button styles with hover effects

## 🔧 Customization

### Adding New Albums

1. **Update the data file**:
   ```bash
   # Run the Python script to add metadata
   python python/add_album_metadata.py
   ```

2. **Add album covers**:
   Place album images in `public/albums/` directory

3. **Update metadata**:
   Edit `data/ROOM_playlist_album_image_mapping_with_metadata.json`

### Styling

The project uses Tailwind CSS with custom configurations:
- Custom color palette in `tailwind.config.js`
- Component classes in `src/index.css`
- Responsive breakpoints and animations

## 🎯 Key Components

### MusicRoom (3D Scene)
- Renders album covers in 3D space
- Interactive stereo system
- Dynamic lighting and shadows
- Camera controls and animations

### GenreSelector
- Pill-style genre and mood selection
- Real-time filtering
- Smooth animations and transitions

### PlaylistBuilder
- Drag-and-drop reordering
- Spotify integration
- Export and sharing functionality

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📸 Image Handling & Deployment

### Local Development
- Album cover images are stored locally in `public/albums/`
- Images are referenced via local paths for fast loading

### Production Deployment
- Album covers use Spotify image URLs for deployment compatibility
- Large image files are excluded from Git commits to keep repository size small
- The app automatically falls back to Spotify URLs when local images aren't available

### Committing Code Only
To commit only code files (excluding large assets):

```bash
# Use the provided script
npm run commit

# Or manually
git add .
git commit -m "Update code files"
git push origin main
```

**Note**: The `.gitignore` file is configured to exclude:
- Album cover images (`public/albums/`)
- Large media files
- Build artifacts
- Environment files

This ensures your repository stays lightweight while maintaining full functionality in both local and deployed environments.

## 🔗 Integration with Main Website

This music room is designed to be integrated into a larger portfolio website:

1. **Component Export**: Export `MusicRoom` as a standalone component
2. **Route Integration**: Add as `/music-room` or `/my-soundscape` route
3. **Styling Consistency**: Match your main site's design system
4. **Navigation**: Add to your main site's navigation menu

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Language**: JavaScript/JSX

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Spotify Web API for music data
- Three.js community for 3D graphics
- Framer Motion for animations
- Tailwind CSS for styling

---

**Built with ❤️ for music lovers everywhere**
