const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

function extrairJson(texto) {
    const semFences = texto.replace(/```json|```/g, "").trim();
    return JSON.parse(semFences);
}

async function analisarProblema(descricao) {
    const prompt = `Você ajuda uma empresa de serviços elétricos brasileira a triar pedidos de clientes.
Analise a descrição do problema elétrico abaixo e responda APENAS com um JSON válido, sem nenhum texto fora do JSON, no formato exato:
{"causaProvavel": "string", "materiaisProvaveis": ["string"], "urgencia": "baixa" | "media" | "alta", "orcamentoProvavel": "string"}

Em "orcamentoProvavel", estime uma faixa de valores em reais (R$) que um eletricista normalmente cobraria por esse serviço no Brasil (mão de obra + materiais), deixando claro que é uma estimativa sujeita a confirmação na visita técnica.

Descrição do cliente: "${descricao}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    if (!resposta.ok) {
        const erroTexto = await resposta.text();
        throw new Error(`Erro na API do Gemini: ${resposta.status} ${erroTexto}`);
    }

    const dados = await resposta.json();
    const texto = dados.candidates[0].content.parts[0].text;

    return extrairJson(texto);
}

module.exports = { analisarProblema };
