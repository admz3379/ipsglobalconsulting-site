// Main JavaScript for iPS Consulting Website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("iL3VaPoDPauBxBP1D");
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
            
            try {
                // Check EmailJS initialization
                console.log('EmailJS available:', typeof emailjs !== 'undefined');
                console.log('EmailJS object:', emailjs);
                
                // Prepare EmailJS template parameters
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    company: contactForm.querySelector('input[name="company"]').value || 'Not provided',
                    service: contactForm.querySelector('select[name="service"]').value || 'General Consultation',
                    message: message,
                    to_email: 'info@ipsglobalconsulting.com',
                    timestamp: new Date().toLocaleString(),
                    source: 'Website Contact Form'
                };
                
                console.log('Sending email with parameters:', templateParams);
                console.log('Service ID: service_nd74rr8, Template ID: template_co99cdj');
                
                // Send email using EmailJS
                const result = await emailjs.send('service_nd74rr8', 'template_co99cdj', templateParams);
                
                console.log('EmailJS result:', result);
                
                if (result.status === 200) {
                    // Store form data for thank you page personalization
                    sessionStorage.setItem('contactSubmission', JSON.stringify({
                        name: name,
                        email: email,
                        company: templateParams.company,
                        service: templateParams.service,
                        message: message,
                        timestamp: templateParams.timestamp
                    }));
                    
                    // Success - redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    throw new Error('EmailJS returned non-200 status');
                }
                
            } catch (error) {
                console.error('Email sending failed:', error);
                console.error('Error details:', error.message, error.status, error.text);
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show detailed error message for debugging
                let errorMessage = 'Sorry, there was an error sending your message. ';
                if (error.status) {
                    errorMessage += `Error ${error.status}: ${error.text}. `;
                } else if (error.message) {
                    errorMessage += `${error.message}. `;
                }
                errorMessage += 'Please try again or email us directly at info@ipsglobalconsulting.com';
                
                showFormError(errorMessage);
            }
        });
    }
    
    // Helper function to show form errors
    function showFormError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert error message before the form
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
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