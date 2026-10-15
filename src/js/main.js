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