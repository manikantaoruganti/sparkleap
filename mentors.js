// Mentors page functionality
class MentorsManager {
    constructor() {
        this.mentors = [];
        this.filteredMentors = [];
        this.init();
    }

    init() {
        this.loadMentors();
        this.setupFilters();
        this.renderMentors();
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

    loadMentors() {
        // Sample mentor data
        this.mentors = [
            {
                id: '1',
                name: 'Dr. Sarah Chen',
                title: 'Senior Product Manager',
                company: 'Google',
                avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Product management expert with 10+ years at top tech companies. Specializes in AI/ML products and user experience design. Has mentored 200+ students.',
                expertise: ['Product Management', 'AI/ML', 'User Experience', 'Strategy'],
                experience: 'senior',
                rating: 4.9,
                sessions: 150,
                students: 89,
                languages: ['English', 'Mandarin']
            },
            {
                id: '2',
                name: 'Marcus Rodriguez',
                title: 'Full Stack Engineer',
                company: 'Netflix',
                avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Full-stack developer with expertise in modern web technologies. Former startup founder and current tech lead at Netflix. Passionate about teaching.',
                expertise: ['JavaScript', 'React', 'Node.js', 'System Design'],
                experience: 'senior',
                rating: 4.8,
                sessions: 120,
                students: 65,
                languages: ['English', 'Spanish']
            },
            {
                id: '3',
                name: 'Dr. Emily Watson',
                title: 'VP of Education',
                company: 'Microsoft',
                avatar: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Educational technology leader with PhD in Computer Science. Expert in curriculum design and career development for tech professionals.',
                expertise: ['Education Technology', 'Career Development', 'Leadership', 'Curriculum Design'],
                experience: 'executive',
                rating: 4.9,
                sessions: 200,
                students: 150,
                languages: ['English']
            },
            {
                id: '4',
                name: 'David Kim',
                title: 'Senior UX Designer',
                company: 'Apple',
                avatar: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Award-winning UX designer with focus on mobile and accessible design. Has worked on products used by millions of users worldwide.',
                expertise: ['UX Design', 'Mobile Design', 'Accessibility', 'Design Systems'],
                experience: 'senior',
                rating: 4.7,
                sessions: 95,
                students: 55,
                languages: ['English', 'Korean']
            },
            {
                id: '5',
                name: 'Jennifer Liu',
                title: 'Marketing Director',
                company: 'Spotify',
                avatar: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Digital marketing strategist with expertise in growth hacking and content marketing. Led marketing campaigns that reached 50M+ users.',
                expertise: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'Analytics'],
                experience: 'senior',
                rating: 4.8,
                sessions: 110,
                students: 78,
                languages: ['English', 'Mandarin']
            },
            {
                id: '6',
                name: 'Alex Thompson',
                title: 'Data Science Manager',
                company: 'Airbnb',
                avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Data scientist turned manager with deep expertise in machine learning and statistical analysis. Published researcher in AI conferences.',
                expertise: ['Data Science', 'Machine Learning', 'Statistics', 'Python'],
                experience: 'senior',
                rating: 4.9,
                sessions: 85,
                students: 45,
                languages: ['English']
            },
            {
                id: '7',
                name: 'Maria Santos',
                title: 'Business Development Lead',
                company: 'Salesforce',
                avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'B2B sales and business development expert. Has closed deals worth $100M+ and built sales teams from ground up in multiple startups.',
                expertise: ['Business Development', 'Sales Strategy', 'B2B Sales', 'Team Building'],
                experience: 'senior',
                rating: 4.6,
                sessions: 75,
                students: 42,
                languages: ['English', 'Spanish', 'Portuguese']
            },
            {
                id: '8',
                name: 'Dr. Robert Chang',
                title: 'Chief Technology Officer',
                company: 'Tesla',
                avatar: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Technology executive with 20+ years experience in automotive and aerospace industries. Expert in embedded systems and IoT.',
                expertise: ['Technology Leadership', 'Embedded Systems', 'IoT', 'Automotive Tech'],
                experience: 'executive',
                rating: 4.8,
                sessions: 60,
                students: 30,
                languages: ['English', 'Mandarin']
            },
            {
                id: '9',
                name: 'Lisa Park',
                title: 'Content Marketing Manager',
                company: 'HubSpot',
                avatar: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Content marketing specialist with proven track record in B2B SaaS companies. Expert in SEO, content strategy, and conversion optimization.',
                expertise: ['Content Marketing', 'SEO', 'Copywriting', 'Conversion Optimization'],
                experience: 'mid',
                rating: 4.7,
                sessions: 90,
                students: 60,
                languages: ['English', 'Korean']
            },
            {
                id: '10',
                name: 'James Rodriguez',
                title: 'Brand Designer',
                company: 'Adobe',
                avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Creative director with expertise in brand identity and visual design. Has worked with Fortune 500 companies and award-winning campaigns.',
                expertise: ['Brand Design', 'Visual Identity', 'Creative Direction', 'Typography'],
                experience: 'senior',
                rating: 4.9,
                sessions: 70,
                students: 40,
                languages: ['English', 'Spanish']
            }
        ];

        this.filteredMentors = [...this.mentors];
    }

    setupFilters() {
        const expertiseFilter = document.getElementById('expertiseFilter');
        const experienceFilter = document.getElementById('experienceFilter');

        if (expertiseFilter) {
            expertiseFilter.addEventListener('change', () => this.filterMentors());
        }

        if (experienceFilter) {
            experienceFilter.addEventListener('change', () => this.filterMentors());
        }
    }

    filterMentors() {
        const expertiseFilter = document.getElementById('expertiseFilter').value.toLowerCase();
        const experienceFilter = document.getElementById('experienceFilter').value;

        this.filteredMentors = this.mentors.filter(mentor => {
            const matchesExpertise = !expertiseFilter || 
                mentor.expertise.some(skill => skill.toLowerCase().includes(expertiseFilter));
            const matchesExperience = !experienceFilter || mentor.experience === experienceFilter;
            return matchesExpertise && matchesExperience;
        });

        this.renderMentors();
    }

    renderMentors() {
        const mentorsGrid = document.getElementById('mentorsGrid');
        if (!mentorsGrid) return;

        if (this.filteredMentors.length === 0) {
            mentorsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🔍</div>
                    <h3>No mentors found</h3>
                    <p>Try adjusting your filters to see more mentors</p>
                </div>
            `;
            return;
        }

        mentorsGrid.innerHTML = this.filteredMentors.map(mentor => `
            <div class="mentor-card">
                <div class="mentor-avatar">
                    <img src="${mentor.avatar}" alt="${mentor.name}" loading="lazy">
                </div>
                
                <h3 class="mentor-name">${mentor.name}</h3>
                <div class="mentor-title">${mentor.title}</div>
                <div class="mentor-company">@ ${mentor.company}</div>
                
                <p class="mentor-bio">${mentor.bio}</p>
                
                <div class="mentor-expertise">
                    ${mentor.expertise.map(skill => 
                        `<span class="expertise-tag">${skill}</span>`
                    ).join('')}
                </div>
                
                <div class="mentor-rating">
                    ${this.renderStars(mentor.rating)}
                    <span class="rating-text">${mentor.rating} (${mentor.sessions} sessions)</span>
                </div>
                
                <div class="mentor-stats">
                    <div class="stat-item">
                        <span class="stat-number">${mentor.students}</span>
                        <span class="stat-label">Students Mentored</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${mentor.sessions}</span>
                        <span class="stat-label">Total Sessions</span>
                    </div>
                </div>
                
                <div class="mentor-languages">
                    <strong>Languages:</strong> ${mentor.languages.join(', ')}
                </div>
                
                <button class="btn-primary btn-full" onclick="connectWithMentor('${mentor.id}')">
                    Connect with Mentor
                </button>
            </div>
        `).join('');

        this.addMentorStyles();
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star">⭐</span>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<span class="star half-star">⭐</span>';
        }
        
        return starsHtml;
    }

    addMentorStyles() {
        if (document.getElementById('mentor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'mentor-styles';
        style.textContent = `
            .mentor-stats {
                display: flex;
                justify-content: space-around;
                margin: var(--space-lg) 0;
                padding: var(--space-md) 0;
                border-top: 1px solid var(--border-color);
                border-bottom: 1px solid var(--border-color);
            }
            
            .mentor-stats .stat-item {
                text-align: center;
            }
            
            .stat-number {
                display: block;
                font-size: var(--font-size-lg);
                font-weight: 700;
                color: var(--primary-400);
                margin-bottom: var(--space-xs);
            }
            
            .stat-label {
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
            }
            
            .mentor-languages {
                margin: var(--space-md) 0;
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .mentor-languages strong {
                color: var(--text-primary);
            }
            
            .rating-text {
                margin-left: var(--space-sm);
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    connectWithMentor(mentorId) {
        const mentor = this.mentors.find(m => m.id === mentorId);
        if (!mentor) return;

        const currentUser = JSON.parse(localStorage.getItem('sparkleap_user') || 'null');
        
        if (!currentUser) {
            sparkLeapApp.showNotification('Please log in to connect with mentors', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        // Check if user already connected with this mentor
        const userMentors = sparkLeapApp.getUserMentors();
        const existingConnection = userMentors.find(m => m.id === mentorId);
        
        if (existingConnection) {
            // Show chat interface (dummy)
            this.showChatModal(mentor);
            return;
        }

        // Add mentor to user's connected mentors
        const newConnection = {
            id: mentorId,
            name: mentor.name,
            title: mentor.title,
            company: mentor.company,
            avatar: mentor.avatar,
            connectedDate: new Date().toISOString(),
            expertise: mentor.expertise
        };

        userMentors.push(newConnection);
        sparkLeapApp.saveUserMentors(userMentors);

        sparkLeapApp.showNotification(`Successfully connected with ${mentor.name}!`, 'success');
        
        // Update the button
        const button = event.target;
        button.textContent = 'Connected ✓';
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
        
        // Show chat after connection
        setTimeout(() => {
            this.showChatModal(mentor);
        }, 1500);
    }

    showChatModal(mentor) {
        // Create chat modal (dummy implementation)
        const modal = document.createElement('div');
        modal.className = 'chat-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>Chat with ${mentor.name}</h3>
                        <button class="modal-close" onclick="this.closest('.chat-modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="chat-messages">
                            <div class="message mentor-message">
                                <div class="message-avatar">
                                    <img src="${mentor.avatar}" alt="${mentor.name}">
                                </div>
                                <div class="message-content">
                                    <p>Hi! I'm excited to work with you. What would you like to focus on in our mentorship sessions?</p>
                                    <span class="message-time">Just now</span>
                                </div>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Type your message..." disabled>
                            <button disabled>Send</button>
                        </div>
                        <p class="chat-note">💬 This is a demo chat interface. In the full platform, you would have real-time messaging with your mentor.</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        `;

        document.body.appendChild(modal);
        this.addModalStyles();
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-lg);
            }
            
            .modal-content {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                width: 100%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .modal-header {
                padding: var(--space-lg);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .modal-header h3 {
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: var(--transition-base);
            }
            
            .modal-close:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            .modal-body {
                padding: var(--space-lg);
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                margin-bottom: var(--space-lg);
            }
            
            .message {
                display: flex;
                gap: var(--space-md);
                margin-bottom: var(--space-lg);
            }
            
            .message-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
            }
            
            .message-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .message-content {
                flex: 1;
            }
            
            .message-content p {
                background: var(--bg-secondary);
                padding: var(--space-md);
                border-radius: var(--radius-base);
                margin: 0 0 var(--space-xs) 0;
                line-height: 1.5;
            }
            
            .mentor-message .message-content p {
                background: var(--primary-600);
                color: white;
            }
            
            .message-time {
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
            }
            
            .chat-input {
                display: flex;
                gap: var(--space-sm);
                margin-bottom: var(--space-md);
            }
            
            .chat-input input {
                flex: 1;
                padding: var(--space-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-base);
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            .chat-input button {
                padding: var(--space-md) var(--space-lg);
                background: var(--primary-600);
                color: white;
                border: none;
                border-radius: var(--radius-base);
                cursor: pointer;
            }
            
            .chat-input button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .chat-note {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                text-align: center;
                font-style: italic;
                padding: var(--space-md);
                background: var(--bg-secondary);
                border-radius: var(--radius-base);
            }
        `;
        document.head.appendChild(style);
    }
}

// Global function for connecting with mentors
function connectWithMentor(mentorId) {
    if (window.mentorsManager) {
        window.mentorsManager.connectWithMentor(mentorId);
    }
}

// Initialize mentors manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mentorsManager = new MentorsManager();
});