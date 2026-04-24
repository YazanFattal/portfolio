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

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
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

// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const modalCache = {};

function openProjectModal(projectId) {
    if (modalCache[projectId]) {
        document.getElementById('modal-body').innerHTML = modalCache[projectId];
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        return;
    }
    
    const projectDetails = {
        'crow-studio': {
            title: 'Crow Studio - Kauwe Bende',
            tags: ['Game Design', 'Social Connection', 'Card Game', 'Self-Reflection'],
            fullDescription: 'Kauwe Bende is an innovative card game designed to combat loneliness and foster meaningful connections. Inspired by the familiar mechanics of UNO, this game adds a unique twist - each card features thoughtful questions that encourage players to reflect on themselves and share personal experiences with others.',
            challenges: 'The main challenge was designing questions that are deep enough to create meaningful connections but not too overwhelming or uncomfortable for players. Balancing fun gameplay with meaningful interaction was key.',
            outcomes: 'Successfully created a prototype that received positive feedback from test players. Users reported feeling more connected to others after playing and appreciated the safe space created for sharing.',
            technologies: ['Card Game Design', 'User Research', 'Playtesting', 'Graphic Design'],
            timeline: '3 months (Semester 3)',
            team: '4 team members'
        },
        'smart-mobile': {
            title: 'Smart Mobile',
            tags: ['Kotlin', 'Android Studio', 'UX/UI'],
            fullDescription: 'A collection of mobile applications developed during the Smart Mobile semester, focusing on creating intuitive and accessible Android apps that solve real-world problems.',
            challenges: 'Implementing complex navigation patterns while maintaining simplicity for users of all technical levels.',
            outcomes: 'Developed 3 fully functional Android apps with Material Design principles, achieving high usability scores in user testing.',
            technologies: ['Kotlin', 'Android Studio', 'Jetpack Compose', 'Room Database'],
            timeline: '5 months (Semester 4)',
            team: 'Individual projects'
        },
        'catchee': {
            title: 'Catchee',
            tags: ['Social Impact', 'App Design', 'User Research'],
            fullDescription: 'Catchee is a location-based social discovery app that helps people find local events and activities based on their interests, making it easier to form meaningful connections in their community.',
            challenges: 'Creating a low-pressure environment that encourages participation without feeling overwhelming or forced.',
            outcomes: 'Designed and tested a prototype that showed 72% of users felt more confident attending local events.',
            technologies: ['Figma', 'Flutter', 'Google Maps API', 'Firebase'],
            timeline: '3 months (Semester 3)',
            team: '3 team members'
        },
        'tomra': {
            title: 'Tomra',
            tags: ['Sustainability', 'Smart Disassembly', 'Circular Economy'],
            fullDescription: 'An innovative smart disassembly system for can recycling that automates sorting and material recovery, improving recycling efficiency and reducing waste.',
            challenges: 'Designing a system that can identify and sort multiple can types while being cost-effective for implementation.',
            outcomes: 'Created a working prototype that increased sorting accuracy by 40% compared to traditional methods.',
            technologies: ['Computer Vision', 'Arduino', 'Python', 'Mechanical Design'],
            timeline: '4 months (Semester 4)',
            team: '4 team members'
        }
    };
    
    const project = projectDetails[projectId];
    
    if (project) {
        const modalHTML = `
            <h2 class="modal-project-title">${project.title}</h2>
            <div class="modal-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            
            <div class="modal-video-placeholder">
                <p>🎥 Video demo is currently being prepared</p>
                <p style="font-size: 12px; margin-top: 10px;">Check back soon for the full video walkthrough!</p>
            </div>
            
            <div class="modal-section">
                <h4>📖 Project Overview</h4>
                <p>${project.fullDescription}</p>
            </div>
            
            <div class="modal-section">
                <h4>⚠️ Challenges</h4>
                <p>${project.challenges}</p>
            </div>
            
            <div class="modal-section">
                <h4>🏆 Outcomes & Impact</h4>
                <p>${project.outcomes}</p>
            </div>
            
            <div class="modal-section">
                <h4>🛠️ Technologies Used</h4>
                <ul>
                    ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>⏱️ Timeline</h4>
                <p>${project.timeline}</p>
            </div>
            
            <div class="modal-section">
                <h4>👥 Team</h4>
                <p>${project.team}</p>
            </div>
        `;
        
        modalCache[projectId] = modalHTML;
        document.getElementById('modal-body').innerHTML = modalHTML;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

if (closeModal) {
    closeModal.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Video coming soon alert
const videoLinks = document.querySelectorAll('.video-coming-soon');
videoLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('🎥 Video demo is currently being recorded!\n\nCheck back soon for the full project walkthrough.');
    });
});