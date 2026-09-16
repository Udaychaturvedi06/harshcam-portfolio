// --- Setup Lenis Smooth Scrolling --- //
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// --- Custom Cursor --- //
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
});
const hoverElements = document.querySelectorAll('.hover-link, button, a');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// --- Preloader & Hero Animation --- //
const tl = gsap.timeline();

// Simulate loading safely
let progress = 0;
const progressBar = document.querySelector('.progress-bar');
const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if(progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;

    if(progress === 100) {
        clearInterval(loadingInterval);
        initReveal();
    }
}, 100);

function initReveal() {
    // Hide preloader
    tl.to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.3
    })
    // Parallax hero bg start
    .fromTo('.hero-bg img', { scale: 1.2 }, { scale: 1, duration: 2, ease: "power3.out" }, "-=1")
    // Reveal Hero text
    .from('.hero-title .line span', {
        y: "110%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
    }, "-=1.2")
    // Sub text
    .from('.fade-up', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");
}

// --- GSAP Scroll Animations --- //
gsap.registerPlugin(ScrollTrigger);

// Hero Parallax effect
gsap.to('.hero-bg img', {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// About Image Parallax
gsap.to('.parallax-img', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".about-img-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Generic Fade/Slide Reveals for Sections
const revealElements = document.querySelectorAll('.gs-reveal');
revealElements.forEach(el => {
    gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%", // Triggers when top of element hits 85% of viewport
            toggleActions: "play none none none"
        }
    });
});
