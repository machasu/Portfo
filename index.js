'use strict';

/* ─── 1. Sticky nav on scroll ─────────────────── */
const nav = document.getElementById('site-nav');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
            ticking = false;
        });
        ticking = true;
    }
}, {
    passive: true
});


/* ─── 2. Scroll-reveal (IntersectionObserver) ─── */
const srEls = document.querySelectorAll('.sr');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

srEls.forEach(el => revealObserver.observe(el));


/* ─── 3. Smooth anchor scroll ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        const tgt = document.querySelector(id);
        if (!tgt) return;
        e.preventDefault();
        const top = tgt.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    });
});


/* ─── 4. Hero sphere – subtle mouse parallax ─── */
const sphereHost = document.querySelector('.hero-sphere-host');
const heroSec = document.querySelector('.hero');

if (sphereHost && heroSec) {
    let baseX = 0,
        baseY = 0;
    let targetX = 0,
        targetY = 0;
    let rafId;

    heroSec.addEventListener('mousemove', e => {
        const r = heroSec.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        targetX = nx * 22;
        targetY = ny * 14;
    }, {
        passive: true
    });

    heroSec.addEventListener('mouseleave', () => {
        targetX = targetY = 0;
    });

    function animSphere() {
        baseX += (targetX - baseX) * 0.06;
        baseY += (targetY - baseY) * 0.06;
        sphereHost.style.marginLeft = `${baseX}px`;
        sphereHost.style.marginTop = `${baseY}px`;
        rafId = requestAnimationFrame(animSphere);
    }
    animSphere();
}


/* ─── 5. Active nav-link highlight on scroll ─── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
        }
    });
}, {
    rootMargin: '-40% 0px -50% 0px'
});

sections.forEach(s => sectionObserver.observe(s));