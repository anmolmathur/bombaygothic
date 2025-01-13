// headManager.js
class HeadManager extends HTMLElement {
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
    }
}

customElements.define('head-manager', HeadManager);