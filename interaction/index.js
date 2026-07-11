      document.getElementById("year").textContent = new Date().getFullYear();

      const toggle = document.querySelector(".nav-toggle");
      const links = document.querySelector(".nav-links");
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        toggle.classList.toggle("is-open", open);
      });
      document.querySelectorAll(".nav-links a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      const galleries = document.querySelectorAll("[data-gallery]");
      const lightbox = document.querySelector(".gallery-lightbox");
      const lightboxImg = lightbox?.querySelector("img");
      const lightboxCaption = lightbox?.querySelector("figcaption");
      const closeLightbox = lightbox?.querySelector(".lightbox-close");
      const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
      const lightboxNext = lightbox?.querySelector(".lightbox-next");
      let activeGallery = null;
      let activeIndex = 0;

      function setGalleryImage(gallery, index) {
        const thumbs = [...gallery.querySelectorAll(".gallery-thumb")];
        const mainImg = gallery.querySelector(".gallery-main img");
        const caption = gallery.querySelector(".gallery-caption");
        const count = gallery.querySelector(".gallery-count");
        const selectedImg = thumbs[index]?.querySelector("img");

        if (!selectedImg || !mainImg) return;

        activeIndex = index;
        mainImg.style.opacity = "0";

        window.setTimeout(() => {
          mainImg.src = selectedImg.src;
          mainImg.alt = selectedImg.alt;
          mainImg.style.opacity = "1";
        }, 120);

        thumbs.forEach((thumb, thumbIndex) => {
          thumb.classList.toggle("is-active", thumbIndex === index);
        });

        if (caption) caption.textContent = selectedImg.dataset.caption || selectedImg.alt;
        if (count) count.textContent = `${index + 1} / ${thumbs.length}`;

        if (lightbox?.classList.contains("is-open")) {
          updateLightbox(selectedImg);
        }
      }

      function moveGallery(gallery, direction) {
        const total = gallery.querySelectorAll(".gallery-thumb").length;
        const nextIndex = (activeIndex + direction + total) % total;
        setGalleryImage(gallery, nextIndex);
      }

      function updateLightbox(img) {
        if (!lightboxImg || !lightboxCaption || !img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.dataset.caption || img.alt;
      }

      function openLightbox(gallery) {
        const currentImg = gallery.querySelector(".gallery-thumb.is-active img");
        activeGallery = gallery;
        updateLightbox(currentImg);
        lightbox?.classList.add("is-open");
        lightbox?.setAttribute("aria-hidden", "false");
        closeLightbox?.focus();
      }

      function hideLightbox() {
        lightbox?.classList.remove("is-open");
        lightbox?.setAttribute("aria-hidden", "true");
      }

      galleries.forEach((gallery) => {
        const thumbs = [...gallery.querySelectorAll(".gallery-thumb")];
        const mainButton = gallery.querySelector(".gallery-main");
        const prev = gallery.querySelector(".gallery-prev");
        const next = gallery.querySelector(".gallery-next");

        thumbs.forEach((thumb, index) => {
          thumb.addEventListener("click", () => {
            activeGallery = gallery;
            setGalleryImage(gallery, index);
          });
        });

        mainButton?.addEventListener("click", () => openLightbox(gallery));
        prev?.addEventListener("click", () => {
          activeGallery = gallery;
          moveGallery(gallery, -1);
        });
        next?.addEventListener("click", () => {
          activeGallery = gallery;
          moveGallery(gallery, 1);
        });
      });

      closeLightbox?.addEventListener("click", hideLightbox);
      lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) hideLightbox();
      });
      lightboxPrev?.addEventListener("click", () => {
        if (activeGallery) moveGallery(activeGallery, -1);
      });
      lightboxNext?.addEventListener("click", () => {
        if (activeGallery) moveGallery(activeGallery, 1);
      });
      document.addEventListener("keydown", (event) => {
        if (!lightbox?.classList.contains("is-open")) return;
        if (event.key === "Escape") hideLightbox();
        if (event.key === "ArrowLeft" && activeGallery) moveGallery(activeGallery, -1);
        if (event.key === "ArrowRight" && activeGallery) moveGallery(activeGallery, 1);
      });

      document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--y", `${event.clientY - rect.top}px`);
        });
      });

      const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particlesArray = [];

function getParticleCount() {
    if (window.innerWidth <= 480) return 42;
    if (window.innerWidth <= 820) return 64;
    return 100;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; 
        this.speedX = Math.random() * 1 - 0.5; 
        this.speedY = Math.random() * 1 - 0.5; 
        this.color = 'rgba(255, 255, 255, 0.7)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray.length = 0;
    const numberOfParticles = getParticleCount();

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

window.addEventListener('resize', init);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}

init();
animate();
