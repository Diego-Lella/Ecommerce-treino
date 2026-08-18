const products = [

    {
        id: 1,
        name: "Produto Premium",
        description: "Produto de alta qualidade.",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },

    {
        id: 2,
        name: "Produto Essencial",
        description: "Uma excelente opção para o dia a dia.",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1503602642458-232111445657"
    },

    {
        id: 3,
        name: "Produto Especial",
        description: "Qualidade e praticidade em um só produto.",
        price: 99.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },

    {
        id: 4,
        name: "Produto Exclusivo",
        description: "Uma escolha diferenciada.",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    }

];


let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


const productsGrid =
    document.getElementById("productsGrid");

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


function formatPrice(price) {

    return price.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2
        }
    );

}


function renderProducts() {

    productsGrid.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card";

        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3 class="product-name">
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


function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    renderCart();

}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function renderCart() {

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


    cartTotal.textContent =
        formatPrice(total);

    cartCount.textContent =
        quantity;

}


cartButton.addEventListener(
    "click",
    () => {

        cartModal.classList.add(
            "active"
        );

    }
);


closeCart.addEventListener(
    "click",
    () => {

        cartModal.classList.remove(
            "active"
        );

    }
);


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


renderProducts();

renderCart();
