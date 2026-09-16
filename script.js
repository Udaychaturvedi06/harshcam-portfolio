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

// --- Advanced Custom Cursor --- //
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', (e) => {
    // Outer ring trails slightly for a smooth, premium feel
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
    // Inner dot moves instantly
    gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
});

// Regular Hover elements (links, buttons)
const hoverElements = document.querySelectorAll('.hover-link, button, a:not(.work-item)');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorDot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorDot.style.opacity = '1';
    });
});

// View Mode Hover elements (Project images)
const viewElements = document.querySelectorAll('.work-item');
viewElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('view-mode');
        cursorDot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('view-mode');
        cursorDot.style.opacity = '1';
    });
});

// --- Preloader Cinematic Montage --- //
const tl = gsap.timeline();
const pImages = document.querySelectorAll('.preloader-images img:not(.final-img)');
const flashDuration = 0.15;

// Fade in the title early
tl.to('.preloader-title', { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);

// Flash through the images
pImages.forEach((img, i) => {
    tl.set(img, { opacity: 1 }, i * flashDuration)
      .set(img, { opacity: 0 }, (i + 1) * flashDuration);
});

// Show the final image (which matches the hero bg)
const finalStart = pImages.length * flashDuration;
tl.set('.final-img', { opacity: 1 }, finalStart);

// Aggressively expand the image container to fill the screen
tl.to('.preloader-images', {
    width: "100vw",
    height: "100vh",
    duration: 1.5,
    ease: "power4.inOut"
}, finalStart + 0.3)
.to('.preloader-title', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.in"
}, finalStart + 0.3)
// Fade out the preloader background to seamlessly reveal the real site
.to('.preloader-bg', {
    opacity: 0,
    duration: 0.1
}, "-=0.1")
.to('.preloader', {
    opacity: 0,
    duration: 0.5,
    onComplete: () => { document.querySelector('.preloader').style.display = 'none'; }
}, "+=0.1");

// Reveal Hero text underneath immediately after expansion
tl.fromTo('.hero-title .line span', 
    { y: "110%" }, 
    { y: "0%", stagger: 0.1, duration: 1, ease: "power4.out" }, 
    finalStart + 1.2
)
.fromTo('.fade-up', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.out" }, 
    "-=0.8"
);

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
