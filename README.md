# Doron Persitz - Personal Website

A memorable and unique personal webpage featuring modern design, animated gradients, smooth interactions, and dark/light theme support.

## ✨ Features

- **Animated Gradient Background** - Mesmerizing, constantly moving gradient orbs
- **Dark/Light Theme** - Toggle between themes with system preference detection
- **Smooth Animations** - Scroll-triggered animations and hover effects
- **Responsive Design** - Looks great on all devices
- **Custom Cursor** - Unique cursor follower effect on desktop
- **Accessibility** - Keyboard navigation and reduced motion support
- **Modern Typography** - Google Fonts (Space Grotesk + Inter)

## 🚀 Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/doronpers/drrweb.git
   cd drrweb
   ```

2. Open `index.html` in your browser, or serve with any static file server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve
   ```

3. Visit `http://localhost:8000` in your browser

### Deployment

This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 📁 Project Structure

```
drrweb/
├── index.html      # Main HTML file
├── css/
│   └── style.css   # All styles including animations
├── js/
│   └── main.js     # Interactivity and theme handling
└── README.md       # Project documentation
```

## 🎨 Customization

### Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --color-accent: #6c5ce7;        /* Primary accent color */
    --color-gradient-1: #667eea;    /* Gradient colors */
    --color-gradient-2: #764ba2;
    /* ... more colors */
}
```

### Content

Edit `index.html` to update:
- Your name and tagline
- About section text
- Project cards
- Contact information

## 🛠️ Technologies

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Google Fonts

## 📄 License

This project is open source and available for personal use.

---

Made with ♥ by Doron Persitz
