"use strict";

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
  const roles = ["Web Developer", "Graphic Designer"];
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
