const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function notificarDono({ nome, telefone, problema, analise }) {
    const destino = process.env.EMAIL_DESTINO || process.env.GMAIL_USER;

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: destino,
        subject: `Novo pedido de orçamento - urgência ${analise.urgencia}`,
        text: `Nome: ${nome}
Telefone: ${telefone}
Problema descrito: ${problema}

Urgência: ${analise.urgencia}
Causa provável: ${analise.causaProvavel}
Materiais prováveis: ${analise.materiaisProvaveis.join(", ")}

Orçamento provável: ${analise.orcamentoProvavel}`,
    });
}

module.exports = { notificarDono };
