// A mesma formatação e a mesma imagem padrão são usadas no Feed e no post.
const formatoPreco = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const imagemPadrao = "Imagens/cupcake-de-aniversario.png";

export function formatarPreco(preco) {
    return Number.isFinite(preco) ? formatoPreco.format(preco) : "Preço indisponível";
}

export function exibirFoto(elemento, produto) {
    // Aceita as fotos JPEG geradas pelo formulário e URLs HTTPS de posts existentes.
    const foto = typeof produto.imagemUrl === "string" ? produto.imagemUrl : "";
    const fotoValida = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(foto)
        || /^https:\/\//i.test(foto);

    elemento.addEventListener("error", () => {
        elemento.src = imagemPadrao;
        elemento.alt = "Imagem ilustrativa";
    }, { once: true });

    elemento.src = fotoValida ? foto : imagemPadrao;
    elemento.alt = fotoValida ? produto.nome : "Imagem ilustrativa";
}
