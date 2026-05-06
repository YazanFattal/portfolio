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
        localStorage.setItem(
            'theme',
            document.body.classList.contains('dark') ? 'dark' : 'light'
        );
    });
}

const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

fadeElements.forEach(element => observer.observe(element));

const modal = document.getElementById('projectModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');

const projectDetails = {
    'crow-studio': {
        title: 'Crow Studio - Kauwe Bende',
        overview: 'Kauwe Bende is a UNO-style card game designed to help young adults connect through self-reflection questions. Instead of only focusing on winning, the game encourages players to open up, laugh, and share personal experiences.',
        problem: 'Loneliness is increasing among young adults, and many people find it difficult to start meaningful conversations in a natural way.',
        solution: 'We designed a familiar card-game format with deeper icebreaker questions, making conversations feel playful instead of awkward.',
        role: 'I contributed to the concept, digital game version, design decisions, portfolio presentation, and improving the interactive experience.',
        tools: ['HTML', 'CSS', 'JavaScript', 'Game Design', 'UX Thinking', 'Playtesting'],
        links: [
            { label: 'Play Desktop Version', url: 'https://yazanfattal.github.io/kauweBende/' },
            { label: 'Play Mobile Version', url: 'https://yazanfattal.github.io/kauweBendeMobileVersion/' },
            { label: 'Watch Demo Video', url: 'https://www.youtube.com/watch?v=NYifCcKBmeU' }
        ]
    },

    'smart-mobile': {
        title: 'Smart Mobile',
        overview: 'Smart Mobile includes three mobile app concepts: New Roots, Sensory Space, and Plant Tree. Each concept focuses on a different user need and shows my ability to design mobile-first experiences.',
        problem: 'Many apps are visually busy or difficult to navigate, especially for users who need support, calmness, or education.',
        solution: 'I created simple mobile interfaces with clear navigation, soft visual hierarchy, and user-friendly layouts.',
        role: 'I worked on app concepts, responsive iPhone-style templates, user journeys, and demo videos for presenting the ideas.',
        tools: ['Figma', 'Android Concepts', 'UX/UI Design', 'Mobile Design', 'Canva', 'Storytelling'],
        links: [
            { label: 'New Roots Demo', url: 'https://www.youtube.com/shorts/HM3XsdPDK-A' },
            { label: 'Sensory Space Demo', url: 'https://www.youtube.com/shorts/SIG6u2Z6D8c' },
            { label: 'Plant Tree Demo', url: 'https://www.youtube.com/shorts/S9eL20umfic' }
        ]
    },

    'catchee': {
        title: 'Catchee - Speed-meet Q&A Game',
        overview: 'Catchee is a speed-meet Q&A game created to help people make new social connections through timed conversations, playful questions, and a friendly visual identity.',
        problem: 'People experiencing loneliness often struggle to meet others because starting a conversation can feel awkward or stressful.',
        solution: 'Catchee makes meeting people easier by turning the first conversation into a guided, playful experience.',
        role: 'I contributed to the visual direction, user journey, prototype screens, storytelling, and presentation material.',
        tools: ['Figma', 'UX Research', 'Visual Design', 'Prototyping', 'Presentation Design'],
        links: [
            { label: 'Watch Demo Video', url: 'https://www.youtube.com/watch?v=tyR4OhImVRY' },
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/wFQfCpUkeeqThXSQQWzZgbz7' }
        ]
    },

    'tomra': {
        title: 'Tomra - Smart Recycling System',
        overview: 'Tomra is a sustainability-focused concept about improving can recycling through smart disassembly, sorting, and circular economy thinking.',
        problem: 'Recycling processes can be inefficient when materials are not sorted or prepared correctly.',
        solution: 'The concept focuses on a smarter system that identifies and supports better material recovery.',
        role: 'I contributed to research, concept explanation, business thinking, and portfolio presentation.',
        tools: ['Research', 'Business Process Thinking', 'Sustainability', 'Concept Design', 'Presentation'],
        links: [
            { label: 'View on Drieam', url: 'https://portfolio.drieam.app/s/GuxUr36X/8whNgDeemrG7FMAydgWiW9MG' }
        ]
    }
};

function openProjectModal(projectId) {
    const project = projectDetails[projectId];

    if (!project || !modal || !modalBody) return;

    const linksHTML = project.links.map(link => `
        <a href="${link.url}" target="_blank" class="external-link-btn">${link.label} →</a>
    `).join('');

    modalBody.innerHTML = `
        <h2 class="modal-project-title">${project.title}</h2>

        <div class="modal-section">
            <h4>📖 Overview</h4>
            <p>${project.overview}</p>
        </div>

        <div class="modal-section">
            <h4>📋 Problem</h4>
            <p>${project.problem}</p>
        </div>

        <div class="modal-section">
            <h4>💡 Solution</h4>
            <p>${project.solution}</p>
        </div>

        <div class="modal-section">
            <h4>🙋 My Role</h4>
            <p>${project.role}</p>
        </div>

        <div class="modal-section">
            <h4>🛠️ Tools & Skills</h4>
            <ul>
                ${project.tools.map(tool => `<li>${tool}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h4>🔗 Links</h4>
            ${linksHTML}
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeProjectModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});