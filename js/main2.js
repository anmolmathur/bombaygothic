document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.main-header');
    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('open');
        });
    }

    // Add scrolled class to header for sticky hero effect
    const scrollThreshold = 10; 
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Image Scroll Effect
    const scrollSection = document.querySelector('.image-scroll-section');
    if (scrollSection) {
        const images = scrollSection.querySelectorAll('.scroll-img');
        
        window.addEventListener('scroll', () => {
            const rect = scrollSection.getBoundingClientRect();
            
            // Only animate when the section is in view
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const viewportCenter = window.innerHeight / 2;
                const sectionCenter = rect.top + rect.height / 2;
                const progress = (viewportCenter - sectionCenter) / viewportCenter;

                // Apply transforms. The multipliers determine speed and direction.
                if (images[0]) images[0].style.transform = `translateY(${progress * -90}px) translateX(${progress * 30}px)`;
                if (images[1]) images[1].style.transform = `translateY(${progress * 100}px) translateX(${progress * -20}px)`;
                if (images[2]) images[2].style.transform = `translateY(${progress * 60}px) translateX(${progress * 50}px)`;
            }
        });
    }
    // Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[n].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

});