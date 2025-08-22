// Authentication functionality
class AuthManager {
    constructor() {
        this.setupAuthForms();
    }

    setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Simple validation
        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Check if user exists (simple demo logic)
        const existingUsers = JSON.parse(localStorage.getItem('sparkleap_users') || '[]');
        const user = existingUsers.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            this.loginUser(user, remember);
        } else {
            this.showError('Invalid email or password');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');
        const terms = formData.get('terms');

        // Validation
        if (!fullName || !email || !password || !role) {
            this.showError('Please fill in all fields');
            return;
        }

        if (!terms) {
            this.showError('Please accept the terms and conditions');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('sparkleap_users') || '[]');
        if (existingUsers.find(u => u.email === email)) {
            this.showError('An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: fullName,
            email: email,
            password: password,
            role: role,
            joinedDate: new Date().toISOString(),
            subscription: { plan: 'free', status: 'active' },
            projects: [],
            mentors: [],
            certifications: 0
        };

        // Save user
        existingUsers.push(newUser);
        localStorage.setItem('sparkleap_users', JSON.stringify(existingUsers));

        // Login the new user
        this.loginUser(newUser);
    }

    loginUser(user, remember = false) {
        // Store current user
        localStorage.setItem('sparkleap_user', JSON.stringify(user));
        
        // Store subscription
        localStorage.setItem('sparkleap_subscription', JSON.stringify(user.subscription));
        
        // Store user projects and mentors
        localStorage.setItem('sparkleap_projects', JSON.stringify(user.projects || []));
        localStorage.setItem('sparkleap_mentors', JSON.stringify(user.mentors || []));

        if (remember) {
            localStorage.setItem('sparkleap_remember', 'true');
        }

        // Show success message
        this.showSuccess(`Welcome ${user.role === 'student' ? 'back' : 'to SparkLeap'}, ${user.name}!`);

        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message auth-message-${type}`;
        messageElement.textContent = message;
        
        messageElement.style.cssText = `
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            animation: slideDown 0.3s ease-out;
        `;

        if (type === 'error') {
            messageElement.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            messageElement.style.color = '#ef4444';
            messageElement.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        } else if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            messageElement.style.color = '#10b981';
            messageElement.style.border = '1px solid rgba(16, 185, 129, 0.2)';
        }

        // Insert message
        const authForm = document.querySelector('.auth-form');
        authForm.insertBefore(messageElement, authForm.firstChild);

        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 3000);
        }
    }
}

// Demo account functionality
function fillDemoAccount(type) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (type === 'student') {
        emailInput.value = 'student@demo.com';
        passwordInput.value = 'demo123';
        
        // Create demo student if it doesn't exist
        createDemoUser({
            name: 'Alex Student',
            email: 'student@demo.com',
            password: 'demo123',
            role: 'student'
        });
    } else if (type === 'mentor') {
        emailInput.value = 'mentor@demo.com';
        passwordInput.value = 'demo123';
        
        // Create demo mentor if it doesn't exist
        createDemoUser({
            name: 'Sarah Mentor',
            email: 'mentor@demo.com',
            password: 'demo123',
            role: 'mentor'
        });
    }
    
    // Add visual feedback
    emailInput.style.animation = 'pulse 0.3s ease-out';
    passwordInput.style.animation = 'pulse 0.3s ease-out';
}

function createDemoUser(userData) {
    const existingUsers = JSON.parse(localStorage.getItem('sparkleap_users') || '[]');
    
    // Check if demo user already exists
    if (!existingUsers.find(u => u.email === userData.email)) {
        const demoUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            joinedDate: new Date().toISOString(),
            subscription: { plan: 'pro', status: 'active' },
            projects: userData.role === 'student' ? [
                {
                    id: '1',
                    title: 'E-commerce Website Development',
                    company: 'TechCorp',
                    status: 'in_progress',
                    progress: 65,
                    enrolledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '2',
                    title: 'Mobile App UI/UX Design',
                    company: 'DesignHub',
                    status: 'completed',
                    progress: 100,
                    enrolledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ] : [],
            mentors: userData.role === 'student' ? [
                {
                    id: '1',
                    name: 'Dr. Emily Watson',
                    company: 'Google',
                    connectedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                }
            ] : [],
            certifications: userData.role === 'student' ? 1 : 0
        };
        
        existingUsers.push(demoUser);
        localStorage.setItem('sparkleap_users', JSON.stringify(existingUsers));
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize auth manager
const authManager = new AuthManager();