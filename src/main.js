// Import CSS
import './styles.css';

// Import analytics
import analytics from './analytics.js';
import {
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackSectionView,
    trackConversion
} from './analytics.js';

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger menu
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Track navigation click
        trackNavigation(this.textContent.trim(), this.getAttribute('href'));

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = '#020617';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = '#020617';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Track form submission
        trackFormSubmission('contact_form', {
            businessType: 'unknown',
            userIntent: 'contact'
        });
        
        // Track conversion
        trackConversion('lead', 100);
        
        // Submit to Netlify
        const data = new URLSearchParams(formData);
        data.append('form-name', 'contact');
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
        })
        .then(response => {
            if (response.status === 200) {
                showNotification("Thank you for your message! We'll get back to you soon.", 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        })
        .catch(() => {
            showNotification('Failed to send message. Please try again.', 'error');
        });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Automation completion popup
function showAutomationPopup() {
    // Remove existing popup
    const existingPopup = document.querySelector('.automation-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'automation-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>You Just Saved $50K!</h3>
            <button class="popup-close" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;

    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;

    // Style popup content
    const popupContent = popup.querySelector('.popup-content');
    popupContent.style.cssText = `
        background: #1e293b;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 2px solid #00d4ff;
        color: white;
        max-width: 400px;
        width: 90%;
        animation: slideIn 0.5s ease;
    `;

    // Style popup icon
    const popupIcon = popup.querySelector('.popup-icon i');
    popupIcon.style.cssText = `
        font-size: 3rem;
        color: #00d4ff;
        margin-bottom: 1rem;
        animation: bounce 1s ease;
    `;

    // Style popup text
    const popupH3 = popup.querySelector('h3');
    popupH3.style.cssText = `
        color: #ffffff;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    `;

    // Style close button
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.style.cssText = `
        background: #00d4ff;
        color: #020617;
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    closeBtn.onmouseover = () => {
        closeBtn.style.background = '#0099ff';
        closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.background = '#00d4ff';
        closeBtn.style.transform = 'scale(1)';
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: scale(0.7) translateY(-50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(popup);

    // Auto-close after 2 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 2000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.service-card, .industry-card, .skill-item, .stat'
    );

    animateElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach((counter) => {
        const originalText = counter.textContent;
        const hasPercent = originalText.includes('%');
        const hasDollar = originalText.includes('$');
        const hasK = originalText.includes('K');
        const hasPlus = originalText.includes('+');
        const target = parseInt(originalText.replace(/[^0-9]/g, ''));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (hasPercent) {
                    counter.textContent = target + ' %';
                } else if (hasDollar && hasK) {
                    counter.textContent = '$' + target + 'K' + (hasPlus ? '+' : '');
                } else {
                    counter.textContent = target + '+';
                }
                clearInterval(timer);
            } else {
                if (hasPercent) {
                    counter.textContent = Math.floor(current) + ' %';
                } else if (hasDollar && hasK) {
                    counter.textContent = '$' + Math.floor(current) + 'K' + (hasPlus ? '+' : '');
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }
        }, 20);
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.workflow-step');
    const heroImage = document.querySelector('.hero-image');
    let current = 0;
    let flashing = false;
    let hasHoveredDuringWorkflow = false;
    
    // Set flag to true if hovering over hero image anytime during workflow
    if (heroImage) {
        heroImage.addEventListener('mouseenter', () => {
            hasHoveredDuringWorkflow = true;
        });
    }

    function activateStep(index) {
        steps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            const status = step.querySelector('.step-status');
            const icon = step.querySelector('.step-icon');
            // Reset status text and icon for all steps
            if (status) {
                if (i === 0) status.innerHTML = 'Processing...';
                else if (i === 1) status.innerHTML = 'Waiting...';
                else if (i === 2) status.innerHTML = 'Waiting...';
                status.classList.remove('flash-green');
            }
            if (icon) {
                // Restore original icons
                if (i === 0) icon.innerHTML = '<i class="fas fa-file-alt"></i>';
                else if (i === 1) icon.innerHTML = '<i class="fas fa-cogs"></i>';
                else if (i === 2) icon.innerHTML = '<i class="fas fa-chart-line"></i>';
                icon.classList.remove('big-green-check');
            }
            if (i < index) {
                step.classList.add('completed');
            } else if (i === index) {
                step.classList.add('active');
                // If it's the Results step, show big green check and flash
                if (i === 2 && status && icon) {
                    status.innerHTML = '<i class="fas fa-check-circle"></i> Done';
                    status.classList.add('flash-green');
                    icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    icon.classList.add('big-green-check');
                }
                // Restart icon animation by reflow
                if (icon) {
                    icon.style.animation = 'none';
                    void icon.offsetWidth;
                    icon.style.animation = '';
                }
            }
        });
    }

    function flashDoneAndRestart() {
        flashing = true;
        const resultsStep = steps[2];
        const status = resultsStep.querySelector('.step-status');
        let flashes = 0;
        function doFlash() {
            if (!status) return;
            status.classList.add('flash-green');
            setTimeout(() => {
                status.classList.remove('flash-green');
                flashes++;
                if (flashes < 3) {
                    setTimeout(doFlash, 200);
                } else {
                    // Wait for popup to close (2 seconds) before restarting
                    setTimeout(() => {
                        flashing = false;
                        current = 0;
                        activateStep(current);
                    }, 2000);
                }
            }, 200);
        }
        doFlash();
    }

    function nextStep() {
        if (flashing) return;
        current++;
        if (current < steps.length) {
            activateStep(current);
        } else {
            // Flash "Done" 3 times in green with check, then restart
            const resultsStep = steps[2];
            const status = resultsStep.querySelector('.step-status');
            if (status) {
                status.innerHTML = '<i class="fas fa-check-circle"></i> Done';
            }
            // Show popup if there was any hover during the workflow
            if (hasHoveredDuringWorkflow) {
                showAutomationPopup();
                hasHoveredDuringWorkflow = false; // Reset for next cycle
            }
            flashDoneAndRestart();
        }
    }

    activateStep(current);
    setInterval(nextStep, 2000);
});

// Initialize analytics and tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize analytics
    analytics.init();
    
    // Track page load
    analytics.trackPageView(window.location.pathname);
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const section = this.closest('section')?.id || 'unknown';
            trackButtonClick(buttonText, section);
        });
    });
    
    // Track section visibility for engagement
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id;
                    trackSectionView(sectionName);
                }
            });
        },
        {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        }
    );
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Set user properties for better segmentation
    analytics.setUserProperties({
        businessType: 'website_visitor',
        userIntent: 'browsing',
        pageType: 'business_website'
    });
    
    if (window.innerWidth <= 600) {
        var heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            // Add margin for better visibility
            heroImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            heroImage.style.marginTop = '100px';
        }
    }
});
