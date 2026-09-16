// Initialize Lenis for Smooth Scrolling
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
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0, 0)

// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});
const hoverElements = document.querySelectorAll('a, button, .magnetic, .gallery-item');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// Magnetic Buttons
const magnetics = document.querySelectorAll('.magnetic-btn, .magnetic');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - h;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    });
});

// Preloader & Initial Animation
const tl = gsap.timeline();
let progress = 0;
const counter = document.querySelector('.counter');

const updateProgress = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 1;
    if (progress >= 100) {
        progress = 100;
        clearInterval(updateProgress);
        revealSite();
    }
    counter.textContent = progress + '%';
}, 50);

function revealSite() {
    tl.to('.preloader', {
        yPercent: -100,
        duration: 1.5,
        ease: "power4.inOut",
        delay: 0.2
    })
    .to('.word', {
        y: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out"
    }, "-=1")
    .fromTo('.hero-img-wrapper', {
        scale: 0.8,
        opacity: 0,
        rotationZ: 5
    }, {
        scale: 1,
        opacity: 1,
        rotationZ: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.2")
    .from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 1
    }, "-=1");
}

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Image Parallax
gsap.to('.hero-img-wrapper.left img', {
    yPercent: 20,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});
gsap.to('.hero-img-wrapper.right img', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

// About Text Reveal
const aboutText = document.querySelector('.about-text-reveal p');
const text = aboutText.textContent;
aboutText.innerHTML = '';
text.split(' ').forEach(word => {
    aboutText.innerHTML += `<span style="opacity:0.2">${word} </span>`;
});
gsap.to('.about-text-reveal p span', {
    opacity: 1,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".about-grid",
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1
    }
});

// About Image Parallax
gsap.to('.about-image-wrapper img', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: { trigger: ".about-image-wrapper", start: "top bottom", end: "bottom top", scrub: true }
});

// Horizontal Gallery Scroll
const galleryTrack = document.querySelector('.gallery-track');
const getScrollAmount = () => -(galleryTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.1);

gsap.to(galleryTrack, {
    x: getScrollAmount,
    ease: "none",
    scrollTrigger: {
        trigger: ".work-horizontal",
        start: "top 10%",
        end: () => `+=${galleryTrack.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
    }
});

// Services 3D Stack Cards
const cards = gsap.utils.toArray('.card');
cards.forEach((card, i) => {
    ScrollTrigger.create({
        trigger: card,
        start: "top 20%",
        endTrigger: ".stack-cards",
        end: "bottom 20%",
        pin: true,
        pinSpacing: false,
    });
    
    if (i < cards.length - 1) {
        gsap.to(card, {
            scale: 1 - ((cards.length - i) * 0.05),
            opacity: 1 - ((cards.length - i) * 0.1),
            filter: "blur(5px)",
            scrollTrigger: {
                trigger: cards[i + 1],
                start: "top 80%",
                end: "top 20%",
                scrub: 1
            }
        });
    }
});


// WebGL Three.js Background Particles (Premium Subtle Effect)
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10; // spread
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

// Mouse Interaction for 3D
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    // Slow rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;
    
    // Mouse Interaction
    particlesMesh.rotation.y += mouseX * 0.01;
    particlesMesh.rotation.x += mouseY * 0.01;

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
