export default async function handler(req, res) {

    const supabaseUrl =
        process.env.SUPABASE_URL;

    const supabaseKey =
           process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            error: "Supabase não configurado"
        });
    }

    try {

        // ==========================================
        // BUSCAR PEDIDO
        // GET /api/orders?id=UUID
        // ==========================================

        if (req.method === "GET") {

            const orderId = req.query.id;

            if (!orderId) {
                return res.status(400).json({
                    error: "ID do pedido não informado"
                });
            }

            const response = await fetch(
                `${supabaseUrl}/rest/v1/orders?Id=eq.${encodeURIComponent(orderId)}&select=*`,
                {
                    method: "GET",

                    headers: {
                        "apikey": supabaseKey,
                        "Authorization":
                            `Bearer ${supabaseKey}`
                    }
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Erro Supabase:",
                    errorText
                );

                return res.status(500).json({
                    error: "Erro ao buscar pedido"
                });
            }

            const data =
                await response.json();

            if (!data.length) {
                return res.status(404).json({
                    error: "Pedido não encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                order: data[0]
            });
        }


        // ==========================================
        // CRIAR PEDIDO
        // POST /api/orders
        // ==========================================

        if (req.method === "POST") {

            const order = req.body;

            if (!order) {
                return res.status(400).json({
                    error: "Pedido não enviado"
                });
            }

            if (
                !order.customer ||
                !order.products ||
                !order.shipping ||
                order.subtotal === undefined ||
                order.total === undefined
            ) {
                return res.status(400).json({
                    error: "Dados do pedido incompletos"
                });
            }

            const orderNumber =
                "PED-" + Date.now();

            const response = await fetch(
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

                    body: JSON.stringify({

                        order_number:
                            orderNumber,

                        customer:
                            order.customer,

                        products:
                            order.products,

                        shipping:
                            order.shipping,

                        subtotal:
                            order.subtotal,

                        total:
                            order.total,

                        status:
                            "pending"

                    })
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Erro Supabase:",
                    errorText
                );

                return res.status(500).json({
                    error: "Erro ao salvar pedido"
                });
            }

            const data =
                await response.json();

            const savedOrder =
                data[0];

            return res.status(201).json({

                success: true,

                orderId:
                    savedOrder.Id,

                orderNumber:
                    savedOrder.order_number

            });
        }


        return res.status(405).json({
            error: "Método não permitido"
        });

    }
    catch (error) {

        console.error(
            "Erro na API:",
            error
        );

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
                        }


