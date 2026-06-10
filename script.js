// Theme switching
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

// Fade-in animation
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });
fadeElements.forEach(el => observer.observe(el));

// Filter functionality
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

// Modal functionality with full case study content
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
        title: 'Smart Mobile - Three App Concepts',
        overview: 'Smart Mobile includes three mobile app concepts: New Roots, Sensory Space, and Plant Tree. Each concept focuses on a different user need and shows my ability to design mobile-first experiences.',
        problem: 'Many apps are visually busy or difficult to navigate, especially for users who need support, calmness, or education.',
        solution: 'I created simple mobile interfaces with clear navigation, soft visual hierarchy, and user-friendly layouts.',
        role: 'I worked on app concepts, responsive iPhone-style templates, user journeys, and demo videos for presenting the ideas.',
        tools: ['Figma', 'UX/UI Design', 'Mobile Design', 'Prototyping'],
        links: [
            { label: 'New Roots Demo', url: 'https://www.youtube.com/shorts/HM3XsdPDK-A' },
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/JVrign45XBMhA39RpCg93KWe' }
        ]
    },
    'catchee': {
        title: 'Catchee - Speed-meet Q&A Game',
        overview: 'Catchee is a speed-meet Q&A game created to help people make new social connections through timed conversations, playful questions, and a friendly visual identity.',
        problem: 'People experiencing loneliness often struggle to meet others because starting a conversation can feel awkward or stressful.',
        solution: 'Catchee makes meeting people easier by turning the first conversation into a guided, playful experience.',
        role: 'I contributed to the visual direction, user journey, prototype screens, storytelling, and presentation material.',
        tools: ['Figma', 'UX Research', 'Visual Design', 'Prototyping'],
        links: [
            { label: 'Watch Demo Video', url: 'https://www.youtube.com/watch?v=tyR4OhImVRY' }
        ]
    },
    'tomra': {
        title: 'Tomra - Smart Recycling System',
        overview: 'Tomra is a sustainability-focused concept about improving can recycling through smart disassembly, sorting, and circular economy thinking.',
        problem: 'Recycling processes can be inefficient when materials are not sorted or prepared correctly.',
        solution: 'The concept focuses on a smarter system that identifies and supports better material recovery.',
        role: 'I contributed to research, concept explanation, business thinking, and portfolio presentation.',
        tools: ['Research', 'Sustainability', 'Concept Design', 'Business Thinking'],
        links: [
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/8whNgDeemrG7FMAydgWiW9MG' }
        ]
    },
    'ludo-game': {
        title: 'Ludo Rush - Digital Board Game',
        overview: 'Ludo Rush is a fully interactive, browser-based Ludo game built with HTML, CSS, and JavaScript. It features a complete game engine, turn-based mechanics, and a clean, responsive interface.',
        problem: 'The goal was to create a faithful digital recreation of the classic Ludo board game that is fun, intuitive, and bug-free.',
        solution: 'I developed a complete game logic system to handle dice rolls, token movement, collision detection, capturing, safe zones, and win conditions.',
        role: 'I was the sole developer, responsible for all aspects: game logic, user interface, design, sound integration, and testing.',
        tools: ['HTML5', 'CSS3', 'JavaScript', 'Game Logic', 'Audio API'],
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