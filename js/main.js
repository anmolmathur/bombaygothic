// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    
    // Update cart count function
    function updateCartCount(count) {
        cartCountElement.textContent = count;
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
    });
    
    // Image lazy loading
    const images = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navbarCollapse.contains(event.target) && 
            !navbarToggler.contains(event.target) && 
            navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Shopify cart integration (placeholder)
const shopifyCart = {
    add: function(productId, quantity = 1) {
        // Add Shopify cart integration code here
        console.log(`Adding product ${productId} to cart`);
    },
    
    update: function(productId, quantity) {
        // Update Shopify cart integration code here
        console.log(`Updating product ${productId} quantity to ${quantity}`);
    },
    
    remove: function(productId) {
        // Remove Shopify cart integration code here
        console.log(`Removing product ${productId} from cart`);
    }
};