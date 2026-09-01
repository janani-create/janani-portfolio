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
// Show practical details for each professional skill.
const professionalSkillCards = [...document.querySelectorAll('.professional-skills .professional-row')];
if (professionalSkillCards.length) {
  const skillContent = {
    'Problem Solving': ['I break complex problems into clear, manageable steps.', 'Debugging issues, comparing solutions and selecting the most reliable approach.'],
    'Communication': ['I explain ideas clearly and listen carefully to feedback.', 'Sharing progress, documenting work and discussing requirements with a team or client.'],
    'Time Management': ['I organize tasks by priority and work toward realistic deadlines.', 'Planning milestones, tracking progress and completing important work on time.'],
    'Teamwork': ['I collaborate respectfully and contribute toward shared goals.', 'Coordinating tasks, supporting team members and combining ideas effectively.'],
    'Adaptability': ['I learn quickly and stay productive when requirements change.', 'Working with new tools, updated designs and unexpected project challenges.'],
    'Creativity': ['I explore thoughtful ideas that balance appearance and usability.', 'Creating engaging interfaces, visual concepts and alternative solutions.'],
    'Critical Thinking': ['I evaluate information carefully before making decisions.', 'Checking assumptions, identifying risks and choosing evidence-based solutions.'],
    'Organization': ['I keep files, tasks and project information structured and accessible.', 'Maintaining clear folders, reusable components and consistent development workflows.']
  };

  const modal = document.createElement('div');
  modal.className = 'professional-dialog';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="professional-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="professional-dialog-title">
      <button class="professional-dialog-close" type="button" aria-label="Close skill details"><i class="bx bx-x"></i></button>
      <span class="professional-dialog-icon" aria-hidden="true"></span>
      <span class="professional-dialog-kicker">Professional skill</span>
      <h2 id="professional-dialog-title"></h2>
      <div class="professional-dialog-level"><span>Strength</span><strong></strong><i><b></b></i></div>
      <p class="professional-dialog-description"></p>
      <div class="professional-dialog-example"><i class="bx bx-bulb"></i><p><strong>In practice</strong><span></span></p></div>
    </div>`;
  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.professional-dialog-close');
  const title = modal.querySelector('#professional-dialog-title');
  const icon = modal.querySelector('.professional-dialog-icon');
  const levelText = modal.querySelector('.professional-dialog-level strong');
  const levelBar = modal.querySelector('.professional-dialog-level b');
  const description = modal.querySelector('.professional-dialog-description');
  const example = modal.querySelector('.professional-dialog-example span');
  let activeSkill = null;

  const closeProfessionalDialog = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('professional-dialog-open');
    window.setTimeout(() => { modal.hidden = true; }, 200);
    activeSkill?.focus();
  };

  const openProfessionalDialog = (card) => {
    const name = card.querySelector('b')?.textContent.trim() || 'Professional Skill';
    const level = card.querySelector('strong')?.textContent.trim() || '85%';
    const sourceIcon = card.querySelector('.professional-icon img');
    const content = skillContent[name] || ['A valuable professional capability.', 'Applied throughout planning and project delivery.'];
    activeSkill = card;
    title.textContent = name;
    levelText.textContent = level;
    levelBar.style.width = level;
    description.textContent = content[0];
    example.textContent = content[1];
    icon.innerHTML = sourceIcon ? `<img src="${sourceIcon.src}" alt="">` : '<i class="bx bx-star"></i>';
    modal.hidden = false;
    document.body.classList.add('professional-dialog-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    closeButton.focus();
  };

  professionalSkillCards.forEach((card) => {
    const name = card.querySelector('b')?.textContent.trim() || 'professional skill';
    card.tabIndex = 0;
    card.setAttribute('aria-label', `View details about ${name}`);
    card.addEventListener('click', () => openProfessionalDialog(card));
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openProfessionalDialog(card);
    });
  });

  closeButton.addEventListener('click', closeProfessionalDialog);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeProfessionalDialog(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeProfessionalDialog();
  });
}

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

// Keep certificates ordered from newest to oldest on both certificate galleries.
// Open an accessible details dialog when a service card is selected.
const serviceCards = [...document.querySelectorAll('.services .servicesItem')];
if (serviceCards.length) {
  const serviceDetails = {
    'Web Development': ['Responsive business and portfolio websites', 'Clean, maintainable front-end code', 'Cross-browser and mobile support'],
    'Responsive Design': ['Mobile, tablet and desktop layouts', 'Flexible grids and readable typography', 'Touch-friendly navigation and controls'],
    'UI/UX Design': ['User-friendly page structure', 'Wireframes and interface planning', 'Consistent visual design systems'],
    'Performance Optimization': ['Page-speed and asset improvements', 'Responsive image optimization', 'Cleaner loading and interaction performance'],
    'Database Management': ['Well-structured relational databases', 'Optimized queries and data workflows', 'Reliable CRUD operations and reporting'],
    'API Development': ['RESTful endpoint development', 'Front-end and back-end integration', 'Structured validation and error handling'],
    'Bug Fixing & Maintenance': ['Interface and functionality troubleshooting', 'Responsive layout corrections', 'Ongoing improvements and updates'],
    'Deployment': ['Production-ready project setup', 'Database and environment configuration', 'Launch checks and post-deployment support']
  };

  const dialog = document.createElement('div');
  dialog.className = 'service-dialog';
  dialog.hidden = true;
  dialog.innerHTML = `
    <div class="service-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="service-dialog-title">
      <button class="service-dialog-close" type="button" aria-label="Close service details"><i class="bx bx-x"></i></button>
      <span class="service-dialog-icon" aria-hidden="true"></span>
      <span class="service-dialog-kicker">Service details</span>
      <h2 id="service-dialog-title"></h2>
      <p class="service-dialog-copy"></p>
      <ul class="service-dialog-list"></ul>
      <a class="service-dialog-action" href="#contact"><i class="bx bx-message-rounded-dots"></i> Discuss this service <span aria-hidden="true">&rarr;</span></a>
    </div>`;
  document.body.appendChild(dialog);

  const title = dialog.querySelector('#service-dialog-title');
  const copy = dialog.querySelector('.service-dialog-copy');
  const list = dialog.querySelector('.service-dialog-list');
  const icon = dialog.querySelector('.service-dialog-icon');
  const closeButton = dialog.querySelector('.service-dialog-close');
  let activeCard = null;

  const closeServiceDialog = (restoreFocus = true) => {
    dialog.classList.remove('is-open');
    document.body.classList.remove('service-dialog-open');
    window.setTimeout(() => { dialog.hidden = true; }, 200);
    if (restoreFocus) activeCard?.focus();
  };

  const openServiceDialog = (card) => {
    const serviceTitle = card.querySelector('h3')?.textContent.trim() || 'Service';
    const serviceCopy = card.querySelector('p')?.textContent.trim() || '';
    const serviceIcon = card.querySelector('.icon-services img');
    activeCard = card;
    title.textContent = serviceTitle;
    copy.textContent = serviceCopy;
    icon.innerHTML = serviceIcon ? `<img src="${serviceIcon.src}" alt="">` : '<i class="bx bx-star"></i>';
    list.innerHTML = (serviceDetails[serviceTitle] || []).map((item) => `<li><i class="bx bx-check"></i><span>${item}</span></li>`).join('');
    dialog.classList.toggle('is-orange', card.classList.contains('service-orange'));
    dialog.hidden = false;
    document.body.classList.add('service-dialog-open');
    requestAnimationFrame(() => dialog.classList.add('is-open'));
    closeButton.focus();
  };

  serviceCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details about ${card.querySelector('h3')?.textContent.trim() || 'this service'}`);
    card.addEventListener('click', () => openServiceDialog(card));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openServiceDialog(card);
    });
  });

  closeButton.addEventListener('click', closeServiceDialog);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeServiceDialog(); });
  dialog.querySelector('.service-dialog-action').addEventListener('click', () => closeServiceDialog(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) closeServiceDialog();
  });
}

document.querySelectorAll('.certificate-grid').forEach((grid) => {
  const cards = [...grid.querySelectorAll('.certificate-card')];
  cards
    .sort((firstCard, secondCard) => {
      const firstDate = Date.parse(firstCard.querySelector('time')?.textContent.trim() || '') || 0;
      const secondDate = Date.parse(secondCard.querySelector('time')?.textContent.trim() || '') || 0;
      return secondDate - firstDate;
    })
    .forEach((card) => grid.appendChild(card));
});

const getCertificateCategory = (card) => {
  const title = card.querySelector('.certificate-info h3')?.textContent.toLowerCase() || '';
  if (title.includes('ai/ml') || title.includes('tensorflow')) return 'ai';
  if (title.includes('graphic design') || title.includes('web design') || title === 'figma') return 'design';
  if (title.includes('project management') || title.includes('appreciation')) return 'management';
  if (title.includes('ict') || title.includes('office applications')) return 'ict';
  if (title.includes('python') || title.includes('c programming') || title.includes('visual basic')) return 'programming';
  return 'other';
};

document.querySelectorAll('.certificates').forEach((section) => {
  const grid = section.querySelector('.certificate-grid');
  const filters = section.querySelectorAll('[data-certificate-filter]');
  if (!grid || !filters.length) return;

  const cards = [...grid.querySelectorAll('.certificate-card')];
  cards.forEach((card) => { card.dataset.category = getCertificateCategory(card); });

  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.certificateFilter;
    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    grid.classList.toggle('is-filtering', category !== 'all');
    cards.forEach((card) => {
      card.classList.toggle('is-filter-hidden', category !== 'all' && card.dataset.category !== category);
    });
  }));
});

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
