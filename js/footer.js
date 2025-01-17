// footer.js
class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
            <p>&copy; ${new Date().getFullYear()} Bombaygothic. All rights reserved.<a class="nav-link" href="aboutus.html">About BombayGothic</a> </p> 
                <!-- <div class="container">
                    
                </div> -->
            </footer>
        `;
    }
}

customElements.define('site-footer', Footer);