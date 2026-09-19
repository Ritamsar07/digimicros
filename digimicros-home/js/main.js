/* ==========================================================================
   DigiMicros: Home page interactions
   Vanilla JS: header scroll state, mobile nav, modal, scroll reveals,
   magnetic buttons, form handling. No external dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     Sticky header: transparent-over-hero -> glass on scroll
     ----------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* -----------------------------------------------------------------------
     Mobile nav toggle
     ----------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navScrim = document.getElementById("navScrim");
  var mainNav = document.getElementById("mainNav");

  function closeMobileNav() {
    document.documentElement.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  function toggleMobileNav() {
    var isOpen = document.documentElement.classList.toggle("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", String(isOpen));
  }
  if (navToggle) navToggle.addEventListener("click", toggleMobileNav);
  if (navScrim) navScrim.addEventListener("click", closeMobileNav);

  // Close mobile nav on Escape, and on nav link click
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });
  if (mainNav) {
    mainNav.querySelectorAll(".nav-list a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1023px)").matches) closeMobileNav();
      });
    });
  }

  // Services dropdown: accordion behavior on mobile, hover/focus on desktop (CSS handles desktop)
  var servicesDropdown = document.getElementById("servicesDropdown");
  var dropdownToggleIcon = servicesDropdown ? servicesDropdown.querySelector(".dropdown-toggle-icon") : null;
  if (dropdownToggleIcon) {
    dropdownToggleIcon.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (!isMobile) return;
      var expanded = servicesDropdown.classList.toggle("is-expanded");
      var navLink = servicesDropdown.querySelector(".nav-link");
      if (navLink) navLink.setAttribute("aria-expanded", String(expanded));
      dropdownToggleIcon.setAttribute("aria-expanded", String(expanded));
    });
  }

  /* -----------------------------------------------------------------------
     Modal: Request a Meeting (sitewide)
     ----------------------------------------------------------------------- */
  var openTriggers = document.querySelectorAll("[data-open-modal]");
  var lastFocusedEl = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.hidden = false;
    // force reflow so the transition runs
    void modal.offsetWidth;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Play video if modal contains one
    var videoEl = modal.querySelector("video");
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(function () {});
    }

    var focusable = modal.querySelector("select, input, textarea, button");
    if (focusable) focusable.focus();
    document.addEventListener("keydown", trapFocus);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";

    // Pause video if modal contains one
    var videoEl = modal.querySelector("video");
    if (videoEl) {
      videoEl.pause();
    }

    document.removeEventListener("keydown", trapFocus);
    window.setTimeout(function () {
      modal.hidden = true;
    }, 400);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function trapFocus(e) {
    var modal = document.querySelector(".modal-overlay.is-open");
    if (!modal) return;
    if (e.key === "Escape") {
      closeModal(modal);
      return;
    }
    if (e.key !== "Tab") return;
    var focusableEls = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusableEls.length) return;
    var first = focusableEls[0];
    var last = focusableEls[focusableEls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var modal = document.getElementById(trigger.getAttribute("data-open-modal"));
      openModal(modal);
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
    var closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", function () { closeModal(overlay); });
  });

  /* -----------------------------------------------------------------------
     Scroll-triggered reveals
     ----------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var revealGroups = document.querySelectorAll("[data-reveal-group]");

  revealGroups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute("data-reveal", "");
      child.style.setProperty("--i", i);
    });
  });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -----------------------------------------------------------------------
     Hero headline reveal on load
     ----------------------------------------------------------------------- */
  function revealHero(heading) {
    if (!heading) return;
    heading.classList.add("is-revealed");
    var copy = heading.closest(".hero-copy");
    if (copy) copy.classList.add("is-revealed");
    var hero = heading.closest(".hero");
    if (hero) hero.classList.add("is-revealed");
  }
  // Reveal as soon as the DOM is usable. Waiting on window.load would hold the
  // headline back until every subresource (the hero video, fonts, images) had
  // finished downloading, which made the copy appear seconds late.
  function startHeroReveal() {
    var heroHeading = document.getElementById("heroHeading");
    if (!heroHeading) return;
    window.requestAnimationFrame(function () { revealHero(heroHeading); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHeroReveal, { once: true });
  } else {
    // This script is deferred, so the DOM is already parsed by the time it runs
    startHeroReveal();
  }

  /* -----------------------------------------------------------------------
     Hero background video: keep it playing, muted, with an autoplay fallback
     ----------------------------------------------------------------------- */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.muted = true;
    var playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        document.addEventListener("click", function startOnUser() {
          heroVideo.play().catch(function () {});
          document.removeEventListener("click", startOnUser);
        }, { once: true });
      });
    }
  }

  /* -----------------------------------------------------------------------
     Interactive Cyber Particle Network Canvas
     ----------------------------------------------------------------------- */
  var heroCanvas = document.getElementById("heroCanvas");
  if (heroCanvas && !prefersReducedMotion) {
    var ctx = heroCanvas.getContext("2d");
    var width = 0;
    var height = 0;
    var particles = [];
    var maxParticles = 42;
    var mouse = { x: -9999, y: -9999, active: false };

    function resizeCanvas() {
      var rect = heroCanvas.parentElement.getBoundingClientRect();
      width = heroCanvas.width = rect.width;
      height = heroCanvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Track mouse over hero section
    var heroEl = document.getElementById("hero");
    if (heroEl) {
      heroEl.addEventListener("mousemove", function (e) {
        var rect = heroEl.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      heroEl.addEventListener("mouseleave", function () {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    // Particle constructor
    function Particle() {
      this.x = Math.random() * (width || 1200);
      this.y = Math.random() * (height || 800);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1.2;
      this.color = Math.random() > 0.4 ? "rgba(0, 212, 199," : "rgba(46, 111, 242,";
      this.alpha = Math.random() * 0.4 + 0.3;
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;

      // Cursor gentle interaction
      if (mouse.active) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          var force = (140 - dist) / 140;
          this.x -= (dx / dist) * force * 0.8;
          this.y -= (dy / dist) * force * 0.8;
        }
      }
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.fill();
    };

    for (var i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    var isHeroVisible = true;
    if ("IntersectionObserver" in window) {
      var heroObs = new IntersectionObserver(function (entries) {
        isHeroVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      if (heroEl) heroObs.observe(heroEl);
    }

    function animateParticles() {
      if (isHeroVisible && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var p1 = particles[i];
            var p2 = particles[j];
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              var lineAlpha = (1 - dist / 110) * 0.22;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = "rgba(0, 212, 199, " + lineAlpha + ")";
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Cursor connection line
          if (mouse.active) {
            var mdx = particles[i].x - mouse.x;
            var mdy = particles[i].y - mouse.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 130) {
              var mAlpha = (1 - mdist / 130) * 0.35;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = "rgba(0, 212, 199, " + mAlpha + ")";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          particles[i].update();
          particles[i].draw();
        }
      }
      window.requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* -----------------------------------------------------------------------
     Magnetic buttons (subtle pointer-follow on primary CTAs, desktop only)
     ----------------------------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn-primary, .btn-light").forEach(function (btn) {
      btn.classList.add("magnetic");
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty("--mx", (x * 0.18).toFixed(1) + "px");
        btn.style.setProperty("--my", (y * 0.35).toFixed(1) + "px");
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  }

  /* -----------------------------------------------------------------------
     Form delivery
     Every form posts to FormSubmit, which emails the submission to the
     DigiMicros inbox. The first submission triggers a one-time activation
     email to that inbox; nothing is delivered until it is confirmed.
     ----------------------------------------------------------------------- */
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/digimicros25@gmail.com";

  function formMessage(form, className, text) {
    var el = form.querySelector("." + className);
    if (!el) {
      el = document.createElement("p");
      el.className = className;
      el.setAttribute("role", className === "form-error" ? "alert" : "status");
      form.appendChild(el);
    }
    if (text) el.textContent = text;
    return el;
  }

  function wireForm(formId, successId, subject, resetDelay, autoReply) {
    var form = document.getElementById(formId);
    if (!form) return;
    var success = document.getElementById(successId);
    var submitBtn = form.querySelector('[type="submit"]');

    // Honeypot: invisible to people, bots fill it in and FormSubmit drops them
    var honey = document.createElement("input");
    honey.type = "text";
    honey.name = "_honey";
    honey.tabIndex = -1;
    honey.autocomplete = "off";
    honey.setAttribute("aria-hidden", "true");
    honey.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0;";
    form.appendChild(honey);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var error = form.querySelector(".form-error");
      if (error) error.classList.remove("is-visible");

      var data = new FormData(form);
      data.append("_subject", "DigiMicros website: " + subject);
      data.append("_template", "table");
      data.append("_captcha", "false");
      data.append("Submitted from", window.location.href);
      if (data.get("email")) {
        data.append("_replyto", data.get("email"));
        // FormSubmit sends this text to the visitor's own address as a confirmation
        if (autoReply) data.append("_autoresponse", autoReply);
      }

      var btnLabel = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.textContent.trim()) submitBtn.textContent = "Sending...";
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (res) {
          return res.json().then(function (json) { return { ok: res.ok, json: json }; });
        })
        .then(function (r) {
          if (!r.ok || String(r.json.success) !== "true") throw new Error(r.json.message || "send failed");
          form.reset();
          if (success) {
            success.classList.add("is-visible");
            window.setTimeout(function () { success.classList.remove("is-visible"); }, resetDelay || 6000);
          }
        })
        .catch(function () {
          formMessage(form, "form-error",
            "Sorry, that didn't go through. Please try again, or call us on 1 (800) 647-3107.")
            .classList.add("is-visible");
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = btnLabel;
          }
        });
    });
  }

  var SIGN_OFF = "\n\nIf anything is urgent, call us on 1 (800) 647-3107.\n\nThe DigiMicros Team\nExcellence Of Execution";

  wireForm("meetingForm", "mtgSuccess", "Meeting request", null,
    "Thank you for requesting a meeting with DigiMicros.\n\n" +
    "We've received your request, and one of our advisors will contact you within one business day " +
    "to confirm a time that works for you." + SIGN_OFF);

  wireForm("contactPageForm", "cSuccess", "Contact form message", null,
    "Thank you for contacting DigiMicros.\n\n" +
    "We've received your message, and one of our advisors will get back to you within one business day." +
    SIGN_OFF);

  wireForm("callbackForm", "callbackSuccess", "Call-back request", 5000);

  /* -----------------------------------------------------------------------
     Meeting request: date / time / time zone helpers
     - open the native calendar on click instead of making people type
     - block past dates
     - preselect the visitor's own time zone when we can detect it
     ----------------------------------------------------------------------- */
  var mtgDate = document.getElementById("mtgDate");
  if (mtgDate) {
    var today = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    mtgDate.min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
  }

  // showPicker() lets a click anywhere on the field open the native picker.
  // It throws if called without a user gesture, so it is guarded.
  document.querySelectorAll('input[type="date"], input[type="time"]').forEach(function (input) {
    input.addEventListener("click", function () {
      if (typeof input.showPicker === "function") {
        try { input.showPicker(); } catch (err) { /* not user-initiated, ignore */ }
      }
    });
  });

  var mtgTimezone = document.getElementById("mtgTimezone");
  if (mtgTimezone && window.Intl && Intl.DateTimeFormat) {
    try {
      var localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var match = Array.prototype.find.call(mtgTimezone.options, function (opt) {
        return opt.value === localZone;
      });
      if (match) mtgTimezone.value = localZone;
    } catch (err) { /* keep the default selection */ }
  }

  /* -----------------------------------------------------------------------
     Footer copyright year
     ----------------------------------------------------------------------- */
  var yearEl = document.getElementById("copyrightYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     Auto-scrolling case study rail: drifts right on its own, pauses while
     the visitor is interacting with it, loops back to the start at the end.
     ----------------------------------------------------------------------- */
  document.querySelectorAll(".case-scroll, .blog-rail").forEach(function (rail) {
    var wrap = rail.closest(".rail-wrap") || rail.closest("section");
    var prevBtn = wrap && wrap.querySelector("[data-rail-prev]");
    var nextBtn = wrap && wrap.querySelector("[data-rail-next]");

    var paused = false;
    var resumeTimer = null;
    var STEP_INTERVAL = 4000; // advance one card every 4s

    function pause(ms) {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () { paused = false; }, ms || STEP_INTERVAL);
    }

    function cardStep() {
      var card = rail.firstElementChild;
      if (!card) return rail.clientWidth * 0.8;
      var styles = window.getComputedStyle(rail);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function nudgeRail(direction) {
      var max = rail.scrollWidth - rail.clientWidth;
      var target = rail.scrollLeft + direction * cardStep();
      // Wrap around at both ends so the arrows never dead-end
      if (target > max + 1) target = 0;
      if (target < -1) target = max;
      // Hold the drift while the click-driven scroll plays out
      pause(3200);
      rail.scrollTo({ left: target, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { nudgeRail(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { nudgeRail(1); });

    if (prefersReducedMotion) return;

    ["pointerdown", "wheel", "touchstart"].forEach(function (evt) {
      rail.addEventListener(evt, function () { pause(); }, { passive: true });
    });
    rail.addEventListener("mouseenter", function () { paused = true; });
    rail.addEventListener("mouseleave", function () {
      paused = false;
      if (resumeTimer) window.clearTimeout(resumeTimer);
    });

    // Auto-advance one card to the right every 4 seconds, wrapping at the end
    window.setInterval(function () {
      if (paused) return;
      if (rail.scrollWidth <= rail.clientWidth) return;
      var max = rail.scrollWidth - rail.clientWidth;
      var target = rail.scrollLeft + cardStep();
      if (target > max - 1) target = 0;
      rail.scrollTo({ left: target, behavior: "smooth" });
    }, STEP_INTERVAL);
  });
})();
