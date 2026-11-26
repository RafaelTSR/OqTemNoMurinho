import { auth } from "./firebase.js";
import { publicarProduto } from "./produtos.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import "./sessao.js";

const formulario = document.getElementById("form-post");
const campos = document.getElementById("campos-publicacao");
const mensagem = document.getElementById("mensagem-publicacao");
const avisoLogin = document.getElementById("aviso-login");
const botaoPostar = document.getElementById("botao-postar");
const nomeArquivo = document.getElementById("nome-arquivo");
let enviando = false;

// Aguarda o Firebase recuperar a sessão antes de liberar a publicação.
onAuthStateChanged(auth, (usuario) => {
    campos.disabled = usuario === null || enviando;
    avisoLogin.hidden = usuario !== null;
    mensagem.textContent = "";
});

formulario.elements.foto.addEventListener("change", () => {
    const arquivo = formulario.elements.foto.files[0];
    nomeArquivo.textContent = arquivo ? arquivo.name : "Adicionar foto";
});

function converterPreco(texto) {
    // Aceita 8, 8,50 e 8.50. A entrada é convertida para número antes da gravação.
    const valor = texto.trim();
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(valor)) {
        return NaN;
    }
    return Number(valor.replace(",", "."));
}

async function prepararFoto(arquivo) {
    if (!arquivo) {
        return "";
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
        throw new Error("Selecione uma imagem JPG, PNG ou WebP.");
    }

    // A demonstração usa uma miniatura JPEG que cabe no documento do Firestore.
    let imagem;
    try {
        imagem = await createImageBitmap(arquivo);
    } catch {
        throw new Error("Não foi possível abrir a imagem. Escolha outro arquivo.");
    }

    try {
        const tela = document.createElement("canvas");
        const pincel = tela.getContext("2d");

        for (const ladoMaximo of [640, 480, 320]) {
            const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
            tela.width = Math.max(1, Math.round(imagem.width * escala));
            tela.height = Math.max(1, Math.round(imagem.height * escala));
            pincel.fillStyle = "#fff";
            pincel.fillRect(0, 0, tela.width, tela.height);
            pincel.drawImage(imagem, 0, 0, tela.width, tela.height);

            const foto = tela.toDataURL("image/jpeg", 0.7);
            if (foto.startsWith("data:image/jpeg;base64,") && foto.length <= 120000) {
                return foto;
            }
        }

        throw new Error("A foto ainda ficou grande. Selecione uma imagem menor.");
    } finally {
        imagem.close();
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const vendedor = auth.currentUser;

    if (enviando || !vendedor) {
        return;
    }

    const nome = formulario.elements.nome.value.trim();
    const preco = converterPreco(formulario.elements.preco.value);
    const descricao = formulario.elements.descricao.value.trim();
    const arquivo = formulario.elements.foto.files[0];

    if (!nome || !Number.isFinite(preco) || preco <= 0) {
        mensagem.textContent = "Informe o nome do produto e um preço maior que zero, como 8,50.";
        return;
    }

    enviando = true;
    campos.disabled = true;
    botaoPostar.textContent = "PUBLICANDO…";
    mensagem.textContent = "Salvando produto…";

    try {
        const imagemUrl = await prepararFoto(arquivo);

        // O UID vem do Firebase Auth e precisa bater com as regras do Firestore.
        await publicarProduto({ nome, preco, descricao, imagemUrl, vendedorId: vendedor.uid });
        window.location.assign("MurinhoFeed.html");
    } catch (erro) {
        if (erro.code === "permission-denied") {
            mensagem.textContent = "O Firestore bloqueou a gravação. Confira a sessão e as regras da coleção produtos.";
        } else if (erro.code) {
            mensagem.textContent = "Não foi possível publicar. Confira sua conexão e tente novamente.";
        } else {
            mensagem.textContent = erro.message;
        }
        console.error("Falha ao publicar:", erro);
    } finally {
        enviando = false;
        campos.disabled = !auth.currentUser;
        botaoPostar.textContent = "POSTAR";
    }
});
