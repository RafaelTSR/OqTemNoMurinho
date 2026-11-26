import { buscarProdutoPorId } from "./produtos.js";
import { exibirFoto, formatarPreco } from "./interface.js";
import "./sessao.js";

const mensagem = document.getElementById("mensagem-post");
const principal = document.querySelector(".post-principal");
const descricao = document.querySelector(".descricao");

async function carregarPost() {
    // O link do Feed carrega o identificador no formato ?id=...
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!id || id.includes("/") || id === "." || id === ".." || /^__.*__$/.test(id)) {
        mensagem.textContent = "Selecione um produto nos Destaques do Feed.";
        return;
    }

    try {
        const produto = await buscarProdutoPorId(id);

        if (!produto) {
            mensagem.textContent = "Produto não encontrado. Volte ao Feed para escolher outro.";
            return;
        }

        document.title = `${produto.nome} | O Que Tem no Murinho?`;
        principal.querySelector(".post-principal__nome").textContent = produto.nome;
        principal.querySelector(".preco").textContent = formatarPreco(produto.preco);
        exibirFoto(principal.querySelector(".post-principal__imagem"), produto);

        descricao.querySelector(".descricao__texto").textContent =
            produto.descricao || "Nenhuma informação adicional.";
        principal.hidden = false;
        descricao.hidden = false;
        mensagem.textContent = "";
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar este produto. Tente novamente.";
        console.error("Falha ao carregar o post:", erro);
    }
}

carregarPost();
