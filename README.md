# VibeProd - AI Powered Productivity App

A premium productivity application with insane 3D animations, particle effects, and AI-powered task generation.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
The app will automatically open at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## ✨ Features

### Tasks Tab
- **AI Task Generator** - Describe your goal and let AI create a complete task breakdown
- **Quick Add** - Instantly add new tasks
- **Task Management** - Check off completed tasks, delete tasks, view priority levels
- **Stats Cards** - Track completion rate and progress

### Focus Tab
- **Pomodoro Mode** - 25-minute focused work sessions
- **Deep Work Mode** - 50-minute intensive sessions
- **Fullscreen Timer** - Distraction-free timer with pause/resume controls

### Visual Effects
- 3D animated logo with mouse tracking
- Particle canvas background with connected nodes
- Floating gradient orbs with parallax scrolling
- Glassmorphism UI with blur effects
- Smooth animations and transitions

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS-in-JS** - Inline styles for component isolation

## 🛠️ Development

The project uses Vite for fast hot module replacement (HMR) during development.

Main files:
- `src/App.jsx` - Main VibeProd component
- `src/main.jsx` - Application entry point
- `src/index.css` - Global styles
- `vite.config.js` - Vite configuration

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note:** Best experience on modern browsers with support for:
- CSS backdrop-filter
- Canvas API
- ES6+ features

## 🎯 Usage Tips

1. **AI Task Generator**: Type a goal (e.g., "Launch a mobile app") and press Enter or click Generate
2. **Focus Mode**: Select Pomodoro or Deep Work, then click Start Session
3. **Task Priority**: High (pink), Medium (orange), Low (green) - color-coded on the left border
4. **Keyboard Shortcuts**: Press Enter in any input field to submit

## 🐛 Troubleshooting

**Issue: Blank screen**
- Check browser console for errors
- Ensure Node.js version is 16+
- Try clearing browser cache

**Issue: Animations not smooth**
- Check if browser supports backdrop-filter
- Try disabling browser extensions
- Use Chrome/Edge for best performance

**Issue: npm install fails**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you have stable internet connection

## 📄 License

This project is private and for demonstration purposes.

## 🙏 Credits

Built with ❤️ using React and Vite
Icons by Lucide React
