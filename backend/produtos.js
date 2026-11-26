import { db } from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    limit,
    getDocs, // Lê os documentos que correspondem à consulta do Feed.
    doc,     // Monta a referência para um documento específico.
    addDoc,
    serverTimestamp,
    getDoc   // Lê o documento apontado por essa referência.
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// export permite importar esta função em outro arquivo, como o JavaScript do Feed.
// async permite usar await dentro da função.
export async function listarProdutosRecentes() {
    // Indica em qual banco e coleção queremos buscar.
    const produtos = collection(db, "produtos");

    // Monta a consulta com três argumentos:
    // 1. A coleção onde buscar.
    // 2. O campo e o sentido da ordenação.
    // 3. A quantidade máxima de documentos.
    const consulta = query(
        produtos,
        orderBy("dataPublicacao", "desc"),
        limit(12)
    );

    // Executa a consulta e espera a resposta do Firestore.
    const resultado = await getDocs(consulta);

    // Para cada documento, cria um objeto com os campos do produto e seu ID.
    // Retorna o array com todos esses objetos.
    return resultado.docs.map(documento => ({
        ...documento.data(),
        id: documento.id
    }));
}

export async function buscarProdutoPorId(id) {
    // Monta a referência para um documento específico da coleção.
    const referencia = doc(db, "produtos", id);

    // Faz a leitura e espera a resposta do Firestore.
    const documento = await getDoc(referencia);

    // Um ID válido pode apontar para um produto que já foi removido.
    if (!documento.exists()) {
        return null;
    }

    const campos = documento.data();

    return {
        ...campos,
        id: documento.id
    };
}
// O formulário envia os dados validados. O Firestore cria o ID e registra a hora.
export async function publicarProduto(produto) {
    const dados = {
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        imagemUrl: produto.imagemUrl,
        vendedorId: produto.vendedorId,
        dataPublicacao: serverTimestamp()
    };

    const documento = await addDoc(collection(db, "produtos"), dados);
    return documento.id;
}
