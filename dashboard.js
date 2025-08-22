// Dashboard functionality
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        if (this.currentUser) {
            this.updateWelcomeMessage();
            this.updateStats();
            this.loadUserProjects();
            this.updateSubscriptionBadge();
            this.loadActivityFeed();
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        }
    }

    loadUser() {
        const userData = localStorage.getItem('sparkleap_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    updateWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        const userName = document.getElementById('userName');
        
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${this.currentUser.name}!`;
        }
        
        if (userName) {
            userName.textContent = this.currentUser.name;
        }
    }

    updateStats() {
        const userProjects = sparkLeapApp.getUserProjects();
        const userMentors = sparkLeapApp.getUserMentors();
        
        const enrolledCount = userProjects.length;
        const completedCount = userProjects.filter(p => p.status === 'completed').length;
        const certifications = this.currentUser.certifications || completedCount;
        const mentorConnections = userMentors.length;

        // Update stat elements
        this.updateStatElement('enrolledProjects', enrolledCount);
        this.updateStatElement('completedProjects', completedCount);
        this.updateStatElement('certifications', certifications);
        this.updateStatElement('mentorConnections', mentorConnections);
    }

    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Animate the number count
            this.animateNumber(element, parseInt(element.textContent) || 0, value, 1000);
        }
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        
        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.round(start + (difference * progress));
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    updateSubscriptionBadge() {
        const subscriptionBadge = document.getElementById('subscriptionBadge');
        const subscription = sparkLeapApp.getSubscription();
        
        if (subscriptionBadge) {
            const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
            subscriptionBadge.innerHTML = `<span>${planName} Plan</span>`;
            
            // Update badge styling based on plan
            subscriptionBadge.className = 'subscription-badge';
            if (subscription.plan === 'pro') {
                subscriptionBadge.style.background = 'var(--secondary-600)';
            } else if (subscription.plan === 'premium') {
                subscriptionBadge.style.background = 'var(--accent-600)';
            }
        }
    }

    loadUserProjects() {
        const userProjects = sparkLeapApp.getUserProjects();
        const projectsContainer = document.getElementById('userProjects');
        
        if (!projectsContainer) return;
        
        if (userProjects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No projects yet</h3>
                    <p>Start your first project to begin your learning journey</p>
                    <a href="projects.html" class="btn-primary">Browse Projects</a>
                </div>
            `;
            return;
        }

        // Display user projects
        projectsContainer.innerHTML = userProjects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-company">${project.company}</div>
                    <h3 class="project-title">${project.title}</h3>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                    <span class="progress-text">${project.progress}% Complete</span>
                </div>
                <div class="project-status">
                    <span class="status-badge status-${project.status}">${this.formatStatus(project.status)}</span>
                </div>
                <div class="project-actions">
                    <button class="btn-primary btn-small" onclick="continueProject('${project.id}')">
                        ${project.status === 'completed' ? 'View Details' : 'Continue'}
                    </button>
                </div>
            </div>
        `).join('');

        // Add progress bar styles
        this.addProgressBarStyles();
    }

    addProgressBarStyles() {
        if (document.getElementById('progress-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'progress-styles';
        style.textContent = `
            .project-progress {
                margin: var(--space-md) 0;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: var(--bg-secondary);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: var(--space-sm);
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
                border-radius: 4px;
                transition: width 0.5s ease-out;
            }
            
            .progress-text {
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
            }
            
            .project-status {
                margin: var(--space-md) 0;
            }
            
            .status-badge {
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                font-weight: 500;
            }
            
            .status-not_started {
                background: var(--gray-700);
                color: var(--gray-300);
            }
            
            .status-in_progress {
                background: var(--warning-500);
                color: white;
            }
            
            .status-completed {
                background: var(--success-500);
                color: white;
            }
            
            .project-actions {
                margin-top: var(--space-md);
            }
        `;
        document.head.appendChild(style);
    }

    formatStatus(status) {
        const statusMap = {
            'not_started': 'Not Started',
            'in_progress': 'In Progress',
            'completed': 'Completed'
        };
        return statusMap[status] || status;
    }

    loadActivityFeed() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;

        const userProjects = sparkLeapApp.getUserProjects();
        const activities = [];

        // Add project-based activities
        userProjects.forEach(project => {
            if (project.enrolledDate) {
                activities.push({
                    type: 'project_enrolled',
                    message: `Started project: <strong>${project.title}</strong>`,
                    date: new Date(project.enrolledDate),
                    icon: '🚀'
                });
            }
            
            if (project.completedDate) {
                activities.push({
                    type: 'project_completed',
                    message: `Completed project: <strong>${project.title}</strong>`,
                    date: new Date(project.completedDate),
                    icon: '🎉'
                });
            }
        });

        // Add mentor connections
        const userMentors = sparkLeapApp.getUserMentors();
        userMentors.forEach(mentor => {
            if (mentor.connectedDate) {
                activities.push({
                    type: 'mentor_connected',
                    message: `Connected with mentor: <strong>${mentor.name}</strong>`,
                    date: new Date(mentor.connectedDate),
                    icon: '👥'
                });
            }
        });

        // Add welcome activity if no other activities
        if (activities.length === 0) {
            activities.push({
                type: 'welcome',
                message: `<strong>Welcome to SparkLeap!</strong>`,
                date: new Date(this.currentUser.joinedDate),
                icon: '🎉'
            });
        }

        // Sort activities by date (most recent first)
        activities.sort((a, b) => b.date - a.date);

        // Display activities
        activityFeed.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">${this.formatRelativeTime(activity.date)}</span>
                </div>
            </div>
        `).join('');
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
}

// Global function for continuing projects
function continueProject(projectId) {
    const userProjects = sparkLeapApp.getUserProjects();
    const project = userProjects.find(p => p.id === projectId);
    
    if (project) {
        if (project.status === 'completed') {
            sparkLeapApp.showNotification(`Viewing details for completed project: ${project.title}`, 'info');
        } else {
            sparkLeapApp.showNotification(`Continuing project: ${project.title}`, 'success');
            // In a real app, this would navigate to the project workspace
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});