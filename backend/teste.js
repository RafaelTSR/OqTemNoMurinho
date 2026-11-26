import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

async function testarFirebase() {

    try {
        const email = prompt("E-mail de teste:");
        const senha = prompt("Senha de teste:");

        const credencial = await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        const produto = {
            nome: "Brownie",
            preco: 8.00,
            descricao: "Brownie recheado com Nutella",
            vendedorId: credencial.user.uid,
            imagemUrl: "",
            dataPublicacao: serverTimestamp()
        };

        const documento = await addDoc(
            collection(db, "produtos"),
            produto
        );

        console.log("Produto cadastrado!");
        console.log("ID:", documento.id);

    } catch (erro) {
        console.error("Erro:", erro);
    }
}

testarFirebase();