// js/main.js - 'BRIGHT GOLDEN PARTICLES' (No Connections)
// High density, bright luxury particles without lines.

document.addEventListener("DOMContentLoaded", () => {

    /* --- 0. LUXURY SMOOTH SCROLL (Lenis) --- */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* --- 1. ANIMATION OBSERVER --- */
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const refreshObserver = () => {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .glass-card, .image-frame, .map-card').forEach(el => {
            if (!el.classList.contains('active')) observer.observe(el);
        });
    };

    /* --- 2. COMPONENT LOADER --- */
    const loadComponent = (placeholderId, filePath, callback) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;
        fetch(filePath)
            .then(res => res.text())
            .then(html => {
                placeholder.innerHTML = html;
                if (callback) callback();
                refreshObserver();
            })
            .catch(err => console.error(err));
    };

    /* --- 3. INIT LOGIC --- */
    const initNavbar = () => {
        const hamburger = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-links a');

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }

        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.glass-nav');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // 1. Glass Effect Logic (Adds background when not at top)
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 2. Hide/Show Logic
            // If scrolling DOWN and we are past the hero section (> 200px)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                // If scrolling UP, show it immediately
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const btn = document.getElementById('accept-cookies');
        if (!localStorage.getItem('cookiesAccepted') && banner) {
            banner.style.display = 'flex';
            if (btn) btn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                banner.style.opacity = '0';
                setTimeout(() => banner.style.display = 'none', 500);
            });
        }
    };

    const initFooter = () => {
        if (typeof spaData !== 'undefined') {
            const footerBtn = document.getElementById("footer-cta");
            if(footerBtn) footerBtn.href = spaData.contact.whatsapp;
        }
    };

    loadComponent("cookie-placeholder", "components/cookie-banner.html", initCookieBanner);
    loadComponent("nav-placeholder", "components/navbar.html", initNavbar);
    loadComponent("reviews-placeholder", "components/reviews.html");
    loadComponent("footer-placeholder", "components/footer.html", initFooter);

    /* --- 4. DATA FILL --- */
    if (typeof spaData !== 'undefined') {
        const renderList = (id, items) => {
            const list = document.getElementById(id);
            if (list && items) {
                list.innerHTML = items.map(item => `<li><span>${item.time}</span><strong>${item.price}</strong></li>`).join("");
            }
        };
        if (spaData.prices) {
            renderList("thai-price-list", spaData.prices.thaiOil);
            renderList("stone-price-list", spaData.prices.hotStone);
            renderList("ventouse-price-list", spaData.prices.ventouse);
        }
        
        // Dynamic Street Note Logic
        const noteEl = document.getElementById('dynamic-street-note');
        if(noteEl && spaData.contact.streetViewNote) {
            noteEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${spaData.contact.streetViewNote}`;
        }
    }
    setTimeout(refreshObserver, 200);


    /* --- 5. GOLDEN PARTICLES ANIMATION (NO LINES) --- */
    const canvas = document.getElementById('sand-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        
        // Configuration: High density, bright stars
        const config = {
            starCount: window.innerWidth < 768 ? 90 : 180, 
            starSize: 1.5,
            moveSpeed: 0.2, 
            starColor: "212, 175, 55", // Gold RGB
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', () => {
            resize();
            initStars();
        });
        resize();

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.moveSpeed;
                this.vy = (Math.random() - 0.5) * config.moveSpeed;
                this.size = Math.random() * config.starSize + 0.5;
                // High brightness: opacity between 0.6 and 1.0
                this.opacity = Math.random() * 0.4 + 0.6; 
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(${config.starColor}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initStars = () => {
            stars = [];
            for (let i = 0; i < config.starCount; i++) {
                stars.push(new Star());
            }
        };
        initStars();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Only update and draw stars. No connections.
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        };
        animate();
    }
});