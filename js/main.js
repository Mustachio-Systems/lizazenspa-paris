// js/main.js - COMPONENT LOADER & LIQUID GOLD ENGINE

document.addEventListener("DOMContentLoaded", () => {

    /* --- 1. COMPONENT LOADER SYSTEM --- */
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
                if (callback) callback();
            })
            .catch(error => console.error(error));
    };

    /* --- 2. INITIALIZATION LOGIC --- */
    const initNavbar = () => {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) link.classList.add('active');
        });
        const navBtn = document.getElementById("nav-cta");
        if(navBtn && typeof spaData !== 'undefined') navBtn.href = spaData.contact.whatsapp;
    };

    const initFooter = () => {
        if (typeof spaData === 'undefined') return;
        document.querySelectorAll("#phone-display").forEach(el => el.innerHTML = `<i class="fa-solid fa-phone"></i> ${spaData.contact.phone}`);
        document.querySelectorAll("#address-display").forEach(el => el.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${spaData.contact.address}`);
        const footerBtn = document.getElementById("footer-cta");
        if(footerBtn) footerBtn.href = spaData.contact.whatsapp;
    };

    loadComponent("nav-placeholder", "components/navbar.html", initNavbar);
    loadComponent("footer-placeholder", "components/footer.html", initFooter);


    /* --- 3. MAIN PAGE DATA --- */
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

    /* --- 4. ANIMATION OBSERVER --- */
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setTimeout(() => {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .glass-card, .image-frame, .features-list, .map-card, .detail-card').forEach(el => observer.observe(el));
    }, 100);


    /* --- 5. THE "LIQUID GOLD" PARTICLE ENGINE (Dribbble Style) --- */
    const canvas = document.getElementById('sand-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Config - Tweaked for "Luxury" feel
        const particleCount = window.innerWidth < 768 ? 50 : 110; 
        const connectionDistance = 140; // Longer lines for a "web" look
        const mouseRadius = 180; // Larger interaction zone

        // Mouse State
        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        // Touch support
        window.addEventListener('touchmove', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        // Resize Logic
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particle Object
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Random drift velocity
                this.vx = (Math.random() - 0.5) * 0.3; 
                this.vy = (Math.random() - 0.5) * 0.3; 
                // Random size for depth perception
                this.size = Math.random() * 2.5 + 0.5; 
                // Store original position for "elasticity" if desired, or free float
                this.baseX = this.x;
                this.baseY = this.y;
                // Gold color with random alpha
                this.color = 'rgba(212, 175, 55,' + (Math.random() * 0.4 + 0.1) + ')';
            }

            update() {
                // 1. Normal Movement
                this.x += this.vx;
                this.y += this.vy;

                // 2. Mouse Interaction (Gentle Push)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRadius) {
                        // Calculate push force based on distance (closer = stronger)
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseRadius - distance) / mouseRadius;
                        
                        // "Swirl" effect factor
                        const directionX = forceDirectionX * force * 2; 
                        const directionY = forceDirectionY * force * 2;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                // 3. Screen Wrapping (Infinite Flow)
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

        // Initialize
        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        init();

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // 1. Update & Draw Particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // 2. Draw "Web" Connections
            connect();
            
            requestAnimationFrame(animate);
        };

        // The "Web" Logic
        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    if (distance < (connectionDistance * connectionDistance)) {
                        // Fade line based on distance
                        opacityValue = 1 - (distance / (20000)); 
                        // Gold Line Color
                        ctx.strokeStyle = 'rgba(212, 175, 55,' + (opacityValue * 0.15) + ')'; 
                        ctx.lineWidth = 0.5; // Fine lines for elegance
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        animate();
    }
});