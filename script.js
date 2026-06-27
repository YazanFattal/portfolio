// ========================================
// THEME SWITCHING
// ========================================

const themeSwitch = document.getElementById('theme-switch');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark');
} else if (savedTheme === 'light') {
    document.body.classList.remove('dark');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
}

if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
}

// ========================================
// FADE-IN ANIMATION
// ========================================

const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });
fadeElements.forEach(el => fadeObserver.observe(el));

// ========================================
// SECTION REVEAL ON SCROLL
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.classList.add('section-reveal', 'visible');
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('visible');
                
                const cards = entry.target.querySelectorAll('.journey-pin, .project-card, .contact-method');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ========================================
    // NAVIGATION HIGHLIGHT - WORKING VERSION
    // ========================================

    const navLinks = document.querySelectorAll('nav a');
    
    // Get all sections that have an id
    const allSections = document.querySelectorAll('section[id]');
    
    // Create an array of section ids
    const sectionIds = [];
    allSections.forEach(section => {
        sectionIds.push(section.getAttribute('id'));
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Get the href without the # symbol
                    const linkHref = link.getAttribute('href').replace('#', '');
                    if (linkHref === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    allSections.forEach(section => {
        navObserver.observe(section);
    });

    // Also highlight on click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ========================================
// FILTER FUNCTIONALITY
// ========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterValue = button.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide');
                card.classList.add('show');
            } else {
                card.classList.remove('show');
                card.classList.add('hide');
            }
        });
    });
});

// ========================================
// MODAL FUNCTIONALITY
// ========================================

const modal = document.getElementById('projectModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');

const projectDetails = {
    'crow-studio': {
        title: 'Crow Studio - Kauwe Bende',
        overview: 'Kauwe Bende is an icebreaker game designed to help young adults connect through self-reflection questions. Instead of only focusing on winning, the game encourages players to open up, laugh, and share personal experiences.',
        problem: 'Loneliness is increasing among young adults, and many people find it difficult to start meaningful conversations in a natural way.',
        solution: 'We designed a familiar card-game format with deeper icebreaker questions, making conversations feel playful instead of awkward.',
        role: 'I contributed to the concept, digital game version, design decisions, portfolio presentation, and improving the interactive experience.',
        tools: ['HTML', 'CSS', 'JavaScript', 'Game Design', 'UX Thinking', 'Playtesting'],
        links: [
            { label: 'Play Desktop Version', url: 'https://yazanfattal.github.io/kauweBende/' },
            { label: 'Play Mobile Version', url: 'https://yazanfattal.github.io/kauweBendeMobileVersion/' },
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/XNCJf29o6wbf2U2pjP8s2aYC' }
        ]
    },
    'smart-mobile': {
        title: 'Smart Mobile',
        overview: 'Three mobile app concepts: New Roots, Sensory Space, and Plant Tree.',
        problem: 'Many apps are visually busy or difficult to navigate.',
        solution: 'Simple mobile interfaces with clear navigation and user-friendly layouts.',
        role: 'App concepts, user journeys, demo videos.',
        tools: ['Figma', 'UX/UI Design', 'Mobile Design'],
        links: [
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/JVrign45XBMhA39RpCg93KWe' }
        ]
    },
    'catchee': {
        title: 'Catchee - Speed-meet Q&A Game',
        overview: 'A speed-meet Q&A game helping people make new social connections.',
        problem: 'Starting conversations can feel awkward or stressful.',
        solution: 'Turning the first conversation into a guided, playful experience.',
        role: 'Visual direction, user journey, prototype screens.',
        tools: ['Figma', 'UX Research', 'Visual Design'],
        links: [
            { label: 'Watch Demo', url: 'https://www.youtube.com/watch?v=tyR4OhImVRY' }
        ]
    },
    'tomra': {
        title: 'Tomra - Smart Recycling System',
        overview: 'A sustainability-focused concept for improving can recycling.',
        problem: 'Recycling processes are inefficient when materials are not sorted correctly.',
        solution: 'A smarter system that identifies and supports better material recovery.',
        role: 'Research, concept explanation, business thinking.',
        tools: ['Research', 'Sustainability', 'Concept Design'],
        links: [
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/8whNgDeemrG7FMAydgWiW9MG' }
        ]
    },
    'ludo-game': {
        title: 'Ludo Rush - Digital Board Game',
        overview: 'A browser-based Ludo game with complete game engine.',
        problem: 'Creating a faithful digital recreation of classic Ludo.',
        solution: 'Game logic for dice rolls, token movement, capturing, and win conditions.',
        role: 'Sole developer - game logic, UI, design, testing.',
        tools: ['HTML5', 'CSS3', 'JavaScript', 'Game Logic'],
        links: [
            { label: 'Play Ludo Game', url: 'https://yazanfattal.github.io/ludo-game/?v=3' }
        ]
    }
};

function openProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project) return;

    const linksHTML = project.links.map(link => 
        `<a href="${link.url}" target="_blank" class="external-link-btn" style="margin-top: 8px;">${link.label} →</a>`
    ).join('');

    modalBody.innerHTML = `
        <h2 class="modal-project-title">${project.title}</h2>
        <div class="modal-section"><h4>📖 Overview</h4><p>${project.overview}</p></div>
        <div class="modal-section"><h4>📋 Problem</h4><p>${project.problem}</p></div>
        <div class="modal-section"><h4>💡 Solution</h4><p>${project.solution}</p></div>
        <div class="modal-section"><h4>🙋 My Role</h4><p>${project.role}</p></div>
        <div class="modal-section"><h4>🛠️ Tools & Skills</h4><ul>${project.tools.map(tool => `<li>${tool}</li>`).join('')}</ul></div>
        <div class="modal-section"><h4>🔗 Links</h4>${linksHTML}</div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});