/* ============================================
   RESERVATION PAGE LOGIC — Saffron & Sage
   ============================================ */

// ⚠️ Change this to your live backend URL when deployed
const API_URL = 'http://localhost:5000/api/reservations';

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


    // ===== DATE PICKER — Min today, Max 90 days =====
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 90);

        const formatDate = (d) => d.toISOString().split('T')[0];

        dateInput.min = formatDate(today);
        dateInput.max = formatDate(maxDate);
    }


    // ===== RESERVATION FORM =====
    const form = document.getElementById('reservationForm');
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
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage();

            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const occasion = document.getElementById('occasion').value;
            const specialRequests = document.getElementById('specialRequests').value.trim();

            // Validation
            if (!name || !email || !phone || !date || !time || !guests) {
                return showMessage('Please fill in all required fields.');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showMessage('Please enter a valid email address.');
            }

            if (name.length < 2) {
                return showMessage('Please enter a valid name.');
            }

            if (phone.length < 8) {
                return showMessage('Please enter a valid phone number.');
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Reserving...';

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        date,
                        time,
                        guests: parseInt(guests),
                        occasion,
                        specialRequests,
                    }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Reservation failed');
                }

                // Success
                showMessage('✅ ' + data.message, 'success');
                form.reset();

                setTimeout(() => {
                    clearMessage();
                }, 8000);

            } catch (error) {
                console.error('Reservation error:', error);
                showMessage(error.message || 'Something went wrong. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reserve Table';
            }
        });
    }

    console.log('✅ Saffron & Sage — Reservation loaded');
});