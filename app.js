// Global application state and utilities
class SparkLeapApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupNavigation();
        this.setupResponsiveMenu();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('sparkleap_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateNavigationForLoggedInUser();
        }
    }

    updateNavigationForLoggedInUser() {
        const navButtons = document.getElementById('navButtons');
        const dashboardLink = document.getElementById('dashboardLink');
        
        if (this.currentUser && navButtons) {
            navButtons.innerHTML = `
                <div class="user-menu">
                    <span id="userName">${this.currentUser.name}</span>
                    <button id="logoutBtn" class="btn-secondary">Logout</button>
                </div>
            `;
            
            // Add logout functionality
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
            });
        }

        // Show dashboard link if user is logged in
        if (this.currentUser && dashboardLink) {
            dashboardLink.style.display = 'inline-block';
        } else if (dashboardLink) {
            dashboardLink.style.display = 'none';
        }
    }

    logout() {
        localStorage.removeItem('sparkleap_user');
        localStorage.removeItem('sparkleap_projects');
        localStorage.removeItem('sparkleap_mentors');
        localStorage.removeItem('sparkleap_subscription');
        
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    setupNavigation() {
        // Handle navigation link active states
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupResponsiveMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    }

    // Utility methods
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        switch (type) {
            case 'success':
                notification.style.backgroundColor = 'var(--success-500)';
                break;
            case 'error':
                notification.style.backgroundColor = 'var(--error-500)';
                break;
            case 'warning':
                notification.style.backgroundColor = 'var(--warning-500)';
                break;
            default:
                notification.style.backgroundColor = 'var(--primary-500)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Data management
    saveUserProjects(projects) {
        localStorage.setItem('sparkleap_projects', JSON.stringify(projects));
    }

    getUserProjects() {
        const projects = localStorage.getItem('sparkleap_projects');
        return projects ? JSON.parse(projects) : [];
    }

    saveUserMentors(mentors) {
        localStorage.setItem('sparkleap_mentors', JSON.stringify(mentors));
    }

    getUserMentors() {
        const mentors = localStorage.getItem('sparkleap_mentors');
        return mentors ? JSON.parse(mentors) : [];
    }

    saveSubscription(plan) {
        localStorage.setItem('sparkleap_subscription', JSON.stringify(plan));
    }

    getSubscription() {
        const subscription = localStorage.getItem('sparkleap_subscription');
        return subscription ? JSON.parse(subscription) : { plan: 'free', status: 'active' };
    }

    // Animation utilities
    animateElement(element, animation) {
        element.style.animation = animation;
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, { once: true });
    }

    // Loading state management
    showLoading(element) {
        element.classList.add('loading');
        element.style.position = 'relative';
    }

    hideLoading(element) {
        element.classList.remove('loading');
    }
}

// Initialize the app
const sparkLeapApp = new SparkLeapApp();

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-top: none;
        flex-direction: column;
        padding: var(--space-lg);
        gap: var(--space-lg);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);