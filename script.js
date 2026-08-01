// Early appearance initialization to prevent flash
(function() {
    const savedAppearance = localStorage.getItem('vision-appearance') || 'system';
    if (savedAppearance === 'dark') {
        document.documentElement.setAttribute('data-appearance', 'dark');
    } else if (savedAppearance === 'light') {
        document.documentElement.setAttribute('data-appearance', 'light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const btnEn = document.getElementById('btn-en');
    const btnFa = document.getElementById('btn-fa');
    const enContent = document.getElementById('english-content');
    const faContent = document.getElementById('persian-content');
    const introEn = document.getElementById('intro-en');
    const introFa = document.getElementById('intro-fa');
    const readingTime = document.getElementById('reading-time');

    const setLanguage = (lang) => {
        if (lang === 'fa') {
            btnFa.classList.add('active');
            btnEn.classList.remove('active');
            if (faContent) faContent.style.display = 'block';
            if (enContent) enContent.style.display = 'none';
            if (introFa) introFa.style.display = 'block';
            if (introEn) introEn.style.display = 'none';
            document.documentElement.lang = 'fa';
            document.documentElement.dir = 'rtl';
            if (readingTime) {
                readingTime.innerText = readingTime.getAttribute('data-fa') || '⏱️ زمان مطالعه';
            }
        } else {
            btnEn.classList.add('active');
            btnFa.classList.remove('active');
            if (enContent) enContent.style.display = 'block';
            if (faContent) faContent.style.display = 'none';
            if (introEn) introEn.style.display = 'block';
            if (introFa) introFa.style.display = 'none';
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
            if (readingTime) {
                readingTime.innerText = readingTime.getAttribute('data-en') || '⏱️ Read time';
            }
        }
        localStorage.setItem('vision-lang', lang);
        addAnchors();
    };

    if (btnEn) btnEn.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('en');
        window.scrollTo(0, 0);
    });

    if (btnFa) btnFa.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('fa');
        window.scrollTo(0, 0);
    });

    // Theme (Accent Color) Logic
    const themeDots = document.querySelectorAll('.theme-dot');
    const setAccent = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeDots.forEach(d => {
            d.classList.toggle('active', d.getAttribute('data-theme') === theme);
        });
        localStorage.setItem('vision-theme', theme);
    };

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => setAccent(dot.getAttribute('data-theme')));
    });

    // Settings Toggle Logic
    const settingsContainer = document.getElementById('settings-fab-container');
    const btnSettingsToggle = document.getElementById('btn-settings-toggle');

    if (btnSettingsToggle && settingsContainer) {
        btnSettingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsContainer.classList.toggle('expanded');
        });

        document.addEventListener('click', (e) => {
            if (!settingsContainer.contains(e.target) && settingsContainer.classList.contains('expanded')) {
                settingsContainer.classList.remove('expanded');
            }
        });
    }

    // Appearance (Light/Dark) Logic
    const appearanceBtns = document.querySelectorAll('.appearance-btn');
    const setAppearance = (appearance) => {
        if (appearance === 'dark') {
            document.documentElement.setAttribute('data-appearance', 'dark');
        } else if (appearance === 'light') {
            document.documentElement.setAttribute('data-appearance', 'light');
        } else {
            document.documentElement.removeAttribute('data-appearance');
        }

        appearanceBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-appearance') === appearance);
        });
        localStorage.setItem('vision-appearance', appearance);
    };

    appearanceBtns.forEach(btn => {
        btn.addEventListener('click', () => setAppearance(btn.getAttribute('data-appearance')));
    });

    // Progress Bar & Back to Top
    const progressBar = document.getElementById('progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        if (backToTopBtn) {
            if (winScroll > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Anchors & TOC
    function addAnchors() {
        const currentSectionId = document.documentElement.lang === 'fa' ? 'persian-content' : 'english-content';
        const section = document.getElementById(currentSectionId);
        if (!section) return;

        const headers = section.querySelectorAll('h2, h3');
        const tocContainer = document.getElementById('toc-container');
        if (tocContainer) tocContainer.innerHTML = '';

        let h2Count = 0;
        headers.forEach(h => {
            const existing = h.querySelector('.anchor-link');
            if (existing) existing.remove();

            const text = h.innerText.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
            h.id = text;

            const anchor = document.createElement('a');
            anchor.className = 'anchor-link';
            anchor.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            anchor.onclick = (e) => {
                e.stopPropagation();
                const url = window.location.origin + window.location.pathname + '#' + h.id;
                navigator.clipboard.writeText(url).then(() => {
                    const originalHTML = anchor.innerHTML;
                    anchor.innerHTML = '<span style="font-size: 0.7rem; font-weight: bold;">COPIED!</span>';
                    setTimeout(() => anchor.innerHTML = originalHTML, 2000);
                });
            };
            h.prepend(anchor);

            if (h.tagName === 'H2' && tocContainer) {
                h2Count++;
                const tocItem = document.createElement('a');
                tocItem.className = 'toc-item';
                tocItem.href = '#' + h.id;
                tocItem.innerHTML = `<span>${h2Count}</span> ${h.innerText}`;
                tocItem.onclick = (e) => {
                    e.preventDefault();
                    const target = document.getElementById(h.id);
                    const offset = 70;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                };
                tocContainer.appendChild(tocItem);
            }
        });
    }

    // Load saved preferences
    const savedTheme = localStorage.getItem('vision-theme') || 'indigo';
    const savedAppearance = localStorage.getItem('vision-appearance') || 'system';
    const savedLang = localStorage.getItem('vision-lang') || 'fa';

    setAccent(savedTheme);
    setAppearance(savedAppearance);
    setLanguage(savedLang);

    // Particle Background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
                ctx.fill();
            }
        }
        for (let i = 0; i < 60; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(); particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath(); ctx.strokeStyle = primaryColor; ctx.globalAlpha = 1 - (distance / 150);
                        ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke(); ctx.globalAlpha = 1;
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
});
