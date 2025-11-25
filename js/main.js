/**
 * Main JavaScript for Doron Persitz Personal Website
 * Handles theme switching, smooth scrolling, animations, and interactivity
 */

// ================================
// Theme Toggle
// ================================
class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        this.storageKey = 'dp-theme-preference';
        this.init();
    }

    init() {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        }

        // Listen for toggle clicks
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem(this.storageKey)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// ================================
// Smooth Scroll
// ================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const navbar = document.querySelector('.navbar');
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ================================
// Navbar Scroll Effect
// ================================
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.boxShadow = 'none';
        }
        
        this.lastScroll = currentScroll;
    }
}

// ================================
// Intersection Observer for Animations
// ================================
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll(
            '.section-header, .about-text, .about-visual, .project-card, .contact-card, .skill-item'
        );
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ================================
// Custom Cursor Follower
// ================================
class CursorFollower {
    constructor() {
        this.cursor = document.getElementById('cursorFollower');
        this.isDesktop = window.innerWidth > 768;
        
        if (this.cursor && this.isDesktop) {
            this.init();
        }
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            });
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.classList.remove('active');
        });

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
}

// ================================
// Typing Effect for Tagline (Optional Enhancement)
// ================================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ================================
// Staggered Animation for Elements
// ================================
class StaggerAnimation {
    constructor() {
        this.init();
    }

    init() {
        // Stagger project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Stagger skill items
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });

        // Stagger contact cards
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Stagger tagline words
        const taglineWords = document.querySelectorAll('.tagline-word');
        taglineWords.forEach((word, index) => {
            word.style.animationDelay = `${index * 0.1}s`;
            word.style.opacity = '0';
            word.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        });
    }
}

// ================================
// Add fadeInUp animation to CSS dynamically
// ================================
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
};

// ================================
// Active Section Highlight in Nav
// ================================
class ActiveNavHighlight {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -60% 0px'
            }
        );

        this.sections.forEach(section => observer.observe(section));
    }
}

// ================================
// Initialize Everything
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize all features
    new ThemeManager();
    new SmoothScroll();
    new NavbarScroll();
    new ScrollAnimations();
    new CursorFollower();
    new StaggerAnimation();
    new ActiveNavHighlight();

    // Log a fun message to console
    console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║   👋 Hello, curious developer!        ║
    ║                                       ║
    ║   Thanks for checking out my site.    ║
    ║   Feel free to connect!               ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    `);
});

// ================================
// Performance: Defer non-critical animations
// ================================
window.addEventListener('load', () => {
    // Start gradient animation after page load
    const gradientBg = document.querySelector('.gradient-bg');
    if (gradientBg) {
        gradientBg.style.opacity = '0.6';
    }
});
