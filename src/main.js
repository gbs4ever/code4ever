// Fonts (self-hosted, bundled, latin subset only)
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';

// Import CSS
import './styles.css';

// Import analytics
import analytics from './analytics.js';
import {
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackSectionView,
    trackConversion,
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
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.35)';
    } else {
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
            userIntent: 'contact',
        });

        // Track conversion
        trackConversion('lead', 100);

        // Submit to Netlify
        const data = new URLSearchParams(formData);
        data.append('form-name', 'contact');
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString(),
        })
            .then((response) => {
                if (response.status === 200) {
                    showNotification(
                        "Thank you for your message! We'll get back to you soon.",
                        'success'
                    );
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

// Initialize analytics and tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize analytics
    analytics.init();

    // Track page load
    analytics.trackPageView(window.location.pathname);

    // Track button clicks
    document.querySelectorAll('.btn').forEach((button) => {
        button.addEventListener('click', function () {
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
            rootMargin: '0px 0px -100px 0px',
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    // Set user properties for better segmentation
    analytics.setUserProperties({
        businessType: 'website_visitor',
        userIntent: 'browsing',
        pageType: 'business_website',
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
