document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const navList = document.getElementById("navList");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("themeToggle");
  const scrollProgress = document.getElementById("scrollProgress");
  const typedEl = document.getElementById("typed");
  const filters = document.getElementById("filters");
  const projects = document.querySelectorAll(".project");
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  /* ---------- Year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });

  /* ---------- Mobile menu ---------- */
  burger.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Scroll: header, progress, active link ---------- */
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${(y / max) * 100}%`;

    let current = "";
    sections.forEach((section) => {
      if (y >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Typing effect ---------- */
  const phrases = [
    "Фронтенд-разработчик",
    "Люблю чистый код",
    "Делаю красивые интерфейсы",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const phrase = phrases[phraseIndex];
    typedEl.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    } else {
      charIndex += deleting ? -1 : 1;
    }
    setTimeout(type, delay);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    type();
  } else {
    typedEl.textContent = phrases[0];
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("skill")) {
            animateSkill(entry.target);
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  function animateSkill(skill) {
    const bar = skill.querySelector(".skill-bar span");
    requestAnimationFrame(() => {
      bar.style.width = `${skill.dataset.level}%`;
    });
  }

  /* ---------- Project filters ---------- */
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;

    filters.querySelectorAll(".filter").forEach((f) => f.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    projects.forEach((project) => {
      const show = filter === "all" || project.dataset.category === filter;
      project.classList.toggle("hide", !show);
    });
  });

  /* ---------- Contact form ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    const wrapper = field.closest(".form-field");
    const error = wrapper.querySelector(".form-error");
    wrapper.classList.toggle("invalid", Boolean(message));
    error.textContent = message || "";
  }

  function validateField(field) {
    const value = field.value.trim();
    let message = "";
    if (!value) {
      message = "Обязательное поле";
    } else if (field.type === "email" && !emailRegex.test(value)) {
      message = "Введите корректный email";
    } else if (field.id === "message" && value.length < 10) {
      message = "Минимум 10 символов";
    }
    setError(field, message);
    return !message;
  }

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-field").classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input, textarea")];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) return;

    formSuccess.hidden = false;
    form.reset();
    setTimeout(() => {
      formSuccess.hidden = true;
    }, 5000);
  });
});
