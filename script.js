"use strict";

const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = document.documentElement.dataset.theme || "dark";

function setTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;
  themeToggle.innerHTML = `<i class='bx ${isLight ? "bx-moon" : "bx-sun"}' aria-hidden="true"></i>`;
  const label = `Switch to ${isLight ? "dark" : "light"} mode`;
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;
  themeToggle.setAttribute("aria-pressed", String(isLight));
}

setTheme(savedTheme || preferredTheme);
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("portfolio-theme", nextTheme);
  setTheme(nextTheme);
});

const menuIcon = document.querySelector(".menu-icon");
const navlist = document.querySelector(".navlist");
if (menuIcon && navlist) {
  menuIcon.setAttribute("role", "button");
  menuIcon.setAttribute("tabindex", "0");
  menuIcon.setAttribute("aria-label", "Toggle navigation");
  const setMenu = (open) => {
    menuIcon.classList.toggle("active", open);
    navlist.classList.toggle("active", open);
    document.body.classList.toggle("open", open);
    menuIcon.setAttribute("aria-expanded", String(open));
  };
  const toggleMenu = () => setMenu(!menuIcon.classList.contains("active"));
  menuIcon.addEventListener("click", toggleMenu);
  menuIcon.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleMenu(); }
  });
  navlist.addEventListener("click", () => setMenu(false));
}

const rotatingText = document.querySelector(".text p");
if (rotatingText) {
  rotatingText.innerHTML = [...rotatingText.textContent].map((char, index) =>
    `<b style="transform:rotate(${index * 6.3}deg)">${char === " " ? "&nbsp;" : char}</b>`).join("");
}

const buttons = document.querySelectorAll(".about-btn button");
const contents = document.querySelectorAll(".content-btn .content");
buttons.forEach((button, index) => button.addEventListener("click", () => {
  contents.forEach((content, contentIndex) => { content.style.display = contentIndex === index ? "block" : "none"; });
  buttons.forEach((item) => item.classList.toggle("active", item === button));
}));

if (typeof window.mixitup === "function" && document.querySelector(".portfolio-gallery")) {
  window.mixitup(".portfolio-gallery", { selectors: { target: ".portfolio-box" }, animation: { duration: 500 } });
}
if (typeof window.Swiper === "function" && document.querySelector(".mySwiper")) {
  new window.Swiper(".mySwiper", { slidesPerView: 1, spaceBetween: 30, pagination: { el: ".swiper-pagination", clickable: true }, autoplay: { delay: 3000, disableOnInteraction: false }, breakpoints: { 576: { slidesPerView: 2 }, 1200: { slidesPerView: 3, spaceBetween: 20 } } });
}

const firstSkill = document.querySelector(".skill:first-child");
const counters = document.querySelectorAll(".counter span");
const progressBars = document.querySelectorAll(".skills svg circle");
let skillsPlayed = false;
function playSkills() {
  if (skillsPlayed || !firstSkill || firstSkill.getBoundingClientRect().top > window.innerHeight) return;
  skillsPlayed = true;
  counters.forEach((counter, index) => {
    const target = Number(counter.dataset.target) || 0;
    if (progressBars[index]) progressBars[index].style.setProperty("--target", 465 - 465 * target / 100);
    let current = 0;
    const timer = window.setInterval(() => { counter.textContent = String(++current); if (current >= target) clearInterval(timer); }, 12);
  });
  progressBars.forEach((bar) => { bar.style.animation = "progress 2s ease-in-out forwards"; });
}

const progress = document.getElementById("progress");
if (progress) progress.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
const menuLinks = [...document.querySelectorAll("header ul li a")];
const sections = [...document.querySelectorAll("section[id]")];
function updateOnScroll() {
  playSkills();
  const position = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (progress) {
    const percent = height > 0 ? Math.round(position * 100 / height) : 0;
    progress.style.display = position > 100 ? "grid" : "none";
    progress.style.background = `conic-gradient(#ffb51b ${percent}%, rgba(255,181,27,.16) ${percent}%)`;
  }
  let activeIndex = 0;
  sections.forEach((section, index) => { if (window.scrollY + 120 >= section.offsetTop) activeIndex = index; });
  menuLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${sections[activeIndex]?.id}`));
}
window.addEventListener("scroll", updateOnScroll, { passive: true });
window.addEventListener("load", updateOnScroll);
updateOnScroll();

if (typeof window.ScrollReveal === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveal = window.ScrollReveal({ distance: "60px", duration: 1200, delay: 100 });
  reveal.reveal(".hero-info,.main-text,.proposal,.heading", { origin: "top" });
  reveal.reveal(".about-img,.fillter-buttons,.contact-info", { origin: "left" });
  reveal.reveal(".about-content,.skills", { origin: "right" });
  reveal.reveal(".allServices,.portfolio-gallery,footer,.img-hero", { origin: "bottom" });
}

const contactForm = document.querySelector("#contact form");
if (contactForm) contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = data.get("subject") || "Portfolio enquiry";
  const body = `${data.get("message") || ""}\n\nFrom: ${data.get("firstName") || ""} ${data.get("lastName") || ""}\nEmail: ${data.get("email") || ""}`;
  location.href = `mailto:avishkajanani20@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const heroRoleText = document.getElementById("hero-role-text");
if (heroRoleText) {
  const roles = ["Web Developer", "Graphic Designer", "Planning"];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;

  const typeRole = () => {
    const role = roles[roleIndex];
    heroRoleText.textContent = role.slice(0, characterIndex);

    if (!deleting && characterIndex === role.length) {
      deleting = true;
      window.setTimeout(typeRole, 1800);
      return;
    }

    if (deleting && characterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(typeRole, 250);
      return;
    }

    characterIndex += deleting ? -1 : 1;
    window.setTimeout(typeRole, deleting ? 55 : 90);
  };

  window.setTimeout(typeRole, 1200);
}

const skillsShowcase = document.querySelector('.skills-showcase');
if (skillsShowcase) {
  const makePlayButton = (label, className = 'skill-play') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.innerHTML = '<span aria-hidden=true></span>';
    return button;
  };

  const replayItem = (item) => {
    item.classList.remove('is-playing');
    void item.offsetWidth;
    item.classList.add('is-playing');
    window.setTimeout(() => item.classList.remove('is-playing'), 1100);
  };

  const technicalItems = [...skillsShowcase.querySelectorAll('.skill-row')];
  const professionalItems = [...skillsShowcase.querySelectorAll('.professional-row')];
  const toolItems = [...skillsShowcase.querySelectorAll('.tool-card')];

  [...technicalItems, ...professionalItems].forEach((item) => {
    const name = item.querySelector('p span, p b, :scope > span:last-of-type')?.textContent?.trim() || 'item';
    const button = makePlayButton(`Play ${name} animation`);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      replayItem(item);
    });
    item.append(button);
  });

  toolItems.forEach((item) => {
    const playMark = document.createElement('span');
    playMark.className = 'skill-play';
    playMark.setAttribute('aria-hidden', 'true');
    playMark.append(document.createElement('span'));
    item.append(playMark);
  });

  const addPlayAll = (heading, items) => {
    if (!heading || !items.length) return;
    const button = makePlayButton('Play all animations', 'skills-play-all');
    button.append(document.createTextNode('Play All'));
    button.addEventListener('click', () => items.forEach((item, index) => {
      window.setTimeout(() => replayItem(item), index * 90);
    }));
    heading.append(button);
  };

  addPlayAll(skillsShowcase.querySelector('.skills-intro > h3'), technicalItems);
  addPlayAll(skillsShowcase.querySelector('.professional-skills > h3'), professionalItems);
  addPlayAll(skillsShowcase.querySelector('.skills-tools > h3'), toolItems);

  const enforceSkillsLayout = () => {
    const singleColumn = window.innerWidth <= 1050;
    const mobile = window.innerWidth <= 650;
    const intro = skillsShowcase.querySelector('.skills-intro');
    const technical = skillsShowcase.querySelector('.technical-skills');
    const professional = skillsShowcase.querySelector('.professional-skills');
    const tools = skillsShowcase.querySelector('.skills-tools');

    skillsShowcase.style.setProperty('display', 'grid', 'important');
    skillsShowcase.style.setProperty('height', 'auto', 'important');
    skillsShowcase.style.setProperty('grid-template-columns', singleColumn ? '1fr' : 'minmax(0, 1.08fr) minmax(420px, .92fr)', 'important');
    intro?.style.setProperty('display', 'contents', 'important');
    technical?.style.setProperty('display', 'grid', 'important');
    technical?.style.setProperty('grid-template-columns', '1fr', 'important');
    professional?.style.setProperty('display', 'grid', 'important');
    tools?.style.setProperty('display', 'grid', 'important');
    tools?.style.setProperty('height', 'auto', 'important');
    tools?.style.setProperty('grid-template-columns', mobile ? 'repeat(2, 1fr)' : singleColumn ? 'repeat(3, 1fr)' : 'repeat(6, minmax(100px, 1fr))', 'important');
    toolItems.forEach((item) => {
      item.style.setProperty('display', 'grid', 'important');
      item.style.setProperty('height', 'auto', 'important');
      item.style.setProperty('min-height', mobile ? '145px' : '164px', 'important');
    });
  };

  enforceSkillsLayout();
  window.addEventListener('resize', enforceSkillsLayout, { passive: true });
}

// Count the About statistics once when they enter the viewport.
const aboutStatNumbers = [...document.querySelectorAll('.about-stats strong')];
if (aboutStatNumbers.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateAboutNumber = (element) => {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';

    const original = element.textContent.trim();
    const target = Number.parseInt(original, 10);
    const suffix = original.replace(/[\d,.]/g, '');
    if (!Number.isFinite(target) || reducedMotion) return;

    const duration = 1450;
    const start = performance.now();
    element.classList.add('is-counting');

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = original;
        element.classList.remove('is-counting');
        element.classList.add('count-finished');
      }
    };

    requestAnimationFrame(update);
  };

  const aboutStatsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      aboutStatNumbers.forEach((number, index) => {
        window.setTimeout(() => animateAboutNumber(number), index * 130);
      });
      observer.disconnect();
    });
  }, { threshold: 0.35 });

  aboutStatsObserver.observe(aboutStatNumbers[0].closest('.about-stats'));
}

// Animate technical percentages and summary figures when Skills becomes visible.
const skillsCounterSection = document.querySelector('.skills-showcase');
if (skillsCounterSection) {
  const skillNumbers = [...skillsCounterSection.querySelectorAll('.skill-row > div > p strong, .skills-summary > div > b')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateSkillNumber = (element) => {
    if (element.dataset.skillCounted === 'true') return;
    element.dataset.skillCounted = 'true';

    const original = element.textContent.trim();
    const target = Number.parseInt(original, 10);
    const suffix = original.replace(/[\d,.]/g, '');
    if (!Number.isFinite(target) || reducedMotion) return;

    const start = performance.now();
    const duration = 1250;
    element.classList.add('is-skill-counting');

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = original;
        element.classList.remove('is-skill-counting');
        element.classList.add('skill-count-finished');
      }
    };

    requestAnimationFrame(update);
  };

  const skillsCounterObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    skillsCounterSection.classList.add('skills-counting');
    skillNumbers.forEach((number, index) => {
      window.setTimeout(() => animateSkillNumber(number), index * 90);
    });
    window.setTimeout(() => skillsCounterSection.classList.remove('skills-counting'), 1900);
    observer.disconnect();
  }, { threshold: 0.18 });

  skillsCounterObserver.observe(skillsCounterSection);
}

// Show certificate images inside the portfolio instead of opening raw PDF tabs.
const certificateModal = document.getElementById('certificate-modal');
if (certificateModal) {
  const modalImage = certificateModal.querySelector('.certificate-modal-image img');
  const modalTitle = certificateModal.querySelector('#certificate-modal-title');
  const modalPdf = certificateModal.querySelector('.certificate-modal-pdf');
  const closeButtons = certificateModal.querySelectorAll('.certificate-modal-close, .certificate-modal-back');
  let lastCertificateTrigger = null;

  const closeCertificateModal = () => {
    certificateModal.classList.remove('is-open');
    document.body.classList.remove('certificate-view-open');
    window.setTimeout(() => { certificateModal.hidden = true; }, 220);
    lastCertificateTrigger?.focus();
  };

  document.querySelectorAll('.certificate-card > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const card = link.closest('.certificate-card');
      const preview = card?.querySelector('.certificate-preview img');
      const title = card?.querySelector('.certificate-info h3')?.textContent?.trim() || 'Certificate';
      if (!preview || !modalImage || !modalTitle || !modalPdf) return;

      lastCertificateTrigger = link;
      modalImage.src = preview.currentSrc || preview.src;
      modalImage.alt = preview.alt;
      modalTitle.textContent = title;
      const pdfFileName = new URL(link.href, window.location.href).pathname.split('/').pop();
      modalPdf.href = `certificate-viewer.html?file=${encodeURIComponent(pdfFileName)}&title=${encodeURIComponent(title)}`;
      certificateModal.hidden = false;
      document.body.classList.add('certificate-view-open');
      requestAnimationFrame(() => certificateModal.classList.add('is-open'));
      certificateModal.querySelector('.certificate-modal-close')?.focus();
    });
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeCertificateModal));
  certificateModal.addEventListener('click', (event) => {
    if (event.target === certificateModal) closeCertificateModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !certificateModal.hidden) closeCertificateModal();
  });
}
