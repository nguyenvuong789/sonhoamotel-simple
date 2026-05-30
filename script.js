const galleryItems = [...document.querySelectorAll('.gallery-item img')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');
const counter = document.querySelector('.lightbox-counter');
const dots = document.querySelector('.lightbox-dots');
let activeIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

galleryItems.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'lightbox-dot';
  dot.setAttribute('aria-label', `Xem ảnh ${index + 1}`);
  dot.addEventListener('click', () => showImage(index));
  dots.appendChild(dot);
});

const dotItems = [...dots.querySelectorAll('.lightbox-dot')];

function showImage(index) {
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const image = galleryItems[activeIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  counter.textContent = `${activeIndex + 1}/${galleryItems.length}`;
  dotItems.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeIndex);
    dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
  });
}

function openLightbox(index) {
  showImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

galleryItems.forEach((image, index) => {
  image.parentElement.addEventListener('click', () => openLightbox(index));
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => showImage(activeIndex - 1));
nextButton.addEventListener('click', () => showImage(activeIndex + 1));

lightbox.addEventListener('touchstart', (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

lightbox.addEventListener('touchend', (event) => {
  if (!lightbox.classList.contains('open')) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  showImage(activeIndex + (deltaX < 0 ? 1 : -1));
}, { passive: true });

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
  if (event.key === 'ArrowRight') showImage(activeIndex + 1);
});
