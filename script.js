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
            minimumFractionDigits: 2
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


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card";


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
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


        productsGrid.appendChild(card);

    });

}


// ============================
// ABRIR PRODUTO
// ============================

function openProduct(productId) {

    window.location.href =
        `produto.html?id=${productId}`;

}


// ============================
// RENDERIZAR PÁGINA DO PRODUTO
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


    // Produto não encontrado

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


    // Produto encontrado

    productContainer.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
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
                        >
                            −
                        </button>

                        <span id="productQuantity">
                            1
                        </span>

                        <button
                            id="increaseQuantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="button product-buy-button"
                    id="addProductButton"
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


    if (!product) {
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
// REMOVER DO CARRINHO
// ============================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
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
// MOSTRAR CARRINHO
// ============================

function renderCart() {

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    let quantity = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

        quantity +=
            item.quantity;


        const element =
            document.createElement("div");

        element.className =
            "cart-item";


        element.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <div>
                    ${item.quantity}x
                    R$ ${formatPrice(item.price)}
                </div>

            </div>

            <button
                onclick="removeFromCart(${item.id})"
            >
                Remover
            </button>

        `;


        cartItems.appendChild(element);

    });


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
// CHECKOUT WHATSAPP
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


            let message =
                "Olá! Quero fazer um pedido:%0A%0A";

            let total = 0;


            cart.forEach(item => {

                const subtotal =
                    item.price *
                    item.quantity;


                total += subtotal;


                message +=
                    `${item.quantity}x ${item.name} - R$ ${formatPrice(subtotal)}%0A`;

            });


            message +=
                `%0ATotal: R$ ${formatPrice(total)}`;


            // TROQUE PELO WHATSAPP DA LOJA

            const phone =
                "5551999999999";


            const url =
                `https://wa.me/${phone}?text=${message}`;


            window.open(
                url,
                "_blank"
            );

        }
    );

}


// ============================
// INICIALIZAÇÃO
// ============================
let currentCategory = "todos";


function filterProducts() {

    let filtered =
        [...products];


    // Categoria

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


    // Pesquisa

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


    // Ordenação

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


// Pesquisa

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// Ordenação

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        filterProducts
    );

}


// Categorias

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
renderProducts();

renderProductPage();

renderCart();
    
