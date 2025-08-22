// Pricing page functionality
class PricingManager {
    constructor() {
        this.init();
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

    init() {
        this.updateCurrentPlan();
    }

    updateCurrentPlan() {
        const currentUser = JSON.parse(localStorage.getItem('sparkleap_user') || 'null');
        if (!currentUser) return;

        const subscription = sparkLeapApp.getSubscription();
        const planButtons = document.querySelectorAll('.pricing-card button');
        
        planButtons.forEach(button => {
            const planName = this.getPlanFromButton(button);
            if (planName === subscription.plan) {
                button.textContent = 'Current Plan ✓';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
                button.disabled = true;
            }
        });
    }

    getPlanFromButton(button) {
        const card = button.closest('.pricing-card');
        const planTitle = card.querySelector('.plan-header h3');
        return planTitle.textContent.toLowerCase();
    }
}

// Global function for selecting plans
function selectPlan(planType) {
    const currentUser = JSON.parse(localStorage.getItem('sparkleap_user') || 'null');
    
    if (!currentUser && planType !== 'free') {
        sparkLeapApp.showNotification('Please create an account to select a plan', 'warning');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 1500);
        return;
    }

    if (!currentUser && planType === 'free') {
        sparkLeapApp.showNotification('Please create an account to get started', 'info');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 1500);
        return;
    }

    const currentSubscription = sparkLeapApp.getSubscription();
    
    if (currentSubscription.plan === planType) {
        sparkLeapApp.showNotification(`You are already on the ${planType} plan`, 'info');
        return;
    }

    // Show upgrade/downgrade confirmation
    showPlanChangeModal(planType, currentSubscription.plan);
}

function showPlanChangeModal(newPlan, currentPlan) {
    const planDetails = {
        free: { name: 'Free', price: '$0' },
        pro: { name: 'Pro', price: '$29' },
        premium: { name: 'Premium', price: '$79' }
    };

    const isUpgrade = getPlanLevel(newPlan) > getPlanLevel(currentPlan);
    const actionText = isUpgrade ? 'Upgrade' : (newPlan === 'free' ? 'Downgrade' : 'Change');
    
    const modal = document.createElement('div');
    modal.className = 'plan-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${actionText} Your Plan</h3>
                    <button class="modal-close" onclick="this.closest('.plan-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="plan-change-summary">
                        <div class="plan-change-item">
                            <span class="plan-label">Current Plan:</span>
                            <span class="plan-value">${planDetails[currentPlan].name} (${planDetails[currentPlan].price}/month)</span>
                        </div>
                        <div class="plan-change-arrow">→</div>
                        <div class="plan-change-item">
                            <span class="plan-label">New Plan:</span>
                            <span class="plan-value highlight">${planDetails[newPlan].name} (${planDetails[newPlan].price}/month)</span>
                        </div>
                    </div>
                    
                    <div class="plan-benefits">
                        ${getPlanBenefits(newPlan, currentPlan)}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.plan-modal').remove()">Cancel</button>
                        <button class="btn-primary" onclick="confirmPlanChange('${newPlan}')">
                            Confirm ${actionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    `;

    document.body.appendChild(modal);
    addPlanModalStyles();
}

function getPlanLevel(plan) {
    const levels = { free: 0, pro: 1, premium: 2 };
    return levels[plan] || 0;
}

function getPlanBenefits(newPlan, currentPlan) {
    const benefits = {
        free: ['Access to 3 basic projects', 'Community forum access', 'Basic learning resources'],
        pro: ['Access to all projects', '2 mentor sessions per month', 'Premium learning resources', 'Priority support'],
        premium: ['Everything in Pro', 'Unlimited mentor sessions', '1-on-1 career coaching', 'Job placement assistance']
    };

    const newBenefits = benefits[newPlan] || [];
    const currentBenefits = benefits[currentPlan] || [];
    
    return `
        <div class="benefits-section">
            <h4>You'll gain access to:</h4>
            <ul>
                ${newBenefits.map(benefit => {
                    const isNew = !currentBenefits.includes(benefit);
                    return `<li class="${isNew ? 'new-benefit' : ''}">${isNew ? '✨ ' : '✓ '}${benefit}</li>`;
                }).join('')}
            </ul>
        </div>
    `;
}

function confirmPlanChange(newPlan) {
    const newSubscription = {
        plan: newPlan,
        status: 'active',
        startDate: new Date().toISOString(),
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    sparkLeapApp.saveSubscription(newSubscription);

    // Update user object
    const currentUser = JSON.parse(localStorage.getItem('sparkleap_user'));
    currentUser.subscription = newSubscription;
    localStorage.setItem('sparkleap_user', JSON.stringify(currentUser));

    // Close modal
    document.querySelector('.plan-modal').remove();

    const planName = newPlan.charAt(0).toUpperCase() + newPlan.slice(1);
    sparkLeapApp.showNotification(`Successfully upgraded to ${planName} plan!`, 'success');

    // Update the page
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

function addPlanModalStyles() {
    if (document.getElementById('plan-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'plan-modal-styles';
    style.textContent = `
        .plan-modal .modal-overlay {
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
        
        .plan-modal .modal-content {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .plan-modal .modal-header {
            padding: var(--space-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .plan-modal .modal-header h3 {
            margin: 0;
        }
        
        .plan-modal .modal-close {
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
        
        .plan-modal .modal-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .plan-modal .modal-body {
            padding: var(--space-lg);
            flex: 1;
            overflow-y: auto;
        }
        
        .plan-change-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-xl);
            padding: var(--space-lg);
            background: var(--bg-secondary);
            border-radius: var(--radius-base);
        }
        
        .plan-change-item {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
            flex: 1;
        }
        
        .plan-label {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }
        
        .plan-value {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .plan-value.highlight {
            color: var(--primary-400);
        }
        
        .plan-change-arrow {
            font-size: var(--font-size-xl);
            color: var(--primary-400);
            margin: 0 var(--space-md);
        }
        
        .benefits-section {
            margin-bottom: var(--space-xl);
        }
        
        .benefits-section h4 {
            margin-bottom: var(--space-md);
        }
        
        .benefits-section ul {
            list-style: none;
            padding: 0;
        }
        
        .benefits-section li {
            padding: var(--space-sm) 0;
            color: var(--text-secondary);
        }
        
        .benefits-section li.new-benefit {
            color: var(--primary-400);
            font-weight: 500;
        }
        
        .modal-actions {
            display: flex;
            gap: var(--space-md);
            justify-content: flex-end;
        }
        
        @media (max-width: 480px) {
            .plan-change-summary {
                flex-direction: column;
                gap: var(--space-lg);
                text-align: center;
            }
            
            .plan-change-arrow {
                transform: rotate(90deg);
                margin: 0;
            }
            
            .modal-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize pricing manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PricingManager();
});