
        
       // alert('Theme toggled!');
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        function getTheme() {
            return localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
        }

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
            localStorage.setItem('theme', theme);
            
            if (window.leafletMap) {
                window.leafletMap.eachLayer(layer => {
                    if (layer._url) window.leafletMap.removeLayer(layer);
                });
                const tileUrl = theme === 'dark' 
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
                L.tileLayer(tileUrl).addTo(window.leafletMap);
            }
        }

        applyTheme(getTheme());

        themeToggle.addEventListener('click', () => {
            const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        mobileToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

        window.addEventListener('scroll', () => {
            document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('active');
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.classList.contains('stagger')) {
                        [...entry.target.children].forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                                child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            }, i * 100);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));

        window.leafletMap = L.map('map').setView([22.7010, 90.3535], 13);
        const initialTile = getTheme() === 'dark' 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        L.tileLayer(initialTile).addTo(window.leafletMap);
        L.marker([22.7010, 90.3535]).addTo(window.leafletMap).bindPopup('NovaSaaS HQ').openPopup();

        document.getElementById('contactForm').addEventListener('submit', e => {
            e.preventDefault();
            alert('Thanks! We’ll get back to you soon.');
            e.target.reset();
        });

        function checkout(plan) {
            alert(`Redirecting to checkout for ${plan} plan. Connect Stripe here.`);
        }