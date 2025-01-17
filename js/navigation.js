// navigation.js
class Navigation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light fixed-top">
                <div class="container">
                    <a class="navbar-brand" href="#">Bombaygothic</a>
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
                                <a class="nav-link" href="consultancy.html">consultancy</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="heritagewalks.html">heritage walks</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="installations.html">art installations</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="press.html">press & media</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="projects.html">interior projects</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="books.html">books</a>
                            </li>
                        </ul>
                        <div class="social-icons">
                            <a href="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.instagram.com/bombay_gothic/"><i class="fab fa-instagram"></i></a>
                            <div class="cart-icon">
                                <a href="https://shop.bombaygothic.com/cart"><i class="fas fa-shopping-bag"></i></a>
                                <span class="cart-count">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('site-navigation', Navigation);