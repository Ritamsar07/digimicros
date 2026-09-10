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
  window.addEventListener("load", function () {
    var heroHeading = document.getElementById("heroHeading");
    if (heroHeading) {
      window.requestAnimationFrame(function () { revealHero(heroHeading); });
    }
  });
  // Fallback in case 'load' already fired or is slow
  if (document.readyState === "complete") {
    revealHero(document.getElementById("heroHeading"));
  }

  /* -----------------------------------------------------------------------
     Hero Video Controller (Stream switcher, play/pause, sound toggle)
     ----------------------------------------------------------------------- */
  var heroVideo = document.getElementById("heroVideo");
  var heroVideoSource = document.getElementById("heroVideoSource");
  var streamBtns = document.querySelectorAll("[data-stream]");
  var videoPlayPauseBtn = document.getElementById("videoPlayPauseBtn");
  var videoMuteBtn = document.getElementById("videoMuteBtn");

  if (heroVideo) {
    // Autoplay fallback safeguard
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

    // Stream switching (Neural Matrix vs Global Defense)
    streamBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetSrc = btn.getAttribute("data-stream");
        if (!targetSrc || btn.classList.contains("is-active")) return;

        streamBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        heroVideo.style.opacity = "0.2";
        window.setTimeout(function () {
          heroVideo.src = targetSrc;
          heroVideo.load();
          heroVideo.play().catch(function () {});
          heroVideo.style.opacity = "";
        }, 300);
      });
    });

    // Play/Pause toggle
    if (videoPlayPauseBtn) {
      var iconPause = videoPlayPauseBtn.querySelector(".icon-pause");
      var iconPlay = videoPlayPauseBtn.querySelector(".icon-play");

      videoPlayPauseBtn.addEventListener("click", function () {
        if (heroVideo.paused) {
          heroVideo.play().catch(function () {});
          heroVideo.classList.remove("is-paused");
          if (iconPause) iconPause.style.display = "";
          if (iconPlay) iconPlay.style.display = "none";
          videoPlayPauseBtn.setAttribute("aria-label", "Pause background video");
        } else {
          heroVideo.pause();
          heroVideo.classList.add("is-paused");
          if (iconPause) iconPause.style.display = "none";
          if (iconPlay) iconPlay.style.display = "";
          videoPlayPauseBtn.setAttribute("aria-label", "Play background video");
        }
      });
    }

    // Mute/Sound toggle
    if (videoMuteBtn) {
      videoMuteBtn.addEventListener("click", function () {
        heroVideo.muted = !heroVideo.muted;
        if (heroVideo.muted) {
          videoMuteBtn.title = "Video Muted";
          videoMuteBtn.style.color = "";
        } else {
          videoMuteBtn.title = "Audio Active";
          videoMuteBtn.style.color = "var(--color-accent)";
        }
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
     Form handling (demo only, no backend wired up)
     ----------------------------------------------------------------------- */
  function handleDemoForm(formId, successId, resetDelay) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (success) success.classList.add("is-visible");
      form.reset();
      if (success) {
        window.setTimeout(function () {
          success.classList.remove("is-visible");
        }, resetDelay || 6000);
      }
    });
  }
  handleDemoForm("meetingForm", "mtgSuccess");
  handleDemoForm("getInTouchForm", "gitSuccess");
  handleDemoForm("callbackForm", "callbackSuccess", 5000);
  handleDemoForm("contactPageForm", "cSuccess");

  /* -----------------------------------------------------------------------
     Footer copyright year
     ----------------------------------------------------------------------- */
  var yearEl = document.getElementById("copyrightYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
