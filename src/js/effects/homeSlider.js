// Before/After slider (framework-free, JS only) - Enhanced with working core functionality
// - JS writes --pos (0..100) on the .ba element
// - CSS reads --pos + [data-orientation] to position clip and handle
export function initBeforeAfterSlider(figureSelector = ".ba") {
    const ba = document.querySelector(figureSelector);
    if (!ba) return null;

    const handle = ba.querySelector(".ba-handle");
    const after = ba.querySelector(".ba-after");
    const hero = ba.closest(".hero");
    const heroContent = document.querySelector(".hero-content");
    const range = ba.querySelector(".ba-range");

    if (!handle || !after) return null;

    const START_POS = 50; // snap target
    const SNAP_MS = 300; // animation duration (ms)

    let pos = 50; // 0..100
    let dragging = false;
    let animating = false;
    let rafId = null;

    function orientation() {
        return window.innerWidth <= 768 ? "vertical" : "horizontal";
    }

    function setOrientation(o) {
        ba.setAttribute("data-orientation", o);
    }

    const clamp = v => Math.min(100, Math.max(0, v));

    function setPos(p) {
        p = clamp(p);
        pos = p;

        // Enhanced positioning with both CSS custom properties and direct styles
        ba.style.setProperty("--pos", `${p}%`);

        // Direct handle positioning (from working code)
        handle.style.left = p + '%';

        // Direct clip-path setting (from working code)
        after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;

        // Update range input if exists
        if (range) range.value = String(p);

        // Accessibility
        handle.setAttribute("aria-valuenow", String(Math.round(p)));
    }

    const toPct = e => {
        const r = ba.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
        const x = clientX - r.left;
        return (x / r.width) * 100;
    };

    function animateTo(target = START_POS, duration = SNAP_MS) {
        const from = parseFloat(handle.style.left) || START_POS;
        if (Math.abs(target - from) < 0.001) return;

        const t0 = performance.now();
        if (rafId) cancelAnimationFrame(rafId);

        const frame = t => {
            if (dragging) return; // abort if user grabs again
            const k = Math.min(1, (t - t0) / duration);
            const eased = from + (target - from) * (1 - Math.pow(1 - k, 3)); // easeOutCubic
            setPos(eased);
            if (k < 1) rafId = requestAnimationFrame(frame);
        };
        rafId = requestAnimationFrame(frame);
    }

    // Init
    setOrientation(orientation());
    setPos(START_POS);
    handle.tabIndex = 0;
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Drag to compare");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");

    // Events
    const onResize = () => {
        const o = orientation();
        if (ba.getAttribute("data-orientation") !== o) {
            setOrientation(o);
            setPos(pos); // re-apply
        }
    };

    const onPointerDown = (e) => {
        if (animating) {
            console.log('Slider: Animation in progress, ignoring pointer down');
            return;
        }
        dragging = true;
        if (handle.setPointerCapture) {
            handle.setPointerCapture(e.pointerId);
        }
        handle.classList.add("is-active");
        handle.classList.add("dragging");
        if (rafId) cancelAnimationFrame(rafId);
        if (heroContent) {
            heroContent.style.opacity = "0";
            heroContent.style.pointerEvents = "none";
        }
        setPos(toPct(e));
        console.log('Slider: Pointer down, dragging started');
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        setPos(toPct(e));
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = false;
        if (handle.releasePointerCapture) {
            handle.releasePointerCapture(e.pointerId);
        }
        handle.classList.remove("is-active");
        handle.classList.remove("dragging");

        // Snap back to center and restore hero content
        returnToCenter();
        console.log('Slider: Pointer up, returning to center');
    };

    const onPointerEnter = () => handle.classList.add("is-hovered");
    const onPointerLeave = () => handle.classList.remove("is-hovered");

    const onKeyDown = (e) => {
        if (animating) return;
        let next = pos;
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) next = pos - 2;
        else if (["ArrowRight", "ArrowDown"].includes(e.key)) next = pos + 2;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 100;
        else return;
        e.preventDefault();
        setPos(next);
    };

    function returnToCenter() {
        if (animating) return;
        animating = true;
        const start = pos;
        const target = START_POS;
        const t0 = performance.now();
        const dur = 600;
        const raf = (t) => {
            const u = Math.min((t - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - u, 3);
            setPos(start + (target - start) * ease);
            if (u < 1) requestAnimationFrame(raf);
            else {
                animating = false;
                if (heroContent) {
                    heroContent.style.opacity = "1";
                    heroContent.style.pointerEvents = "auto";
                }
                console.log('Slider: Animation complete, hero content restored');
            }
        };
        requestAnimationFrame(raf);
    }

    // Event listeners
    window.addEventListener("resize", onResize, {
        passive: true
    });
    handle.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointerenter", onPointerEnter);
    handle.addEventListener("pointerleave", onPointerLeave);
    handle.addEventListener("keydown", onKeyDown);

    // Public API (optional)
    return {
        reset: () => setPos(START_POS),
        destroy: () => {
            window.removeEventListener("resize", onResize);
            handle.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            handle.removeEventListener("pointerenter", onPointerEnter);
            handle.removeEventListener("pointerleave", onPointerLeave);
            handle.removeEventListener("keydown", onKeyDown);
            if (rafId) cancelAnimationFrame(rafId);
        }
    };
}