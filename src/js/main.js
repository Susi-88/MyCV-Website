/* === BACK TO TOP === */
// The shared script also runs on pages without a main panel, so only create
// the control when the page has the container it belongs to.
const mainContainer = document.getElementById("main-container");
const pageFooter = document.getElementById("footer");

if (mainContainer) {
    const backToTop = document.createElement("button");
    const isGerman = document.documentElement.lang.toLowerCase().startsWith("de");

    // Use a real button for keyboard support and provide a localized accessible
    // name. The SVG is decorative because the button already has that name.
    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.setAttribute(
        "aria-label",
        isGerman ? "Nach oben scrollen" : "Scroll to top"
    );
    backToTop.setAttribute("aria-hidden", "true");
    backToTop.tabIndex = -1;
    backToTop.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 19V5m-7 7 7-7 7 7" />
        </svg>
    `;

    // Keep the button one root-em above the footer when it reaches the bottom
    // of the viewport. The root font size makes this gap match the CSS rem unit.
    const footerGap = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
    );

    // Keep the control hidden near the top, then show it after a short scroll.
    const visibilityThreshold = 200;

    // The normal fixed-position offset is needed to calculate when the footer
    // is about to collide with the button.
    let defaultBottomOffset;

    // Prevent repeated repositioning after the button has reached the footer.
    let stoppedBeforeFooter = false;

    // Scroll direction lets the footer stop release as soon as the user scrolls up.
    let previousScrollY = window.scrollY;

    // Update visibility and footer positioning from the same scroll handler.
    const updateBackToTopVisibility = () => {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < previousScrollY;
        previousScrollY = currentScrollY;

        const isVisible = currentScrollY > visibilityThreshold;
        backToTop.classList.toggle("is-visible", isVisible);
        backToTop.setAttribute("aria-hidden", String(!isVisible));
        backToTop.tabIndex = isVisible ? 0 : -1;

        // While scrolling up, let the stopped button travel with the main panel.
        // Restore its fixed position only when it naturally reaches that position,
        // avoiding a jump down to the viewport edge.
        if (stoppedBeforeFooter && isScrollingUp) {
            const stoppedButtonTop = backToTop.getBoundingClientRect().top;
            const fixedButtonTop = window.innerHeight
                - defaultBottomOffset
                - backToTop.offsetHeight;

            if (stoppedButtonTop >= fixedButtonTop) {
                stoppedBeforeFooter = false;
                backToTop.classList.remove("is-stopped");
                backToTop.style.removeProperty("bottom");
            }
        }

        // On downward scroll, detect when the footer gets within one button-height
        // plus the desired gap of the button's normal bottom-right position.
        if (pageFooter && !stoppedBeforeFooter && !isScrollingUp) {
            const footerTop = pageFooter.getBoundingClientRect().top;
            const buttonTop = window.innerHeight
                - defaultBottomOffset
                - backToTop.offsetHeight;

            if (footerTop < buttonTop - footerGap) {
                const mainBottom = mainContainer.getBoundingClientRect().bottom;

                // Convert the desired viewport position (footer top minus the gap)
                // into a bottom offset relative to the main panel. The stopped
                // button remains a child of that panel, not of the footer.
                const targetButtonBottom = footerTop - footerGap;
                backToTop.style.bottom = `${mainBottom - targetButtonBottom}px`;
                backToTop.classList.add("is-stopped");
                stoppedBeforeFooter = true;
            }
        }
    };

    // Respect the visitor's reduced-motion preference when returning to the top.
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
        });
    });

    // Keep the button within the main panel so the footer stop is anchored to
    // that panel's bottom edge.
    mainContainer.append(backToTop);

    // Read the CSS-controlled default offset after insertion so responsive
    // styles and safe-area insets are included in the stop-position calculation.
    const updateDefaultBottomOffset = () => {
        defaultBottomOffset = Number.parseFloat(
            window.getComputedStyle(backToTop).bottom
        );
    };

    // A viewport resize can change both the fixed offset and footer position.
    // Clear the old stop and recalculate using the new layout measurements.
    const resetFooterStop = () => {
        stoppedBeforeFooter = false;
        backToTop.classList.remove("is-stopped");
        backToTop.style.removeProperty("bottom");
        updateDefaultBottomOffset();
        updateBackToTopVisibility();
    };

    // Measure once, then update on scroll and resize. Passive scroll handling
    // avoids blocking the browser's normal scrolling.
    updateDefaultBottomOffset();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    window.addEventListener("resize", resetFooterStop);
    updateBackToTopVisibility();
}

/* === FOOTER SIDEBAR TRANSITION === */
const sidebarHeader = document.getElementById("header-img-container");
const sidebarNav = document.getElementById("nav-container");
const footer = document.getElementById("footer");

if (sidebarHeader && sidebarNav && footer) {
    const desktopSidebar = window.matchMedia("(min-width: 576px)");
    let updateScheduled = false;

    const updateSidebarPosition = () => {
        updateScheduled = false;

        if (!desktopSidebar.matches) {
            sidebarHeader.style.transform = "";
            sidebarNav.style.transform = "";
            return;
        }

        const footerTop = footer.getBoundingClientRect().top;
        const visibleFooterHeight = Math.min(
            window.innerHeight,
            Math.max(0, window.innerHeight - footerTop)
        );
        const transform = visibleFooterHeight > 200
            ? `translateY(-${visibleFooterHeight - 200}px)`
            : "";

        sidebarHeader.style.transform = transform;
        sidebarNav.style.transform = transform;
    };

    const scheduleSidebarUpdate = () => {
        if (!updateScheduled) {
            updateScheduled = true;
            window.requestAnimationFrame(updateSidebarPosition);
        }
    };

    window.addEventListener("scroll", scheduleSidebarUpdate, { passive: true });
    window.addEventListener("resize", scheduleSidebarUpdate);
    updateSidebarPosition();
}


/* === EDUCATION TOGGLE === */
// Toggle each educational detail panel and keep only one panel open at a time.
document.querySelectorAll(".education-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const education = button.closest(".education");

        if (!education) {
            return;
        }

        const development = education.querySelector(".education-development");
        const arrow = button.querySelector(".toggle-arrow");

        if (!development || !arrow) {
            return;
        }

        // Keep the accordion predictable by collapsing any open siblings first.
        const isHidden = development.classList.contains("display-none");
        document.querySelectorAll(".education").forEach(item => {
            if (item === education) {
                return;
            }

            const otherDevelopment = item.querySelector(".education-development");
            const otherArrow = item.querySelector(".toggle-arrow");
            const otherHeader = item.querySelector(".education-toggle");

            if (otherDevelopment) {
                otherDevelopment.classList.remove("display-block");
                otherDevelopment.classList.add("display-none");
            }

            if (otherArrow) {
                otherArrow.classList.remove("toggle-arrow-up");
                otherArrow.classList.add("toggle-arrow-down");
            }

            if (otherHeader) {
                otherHeader.style.color = "";
            }
        });

        if (isHidden) {
            // Show the description
            development.classList.remove("display-none");
            development.classList.add("display-block");

            // Point the arrow up
            arrow.classList.remove("toggle-arrow-down");
            arrow.classList.add("toggle-arrow-up");

            // Highlight the header in red
            const header = education.querySelector(".education-toggle");
            if (header) {
                header.style.color = "var(--primaere)";
            }
        } else {
            // Hide the description
            development.classList.remove("display-block");
            development.classList.add("display-none");

            // Point the arrow down
            arrow.classList.remove("toggle-arrow-up");
            arrow.classList.add("toggle-arrow-down");

            // Reset the header color
            const header = education.querySelector(".education-toggle");
            if (header) {
                header.style.color = "";
            }
        }
    });
});


/* === CERTIFICATE CAROUSEL === */
/* Controls the independent certificate carousels on the certificates page. */

// Store the current slide index for each carousel instance.
const carouselContainers = Array.from(
    document.querySelectorAll(".certificate-container-slides")
);
const slideIndex = carouselContainers.map(() => 1);

carouselContainers.forEach((slideshow, slideshowIndex) => {
    showSlides(1, slideshowIndex);

    let swipeStart = null;
    let suppressClickUntil = 0;

    // Track touch swipes without interfering with normal vertical page scrolling.
    slideshow.addEventListener("pointerdown", event => {
        if (event.pointerType !== "touch") {
            return;
        }

        swipeStart = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY
        };
    });

    slideshow.addEventListener("pointerup", event => {
        if (!swipeStart || event.pointerId !== swipeStart.pointerId) {
            return;
        }

        const distanceX = event.clientX - swipeStart.x;
        const distanceY = event.clientY - swipeStart.y;
        swipeStart = null;

        // Ignore short or mostly vertical movements so they remain ordinary taps/scrolls.
        if (Math.abs(distanceX) < 40 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) {
            return;
        }

        // A left swipe advances; a right swipe returns to the previous certificate.
        plusSlides(distanceX < 0 ? 1 : -1, slideshowIndex);
        suppressClickUntil = Date.now() + 100;
    });

    slideshow.addEventListener("pointercancel", () => {
        swipeStart = null;
    });

    // Prevent a swipe from also activating a thumbnail or carousel arrow.
    slideshow.addEventListener("click", event => {
        if (Date.now() > suppressClickUntil) {
            return;
        }

        suppressClickUntil = 0;
        event.preventDefault();
        event.stopPropagation();
    }, true);
});

// Next / previous controls.
function plusSlides(step, slideshowIndex) {
    const validIndex = Number.isInteger(slideshowIndex)
        ? slideshowIndex
        : 0;

    showSlides(slideIndex[validIndex] += step, validIndex);
}

// Thumbnail controls.
function currentSlide(slideNumber, slideshowIndex) {
    const validIndex = Number.isInteger(slideshowIndex)
        ? slideshowIndex
        : 0;

    showSlides(slideIndex[validIndex] = slideNumber, validIndex);
}

function showSlides(n, slideshowIndex) {
    const slideshow = carouselContainers[slideshowIndex];

    if (!slideshow) {
        return;
    }

    const slides = slideshow.getElementsByClassName("certificate-slides");
    const dots = slideshow.getElementsByClassName("demo");
    const captionText = slideshow.getElementsByClassName("certificate-caption")[0];

    if (!slides.length || !dots.length || !captionText) {
        return;
    }

    // Wrap navigation at either end of the slide list.
    if (n > slides.length) {
        slideIndex[slideshowIndex] = 1;
    }

    if (n < 1) {
        slideIndex[slideshowIndex] = slides.length;
    }

    // Hide every slide before displaying the selected one.
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Clear the active state from all thumbnails in this carousel.
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Show the selected slide and mark its matching thumbnail as active.
    slides[slideIndex[slideshowIndex] - 1].style.display = "block";
    dots[slideIndex[slideshowIndex] - 1].className += " active";

    // Use the selected thumbnail's alternative text as the visible caption.
    captionText.innerHTML = dots[slideIndex[slideshowIndex] - 1].getAttribute("alt");
}