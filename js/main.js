// Main JavaScript for iPS Consulting Website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileServicesBtn = document.getElementById('mobile-services-btn');
    const mobileServicesMenu = document.getElementById('mobile-services-menu');

    // Toggle mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.maxHeight = '500px';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.style.maxHeight = '0';
            }
            
            // Toggle icon between bars and X
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.style.maxHeight = '0';
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.className = 'fas fa-bars text-xl';
                }
            }
        });
    }

    // Toggle mobile services submenu
    if (mobileServicesBtn && mobileServicesMenu) {
        mobileServicesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = mobileServicesMenu.classList.contains('hidden');
            mobileServicesMenu.classList.toggle('hidden');
            
            // Rotate chevron icon
            const chevron = mobileServicesBtn.querySelector('.fa-chevron-down');
            if (chevron) {
                if (isHidden) {
                    chevron.style.transform = 'rotate(180deg)';
                    chevron.style.transition = 'transform 0.3s ease';
                } else {
                    chevron.style.transform = 'rotate(0deg)';
                    chevron.style.transition = 'transform 0.3s ease';
                }
            }
        });
    }

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');
    if (mobileMenuLinks) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }

    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !message) {
                showFormError('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormError('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simple mailto solution that always works
            const company = contactForm.querySelector('input[name="company"]').value || 'Not provided';
            const service = contactForm.querySelector('select[name="service"]').value || 'General Consultation';
            const timestamp = new Date().toLocaleString();
            
            // Create email content
            const subject = `New Contact Form Submission - ${name}`;
            const body = `
NEW CONTACT FORM SUBMISSION - iPS Global Consulting

FROM: ${name}
EMAIL: ${email}
COMPANY: ${company}
SERVICE INTEREST: ${service}

MESSAGE:
${message}

---
SUBMISSION DETAILS:
Source: Website Contact Form
Timestamp: ${timestamp}
Page URL: ${window.location.href}

This message was generated from the iPS Global Consulting website contact form.
            `.trim();
            
            // Create mailto link
            const mailtoLink = `mailto:info@ipsglobalconsulting.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Store form data for thank you page
            sessionStorage.setItem('contactSubmission', JSON.stringify({
                name: name,
                email: email,
                company: company,
                service: service,
                message: message,
                timestamp: timestamp
            }));
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message and redirect after short delay
            showFormSuccess('Thank you! Your email client is opening with your message pre-filled. Please send the email to complete your inquiry.');
            
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3000);
        });
    }
    
    // Helper function to show form errors
    function showFormError(message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert error message before the form
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        
        // Remove error message after 8 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 8000);
    }
    
    // Helper function to show form success
    function showFormSuccess(message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create and show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-message bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert success message before the form
        contactForm.parentNode.insertBefore(successDiv, contactForm);
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter form, form[action*="newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Create mailto for newsletter signup
            const subject = encodeURIComponent('Newsletter Subscription Request');
            const body = encodeURIComponent(`
Please add the following email to your newsletter:

Email: ${email}

---
Subscribed via iPS Consulting website
            `.trim());
            
            const mailtoLink = `mailto:info@ipsglobalconsulting.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            alert('Thank you for subscribing! Your email client will now open.');
            this.reset();
        });
    }

    // Add active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-600');
            }
        });
    }
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initialize active nav
    updateActiveNav();

    // Handle newsletter button click
    const newsletterBtn = document.querySelector('button[type="submit"]');
    if (newsletterBtn && newsletterBtn.innerHTML.includes('fa-paper-plane')) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = this.parentNode.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Create mailto for newsletter signup
            const subject = encodeURIComponent('Newsletter Subscription Request');
            const body = encodeURIComponent(`
Please add the following email to your newsletter:

Email: ${email}

---
Subscribed via iPS Consulting website
            `.trim());
            
            const mailtoLink = `mailto:info@ipsglobalconsulting.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            alert('Thank you for subscribing! Your email client will now open.');
            emailInput.value = '';
        });
    }
});