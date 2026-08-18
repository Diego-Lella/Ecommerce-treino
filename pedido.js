// ============================
// PEGAR PEDIDO
// ============================

const savedOrder =
    JSON.parse(
        localStorage.getItem(
            "lastOrder"
        )
    );


// ============================
// ELEMENTOS
// ============================

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


// ============================
// FORMATAR PREÇO
// ============================

function formatPrice(price) {

    return Number(price).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================
// VERIFICAR PEDIDO
// ============================

if (!savedOrder) {

    if (orderProducts) {

        orderProducts.innerHTML = `

            <p>
                Nenhum pedido encontrado.
            </p>

            <a
                href="index.html"
                class="back-link"
            >
                Voltar para a loja
            </a>

        `;

    }

}
else {


    // ========================
    // NÚMERO
    // ========================

    if (orderNumber) {

        orderNumber.textContent =
            savedOrder.orderNumber;

    }


    // ========================
    // VALORES
    // ========================

    if (orderSubtotal) {

        orderSubtotal.textContent =
            `R$ ${formatPrice(
                savedOrder.subtotal
            )}`;

    }


    if (orderShipping) {

        orderShipping.textContent =
            `R$ ${formatPrice(
                savedOrder.shipping.price
            )}`;

    }


    if (orderTotal) {

        orderTotal.textContent =
            `R$ ${formatPrice(
                savedOrder.total
            )}`;

    }


    // ========================
    // PRODUTOS
    // ========================

    if (orderProducts) {

        orderProducts.innerHTML = "";


        savedOrder.products.forEach(
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
                        src="${product.image}"
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


    // ========================
    // ENDEREÇO
    // ========================

    if (orderCustomer) {

        const customer =
            savedOrder.customer;


        orderCustomer.innerHTML = `

            <strong>
                ${customer.name}
            </strong>

            <br>

            ${customer.street},
            ${customer.number}

            ${customer.complement
                ? ` - ${customer.complement}`
                : ""
            }

            <br>

            ${customer.neighborhood}

            <br>

            ${customer.city}
            -
            ${customer.state}

            <br>

            CEP:
            ${customer.cep}

        `;

    }

              }
