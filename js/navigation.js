// navigation.js
class Navigation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="site-header-container fixed-top">
                <div class="announcement-bar">
                    Welcome to Bombay Gothic! Explore our unique collection of heritage-inspired products and services.
                </div>
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <div class="d-flex justify-content-center flex-grow-1 d-lg-none">
                            <a class="navbar-brand" href="/">Bombay Gothic</a>
                        </div>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mx-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="https://shop.bombaygothic.com/">shop</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="heritagewalks.html">heritage walks</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="consultancy.html">consultancy</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="installations.html">art installations</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="press.html">press & media</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="books.html">books</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="aboutus.html">about us</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="contact.html">contact</a>
                                </li>
                            </ul>
                            <div class="social-icons">
                                <a href="https://www.instagram.com/bombay_gothic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <div class="cart-icon">
                                    <a href="https://shop.bombaygothic.com/cart"><i class="fas fa-shopping-bag"></i></a>
                                    <span class="cart-count">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        `;
    }
}

customElements.define('site-navigation', Navigation);