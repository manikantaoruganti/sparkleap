// Projects page functionality
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupFilters();
        this.renderProjects();
        this.updateNavForAuth();
    }

    updateNavForAuth() {
        const currentUser = JSON.parse(localStorage.getItem('sparkleap_user') || 'null');
        const navButtons = document.getElementById('navButtons');
        const dashboardLink = document.getElementById('dashboardLink');
        
        if (currentUser && navButtons) {
            navButtons.innerHTML = `
                <div class="user-menu">
                    <span>${currentUser.name}</span>
                    <button onclick="sparkLeapApp.logout()" class="btn-secondary">Logout</button>
                </div>
            `;
        }
        
        if (currentUser && dashboardLink) {
            dashboardLink.style.display = 'inline-block';
        } else if (dashboardLink) {
            dashboardLink.style.display = 'none';
        }
    }

    loadProjects() {
        // Sample project data
        this.projects = [
            {
                id: '1',
                title: 'E-commerce Website Development',
                company: 'TechCorp Solutions',
                description: 'Build a full-stack e-commerce platform using React and Node.js. Implement user authentication, product catalog, shopping cart, and payment integration.',
                difficulty: 'intermediate',
                category: 'technology',
                tags: ['React', 'Node.js', 'JavaScript', 'E-commerce', 'Full-stack'],
                mentor: 'Dr. Sarah Chen',
                duration: '8-10 weeks',
                enrolled: 1250,
                rating: 4.8
            },
            {
                id: '2',
                title: 'Mobile App UI/UX Design',
                company: 'DesignHub Agency',
                description: 'Design a complete mobile application interface for a fitness tracking app. Focus on user experience, accessibility, and modern design principles.',
                difficulty: 'beginner',
                category: 'design',
                tags: ['UI/UX', 'Figma', 'Mobile Design', 'Prototyping'],
                mentor: 'James Rodriguez',
                duration: '6-8 weeks',
                enrolled: 890,
                rating: 4.9
            },
            {
                id: '3',
                title: 'Data Analytics Dashboard',
                company: 'DataViz Inc',
                description: 'Create an interactive dashboard for business intelligence using Python, Pandas, and Tableau. Analyze large datasets and present insights effectively.',
                difficulty: 'advanced',
                category: 'technology',
                tags: ['Python', 'Data Analysis', 'Tableau', 'SQL', 'Business Intelligence'],
                mentor: 'Dr. Emily Watson',
                duration: '10-12 weeks',
                enrolled: 675,
                rating: 4.7
            },
            {
                id: '4',
                title: 'Social Media Marketing Campaign',
                company: 'GrowthMarketing Pro',
                description: 'Develop and execute a comprehensive social media marketing strategy for a startup. Include content creation, audience analysis, and performance tracking.',
                difficulty: 'intermediate',
                category: 'marketing',
                tags: ['Social Media', 'Content Strategy', 'Analytics', 'Campaign Management'],
                mentor: 'Maria Santos',
                duration: '6-8 weeks',
                enrolled: 1100,
                rating: 4.6
            },
            {
                id: '5',
                title: 'Financial Planning App',
                company: 'FinTech Innovations',
                description: 'Build a personal finance management application with budget tracking, expense categorization, and financial goal setting features.',
                difficulty: 'advanced',
                category: 'technology',
                tags: ['React Native', 'Financial APIs', 'Chart.js', 'Authentication'],
                mentor: 'David Kim',
                duration: '12-14 weeks',
                enrolled: 432,
                rating: 4.9
            },
            {
                id: '6',
                title: 'Brand Identity Design',
                company: 'Creative Studio X',
                description: 'Create a complete brand identity package including logo design, color palette, typography, and brand guidelines for a sustainable fashion startup.',
                difficulty: 'intermediate',
                category: 'design',
                tags: ['Branding', 'Logo Design', 'Adobe Creative Suite', 'Brand Guidelines'],
                mentor: 'Alex Thompson',
                duration: '4-6 weeks',
                enrolled: 768,
                rating: 4.8
            },
            {
                id: '7',
                title: 'Business Plan Development',
                company: 'Startup Accelerator',
                description: 'Develop a comprehensive business plan for a tech startup including market analysis, financial projections, and go-to-market strategy.',
                difficulty: 'intermediate',
                category: 'business',
                tags: ['Business Strategy', 'Market Research', 'Financial Modeling', 'Pitch Deck'],
                mentor: 'Jennifer Lee',
                duration: '8-10 weeks',
                enrolled: 543,
                rating: 4.5
            },
            {
                id: '8',
                title: 'Machine Learning Model',
                company: 'AI Research Lab',
                description: 'Build and train a machine learning model for image classification using TensorFlow. Include data preprocessing, model training, and evaluation.',
                difficulty: 'advanced',
                category: 'technology',
                tags: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Computer Vision'],
                mentor: 'Dr. Robert Chang',
                duration: '10-12 weeks',
                enrolled: 321,
                rating: 4.9
            },
            {
                id: '9',
                title: 'Content Marketing Strategy',
                company: 'Digital Content Agency',
                description: 'Create a content marketing strategy for B2B SaaS company including blog content, email campaigns, and lead generation tactics.',
                difficulty: 'beginner',
                category: 'marketing',
                tags: ['Content Marketing', 'SEO', 'Email Marketing', 'Lead Generation'],
                mentor: 'Lisa Park',
                duration: '6-8 weeks',
                enrolled: 987,
                rating: 4.7
            },
            {
                id: '10',
                title: 'Supply Chain Optimization',
                company: 'LogiTech Solutions',
                description: 'Analyze and optimize supply chain processes for a manufacturing company using data analysis and process improvement methodologies.',
                difficulty: 'advanced',
                category: 'business',
                tags: ['Operations', 'Data Analysis', 'Process Improvement', 'Supply Chain'],
                mentor: 'Michael Brown',
                duration: '10-12 weeks',
                enrolled: 234,
                rating: 4.6
            }
        ];

        this.filteredProjects = [...this.projects];
    }

    setupFilters() {
        const difficultyFilter = document.getElementById('difficultyFilter');
        const categoryFilter = document.getElementById('categoryFilter');

        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => this.filterProjects());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProjects());
        }
    }

    filterProjects() {
        const difficultyFilter = document.getElementById('difficultyFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;

        this.filteredProjects = this.projects.filter(project => {
            const matchesDifficulty = !difficultyFilter || project.difficulty === difficultyFilter;
            const matchesCategory = !categoryFilter || project.category === categoryFilter;
            return matchesDifficulty && matchesCategory;
        });

        this.renderProjects();
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        if (this.filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🔍</div>
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters to see more projects</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = this.filteredProjects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-company">${project.company}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
                
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                
                <div class="project-meta">
                    <span class="difficulty-badge difficulty-${project.difficulty}">
                        ${project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                    </span>
                    <span class="project-mentor">👨‍🏫 ${project.mentor}</span>
                </div>
                
                <div class="project-stats">
                    <div class="stat-item">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-text">${project.duration}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">👥</span>
                        <span class="stat-text">${project.enrolled.toLocaleString()} enrolled</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-text">${project.rating}</span>
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="btn-primary btn-full" onclick="startProject('${project.id}')">
                        Start Project
                    </button>
                </div>
            </div>
        `).join('');

        // Add project stats styles
        this.addProjectStyles();
    }

    addProjectStyles() {
        if (document.getElementById('project-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'project-styles';
        style.textContent = `
            .project-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: var(--space-lg) 0;
                padding-top: var(--space-md);
                border-top: 1px solid var(--border-color);
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
            }
            
            .stat-icon {
                font-size: var(--font-size-sm);
            }
            
            .project-actions {
                margin-top: var(--space-lg);
            }
        `;
        document.head.appendChild(style);
    }

    startProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const currentUser = JSON.parse(localStorage.getItem('sparkleap_user') || 'null');
        
        if (!currentUser) {
            sparkLeapApp.showNotification('Please log in to start projects', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        // Check if user already enrolled in this project
        const userProjects = sparkLeapApp.getUserProjects();
        const existingProject = userProjects.find(p => p.id === projectId);
        
        if (existingProject) {
            sparkLeapApp.showNotification(`You are already enrolled in "${project.title}"`, 'info');
            return;
        }

        // Add project to user's enrolled projects
        const newUserProject = {
            id: projectId,
            title: project.title,
            company: project.company,
            status: 'not_started',
            progress: 0,
            enrolledDate: new Date().toISOString(),
            difficulty: project.difficulty,
            mentor: project.mentor
        };

        userProjects.push(newUserProject);
        sparkLeapApp.saveUserProjects(userProjects);

        sparkLeapApp.showNotification(`Successfully enrolled in "${project.title}"!`, 'success');
        
        // Update the button to show enrollment
        const button = event.target;
        button.textContent = 'Enrolled ✓';
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
        button.disabled = true;
    }
}

// Global function for starting projects
function startProject(projectId) {
    if (window.projectsManager) {
        window.projectsManager.startProject(projectId);
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsManager = new ProjectsManager();
});