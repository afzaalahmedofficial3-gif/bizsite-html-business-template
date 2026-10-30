/* ==========================================================================
   BizSite — main script (shared by all pages)
   --------------------------------------------------------------------------
   Intentionally small vanilla JavaScript. Features:
   1. Dark / light mode toggle (persisted in localStorage)
   2. Mobile navigation toggle
   3. Testimonial slider (prev / next / dots, keyboard friendly)
   4. FAQ accordion
   5. Scroll-reveal animations (IntersectionObserver)
   6. Animated stat counters (IntersectionObserver)
   7. Back-to-top button
   8. Newsletter + contact form front-end validation
   9. Automatic footer year
   ========================================================================== */

(function () {
  "use strict";

  /* Mark the document as JS-enabled so reveal animations can apply */
  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     1. Dark / light mode
     On load, restore the saved theme (if any) before wiring the toggle.
     ------------------------------------------------------------------ */
  try {
    var savedTheme = localStorage.getItem("bizsite-theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  } catch (e) {
    /* localStorage unavailable — fall back to the default light theme */
  }

  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      try {
        localStorage.setItem("bizsite-theme", next);
      } catch (e) {
        /* localStorage unavailable (private mode) — toggle still works */
      }
    });
  }

  /* ------------------------------------------------------------------
     2. Mobile navigation
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav__list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navList.classList.toggle("nav__list--open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    /* Close the menu after a link is tapped */
    navList.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navList.classList.remove("nav__list--open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Testimonial slider
     ------------------------------------------------------------------ */
  var track = document.querySelector(".slider__track");
  if (track) {
    var slides = track.children;
    var dotsWrap = document.querySelector(".slider__dots");
    var prevBtn = document.querySelector(".slider__btn--prev");
    var nextBtn = document.querySelector(".slider__btn--next");
    var index = 0;
    var dots = [];

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, d) {
        dot.classList.toggle("slider__dot--active", d === index);
        dot.setAttribute("aria-current", d === index ? "true" : "false");
      });
    }

    if (dotsWrap) {
      for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider__dot";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener(
          "click",
          (function (n) {
            return function () {
              goTo(n);
            };
          })(i)
        );
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }
    goTo(0);
  }

  /* ------------------------------------------------------------------
     4. FAQ accordion
     ------------------------------------------------------------------ */
  document.querySelectorAll(".faq__question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var answer = document.getElementById(
        btn.getAttribute("aria-controls")
      );
      var isOpen = btn.getAttribute("aria-expanded") === "true";

      /* Close any other open item */
      document
        .querySelectorAll('.faq__question[aria-expanded="true"]')
        .forEach(function (other) {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            document.getElementById(
              other.getAttribute("aria-controls")
            ).style.maxHeight = null;
          }
        });

      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      if (answer) {
        answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
      }
    });
  });

  /* ------------------------------------------------------------------
     5. Scroll reveal
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  }

  /* ------------------------------------------------------------------
     6. Animated counters  —  <span data-count="250" data-suffix="+">
     ------------------------------------------------------------------ */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var startTime = null;
    function step(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      el.textContent =
        Math.round(target * progress).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ------------------------------------------------------------------
     7. Back to top
     ------------------------------------------------------------------ */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle(
          "back-to-top--visible",
          window.scrollY > 500
        );
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     8. Form validation helpers
     ------------------------------------------------------------------ */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(input, message) {
    var errorEl = document.getElementById(input.id + "-error");
    if (errorEl) errorEl.textContent = message || "";
    input.classList.toggle("form__control--invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  /* Newsletter form (footer, present on every page) */
  var newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    var newsInput = newsletterForm.querySelector('input[type="email"]');
    var newsMsg = document.querySelector(".newsletter-msg");
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = newsInput.value.trim();
      if (!isValidEmail(value)) {
        newsMsg.textContent = "Please enter a valid email address.";
        newsMsg.className = "newsletter-msg newsletter-msg--error";
        newsInput.focus();
        return;
      }
      newsMsg.textContent =
        "Thank you for subscribing! Please check your inbox to confirm.";
      newsMsg.className = "newsletter-msg newsletter-msg--success";
      newsletterForm.reset();
    });
  }

  /* Contact form (contact page only — front-end validation demo) */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;

      var name = document.getElementById("cf-name");
      var email = document.getElementById("cf-email");
      var subject = document.getElementById("cf-subject");
      var message = document.getElementById("cf-message");

      if (name.value.trim().length < 2) {
        setError(name, "Please enter your name.");
        valid = false;
      } else setError(name, "");

      if (!isValidEmail(email.value.trim())) {
        setError(email, "Please enter a valid email address.");
        valid = false;
      } else setError(email, "");

      if (subject.value.trim().length < 3) {
        setError(subject, "Please enter a subject.");
        valid = false;
      } else setError(subject, "");

      if (message.value.trim().length < 10) {
        setError(message, "Please write a message (at least 10 characters).");
        valid = false;
      } else setError(message, "");

      var success = document.getElementById("form-success");
      if (valid) {
        success.classList.add("form__success--visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
        contactForm.reset();
      } else {
        success.classList.remove("form__success--visible");
        var firstInvalid = contactForm.querySelector(
          ".form__control--invalid"
        );
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     9. Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
