// footer.js
class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="container footer-grid">
                    <div class="footer-column">
                        <h3 class="footer-heading">Explore</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="https://shop.bombaygothic.com/">Shop</a></li>
                            <li><a href="aboutus.html">About Us</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3 class="footer-heading">Our Work</h3>
                        <ul>
                            <li><a href="consultancy.html">Consultancy</a></li>
                            <li><a href="heritagewalks.html">Heritage Walks</a></li>
                            <li><a href="installations.html">Art Installations</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <p class="footer-tagline">CITY..CULTURE..CURIOS</p>
                        <p class="footer-copy">&copy; ${new Date().getFullYear()} Bombay Gothic. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', Footer);