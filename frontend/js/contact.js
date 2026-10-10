/* ============================================
   CONTACT PAGE LOGIC — Saffron & Sage
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL =====
    const nav = document.getElementById('nav');

    function handleScroll() {
        if (window.pageYOffset > 80) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('active');
                hamburger.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    function showMessage(text, type = 'error') {
        formMessage.textContent = text;
        formMessage.className = 'form__message form__message--' + type;
    }

    function clearMessage() {
        formMessage.textContent = '';
        formMessage.className = 'form__message';
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearMessage();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                return showMessage('Please fill in all required fields.');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showMessage('Please enter a valid email address.');
            }

            if (message.length < 10) {
                return showMessage('Message must be at least 10 characters.');
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate sending (backend API will be added later)
            setTimeout(() => {
                showMessage('✅ Message sent! We\'ll respond within 24 hours.', 'success');
                form.reset();

                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';

                // Clear success message after 5 seconds
                setTimeout(() => {
                    clearMessage();
                }, 5000);
            }, 1200);
        });
    }

    console.log('✅ Saffron & Sage — Contact loaded');
});