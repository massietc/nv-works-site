(() => {
  "use strict";

  const header = document.querySelector(".header");
  const button = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

  const closeMenu = () => {
    if (!button || !nav) return;

    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (button && nav) {
    button.addEventListener("click", () => {
      const open =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        String(!open)
      );

      nav.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 15
    );
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

  document
    .querySelectorAll("[data-year]")
    .forEach((element) => {
      element.textContent =
        new Date().getFullYear();
    });

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  document
    .querySelectorAll(".stars")
    .forEach((canvas) => {
      const context =
        canvas.getContext("2d");

      if (!context) return;

      let width = 0;
      let height = 0;
      let stars = [];

      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      const resizeCanvas = () => {
        const box =
          canvas.getBoundingClientRect();

        const ratio =
          Math.min(
            window.devicePixelRatio || 1,
            2
          );

        width = box.width;
        height = box.height;

        canvas.width =
          Math.max(1, width * ratio);

        canvas.height =
          Math.max(1, height * ratio);

        context.setTransform(
          ratio,
          0,
          0,
          ratio,
          0,
          0
        );

        stars = Array.from(
          {
            length: Math.max(
              65,
              Math.floor(
                width * height / 12000
              )
            )
          },
          () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius:
              Math.random() * 1.35 + 0.2,
            opacity:
              Math.random() * 0.7 + 0.15,
            speed:
              Math.random() * 0.002 + 0.0007,
            phase:
              Math.random() * Math.PI * 2
          })
        );
      };

      const drawStars = (time) => {
        context.clearRect(
          0,
          0,
          width,
          height
        );

        stars.forEach((star) => {
          const opacity =
            reducedMotion
              ? star.opacity
              : star.opacity *
                (
                  0.65 +
                  Math.sin(
                    time * star.speed +
                    star.phase
                  ) *
                  0.35
                );

          context.beginPath();

          context.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
          );

          context.fillStyle =
            `rgba(255,255,255,${
              Math.max(0.08, opacity)
            })`;

          context.shadowBlur =
            star.radius > 1 ? 7 : 2;

          context.shadowColor = "white";

          context.fill();
        });

        context.shadowBlur = 0;

        if (!reducedMotion) {
          window.requestAnimationFrame(
            drawStars
          );
        }
      };

      resizeCanvas();
      drawStars(0);

      window.addEventListener(
        "resize",
        resizeCanvas
      );
    });

  const form =
    document.querySelector("#quoteForm");

  if (!form) return;

  const service =
    form.querySelector("#service");

  const ambientPanel =
    form.querySelector(
      '[data-panel="ambient"]'
    );

  const starlightPanel =
    form.querySelector(
      '[data-panel="starlight"]'
    );

  const formSections =
    form.querySelectorAll(
      ".form-section, .submit-area"
    );

  const successPanel =
    form.querySelector(".success");

  const resetButton =
    form.querySelector("[data-reset]");

  const dateInput =
    form.querySelector("#date");

  if (dateInput) {
    const today =
      new Date(
        Date.now() -
        new Date().getTimezoneOffset() *
        60000
      );

    dateInput.min =
      today
        .toISOString()
        .split("T")[0];
  }

  const showPanel = (
    panel,
    shouldShow
  ) => {
    if (!panel) return;

    panel.hidden = !shouldShow;

    panel
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach((field) => {
        field.disabled = !shouldShow;
      });
  };

  const updatePanels = () => {
    const selectedService =
      service?.value || "";

    showPanel(
      ambientPanel,
      selectedService === "ambient" ||
      selectedService === "both"
    );

    showPanel(
      starlightPanel,
      selectedService === "starlight" ||
      selectedService === "both"
    );
  };

  const requestedService =
    new URLSearchParams(
      window.location.search
    ).get("service");

  if (
    service &&
    requestedService &&
    [...service.options].some(
      (option) =>
        option.value === requestedService
    )
  ) {
    service.value = requestedService;
  }

  service?.addEventListener(
    "change",
    updatePanels
  );

  updatePanels();

  form.addEventListener(
    "submit",
    (event) => {
      if (
        form.dataset.mode === "live"
      ) {
        return;
      }

      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      formSections.forEach(
        (section) => {
          section.hidden = true;
        }
      );

      if (successPanel) {
        successPanel.hidden = false;

        successPanel.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  );

  resetButton?.addEventListener(
    "click",
    () => {
      form.reset();

      formSections.forEach(
        (section) => {
          section.hidden = false;
        }
      );

      if (successPanel) {
        successPanel.hidden = true;
      }

      updatePanels();

      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  );
})();
