/* === EDUCATION TOGGEL === */
// Select all education toggle buttons
document.querySelectorAll(".education-toggle").forEach(button => {
    button.addEventListener("click", () => {

        // Find the parent education container
        const education = button.closest(".education");

        // Find the description and arrow within this container
        const development = education.querySelector(".education-development");
        const arrow = button.querySelector(".toggle-arrow");

        // Check whether the description is currently hidden
        const isHidden = development.classList.contains("display-none");

        // Close all other open descriptions
        document.querySelectorAll(".education").forEach(item => {
            if (item !== education) {
                const otherDevelopment = item.querySelector(".education-development");
                const otherArrow = item.querySelector(".toggle-arrow");

                // Hide the description if it exists
                if (otherDevelopment) {
                    otherDevelopment.classList.remove("display-block");
                    otherDevelopment.classList.add("display-none");
                }

                // Reset the arrow if it exists
                if (otherArrow) {
                    otherArrow.classList.remove("toggle-arrow-up");
                    otherArrow.classList.add("toggle-arrow-down");
                }

                // Reset the header color if it exists
                const otherHeader = item.querySelector(".education-toggle");
                if (otherHeader) {
                    otherHeader.style.color = "";
                }

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

// Store the current slide separately for each carousel.
let slideIndex = [1, 1, 1, 1];

showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);
showSlides(1, 3);


// Next / previous controls
// Move the selected carousel forward or backward.
function plusSlides(n, slideshowIndex) {
    showSlides(
        slideIndex[slideshowIndex] += n,
        slideshowIndex
    );
}


// Thumbnail controls
// Display the slide selected by a thumbnail.
function currentSlide(n, slideshowIndex) {
    showSlides(
        slideIndex[slideshowIndex] = n,
        slideshowIndex
    );
}


function showSlides(n, slideshowIndex) {

    let i;

    // Resolve slide elements only within the requested carousel.
    let slideshow = document.getElementsByClassName(
        "certificate-container-slides"
    )[slideshowIndex];

    let slides = slideshow.getElementsByClassName(
        "certificate-slides"
    );

    let dots = slideshow.getElementsByClassName(
        "demo"
    );

    let captionText = slideshow.getElementsByClassName(
        "certificate-caption"
    )[0];

    // Wrap navigation at either end of the slide list.
    if (n > slides.length) {
        slideIndex[slideshowIndex] = 1;
    }

    if (n < 1) {
        slideIndex[slideshowIndex] = slides.length;
    }

    // Hide every slide before displaying the selected one.
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Clear the active state from all thumbnails in this carousel.
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(
            " active",
            ""
        );
    }

    // Show the selected slide and mark its matching thumbnail as active.
    slides[slideIndex[slideshowIndex] - 1].style.display = "block";

    dots[slideIndex[slideshowIndex] - 1].className += " active";

    // Use the selected thumbnail's alternative text as the visible caption.
    captionText.innerHTML =
        dots[slideIndex[slideshowIndex] - 1].getAttribute("alt");
}