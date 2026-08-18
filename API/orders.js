export default function handler(req, res) {

    return res.status(200).json({
        funcionando: true,
        metodo: req.method,
        mensagem: "API funcionando corretamente"
    });

} 
                                
