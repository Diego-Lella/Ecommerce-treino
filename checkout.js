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
// FORMATAÇÃO
// ============================

function formatCheckoutPrice(price) {

    return Number(price).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================
// SUBTOTAL
// ============================

function calculateSubtotal() {

    return checkoutCart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );

}


// ============================
// FRETE
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
            selected.dataset.name ||
            "Entrega",

        price:
            Number(selected.value) || 0

    };

}


// ============================
// TOTAL
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
// RENDERIZAR PRODUTOS
// ============================

function renderCheckout() {

    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    if (checkoutCart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="checkout-empty">
                Seu carrinho está vazio.
            </div>
        `;

        updateCheckoutTotal();

        return;

    }


    checkoutCart.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        const element =
            document.createElement("div");


        element.className =
            "checkout-product";


        element.innerHTML = `

            <img
                src="${item.image || ""}"
                alt="${item.name || "Produto"}"
            >

            <div class="checkout-product-info">

                <strong>
                    ${item.name || "Produto"}
                </strong>

                <span>
                    Quantidade:
                    ${item.quantity}
                </span>

            </div>

            <strong>
                R$ ${formatCheckoutPrice(
                    itemTotal
                )}
            </strong>

        `;


        checkoutItems.appendChild(
            element
        );

    });


    updateCheckoutTotal();

}


// ============================
// ALTERAR FRETE
// ============================

shippingOptions.forEach(option => {

    option.addEventListener(
        "change",
        updateCheckoutTotal
    );

});


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
        async () => {

            let value =
                cepInput.value.replace(
                    /\D/g,
                    ""
                );


            if (value.length > 8) {

                value =
                    value.substring(0, 8);

            }


            if (value.length > 5) {

                value =
                    value.substring(0, 5) +
                    "-" +
                    value.substring(5);

            }


            cepInput.value =
                value;


            const cleanCep =
                value.replace(
                    /\D/g,
                    ""
                );


            if (cleanCep.length !== 8) {
                return;
            }


            if (cepStatus) {

                cepStatus.textContent =
                    "Buscando endereço...";

            }


            try {

                const response =
                    await fetch(
                        `https://viacep.com.br/ws/${cleanCep}/json/`
                    );


                const data =
                    await response.json();


                if (data.erro) {

                    throw new Error(
                        "CEP não encontrado"
                    );

                }


                if (streetInput) {
                    streetInput.value =
                        data.logradouro || "";
                }


                if (neighborhoodInput) {
                    neighborhoodInput.value =
                        data.bairro || "";
                }


                if (cityInput) {
                    cityInput.value =
                        data.localidade || "";
                }


                if (stateInput) {
                    stateInput.value =
                        data.uf || "";
                }


                if (cepStatus) {

                    cepStatus.textContent =
                        "Endereço encontrado.";

                }

            } catch (error) {

                if (cepStatus) {

                    cepStatus.textContent =
                        "Não foi possível consultar o CEP.";

                }

            }

        }
    );

}


// ============================
// FINALIZAR PEDIDO
// ============================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (checkoutCart.length === 0) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            const formData =
                new FormData(
                    checkoutForm
                );


            const shipping =
                getSelectedShipping();


            const subtotal =
                calculateSubtotal();


            const order = {

                customer: {

                    name:
                        formData.get("name"),

                    email:
                        formData.get("email"),

                    phone:
                        formData.get("phone"),

                    cep:
                        formData.get("cep"),

                    street:
                        formData.get("street"),

                    number:
                        formData.get("number"),

                    complement:
                        formData.get(
                            "complement"
                        ),

                    neighborhood:
                        formData.get(
                            "neighborhood"
                        ),

                    city:
                        formData.get("city"),

                    state:
                        formData.get("state")

                },

                products:
                    checkoutCart,

                shipping: {

                    name:
                        shipping.name,

                    price:
                        shipping.price

                },

                subtotal:
                    subtotal,

                total:
                    subtotal +
                    shipping.price

            };


            try {

                // ============================
                // CHAMAR API
                // ============================

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
                                JSON.stringify(
                                    order
                                )

                        }
                    );


                // ============================
                // RESPOSTA BRUTA
                // ============================

                const responseText =
                    await response.text();


                // ============================
                // TENTAR JSON
                // ============================

                let result = null;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    // Não é JSON
                    result = null;

                }


                // ============================
                // ERRO DA API
                // ============================

                if (!response.ok) {

                    let mensagem =
                        "Erro ao finalizar pedido.";


                    if (result?.error) {

                        mensagem =
                            result.error;

                    }


                    if (
                        result?.details
                    ) {

                        mensagem +=
                            "\n\nDetalhes:\n" +
                            result.details;

                    }


                    if (
                        !result &&
                        responseText
                    ) {

                        mensagem =
                            "A API retornou uma resposta inesperada.\n\n" +
                            "Status: " +
                            response.status;

                    }


                    alert(mensagem);

                    return;

                }


                // ============================
                // API RETORNOU TEXTO
                // ============================

                if (!result) {

                    alert(
                        "A API respondeu, mas não retornou JSON.\n\n" +
                        "Status: " +
                        response.status
                    );

                    return;

                }


                // ============================
                // SUCESSO
                // ============================

                if (result.orderId) {

                    localStorage.removeItem(
                        "cart"
                    );


                    window.location.href =
                        `pedido.html?id=${result.orderId}`;

                    return;

                }


                alert(
                    "Pedido enviado, mas a API não retornou o número do pedido."
                );


            } catch (error) {

                alert(
                    "Erro de conexão com a API.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================
// INICIAR
// ============================

renderCheckout();
     
                    