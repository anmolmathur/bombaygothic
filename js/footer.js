// footer.js
class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="container">
                    <p>&copy; ${new Date().getFullYear()} Bombaygothic. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', Footer);