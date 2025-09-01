# Sofia Ferro - Interactive Portfolio

A modern, interactive portfolio website built with Next.js, featuring an infinite canvas map interface with dynamic shader backgrounds.

## ✨ Features

### 🎨 Interactive Map Interface
- **Infinite Canvas**: Smooth panning and zooming like Miro/Figma
- **Interactive Nodes**: Clickable areas representing different portfolio sections
- **Connection Lines**: Animated connections between related nodes
- **Mini-map**: Overview showing current position
- **Zoom Controls**: Elegant +/- buttons and mouse wheel support

### 🌟 Dynamic Shader Background
- **Organic Patterns**: Dark base with flowing, organic textures
- **Orange/Red Accents**: Glowing highlights that move slowly
- **Liquid Effects**: Plasma-like distortions and noise-based animation
- **Performance Optimized**: WebGL/Three.js with fallback support
- **Mouse Interaction**: Subtle response to cursor movement

### 📱 Mobile-First Design
- **Touch Gestures**: Pinch-to-zoom, pan, and tap interactions
- **Responsive Layout**: Optimized for all screen sizes
- **Mobile Controls**: Dedicated mobile interface elements
- **Performance**: 60fps animations on mobile devices

### 🎭 Modern UI/UX
- **Dark Theme**: Deep blacks and grays with glassmorphism effects
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Beautiful skeleton loading with progress indicators
- **Glassmorphism**: Semi-transparent cards with backdrop blur

## 🚀 Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion for smooth interactions
- **3D Graphics**: Three.js with React Three Fiber
- **Shaders**: Custom GLSL shaders for background effects
- **TypeScript**: Full type safety throughout
- **Mobile**: Touch gesture handling and responsive design

## 🏗️ Architecture

### Core Components

```
components/
├── shader-background.tsx    # Dynamic WebGL background
├── interactive-map.tsx      # Main map interface
├── mobile-map-controls.tsx  # Mobile-specific controls
└── loading-skeleton.tsx     # Loading animations
```

### Map Structure

The portfolio is organized as an interactive map with these main nodes:

- **About Me** (Center Hub)
- **Skills & Expertise** (Top Right)
- **Portfolio Projects** (Right)
- **Services** (Bottom Right)
- **Contact** (Bottom)

Each node is connected with animated lines and expands to show detailed content.

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd porfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Deploy to Vercel
vercel --prod
```

## 🎨 Customization

### Shader Background

Modify the GLSL shaders in `components/shader-background.tsx`:

- Adjust colors in the fragment shader
- Change animation speeds by modifying time multipliers
- Add new effects by extending the shader code

### Map Nodes

Update the node configuration in `components/interactive-map.tsx`:

```typescript
const nodes: MapNode[] = [
  {
    id: 'custom',
    title: 'Custom Section',
    description: 'Your description here',
    position: { x: 0, y: 0 },
    type: 'custom',
    connections: ['about'],
    icon: <YourIcon />
  }
]
```

### Styling

The theme is built with Tailwind CSS and custom CSS variables:

- Modify `app/globals.css` for global styles
- Update color schemes in the CSS variables
- Add new utility classes as needed

## 📱 Mobile Optimization

The site automatically detects mobile devices and provides:

- Touch-friendly controls
- Optimized node sizes
- Mobile-specific navigation
- Performance optimizations for mobile GPUs

## 🚀 Performance Features

- **WebGL Fallback**: Graceful degradation for unsupported devices
- **Dynamic Quality**: Automatic quality adjustment based on device performance
- **Lazy Loading**: Components load only when needed
- **Optimized Shaders**: Reduced complexity for better frame rates

## 🔧 Development

### File Structure

```
app/
├── layout.tsx           # Root layout with dark theme
├── page.tsx            # Main interactive map page
└── globals.css         # Global styles and theme

components/
├── shader-background.tsx    # WebGL background
├── interactive-map.tsx      # Map interface
├── mobile-map-controls.tsx  # Mobile controls
└── loading-skeleton.tsx     # Loading states

lib/                     # Utility functions
public/                  # Static assets
```

### Key Technologies

- **Three.js**: 3D graphics and WebGL rendering
- **React Three Fiber**: React integration for Three.js
- **Framer Motion**: Animation library for smooth interactions
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

## 🎨 Design Philosophy

This portfolio represents a departure from traditional linear layouts, embracing:

- **Exploration**: Users discover content through interaction
- **Immersive Experience**: Full-screen canvas with dynamic backgrounds
- **Modern Aesthetics**: Dark theme with glassmorphism and glowing accents
- **Performance**: Smooth 60fps animations across all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Miro's infinite canvas interface
- Shader effects inspired by creative coding community
- Built with modern web technologies and best practices

---

**Sofia Ferro** - Software Engineer, AI Engineer, and Creative Technologist

*Creating innovative solutions that bridge technology and creativity.*
