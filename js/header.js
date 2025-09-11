// js/header.js - STABLE VERSION (with Header Strip)

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    
    // Create Google Analytics scripts
        const gaScript1 = document.createElement('script');
        gaScript1.setAttribute('async', '');
        gaScript1.src = 'https://www.googletagmanager.com/gtag/js?id=G-5T5KHDL2M0';
        
        const gaScript2 = document.createElement('script');
        gaScript2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5T5KHDL2M0');
        `;

        // Insert scripts into head
        document.head.appendChild(gaScript1);
        document.head.appendChild(gaScript2);
    
    
    // The component's HTML now includes BOTH the strip and the main header
    this.innerHTML = `
    <!-- Section 1: Header - Strip (Updated with Title Case Text) -->
    <div class="bg-brand-terracotta text-white font-raleway font-extralight py-3 overflow-hidden whitespace-nowrap text-sm tracking-wider">
        <div class="w-full inline-block animate-marquee" style="margin: 0 10%;">
            <!-- Text updated as per request -->
            <span class="mx-8">CITY.. CULTURE.. CURIOS..</span>
            <span class="mx-8">CITY.. CULTURE.. CURIOS..</span>
            <span class="mx-8" aria-hidden="true">CITY.. CULTURE.. CURIOS..</span>
            <span class="mx-8" aria-hidden="true">CITY.. CULTURE.. CURIOS..</span>
        </div>
    </div>
    <!-- End of Section 1 -->


    <!-- Section 2: Main Header (Final Version with All Updates) -->
    <header 
        x-data="{ scrolled: false, mobileMenuOpen: false, shopMenuOpen: false, mobileShopOpen: false }" 
        @scroll.window="scrolled = (window.scrollY > 50)"
        :class="{ 'bg-brand-beige shadow-lg': scrolled, 'bg-transparent': !scrolled }"
        class="sticky top-0 z-50 w-full transition-colors duration-300 ease-in-out relative"
        @keydown.escape.window="shopMenuOpen = false"
    >
        <div class="w-full flex justify-between items-center px-6 py-4 md:px-10">
            
<!-- Mobile Header: Logo and Menu Button -->
<div class="w-full flex justify-between items-center md:hidden">
    <div class="flex-1 flex justify-center">
        <!-- Centered Logo for Mobile -->
        <a href="https://bombaygothic.com" class="flex items-center space-x-2">
            <img src="images/Logotype.png" alt="Bombay Gothic Logo" class="h-20 w-auto scale-150">
        </a>
    </div>
</div>

<!-- Desktop Header: Full Width -->
<div class="hidden w-full md:flex justify-between items-center">
                <!-- Logo - Aligned Left -->
                <div class="flex-none">
                    <a href="https://bombaygothic.com/" class="flex items-center space-x-2 ml-4">
                        <img src="images/Logotype.png" alt="Bombay Gothic Logo" class="h-20 w-auto scale-150">
                    </a>
                </div>

                <!-- Desktop Navigation - Centered -->
                <nav class="hidden md:flex flex-grow justify-center items-center space-x-8">
                    <button type="button" @click="shopMenuOpen = !shopMenuOpen" class="font-raleway transition-colors focus:outline-none border-b-2 border-transparent pb-1" :class="{ 'text-brand-terracotta border-brand-terracotta': shopMenuOpen, 'text-brand-text hover:text-brand-terracotta': !shopMenuOpen }" aria-haspopup="true" :aria-expanded="shopMenuOpen.toString()">shop</button>
                    <a href="https://bombaygothic.com/consultancy.html" class="font-raleway text-brand-text hover:text-brand-terracotta transition-colors">consultancy</a>
                    <a href="https://bombaygothic.com/heritagewalks.html" class="font-raleway text-brand-text hover:text-brand-terracotta transition-colors">heritage walks</a>
                    <a href="https://bombaygothic.com/journal.html" class="font-raleway text-brand-text hover:text-brand-terracotta transition-colors">journal</a>
                    <a href="https://shop.bombaygothic.com/collections/all-products" class="font-raleway text-brand-text hover:text-brand-terracotta transition-colors">products</a>
                    <a href="https://bombaygothic.com/aboutus.html" class="font-raleway text-brand-text hover:text-brand-terracotta transition-colors">our story</a>
                </nav>

                <!-- Right-Side Actions (Desktop) & Mobile Menu Button -->
                <div class="flex-none flex items-center justify-end">
                    <!-- Desktop Icons & Enquire Button -->
                    <div class="hidden md:flex items-center space-x-6">
                        <a href="https://www.instagram.com/bombay_gothic/" target="_blank" class="text-brand-text text-xl hover:text-brand-terracotta transition-colors"><i class="fab fa-instagram"></i></a>
                        <a href="https://shop.bombaygothic.com/cart" class="text-brand-text text-xl hover:text-brand-terracotta transition-colors"><i class="fas fa-cart-shopping"></i></a>
                        <a href="https://bombaygothic.com/contact.html" class="bg-brand-terracotta text-white font-raleway px-5 py-2 rounded-md hover:bg-brand-dark transition-colors">
                            enquire
                        </a>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden">
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-brand-text">
                    <svg x-show="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <svg x-show="mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display: none;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Desktop Shop Submenu (Mega Menu) -->
        <div 
            x-show="shopMenuOpen" 
            x-transition 
            @click.away="shopMenuOpen = false"
            class="hidden md:block absolute left-0 right-0 top-full bg-brand-beige/95 backdrop-blur border-t border-gray-200 shadow-lg"
            style="display: none;"
        >
            <div class="container mx-auto px-6 md:px-10 py-10">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <a href="https://shop.bombaygothic.com/collections/all" target="_blank" class="group block text-center">
                        <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-1/2 mx-auto">
                            <img src="images/shoponline.jpg" alt="All Products" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                        </div>
                        <div class="mt-4 font-playfair text-xl">All Products</div>
                    </a>
                    <a href="https://shop.bombaygothic.com/" target="_blank" class="group block text-center">
                        <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-1/2 mx-auto">
                            <img src="images/artinstallation.jpg" alt="By Category" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                        </div>
                        <div class="mt-4 font-playfair text-xl">By Category</div>
                    </a>
                    <a href="https://shop.bombaygothic.com/collections" target="_blank" class="group block text-center">
                        <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-1/2 mx-auto">
                            <img src="images/pressand media1.jpg" alt="By Collection" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                        </div>
                        <div class="mt-4 font-playfair text-xl">By Collection</div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Panel (Updated) -->
        <div 
            x-show="mobileMenuOpen" 
            @click.away="mobileMenuOpen = false"
            x-transition
            class="md:hidden absolute top-0 inset-x-0 w-full bg-brand-beige shadow-lg pt-24 pb-8"
            style="display: none;"
        >
            <nav class="flex flex-col items-center space-y-6">
                <!-- Updated Links -->
                <button @click="mobileShopOpen = !mobileShopOpen" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">shop</button>
                <!-- Mobile Shop Submenu -->
                <div x-show="mobileShopOpen" x-transition class="w-full px-6">
                    <div class="grid grid-cols-3 gap-4">
                        <a @click="mobileMenuOpen = false" href="https://shop.bombaygothic.com/collections/all" target="_blank" class="group block text-center">
                            <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-20 sm:w-24 mx-auto">
                                <img src="images/shoponline.jpg" alt="All Products" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                            </div>
                            <div class="mt-2 font-playfair text-sm">All Products</div>
                        </a>
                        <a @click="mobileMenuOpen = false" href="https://shop.bombaygothic.com/" target="_blank" class="group block text-center">
                            <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-20 sm:w-24 mx-auto">
                                <img src="images/artinstallation.jpg" alt="By Category" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                            </div>
                            <div class="mt-2 font-playfair text-sm">By Category</div>
                        </a>
                        <a @click="mobileMenuOpen = false" href="https://shop.bombaygothic.com/collections" target="_blank" class="group block text-center">
                            <div class="relative overflow-hidden rounded-lg bg-white aspect-square w-20 sm:w-24 mx-auto">
                                <img src="images/pressand media1.jpg" alt="By Collection" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300">
                            </div>
                            <div class="mt-2 font-playfair text-sm">By Collection</div>
                        </a>
                    </div>
                </div>
                <a @click="mobileMenuOpen = false" href="https://bombaygothic.com/consultancy.html" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">consultancy</a>
                <a @click="mobileMenuOpen = false" href="https://bombaygothic.com/heritagewalks.html" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">heritage walks</a>
                <a @click="mobileMenuOpen = false" href="https://bombaygothic.com/journal.html" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">journal</a>
                <a @click="mobileMenuOpen = false" href="https://shop.bombaygothic.com/collections/all-products" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">products</a>
                <a @click="mobileMenuOpen = false" href="https://bombaygothic.com/aboutus.html" class="font-raleway text-lg text-brand-text hover:text-brand-terracotta transition-colors">our story</a>
                
                <!-- Social & Cart Icons for Mobile -->
                <div class="flex items-center space-x-6 pt-6">
                    <a href="https://www.instagram.com/bombay_gothic/" target="_blank" class="text-brand-text text-2xl hover:text-brand-terracotta transition-colors"><i class="fab fa-instagram"></i></a>
                    <a href="https://shop.bombaygothic.com/cart" class="text-brand-text text-2xl hover:text-brand-terracotta transition-colors"><i class="fas fa-cart-shopping"></i></a>
                </div>

                <!-- Enquire Button for Mobile -->
                <div class="pt-2">
                    <a href="https://bombaygothic.com/contact.html" class="inline-block bg-brand-terracotta text-white font-raleway px-8 py-3 rounded-md hover:bg-brand-dark transition-colors">
                        enquire now
                    </a>
                </div>
            </nav>
        </div>
    </header>
    <!-- End of Section 2 -->
    `;
  }
}

customElements.define('main-header', Header);