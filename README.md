# O Que Tem no Murinho?

## Como rodar

1. Extraia o ZIP e abra a pasta **OqTemNoMurinho** no VS Code.
2. Abra **Murinho.html** pelo Live Server. A página deve abrir em um endereço HTTP.
3. Clique em **Entrar como visitante** para consultar o Feed ou use **Entrar** com a conta que você já criou no Firebase Authentication.
4. No Feed, clique no ícone **+** para abrir **Criar post**. Preencha o nome e o preço. A descrição e a foto são opcionais.
5. Ao clicar em **Postar**, você volta ao Feed. O novo card aparece no início dos Destaques. Clique nele e confira se o nome, o preço, a foto e a descrição correspondem ao produto publicado.
6. Após sair, volte ao Feed como visitante para conferir se a publicação continua visível. Para testar em outro dispositivo, abra o projeto por um servidor acessível nele. O navegador precisa ter acesso à internet para carregar o Firebase.

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

### O que acontece ao publicar

1. O navegador dispara o evento `submit`. A função chama `evento.preventDefault()` para controlar o envio.
2. `auth.currentUser.uid` fornece o identificador da conta que vai publicar. Esse valor vira o campo `vendedorId`.
3. O preço digitado como `8,50` vira o número `8.5`. Se o usuário selecionou uma foto, o navegador a redimensiona e comprime para JPEG.
4. `addDoc()` envia os campos para a coleção `produtos`. O Firestore gera o ID. `serverTimestamp()` pede que o servidor preencha `dataPublicacao`.
5. `await` espera a gravação terminar antes de voltar ao Feed. Se a operação falhar, o `catch` mostra uma mensagem e o usuário pode tentar de novo.

### O que acontece ao abrir um card

1. `collection()` indica onde buscar. `query()` define a ordem e o limite. `getDocs()` faz a leitura da lista.
2. Cada card recebe um endereço como `MurinhoPost.html?id=abc123`.
3. `URLSearchParams` lê o valor de `id`. `doc()` monta a referência para aquele documento e `getDoc()` faz a leitura.
4. O código usa `textContent` para exibir os textos enviados no formulário como texto simples.

## Configuração usada

- Firebase Authentication com **E-mail/senha** habilitado.
- Firestore com leitura pública na coleção `produtos` e criação permitida a usuários autenticados quando `vendedorId` corresponde ao UID da sessão, conforme as regras da demonstração.
- A conta de teste criada anteriormente funciona no botão **Entrar**. As contas criadas pelo botão **Cadastro** também podem publicar sob as regras de demonstração.
- A foto é gravada como miniatura JPEG no campo `imagemUrl` do documento, limitada pelo código a 120 mil caracteres. Se não houver foto, aparece uma imagem ilustrativa. Para um projeto com volume maior de imagens, use armazenamento de arquivos.
- Busca, categorias, configurações, comentários, variações e Pix fazem parte do protótipo visual original. O fluxo funcional usa conta, Feed, publicação e leitura de um post.
- `Hello.html`, `backend/teste.js` e `backend/firebase.js` foram preservados. Use `Murinho.html` como entrada do projeto. O teste de gravação antigo cria outro produto a cada execução bem-sucedida.

### Fotos de produtos já publicados

Na aba **Dados → produtos** do Firestore, abra o documento pelo ID. Edite `imagemUrl` e salve um link HTTPS direto para uma imagem disponível ao público. Faça isso nos dois documentos se quiser que ambos os brownies tenham foto. O Feed e o post carregam a nova imagem ao atualizar a página. O campo é uma string, e um caminho do seu computador funciona apenas como arquivo local. Esta versão usa o Console do Firebase para a alteração em posts existentes.

O carrossel mostra até três cards por vez em telas maiores e até dois no celular. A lista segue na horizontal. As setas aparecem quando tem mais cards do que cabem naquele tamanho de tela.
