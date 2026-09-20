const nav = document.getElementById('nav');
const navLinks = Array.from(document.querySelectorAll('.nav__link'));
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));

function syncNav() {
    nav.classList.toggle('nav--compact', window.scrollY > 32);

    const readingLine = window.scrollY + nav.offsetHeight + 1;
    const doc = document.documentElement;
    const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
    let current = sections.length - 1;

    if (!atBottom) {
        current = 0;
        sections.forEach((section, i) => {
            if (section && section.offsetTop <= readingLine) current = i;
        });
    }

    navLinks.forEach((link, i) => {
        const isActive = i === current;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let scrollQueued = false;
window.addEventListener(
    'scroll',
    () => {
        if (scrollQueued) return;
        scrollQueued = true;
        window.requestAnimationFrame(() => {
            syncNav();
            scrollQueued = false;
        });
    },
    { passive: true }
);
window.addEventListener('resize', syncNav);
syncNav();

const carousel = document.getElementById('carousel');
const track = document.getElementById('carousel-track');
const slides = Array.from(track.children);
const status = document.getElementById('carousel-status');
const dotBox = document.getElementById('carousel-dots');
let slideIndex = 0;

const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.addEventListener('click', () => showSlide(i));
    dotBox.appendChild(dot);
    return dot;
});

function showSlide(next) {
    slideIndex = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;

    slides.forEach((slide, i) => {
        slide.toggleAttribute('inert', i !== slideIndex);
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === slideIndex));
    status.textContent = `Slide ${slideIndex + 1} of ${slides.length}`;
}

document.getElementById('carousel-prev').addEventListener('click', () => showSlide(slideIndex - 1));
document.getElementById('carousel-next').addEventListener('click', () => showSlide(slideIndex + 1));
carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showSlide(slideIndex - 1);
    if (event.key === 'ArrowRight') showSlide(slideIndex + 1);
});

showSlide(0);

document.querySelectorAll('[data-modal]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.dataset.modal);
        if (modal) modal.showModal();
    });
});

document.querySelectorAll('.modal').forEach((modal) => {
    modal.querySelector('.modal__close').addEventListener('click', () => modal.close());
    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.close();
    });
});

const pageUrl = encodeURIComponent(window.location.href);
const pageTitle = encodeURIComponent(document.title);
const shareTargets = {
    weibo: `https://service.weibo.com/share/share.php?url=${pageUrl}&title=${pageTitle}`,
    x: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
};

document.querySelectorAll('[data-share]').forEach((link) => {
    const target = shareTargets[link.dataset.share];
    if (target) link.href = target;
});

document.getElementById('year').textContent = new Date().getFullYear();
