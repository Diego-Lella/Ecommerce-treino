// ============================
// ELEMENTOS
// ============================

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutShipping =
    document.getElementById("checkoutShipping");

const checkoutForm =
    document.getElementById("checkoutForm");

const shippingOptions =
    document.querySelectorAll(
        'input[name="shipping"]'
    );


// ============================
// CARRINHO
// ============================

let checkoutCart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ============================
// FORMATAR PREÇO
// ============================

function formatCheckoutPrice(price) {

    return price.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================
// CALCULAR SUBTOTAL
// ============================

function calculateSubtotal() {

    return checkoutCart.reduce(
        (total, item) => {

            return total +
                (item.price * item.quantity);

        },
        0
    );

}


// ============================
// PEGAR FRETE
// ============================

function getSelectedShipping() {

    const selected =
        document.querySelector(
            'input[name="shipping"]:checked'
        );


    if (!selected) {

        return {
            name: "Nenhum",
            price: 0
        };

    }


    return {

        name:
            selected.dataset.name,

        price:
            Number(selected.value)

    };

}


// ============================
// ATUALIZAR TOTAL
// ============================

function updateCheckoutTotal() {

    const subtotal =
        calculateSubtotal();


    const shipping =
        getSelectedShipping();


    const total =
        subtotal + shipping.price;


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            `R$ ${formatCheckoutPrice(
                subtotal
            )}`;

    }


    if (checkoutShipping) {

        checkoutShipping.textContent =
            `R$ ${formatCheckoutPrice(
                shipping.price
            )}`;

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            `R$ ${formatCheckoutPrice(
                total
            )}`;

    }

}


// ============================
// RENDERIZAR CHECKOUT
// ============================

function renderCheckout() {

    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    if (checkoutCart.length === 0) {

        checkoutItems.innerHTML = `

            <div class="checkout-empty">

                <p>
                    Seu carrinho está vazio.
                </p>

                <a
                    href="index.html"
                    class="back-link"
                >
                    Voltar para a loja
                </a>

            </div>

        `;


        if (checkoutForm) {

            checkoutForm.style.display =
                "none";

        }


        updateCheckoutTotal();

        return;

    }


    if (checkoutForm) {

        checkoutForm.style.display =
            "";

    }


    checkoutCart.forEach(
        item => {

            const subtotal =
                item.price *
                item.quantity;


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "checkout-product";


            element.innerHTML = `

                <img
                    src="${item.image}?auto=format&fit=crop&w=160&q=70"
                    alt="${item.name}"
                    width="70"
                    height="70"
                    loading="lazy"
                    decoding="async"
                >

                <div class="checkout-product-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        ${item.quantity}x
                        R$ ${formatCheckoutPrice(
                            item.price
                        )}
                    </span>

                </div>

                <strong>
                    R$ ${formatCheckoutPrice(
                        subtotal
                    )}
                </strong>

            `;


            checkoutItems.appendChild(
                element
            );

        }
    );


    updateCheckoutTotal();

}


// ============================
// TROCAR FRETE
// ============================

shippingOptions.forEach(
    option => {

        option.addEventListener(
            "change",
            () => {

                updateCheckoutTotal();

            }
        );

    }
);


// ============================
// CEP
// ============================

const cepInput =
    document.getElementById("cep");

const cepStatus =
    document.getElementById("cepStatus");

const streetInput =
    document.getElementById("street");

const neighborhoodInput =
    document.getElementById(
        "neighborhood"
    );

const cityInput =
    document.getElementById("city");

const stateInput =
    document.getElementById("state");


if (cepInput) {

    cepInput.addEventListener(
        "input",
        async event => {

            let value =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 8);


            if (value.length > 5) {

                value =
                    value.slice(0, 5)
                    + "-"
                    + value.slice(5);

            }


            event.target.value =
                value;


            const cleanCep =
                value.replace(
                    /\D/g,
                    ""
                );


            if (
                cleanCep.length !== 8
            ) {

                if (cepStatus) {

                    cepStatus.textContent =
                        "";

                }

                return;

            }


            if (cepStatus) {

                cepStatus.textContent =
                    "Buscando...";

            }


            try {

                const response =
                    await fetch(
                        `https://brasilapi.com.br/api/cep/v2/${cleanCep}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "CEP não encontrado"
                    );

                }


                const data =
                    await response.json();


                if (streetInput) {

                    streetInput.value =
                        data.street || "";

                }


                if (
                    neighborhoodInput
                ) {

                    neighborhoodInput.value =
                        data.neighborhood || "";

                }


                if (cityInput) {

                    cityInput.value =
                        data.city || "";

                }


                if (stateInput) {

                    stateInput.value =
                        data.state || "";

                }


                if (cepStatus) {

                    cepStatus.textContent =
                        "✓ Endereço encontrado";

                }

            }
            catch (error) {

                console.error(
                    "Erro ao consultar CEP:",
                    error
                );


                if (cepStatus) {

                    cepStatus.textContent =
                        "CEP não encontrado";

                }

            }

        }
    );

}


// ============================
// FORMULÁRIO
// ============================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
       async event => {

            event.preventDefault();


            if (
                checkoutCart.length === 0
            ) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            const formData =
                new FormData(
                    checkoutForm
                );


            const customer = {

                name:
                    formData.get("name"),

                email:
                    formData.get("email"),

                phone:
                    formData.get("phone"),

                cep:
                    formData.get("cep"),

                state:
                    formData.get("state"),

                street:
                    formData.get("street"),

                number:
                    formData.get("number"),

                complement:
                    formData.get("complement"),

                neighborhood:
                    formData.get(
                        "neighborhood"
                    ),

                city:
                    formData.get("city")

            };


            const shipping =
                getSelectedShipping();


            const subtotal =
                calculateSubtotal();


            const order = {

                customer,

                products:
                    checkoutCart,

                shipping,

                subtotal,

                total:
                    subtotal +
                    shipping.price

            };


            console.log(
                "Pedido:",
                order
            );


            // ============================
// NÚMERO DO PEDIDO
// ============================

const now =
    new Date();

const date =
    now.getFullYear().toString()
    +
    String(
        now.getMonth() + 1
    ).padStart(2, "0")
    +
    String(
        now.getDate()
    ).padStart(2, "0");


const random =
    Math.floor(
        1000 +
        Math.random() * 9000
    );


const orderNumber =
    `${date}-${random}`;


// ============================
// SALVAR PEDIDO
// ============================

order.orderNumber =
    orderNumber;


order.createdAt =
    now.toISOString();


// ============================
// ENVIAR PEDIDO PARA A API
// ============================

try {

    const response =
        await fetch(
            "/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(order)
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "Erro ao salvar pedido:",
            data
        );

        alert(
            "Não foi possível registrar o pedido. Tente novamente."
        );

        return;

    }


    // ============================
    // SALVAR LOCALMENTE
    // ============================

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // ============================
    // LIMPAR CARRINHO
    // ============================

    localStorage.removeItem(
        "cart"
    );


    // ============================
    // IR PARA CONFIRMAÇÃO
    // ============================

    window.location.href =
        "pedido.html";


}
catch (error) {

    console.error(
        "Erro ao enviar pedido:",
        error
    );


    alert(
        "Erro de conexão. Tente novamente."
    );

}


// ============================
// INICIALIZAÇÃO
// ============================

renderCheckout();
