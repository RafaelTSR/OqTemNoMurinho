import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const janela = document.getElementById("janela-conta");
const formulario = document.getElementById("form-conta");
const titulo = document.getElementById("titulo-conta");
const senha = document.getElementById("senha-conta");
const mensagem = document.getElementById("mensagem-conta");
const confirmar = document.getElementById("confirmar-conta");
const fechar = document.getElementById("fechar-conta");
let cadastrando = false;

// O formulário de publicação usa esse parâmetro para voltar após o login.
const parametros = new URLSearchParams(window.location.search);
const veioDaPublicacao = parametros.get("destino") === "publicar";

function abrirConta(modo) {
    cadastrando = modo === "cadastro";
    formulario.reset();
    mensagem.textContent = "";
    titulo.textContent = cadastrando ? "Criar conta" : "Entrar na sua conta";
    confirmar.textContent = cadastrando ? "Criar conta" : "Entrar";
    senha.autocomplete = cadastrando ? "new-password" : "current-password";
    senha.minLength = cadastrando ? 6 : 0;
    janela.showModal();
}

document.getElementById("abrir-login").addEventListener("click", () => abrirConta("login"));
document.getElementById("abrir-cadastro").addEventListener("click", () => abrirConta("cadastro"));
fechar.addEventListener("click", () => janela.close());

if (veioDaPublicacao) {
    abrirConta("login");
}

function mensagemDeErro(erro) {
    switch (erro.code) {
        case "auth/email-already-in-use":
            return "Já existe uma conta com esse e-mail.";
        case "auth/weak-password":
        case "auth/password-does-not-meet-requirements":
            return "Escolha uma senha que atenda aos requisitos do Firebase.";
        case "auth/network-request-failed":
            return "Confira sua conexão e tente novamente.";
        case "auth/too-many-requests":
            return "Muitas tentativas. Aguarde um pouco e tente novamente.";
        case "auth/operation-not-allowed":
            return "Ative o método E-mail/senha no Firebase Authentication.";
        default:
            return cadastrando ? "Não foi possível criar a conta." : "Confira o e-mail e a senha.";
    }
}

formulario.addEventListener("submit", async (evento) => {
    // Cancela o envio padrão do HTML. O SDK vai tratar as credenciais.
    evento.preventDefault();
    confirmar.disabled = true;
    fechar.disabled = true;
    mensagem.textContent = cadastrando ? "Criando conta…" : "Entrando…";

    try {
        const email = formulario.elements.email.value.trim();
        const senhaDigitada = senha.value;

        if (cadastrando) {
            await createUserWithEmailAndPassword(auth, email, senhaDigitada);
        } else {
            await signInWithEmailAndPassword(auth, email, senhaDigitada);
        }

        const destino = veioDaPublicacao ? "MurinhoCriarPost.html" : "MurinhoFeed.html";
        window.location.assign(destino);
    } catch (erro) {
        mensagem.textContent = mensagemDeErro(erro);
        console.error("Erro de autenticação:", erro.code);
        confirmar.disabled = false;
        fechar.disabled = false;
    }
});

janela.addEventListener("cancel", (evento) => {
    if (confirmar.disabled) {
        evento.preventDefault();
    }
});
