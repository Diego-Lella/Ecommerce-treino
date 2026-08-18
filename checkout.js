// ============================
// PRODUTOS DO CARRINHO
// ============================

const checkoutItems =
    document.getElementById(
        "checkoutItems"
    );

const checkoutTotal =
    document.getElementById(
        "checkoutTotal"
    );

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


// ============================
// PEGAR CARRINHO
// ============================

let checkoutCart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ============================
// FORMATAR PREÇO
// ============================

function formatCheckoutPrice(
    price
) {

    return price.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================
// MOSTRAR PEDIDO
// ============================

function renderCheckout() {

    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    if (
        checkoutCart.length === 0
    ) {

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

        return;

    }


    let total = 0;


    checkoutCart.forEach(
        item => {

            const subtotal =
                item.price *
                item.quantity;


            total += subtotal;


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


    if (checkoutTotal) {

        checkoutTotal.textContent =
            `R$ ${formatCheckoutPrice(total)}`;

    }

}


// ============================
// CEP
// ============================

const cepInput =
    document.getElementById("cep");


if (cepInput) {

    cepInput.addEventListener(
        "input",
        event => {

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

        }
    );

}


// ============================
// FORMULÁRIO
// ============================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        event => {

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

                city:
                    formData.get("city")

            };


            console.log(
                "Cliente:",
                customer
            );


            console.log(
                "Pedido:",
                checkoutCart
            );


            alert(
                "Pedido recebido! Agora vamos conectar o pagamento."
            );

        }
    );

}


// ============================
// INICIALIZAÇÃO
// ============================

renderCheckout();
