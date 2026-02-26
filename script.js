document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Hero Animations
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

    // Initial setups for elements
    gsap.set(".hero-title, .hero-subtitle, .hero-cta", { opacity: 0, y: 30 });

    tl.to(".hero-title", { opacity: 1, y: 0, delay: 0.2 })
        .to(".hero-subtitle", { opacity: 1, y: 0 }, "-=0.9")
        .to(".hero-cta", { opacity: 1, y: 0 }, "-=0.9");

    // Logo refresh interaction
    document.getElementById("logo-refresh").addEventListener("click", (e) => {
        e.preventDefault();
        gsap.set(".hero-title, .hero-subtitle, .hero-cta", { opacity: 0, y: 30 });
        tl.restart();
    });

    // 2. Theme Toggle Logic
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // Icon paths
    const sunPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
    const moonPath = "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z";

    // Detect system theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    let isDark = prefersDark.matches;

    const applyTheme = (dark, animate = true) => {
        document.body.setAttribute("data-theme", dark ? "dark" : "light");
        const pathNode = themeIcon.querySelector("path");
        pathNode.setAttribute("d", dark ? sunPath : moonPath);

        if (animate) {
            gsap.fromTo(themeIcon,
                { rotation: 0, scale: 0.8 },
                { rotation: 360, scale: 1, duration: 0.6, ease: "power2.out" }
            );
        }
    };

    // Initialize with system settings
    applyTheme(isDark, false);

    themeBtn.addEventListener("click", () => {
        isDark = !isDark;
        applyTheme(isDark);
    });

    // Handle system theme changes
    prefersDark.addEventListener("change", (e) => {
        isDark = e.matches;
        applyTheme(isDark, true);
    });

    // 3. Modal Logic
    const modals = document.querySelectorAll(".modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const openBtns = document.querySelectorAll("[data-modal]");
    const closeBtns = document.querySelectorAll(".close-modal");

    // Pre-calculate GSAP timelines for modals for optimal performance
    const animMap = new Map();

    modals.forEach(modal => {
        gsap.set(modal, { scale: 0.95 }); // Initial hidden scale
        const tween = gsap.timeline({ paused: true, defaults: { ease: "power4.out", duration: 0.6 } })
            .to(modalOverlay, { autoAlpha: 1 })
            .to(modal, { autoAlpha: 1, scale: 1 }, "<")
        animMap.set(modal.id, tween);
    });

    let currentOpenModal = null;

    const openModal = (id) => {
        if (currentOpenModal) return;
        currentOpenModal = id;
        document.body.classList.add("modal-open");

        // Fluid blur effect manually on hero
        gsap.to(".hero-content", { filter: "blur(5px)", opacity: 0.5, duration: 0.5 });

        animMap.get(id).play();
    };

    const closeModal = () => {
        if (!currentOpenModal) return;

        // Unblur hero
        gsap.to(".hero-content", { filter: "blur(0px)", opacity: 1, duration: 0.5 });
        animMap.get(currentOpenModal).reverse();

        document.body.classList.remove("modal-open");
        currentOpenModal = null;
    };

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => openModal(btn.dataset.modal));
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    modalOverlay.addEventListener("click", closeModal);

    // Escape Key logic
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && currentOpenModal) {
            closeModal();
        }
    });
});
