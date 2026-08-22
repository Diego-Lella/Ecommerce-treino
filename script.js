const products = [

    {
        id: 1,
        name: "Produto Premium",
        description: "Produto de alta qualidade.",
        price: 79.90,
        category: "premium",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },

    {
        id: 2,
        name: "Produto Essencial",
        description: "Uma excelente opção para o dia a dia.",
        price: 49.90,
        category: "essencial",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657"
    },

    {
        id: 3,
        name: "Produto Especial",
        description: "Qualidade e praticidade em um só produto.",
        price: 99.90,
        category: "especial",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },

    {
        id: 4,
        name: "Produto Exclusivo",
        description: "Uma escolha diferenciada.",
        price: 129.90,
        category: "premium",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    }

];


// ============================
// CONFIGURAÇÃO DE IMAGENS
// ============================

function getImageUrl(
    image,
    width = 600,
    quality = 75
) {

    return `${image}?auto=format&fit=crop&w=${width}&q=${quality}`;

}


// ============================
// CARRINHO
// ============================

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


// ============================
// ELEMENTOS
// ============================

const productsGrid =
    document.getElementById("productsGrid");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const categoryButtons =
    document.querySelectorAll(
        ".category-button"
    );

const productContainer =
    document.getElementById("productContainer");

const cartButton =
    document.getElementById("cartButton");

const cartModal =
    document.getElementById("cartModal");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const checkoutButton =
    document.getElementById("checkoutButton");


// ============================
// FORMATAÇÃO DE PREÇO
// ============================

function formatPrice(price) {

    return price.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================
// PRODUTOS DA HOME
// ============================

function renderProducts(
    filteredProducts = products
) {

    if (!productsGrid) {
        return;
    }

    productsGrid.innerHTML = "";


    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `

            <div class="no-products">

                <h3>
                    Nenhum produto encontrado.
                </h3>

                <p>
                    Tente procurar outro produto.
                </p>

            </div>

        `;

        return;
    }


    const fragment =
        document.createDocumentFragment();


    filteredProducts.forEach(
        (product, index) => {

            const card =
                document.createElement("article");

            card.className =
                "product-card";


            const imageLoading =
                index < 2
                    ? "eager"
                    : "lazy";


            card.innerHTML = `

                <img
                    class="product-image"
                    src="${getImageUrl(
                        product.image,
                        600,
                        75
                    )}"
                    alt="${product.name}"
                    width="600"
                    height="600"
                    loading="${imageLoading}"
                    decoding="async"
                    fetchpriority="${
                        index < 2
                            ? "high"
                            : "auto"
                    }"
                    onclick="openProduct(${product.id})"
                    style="cursor: pointer;"
                >

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3
                        class="product-name"
                        onclick="openProduct(${product.id})"
                        style="cursor: pointer;"
                    >
                        ${product.name}
                    </h3>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <div class="product-price">
                        R$ ${formatPrice(product.price)}
                    </div>

                    <button
                        class="button"
                        onclick="addToCart(${product.id})"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            `;


            fragment.appendChild(card);

        }
    );


    productsGrid.appendChild(fragment);

}


// ============================
// ABRIR PRODUTO
// ============================

function openProduct(productId) {

    window.location.href =
        `produto.html?id=${productId}`;

}


// ============================
// PÁGINA DO PRODUTO
// ============================

function renderProductPage() {

    if (!productContainer) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        Number(
            params.get("id")
        );


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        productContainer.innerHTML = `

            <div class="product-not-found">

                <h1>
                    Produto não encontrado
                </h1>

                <p>
                    Esse produto não existe.
                </p>

                <a
                    href="index.html"
                    class="button"
                >
                    Voltar para a loja
                </a>

            </div>

        `;

        return;
    }


    productContainer.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${getImageUrl(
                        product.image,
                        1000,
                        80
                    )}"
                    alt="${product.name}"
                    width="1000"
                    height="1000"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                >

            </div>


            <div class="product-detail-info">

                <span class="product-detail-tag">
                    PRODUTO EM DESTAQUE
                </span>

                <h1>
                    ${product.name}
                </h1>

                <p class="product-detail-description">
                    ${product.description}
                </p>

                <div class="product-detail-price">
                    R$ ${formatPrice(product.price)}
                </div>


                <div class="quantity-area">

                    <label>
                        Quantidade
                    </label>

                    <div class="quantity-controls">

                        <button
                            id="decreaseQuantity"
                            type="button"
                        >
                            −
                        </button>

                        <span id="productQuantity">
                            1
                        </span>

                        <button
                            id="increaseQuantity"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="button product-buy-button"
                    id="addProductButton"
                    type="button"
                >
                    Adicionar ao carrinho
                </button>


                <a
                    href="index.html"
                    class="back-link"
                >
                    ← Voltar para produtos
                </a>

            </div>

        </div>

    `;


    let quantity = 1;


    const quantityElement =
        document.getElementById(
            "productQuantity"
        );

    const decreaseButton =
        document.getElementById(
            "decreaseQuantity"
        );

    const increaseButton =
        document.getElementById(
            "increaseQuantity"
        );

    const addProductButton =
        document.getElementById(
            "addProductButton"
        );


    if (
        !quantityElement ||
        !decreaseButton ||
        !increaseButton ||
        !addProductButton
    ) {
        return;
    }


    decreaseButton.addEventListener(
        "click",
        () => {

            if (quantity > 1) {

                quantity--;

                quantityElement.textContent =
                    quantity;

            }

        }
    );


    increaseButton.addEventListener(
        "click",
        () => {

            quantity++;

            quantityElement.textContent =
                quantity;

        }
    );


    addProductButton.addEventListener(
        "click",
        () => {

            addToCart(
                product.id,
                quantity
            );

            alert(
                "Produto adicionado ao carrinho!"
            );

        }
    );

}


// ============================
// ADICIONAR AO CARRINHO
// ============================

function addToCart(
    productId,
    quantity = 1
) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product || quantity <= 0) {
        return;
    }


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({

            ...product,

            quantity: quantity

        });

    }


    saveCart();

    renderCart();

}


// ============================
// ALTERAR QUANTIDADE
// ============================

function changeCartQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    saveCart();

    renderCart();

}


// ============================
// REMOVER DO CARRINHO
// ============================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    renderCart();

}


// ============================
// SALVAR CARRINHO
// ============================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ============================
// RENDERIZAR CARRINHO
// ============================

function renderCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    let total = 0;

    let quantity = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Adicione alguns produtos
                    para continuar.
                </p>

            </div>

        `;

    }


    const fragment =
        document.createDocumentFragment();


    cart.forEach(item => {

        const subtotal =
            item.price *
            item.quantity;


        total += subtotal;

        quantity += item.quantity;


        const element =
            document.createElement("div");


        element.className =
            "cart-item";


        element.innerHTML = `

            <div class="cart-product">

                <img
                    src="${getImageUrl(
                        item.image,
                        140,
                        70
                    )}"
                    alt="${item.name}"
                    class="cart-product-image"
                    width="70"
                    height="70"
                    loading="lazy"
                    decoding="async"
                >

                <div class="cart-product-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        R$ ${formatPrice(item.price)}
                    </span>

                </div>

            </div>


            <div class="cart-item-actions">

                <div class="cart-quantity">

                    <button
                        type="button"
                        onclick="changeCartQuantity(
                            ${item.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeCartQuantity(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>

                </div>


                <strong class="cart-subtotal">
                    R$ ${formatPrice(subtotal)}
                </strong>


                <button
                    type="button"
                    class="remove-cart-item"
                    onclick="removeFromCart(${item.id})"
                    aria-label="Remover ${item.name}"
                >
                    🗑️
                </button>

            </div>

        `;


        fragment.appendChild(element);

    });


    cartItems.appendChild(fragment);


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);

    }


    if (cartCount) {

        cartCount.textContent =
            quantity;

    }

}


// ============================
// ABRIR CARRINHO
// ============================

if (cartButton && cartModal) {

    cartButton.addEventListener(
        "click",
        () => {

            cartModal.classList.add(
                "active"
            );

        }
    );

}


// ============================
// FECHAR CARRINHO
// ============================

if (closeCart && cartModal) {

    closeCart.addEventListener(
        "click",
        () => {

            cartModal.classList.remove(
                "active"
            );

        }
    );

}


// ============================
// FECHAR CLICANDO FORA
// ============================

if (cartModal) {

    cartModal.addEventListener(
        "click",
        event => {

            if (
                event.target === cartModal
            ) {

                cartModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ============================
// CHECKOUT 
// ============================

if (checkoutButton) {

    checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);
}

// ============================
// FILTROS
// ============================

let currentCategory =
    "todos";


function filterProducts() {

    if (!productsGrid) {
        return;
    }


    let filtered =
        [...products];


    // ========================
    // CATEGORIA
    // ========================

    if (
        currentCategory !== "todos"
    ) {

        filtered =
            filtered.filter(
                product =>
                    product.category ===
                    currentCategory
            );

    }


    // ========================
    // PESQUISA
    // ========================

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (search) {

        filtered =
            filtered.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(search)

            );

    }


    // ========================
    // ORDENAÇÃO
    // ========================

    const sort =
        sortSelect
            ? sortSelect.value
            : "default";


    if (sort === "price-low") {

        filtered.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sort === "price-high") {

        filtered.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sort === "name") {

        filtered.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    renderProducts(filtered);

}


// ============================
// PESQUISA
// ============================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// ============================
// ORDENAÇÃO
// ============================

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        filterProducts
    );

}


// ============================
// CATEGORIAS
// ============================

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category;


                filterProducts();

            }
        );

    }
);


// ============================
// INICIALIZAÇÃO
// ============================

renderProducts();

renderProductPage();

renderCart();
/* =========================================
   CARROSSEL DE OFERTAS DA HERO
========================================= */

const heroCarousel = document.getElementById("heroCarousel");
const heroDots = document.getElementById("heroDots");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

let currentHeroIndex = 0;


/*
    Produtos que aparecerão na Hero.

    O primeiro produto será o
    PRODUTO CAMPEÃO.
*/

const heroProducts = products.slice(0, 4);


/* =========================================
   RENDERIZAR CARROSSEL
========================================= */

function renderHeroCarousel() {

    if (!heroCarousel || !heroDots) {
        return;
    }

    heroCarousel.innerHTML = "";
    heroDots.innerHTML = "";


    heroProducts.forEach((product, index) => {

        const card = document.createElement("article");

        card.className = "hero-offer-card";


        /*
            Preço antigo apenas para criar
            o efeito visual de promoção.

            Depois vamos colocar os preços
            reais das ofertas.
        */

        const oldPrice = product.price * 1.25;


        card.innerHTML = `

            <div class="hero-offer-image-area">

                <span class="hero-offer-badge">

                    ${index === 0
                        ? "🔥 CAMPEÃO"
                        : "OFERTA"
                    }

                </span>


                <img
                    class="hero-offer-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="${index === 0
