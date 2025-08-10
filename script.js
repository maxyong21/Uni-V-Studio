// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initTypewriter();
    initScrollIndicator();
    initNavbarScroll();
    initPortfolioFilter();
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                
                // Add stagger animation for portfolio items and service cards
                if (entry.target.classList.contains('portfolio-item') || 
                    entry.target.classList.contains('service-card')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.portfolio-item, .service-card, .contact-info, .contact-form, .section-header'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Validate form
        if (validateForm(formObject)) {
            // Show success message
            showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showMessage('Please fill in all required fields.', 'error');
        }
    });
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Check if required field is empty
    if (!value) {
        field.classList.add('error');
        return false;
    }
    
    // Validate email
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    return true;
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Add styles
    messageEl.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    // Insert message
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(messageEl, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const texts = [
        'Full Stack Developer',
        'Frontend Specialist', 
        'Backend Engineer',
        'UI/UX Enthusiast',
        'Problem Solver'
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
        const currentText = texts[currentTextIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            typeSpeed = 200; // Pause before new text
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrolled > windowHeight * 0.1) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background on scroll
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Portfolio Filter (if needed for future expansion)
function initPortfolioFilter() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add hover effects for better interactivity
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Recalculate any position-dependent elements
    const mobileMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}, 250));

// Add loading animation when page loads
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger any entrance animations
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 0.8s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Enhanced floating animation for hero elements
function initFloatingAnimation() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            card.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 500));
    });
}

// Initialize floating animation
setTimeout(initFloatingAnimation, 2000);

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .navbar {
        transition: all 0.3s ease;
    }
    
    .hero-text {
        opacity: 1;
        transform: translateY(0);
    }
    
    .loading {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .loading.loaded {
        opacity: 1;
        transform: translateY(0);
    }
    
    .portfolio-item {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);