export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    try {

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

        const supabaseUrl =
            process.env.SUPABASE_URL;

        const supabaseKey =
            process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                error: "Supabase não configurado"
            });
        }

        const orderNumber =
            "PED-" +
            Date.now();

        const response = await fetch(
            `${supabaseUrl}/rest/v1/orders`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`,
                    "Prefer": "return=representation"
                },

                body: JSON.stringify({

                    order_number: orderNumber,

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
                savedOrder.id,

            orderNumber:
                savedOrder.order_number

        });

    } catch (error) {

        console.error(
            "Erro na API:",
            error
        );

        return res.status(500).json({
            error: "Erro interno do servidor"
        });

    }

}
