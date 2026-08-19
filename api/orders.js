export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // ==========================================
    // VERIFICAR CONFIGURAÇÃO
    // ==========================================

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            success: false,
            error: "Supabase não configurado"
        });
    }

    try {

        // ==========================================
        // GET — BUSCAR PEDIDO PELO UUID
        // /api/orders?id=UUID
        // ==========================================

        if (req.method === "GET") {

            const orderId = req.query?.id;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    error: "ID do pedido não informado"
                });
            }

            const url =
                `${supabaseUrl}/rest/v1/orders` +
                `?Id=eq.${encodeURIComponent(orderId)}` +
                `&select=*`;

            const response = await fetch(url, {
                method: "GET",

                headers: {
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`
                }
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                data = null;
            }

            if (!response.ok) {

                console.error(
                    "Erro Supabase GET:",
                    text
                );

                return res.status(500).json({
                    success: false,
                    error: "Erro ao buscar pedido",
                    details: text
                });
            }

            if (!Array.isArray(data) || data.length === 0) {

                return res.status(404).json({
                    success: false,
                    error: "Pedido não encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                order: data[0]
            });
        }


        // ==========================================
        // POST — CRIAR PEDIDO
        // /api/orders
        // ==========================================

        if (req.method === "POST") {

            const order = req.body;

            if (!order) {

                return res.status(400).json({
                    success: false,
                    error: "Pedido não enviado"
                });
            }


            // ======================================
            // VALIDAR PEDIDO
            // ======================================

            if (!order.customer) {

                return res.status(400).json({
                    success: false,
                    error: "Cliente não informado"
                });
            }

            if (
                !order.products ||
                !Array.isArray(order.products) ||
                order.products.length === 0
            ) {

                return res.status(400).json({
                    success: false,
                    error: "Produtos não informados"
                });
            }

            if (!order.shipping) {

                return res.status(400).json({
                    success: false,
                    error: "Frete não informado"
                });
            }

            if (
                order.subtotal === undefined ||
                order.total === undefined
            ) {

                return res.status(400).json({
                    success: false,
                    error: "Valores do pedido não informados"
                });
            }


            // ======================================
            // NÚMERO DO PEDIDO
            // ======================================

            const orderNumber =
                "PED-" + Date.now();


            // ======================================
            // DADOS PARA O SUPABASE
            // ======================================

            const orderData = {

                order_number: orderNumber,

                customer: order.customer,

                products: order.products,

                shipping: order.shipping,

                subtotal: Number(order.subtotal),

                total: Number(order.total),

                status: "pending"

            };


            // ======================================
            // SALVAR NO SUPABASE
            // ======================================

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

                    body:
                        JSON.stringify(orderData)
                }
            );


            const text =
                await response.text();


            let data;

            try {

                data =
                    JSON.parse(text);

            } catch {

                data = null;

            }


            // ======================================
            // ERRO SUPABASE
            // ======================================

            if (!response.ok) {

                console.error(
                    "Erro Supabase POST:",
                    text
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Erro ao salvar pedido",

                    details:
                        text

                });
            }


            // ======================================
            // VERIFICAR RESPOSTA
            // ======================================

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                return res.status(500).json({

                    success: false,

                    error:
                        "Pedido salvo, mas o Supabase não retornou os dados"

                });
            }


            const savedOrder =
                data[0];


            // ======================================
            // RETORNAR RESULTADO
            // ======================================

            return res.status(201).json({

                success: true,

                orderId:
                    savedOrder.Id,

                orderNumber:
                    savedOrder.order_number

            });
        }


        // ==========================================
        // MÉTODO NÃO PERMITIDO
        // ==========================================

        return res.status(405).json({

            success: false,

            error:
                "Método não permitido"

        });


    } catch (error) {

        console.error(
            "Erro interno da API:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "Erro interno do servidor",

            details:
                error.message

        });
    }
}

                        
