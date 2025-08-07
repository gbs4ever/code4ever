// Import CSS
import './styles.css';

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
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
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

        // Simulate form submission
        showNotification("Thank you for your message! We'll get back to you soon.", 'success');
        this.reset();
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
        const target = parseInt(originalText.replace(/[^0-9]/g, ''));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (hasPercent) {
                    counter.textContent = target + ' %';
                } else if (hasDollar && hasK) {
                    counter.textContent = '$' + target + 'K';
                } else {
                    counter.textContent = target + '+';
                }
                clearInterval(timer);
            } else {
                if (hasPercent) {
                    counter.textContent = Math.floor(current) + ' %';
                } else if (hasDollar && hasK) {
                    counter.textContent = '$' + Math.floor(current) + 'K';
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
    let current = 0;
    let flashing = false;

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
                    flashing = false;
                    current = 0;
                    activateStep(current);
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
            flashDoneAndRestart();
        }
    }

    activateStep(current);
    setInterval(nextStep, 2000);
});

document.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth <= 600) {
        var heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            // Add margin for better visibility
            heroImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            heroImage.style.marginTop = '100px';
        }
    }
});
