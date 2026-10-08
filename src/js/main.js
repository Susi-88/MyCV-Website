/* --- Zertifikate --- */

let slideIndex = [1, 1, 1, 1];

showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);
showSlides(1, 3);


// Next / previous controls
function plusSlides(n, slideshowIndex) {
    showSlides(
        slideIndex[slideshowIndex] += n,
        slideshowIndex
    );
}


// Thumbnail controls
function currentSlide(n, slideshowIndex) {
    showSlides(
        slideIndex[slideshowIndex] = n,
        slideshowIndex
    );
}


function showSlides(n, slideshowIndex) {

    let i;

    // Nur den entsprechenden Slideshow-Container auswählen
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


    // Grenzen prüfen
    if (n > slides.length) {
        slideIndex[slideshowIndex] = 1;
    }

    if (n < 1) {
        slideIndex[slideshowIndex] = slides.length;
    }


    // Alle Slides verstecken
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }


    // Alle Dots deaktivieren
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(
            " active",
            ""
        );
    }


    // Aktuellen Slide anzeigen
    slides[slideIndex[slideshowIndex] - 1].style.display = "block";


    // Aktuellen Dot aktivieren
    dots[slideIndex[slideshowIndex] - 1].className += " active";


    // Caption setzen
    captionText.innerHTML =
        dots[slideIndex[slideshowIndex] - 1].getAttribute("alt");
}