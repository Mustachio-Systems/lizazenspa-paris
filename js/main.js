// js/main.js - FINAL STABLE VERSION

document.addEventListener("DOMContentLoaded", () => {

    /* --- 0. LUXURY SMOOTH SCROLL (Lenis) --- */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* --- 1. ANIMATION OBSERVER SETUP (Global) --- */
    // We define this early so we can call it whenever content loads
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Helper to scan for new elements to animate
    const refreshObserver = () => {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .glass-card, .image-frame, .features-list, .map-card, .detail-card, .review-card').forEach(el => {
            // Only observe if not already active
            if (!el.classList.contains('active')) {
                observer.observe(el);
            }
        });
    };

    /* --- 2. COMPONENT LOADER SYSTEM --- */
    const loadComponent = (placeholderId, filePath, callback) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                // Run specific logic (like initNavbar)
                if (callback) callback();
                // CRITICAL FIX: Tell the animator new content has arrived!
                refreshObserver(); 
            })
            .catch(error => console.error(error));
    };

    /* --- 3. INITIALIZATION LOGIC --- */
    const initNavbar = () => {
        const page = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('.nav-link').forEach(l => { 
            if(l.getAttribute('href') === page) l.classList.add('active'); 
        });

        // WhatsApp Link Logic
        const waLink = typeof spaData !== 'undefined' ? spaData.contact.whatsapp : "#";
        // Only target .btn-gold (Map button is now .btn-map so it's safe)
        document.querySelectorAll(".btn-gold:not(.direction-btn)").forEach(btn => btn.href = waLink);

        // Mobile Menu Logic
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
                if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }
    };

    const initFooter = () => {
        if (typeof spaData === 'undefined') return;
        document.querySelectorAll("#phone-display").forEach(el => el.innerHTML = `<i class="fa-solid fa-phone"></i> ${spaData.contact.phone}`);
        document.querySelectorAll("#address-display").forEach(el => el.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${spaData.contact.address}`);
        const footerBtn = document.getElementById("footer-cta");
        if(footerBtn) footerBtn.href = spaData.contact.whatsapp;
    };

    // Load Components
    loadComponent("nav-placeholder", "components/navbar.html", initNavbar);
    loadComponent("reviews-placeholder", "components/reviews.html", () => console.log("Reviews Loaded")); 
    loadComponent("footer-placeholder", "components/footer.html", initFooter);


    /* --- 4. MAIN PAGE DATA (Prices & Metro) --- */
    if (typeof spaData !== 'undefined') {
        const metroEl = document.getElementById("metro-display");
        if(metroEl) metroEl.innerHTML = `<i class="fa-solid fa-train-subway"></i> ${spaData.contact.metro}`;

        const renderList = (id, items) => {
            const list = document.getElementById(id);
            if (!list || !items || !Array.isArray(items)) return;
            list.innerHTML = items.map(item => `<li><span>${item.time}</span><strong>${item.price}</strong></li>`).join("");
        };

        if (spaData.prices) {
            renderList("thai-price-list", spaData.prices.thaiOil);
            renderList("stone-price-list", spaData.prices.hotStone);
            renderList("ventouse-price-list", spaData.prices.ventouse);
        }
    }

    // Initial Scan for static HTML elements
    setTimeout(refreshObserver, 100); 


    /* --- 5. LIQUID GOLD PARTICLES --- */
    const canvas = document.getElementById('sand-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 90; 
        const connectionDistance = 140; 
        const mouseRadius = 180; 
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3; 
                this.vy = (Math.random() - 0.5) * 0.3; 
                this.size = Math.random() * 2.5 + 0.5; 
                this.color = 'rgba(212, 175, 55,' + (Math.random() * 0.4 + 0.1) + ')';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseRadius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseRadius - distance) / mouseRadius;
                        const directionX = forceDirectionX * force * 2; 
                        const directionY = forceDirectionY * force * 2;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        init();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (connectionDistance * connectionDistance)) {
                        let opacityValue = 1 - (distance / (20000)); 
                        ctx.strokeStyle = 'rgba(212, 175, 55,' + (opacityValue * 0.15) + ')'; 
                        ctx.lineWidth = 0.5; 
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
});