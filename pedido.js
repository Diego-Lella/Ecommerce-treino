// ==========================================
// PEGAR ID DO PEDIDO NA URL
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    params.get("id");


// ==========================================
// ELEMENTOS
// ==========================================

const orderNumber =
    document.getElementById(
        "orderNumber"
    );

const orderProducts =
    document.getElementById(
        "orderProducts"
    );

const orderSubtotal =
    document.getElementById(
        "orderSubtotal"
    );

const orderShipping =
    document.getElementById(
        "orderShipping"
    );

const orderTotal =
    document.getElementById(
        "orderTotal"
    );

const orderCustomer =
    document.getElementById(
        "orderCustomer"
    );


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatPrice(price) {

    return Number(price).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// MOSTRAR ERRO
// ==========================================

function showError(message) {

    if (orderProducts) {

        orderProducts.innerHTML = `
            <p>${message}</p>

            <a
                href="index.html"
                class="back-link"
            >
                Voltar para a loja
            </a>
        `;

    }

}


// ==========================================
// VERIFICAR ID
// ==========================================

if (!orderId) {

    showError(
        "Nenhum pedido encontrado."
    );

}
else {

    carregarPedido();

}


// ==========================================
// CARREGAR PEDIDO
// ==========================================

async function carregarPedido() {

    try {

        const response =
            await fetch(
                `/api/orders?id=${encodeURIComponent(orderId)}`
            );


        if (!response.ok) {

            throw new Error(
                "Pedido não encontrado"
            );

        }


        const result =
            await response.json();


        if (
            !result.success ||
            !result.order
        ) {

            throw new Error(
                "Pedido não encontrado"
            );

        }


        const order =
            result.order;


        // ======================================
        // CONVERTER CAMPOS JSON
        // ======================================

        const customer =
            typeof order.customer === "string"
                ? JSON.parse(order.customer)
                : order.customer;


        const products =
            typeof order.products === "string"
                ? JSON.parse(order.products)
                : order.products;


        const shipping =
            typeof order.shipping === "string"
                ? JSON.parse(order.shipping)
                : order.shipping;


        // ======================================
        // NÚMERO
        // ======================================

        if (orderNumber) {

            orderNumber.textContent =
                order.order_number;

        }


        // ======================================
        // VALORES
        // ======================================

        if (orderSubtotal) {

            orderSubtotal.textContent =
                `R$ ${formatPrice(
                    order.subtotal
                )}`;

        }


        if (orderShipping) {

            orderShipping.textContent =
                `R$ ${formatPrice(
                    shipping.price
                )}`;

        }


        if (orderTotal) {

            orderTotal.textContent =
                `R$ ${formatPrice(
                    order.total
                )}`;

        }


        // ======================================
        // PRODUTOS
        // ======================================

        if (orderProducts) {

            orderProducts.innerHTML = "";


            products.forEach(
                product => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "order-product";


                    const itemTotal =
                        Number(product.price) *
                        Number(product.quantity);


                    item.innerHTML = `

                        <img
                            src="${product.image || ""}"
                            alt="${product.name}"
                            width="70"
                            height="70"
                        >

                        <div>

                            <strong>
                                ${product.name}
                            </strong>

                            <span>
                                ${product.quantity}x
                                R$ ${formatPrice(
                                    product.price
                                )}
                            </span>

                        </div>

                        <strong>
                            R$ ${formatPrice(
                                itemTotal
                            )}
                        </strong>

                    `;


                    orderProducts.appendChild(
                        item
                    );

                }
            );

        }


        // ======================================
        // ENDEREÇO
        // ======================================

        if (orderCustomer) {

            orderCustomer.innerHTML = `

                <strong>
                    ${customer.name || ""}
                </strong>

                <br>

                ${customer.street || ""},
                ${customer.number || ""}

                ${
                    customer.complement
                        ? ` - ${customer.complement}`
                        : ""
                }

                <br>

                ${customer.neighborhood || ""}

                <br>

                ${customer.city || ""}
                -
                ${customer.state || ""}

                <br>

                CEP:
                ${customer.cep || ""}

            `;

        }


    }
    catch (error) {

        console.error(
            "Erro ao carregar pedido:",
            error
        );

        showError(
            "Não foi possível carregar este pedido."
        );

    }

                      }
