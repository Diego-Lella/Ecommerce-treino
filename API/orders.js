export default async function handler(req, res) {

    // ============================
    // ACEITAR SOMENTE POST
    // ============================

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Método não permitido"
        });

    }


    try {

        // ============================
        // DADOS DO PEDIDO
        // ============================

        const order = req.body;


        if (!order) {

            return res.status(400).json({
                error: "Pedido não enviado"
            });

        }


        // ============================
        // VALIDAR CAMPOS
        // ============================

        if (
            !order.customer ||
            !Array.isArray(order.products) ||
            !order.shipping ||
            order.subtotal === undefined ||
            order.total === undefined
        ) {

            return res.status(400).json({
                error: "Dados do pedido incompletos"
            });

        }


        // ============================
        // SUPABASE
        // ============================

        const supabaseUrl =
            process.env.SUPABASE_URL;

        const supabaseKey =
            process.env.SUPABASE_ANON_KEY;


        if (
            !supabaseUrl ||
            !supabaseKey
        ) {

            return res.status(500).json({
                error:
                    "Variáveis do Supabase não configuradas"
            });

        }


        // ============================
        // NÚMERO DO PEDIDO
        // ============================

        const orderNumber =
            `PED-${Date.now()}`;


        // ============================
        // ENVIAR PARA O SUPABASE
        // ============================

        const response =
            await fetch(
                `${supabaseUrl}/rest/v1/orders`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            supabaseKey,

                        "Authorization":
                            `Bearer ${supabaseKey}`,

                        "Prefer":
                            "return=representation"

                    },

                    body:
                        JSON.stringify({

                            order_number:
                                orderNumber,

                            customer:
                                order.customer,

                            products:
                                order.products,

                            shipping:
                                order.shipping,

                            subtotal:
                                Number(
                                    order.subtotal
                                ),

                            total:
                                Number(
                                    order.total
                                ),

                            status:
                                "pending"

                        })

                }
            );


        // ============================
        // ERRO DO SUPABASE
        // ============================

        if (!response.ok) {

            const error =
                await response.text();


            console.error(
                "Erro Supabase:",
                error
            );


            return res.status(
                response.status
            ).json({

                error:
                    "Erro ao salvar pedido",

                details:
                    error

            });

        }


        // ============================
        // PEDIDO SALVO
        // ============================

        const data =
            await response.json();


        const savedOrder =
            data[0];


        // ============================
        // RESPOSTA PARA O CHECKOUT
        // ============================

        return res.status(201).json({

            success: true,

            orderId:
                savedOrder?.id || orderNumber,

            order:
                savedOrder

        });


    }
    catch (error) {

        console.error(
            "Erro na API:",
            error
        );


        return res.status(500).json({

            error:
                "Erro interno do servidor",

            details:
                error.message

        });

    }

}
