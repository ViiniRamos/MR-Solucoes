document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formOrcamento");
    if (!form) return;

    const feedback = document.getElementById("orcamentoFeedback");
    const botaoEnviar = document.getElementById("orcamentoEnviar");

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const dados = {
            nome: form.nome.value.trim(),
            telefone: form.telefone.value.trim(),
            problema: form.problema.value.trim(),
        };

        botaoEnviar.disabled = true;
        feedback.textContent = "Enviando...";
        feedback.className = "mb-0 text-muted";

        try {
            const resposta = await fetch("/api/orcamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.ok) {
                throw new Error(resultado.erro || "Não foi possível enviar seu pedido.");
            }

            feedback.textContent = "Recebemos seu pedido! Em breve entraremos em contato.";
            feedback.className = "mb-0 text-success";
            form.reset();
        } catch (erro) {
            feedback.textContent = erro.message;
            feedback.className = "mb-0 text-danger";
        } finally {
            botaoEnviar.disabled = false;
        }
    });
});
