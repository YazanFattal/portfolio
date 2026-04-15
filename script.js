// Theme switching functionality
const themeSwitch = document.getElementById('theme-switch');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
} else if (savedTheme === 'light') {
    document.body.classList.remove('dark');
} else {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
    }
}

// Toggle theme function
function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Add click event to theme button
if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
}

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Optional: Smooth theme transition for images
// This ensures images look good in both modes
function adjustImagesForTheme() {
    const images = document.querySelectorAll('.project-image img');
    if (document.body.classList.contains('dark')) {
        // Dark mode adjustments if needed
        images.forEach(img => {
            img.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
        });
    } else {
        images.forEach(img => {
            img.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))';
        });
    }
}

// Call on theme change
if (themeSwitch) {
    themeSwitch.addEventListener('click', adjustImagesForTheme);
}

// Initial call
adjustImagesForTheme();