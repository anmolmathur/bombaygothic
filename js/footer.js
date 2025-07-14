// js/footer.js - STABLE VERSION (with Instagram link removed)

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-brand-beige pt-16 md:pt-24 pb-8">
          <div class="container mx-auto px-6">
              <div class="text-center border-b border-gray-300 pb-12 mb-12">
                  <h2 class="font-playfair text-3xl md:text-4xl mb-2">Stay in the loop</h2>
                  <p class="font-raleway text-lg font-extralight text-gray-600 mb-6 max-w-lg mx-auto">Join our weekly newsletter for exclusive updates, stories from the studio, and early access to new collections.</p>
                  <form action="#" method="POST" class="max-w-md mx-auto flex items-center border border-gray-400 rounded-md overflow-hidden">
                      <input type="email" name="email" placeholder="enter your email" class="w-full px-4 py-3 bg-transparent font-raleway focus:outline-none text-brand-text" required>
                      <button type="submit" class="bg-brand-terracotta text-white px-5 py-3 hover:bg-brand-dark transition-colors" aria-label="Subscribe">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                  </form>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                  <div class="col-span-2 md:col-span-1">
                      <a href="index5.html" class="font-lovtony text-4xl text-brand-text mb-4 inline-block">Bombay Gothic</a>
                      <p class="font-raleway font-extralight text-gray-600">CITY | CULTURE | CURIOS</p>
                  </div>
                  <div>
                      <h3 class="font-raleway font-bold tracking-wider mb-4">Explore</h3>
                      <nav class="flex flex-col space-y-3 font-raleway font-extralight">
                          <a href="http://shop.bombaygothic.com" target="_blank" class="text-gray-600 hover:text-brand-terracotta">shop</a>
                          <a href="consultancy.html" class="text-gray-600 hover:text-brand-terracotta">consultancy</a>
                          <a href="heritagewalks.html" class="text-gray-600 hover:text-brand-terracotta">heritage walks</a>
                      </nav>
                  </div>
                  <div>
                      <h3 class="font-raleway font-bold tracking-wider mb-4">About</h3>
                      <nav class="flex flex-col space-y-3 font-raleway font-extralight">
                          <a href="aboutus.html" class="text-gray-600 hover:text-brand-terracotta">our story</a>
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">journal</a>
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">work with us</a>
                      </nav>
                  </div>
                  <div>
                      <h3 class="font-raleway font-bold tracking-wider mb-4">Help</h3>
                      <nav class="flex flex-col space-y-3 font-raleway font-extralight">
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">contact us</a>
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">faqs</a>
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">shipping & returns</a>
                          <a href="#" class="text-gray-600 hover:text-brand-terracotta">privacy policy</a>
                      </nav>
                  </div>
              </div>
              <div class="mt-12 pt-8 border-t border-gray-300 flex justify-center items-center text-center">
                  <p class="font-raleway font-extralight text-sm text-gray-500">&copy; ${new Date().getFullYear()} Bombay Gothic. All Rights Reserved.</p>
              </div>
          </div>
      </footer>
    `;
  }
}

customElements.define('main-footer', Footer);