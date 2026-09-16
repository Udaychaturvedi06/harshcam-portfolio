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

// --- Advanced Custom Cursor & Ambient Glow --- //
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
    gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
    // Ambient spotlight follows cursor heavily eased
    gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 1.2, ease: "power3.out" });
});

// --- Cyberpunk Text Scramble Hover Effect --- //
const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';
function scrambleText(element) {
    const originalText = element.dataset.text || element.innerText;
    if(!element.dataset.text) element.dataset.text = originalText;
    let iterations = 0;
    
    clearInterval(element.scrambleInterval);
    element.scrambleInterval = setInterval(() => {
        element.innerText = originalText.split('').map((letter, index) => {
            if(index < iterations) return originalText[index];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        
        if(iterations >= originalText.length) clearInterval(element.scrambleInterval);
        iterations += 1 / 3;
    }, 30);
}

// Regular Hover elements (links, buttons)
const hoverElements = document.querySelectorAll('.hover-link, button, a:not(.work-item)');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorDot.style.opacity = '0';
        if(el.innerText && el.innerText.length < 20) scrambleText(el);
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

// --- Premium Text Splitting --- //
document.querySelectorAll('.char-split').forEach(el => {
    const text = el.innerText;
    el.innerHTML = text.split('').map(char => `<span style="display:inline-block; transform: translateY(110%);">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
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

// Reveal Hero text underneath immediately after expansion (Character by character)
tl.fromTo('.char-split span', 
    { y: "110%" }, 
    { y: "0%", stagger: 0.03, duration: 1.2, ease: "power4.out" }, 
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

// --- Infinite Marquee --- //
gsap.to('.marquee-track', {
    xPercent: -33.33, // scrolls one third of the track since we duplicated it 3 times
    ease: "none",
    duration: 15,
    repeat: -1
});

// --- Magnetic Buttons --- //
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const w = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - w;
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
});

// --- Image Clip Reveal --- //
const clipElements = document.querySelectorAll('.clip-reveal');
clipElements.forEach(el => {
    gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
        }
    });
});

// --- Dynamic Background Color Morphing --- //
gsap.to('body', {
    backgroundColor: '#0a0906', // Very dark gold/charcoal tint
    color: '#e0e0e0',
    scrollTrigger: {
        trigger: '#about',
        start: "top 60%",
        end: "bottom 40%",
        toggleActions: "play reverse play reverse"
    }
});
gsap.to('body', {
    backgroundColor: '#070707', // Back to pitch black
    color: '#f5f5f5',
    scrollTrigger: {
        trigger: '#work',
        start: "top 60%",
        end: "bottom 40%",
        toggleActions: "play reverse play reverse"
    }
});

// --- Ultra Premium Scroll Velocity Skew --- //
lenis.on('scroll', (e) => {
    const velocity = e.velocity;
    gsap.to('.work-item, .about-img-container', {
        skewY: velocity * 0.1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto"
    });
});

// --- 3D Magnetic Image Tilt --- //
document.querySelectorAll('.work-img').forEach(imgWrap => {
    imgWrap.style.perspective = "1000px";
    const img = imgWrap.querySelector('img');
    
    imgWrap.addEventListener('mousemove', (e) => {
        const rect = imgWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        
        gsap.to(img, {
            x: -x * 0.05,
            y: -y * 0.05,
            rotationX: y * 0.02,
            rotationY: -x * 0.02,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
    
    imgWrap.addEventListener('mouseleave', () => {
        gsap.to(img, {
            x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
            duration: 1.2, ease: "elastic.out(1, 0.3)"
        });
    });
});
