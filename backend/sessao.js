import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const botaoSair = document.querySelector("[data-sair]");

if (botaoSair) {
    // O Auth restaura a sessão ao navegar. O botão só aparece para quem está logado.
    onAuthStateChanged(auth, (usuario) => {
        botaoSair.hidden = usuario === null;
    });

    botaoSair.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.assign("Murinho.html");
        } catch (erro) {
            console.error("Falha ao sair:", erro);
            window.alert("Não foi possível sair. Tente novamente.");
        }
    });
}
