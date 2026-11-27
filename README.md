# O Que Tem no Murinho?



## HTML e CSS

| Arquivo | O que faz |
| --- | --- |
| `Murinho.html` | Apresenta o projeto. Os botões Entrar e Cadastro abrem o mesmo diálogo. O link de visitante abre o Feed diretamente. |
| `MurinhoFeed.html` | Tem o link **+**, as setas e o elemento `template` com a estrutura de um card. O template fica invisível até o JavaScript cloná-lo. |
| `MurinhoCriarPost.html` | Contém o formulário. Os atributos `name` dão acesso aos campos por `formulario.elements`. O `fieldset` começa desabilitado enquanto a sessão é verificada. |
| `MurinhoPost.html` | Deixa espaços para foto, nome, preço e descrição. Os campos são preenchidos depois que a consulta encontra o produto. |
| `murinhoFuncionalStyle.css` | Estiliza as setas, a rolagem horizontal, as mensagens e os estados ocultos. Os CSS das telas mantêm o restante do visual. |

## JavaScript, arquivo por arquivo

| Arquivo | O que faz |
| --- | --- |
| `backend/firebase.js` | Inicializa o aplicativo Firebase, exporta `db` para o Firestore e `auth` para a autenticação. |
| `backend/inicio.js` | Abre o diálogo, lê os campos e chama a função de login ou cadastro do Firebase. O login aberto pelo formulário volta para a tela de publicação. |
| `backend/sessao.js` | Mostra a opção de sair somente quando há sessão ativa. `signOut()` encerra a sessão. |
| `backend/produtos.js` | Centraliza as operações do Firestore. `listarProdutosRecentes()` busca até 12 produtos. `buscarProdutoPorId()` lê um documento. `publicarProduto()` cria um documento com a hora do servidor. |
| `backend/criar-post.js` | Espera a sessão, lê e valida o formulário, comprime a foto opcional e pede a gravação do documento. |
| `backend/feed.js` | Consulta os produtos, clona um card para cada registro e cria os links. As setas rolam a largura visível da lista. |
| `backend/post.js` | Lê o ID da URL e busca o produto correspondente. Mostra uma mensagem se o link estiver incompleto ou se o documento tiver sido removido. |
| `backend/interface.js` | Formata preços em reais e aplica a mesma imagem padrão no Feed e na página do post. |
