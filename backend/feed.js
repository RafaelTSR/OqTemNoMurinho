import { listarProdutosRecentes } from "./produtos.js";
import { exibirFoto, formatarPreco } from "./interface.js";
import "./sessao.js";

const lista = document.getElementById("lista-destaques");
const modelo = document.getElementById("modelo-card");
const mensagem = document.getElementById("mensagem-feed");
const controles = document.getElementById("controles-destaques");
const anterior = document.getElementById("destaque-anterior");
const proximo = document.getElementById("destaque-proximo");

function montarCard(produto) {
    // Clona o HTML do card e preenche suas partes com os dados do Firestore.
    const card = modelo.content.firstElementChild.cloneNode(true);
    const id = encodeURIComponent(produto.id);

    card.href = `MurinhoPost.html?id=${id}`;
    card.querySelector(".card__nome").textContent = produto.nome;
    card.querySelector(".card__preco").textContent = formatarPreco(produto.preco);
    exibirFoto(card.querySelector(".card__imagem"), produto);

    return card;
}

function atualizarControles() {
    // O último ponto de rolagem é a largura total menos a parte visível.
    const fim = lista.scrollWidth - lista.clientWidth;
    // Com poucos produtos, a faixa inteira cabe na tela e dispensa as setas.
    controles.hidden = fim <= 1;
    anterior.disabled = lista.scrollLeft <= 1;
    proximo.disabled = lista.scrollLeft >= fim - 1;
}

function rolarDestaques(direcao) {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista.scrollBy({
        left: direcao * lista.clientWidth,
        behavior: reduzirMovimento ? "auto" : "smooth"
    });
}

anterior.addEventListener("click", () => rolarDestaques(-1));
proximo.addEventListener("click", () => rolarDestaques(1));
lista.addEventListener("scroll", atualizarControles);
// Recalcula o espaço quando a faixa muda de largura.
const observarLargura = new ResizeObserver(atualizarControles);
observarLargura.observe(lista);

async function carregarFeed() {
    try {
        const produtos = await listarProdutosRecentes();

        if (produtos.length === 0) {
            mensagem.textContent = "Ainda não há produtos publicados.";
            return;
        }

        for (const produto of produtos) {
            lista.appendChild(montarCard(produto));
        }

        mensagem.textContent = "";
        atualizarControles();
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar os produtos. Atualize a página para tentar novamente.";
        console.error("Falha ao carregar o Feed:", erro);
    }
}

carregarFeed();
