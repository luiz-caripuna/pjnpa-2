/**
 * ==============================================================================
 * CATÁLOGO INTERATIVO DE PRODUTOS - SCRIPT PRINCIPAL
 * ==============================================================================
 * Disciplina: Programação Web (UFOPA)
 * Equipe:
 *   - Lucas Patrik Lopes dos Santos (2021015036)
 *   - Luiz Otavio Caripuna da Cunha (2022004270)
 *
 * Tecnologias: JavaScript puro (ES6+), Fetch API, LocalStorage e Manipulação do DOM.
 * API consumida: DummyJSON Products API (https://dummyjson.com/products)
 * ==============================================================================
 */

// ==============================================================================
// 1. CONSTANTES E CONFIGURAÇÕES DA API
// ==============================================================================
const URL_BASE_API = "https://dummyjson.com/products";
const LIMITE_PRODUTOS = 30;
const CHAVE_LOCAL_STORAGE_FAVORITOS = "amazonia_store_favoritos_v1";
const CHAVE_LOCAL_STORAGE_TEMA = "amazonia_store_tema_v1";

// ==============================================================================
// 2. ESTADO GLOBAL DA APLICAÇÃO
// ==============================================================================
let produtosCarregados = [];       // Lista de objetos de produtos vindos da API
let produtosFavoritos = [];        // Lista de objetos de produtos salvos no LocalStorage
let visualizacaoAtual = "todos";    // "todos" ou "favoritos"
let termoBuscaAtual = "";          // Termo digitado na barra de pesquisa
let produtoSelecionadoModal = null; // Objeto do produto atualmente aberto no modal

// ==============================================================================
// 3. SELEÇÃO DE ELEMENTOS DO DOM
// ==============================================================================
// Cabeçalho e alternadores
const corpoDocumento = document.body;
const botaoModoEscuro = document.getElementById("botaoModoEscuro");
const botaoFavoritosTopo = document.getElementById("botaoFavoritosTopo");
const contadorFavoritos = document.getElementById("contadorFavoritos");
const contadorAbaFavoritos = document.getElementById("contadorAbaFavoritos");

// Formulário de busca e abas
const formularioBusca = document.getElementById("formularioBusca");
const campoBusca = document.getElementById("campoBusca");
const botaoLimparBusca = document.getElementById("botaoLimparBusca");
const abaTodos = document.getElementById("abaTodos");
const abaFavoritos = document.getElementById("abaFavoritos");

// Área de status e mensagens
const statusCarregando = document.getElementById("statusCarregando");
const statusErro = document.getElementById("statusErro");
const mensagemErroDetalhe = document.getElementById("mensagemErroDetalhe");
const botaoTentarNovamente = document.getElementById("botaoTentarNovamente");
const statusVazio = document.getElementById("statusVazio");
const mensagemVazioTexto = document.getElementById("mensagemVazioTexto");
const textoResumo = document.getElementById("textoResumo");

// Grade de produtos
const gradeProdutos = document.getElementById("gradeProdutos");

// Modal de detalhes
const modalDetalhes = document.getElementById("modalDetalhes");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const modalImagem = document.getElementById("modalImagem");
const modalCategoria = document.getElementById("modalCategoria");
const modalTitulo = document.getElementById("modalTitulo");
const modalMarca = document.getElementById("modalMarca");
const modalAvaliacao = document.getElementById("modalAvaliacao");
const modalEstoque = document.getElementById("modalEstoque");
const modalPreco = document.getElementById("modalPreco");
const modalDesconto = document.getElementById("modalDesconto");
const modalDescricao = document.getElementById("modalDescricao");
const modalSku = document.getElementById("modalSku");
const modalGarantia = document.getElementById("modalGarantia");
const modalEnvio = document.getElementById("modalEnvio");
const modalBotaoFavorito = document.getElementById("modalBotaoFavorito");

// ==============================================================================
// 4. PERSISTÊNCIA COM LOCALSTORAGE
// ==============================================================================

/**
 * Recupera a lista de favoritos gravada no localStorage.
 * Utiliza JSON.parse() e faz tratamento de exceção.
 * @returns {Array} Array de objetos de produtos favoritos
 */
function carregarFavoritosDoStorage() {
    try {
        const dadosStorage = localStorage.getItem(CHAVE_LOCAL_STORAGE_FAVORITOS);
        if (dadosStorage) {
            const favoritosParseados = JSON.parse(dadosStorage);
            // Garante que é um array válido
            return Array.isArray(favoritosParseados) ? favoritosParseados : [];
        }
    } catch (erro) {
        console.error("Erro ao ler favoritos do LocalStorage:", erro);
    }
    return [];
}

/**
 * Salva a lista de favoritos no localStorage.
 * Utiliza JSON.stringify() para serializar os dados.
 */
function salvarFavoritosNoStorage() {
    try {
        const jsonString = JSON.stringify(produtosFavoritos);
        localStorage.setItem(CHAVE_LOCAL_STORAGE_FAVORITOS, jsonString);
    } catch (erro) {
        console.error("Erro ao salvar favoritos no LocalStorage:", erro);
    }
}

/**
 * Atualiza os contadores numéricos de favoritos na interface.
 */
function atualizarContadoresFavoritos() {
    const total = produtosFavoritos.length;
    contadorFavoritos.textContent = total;
    contadorAbaFavoritos.textContent = total;
}

/**
 * Verifica se um produto específico já está na lista de favoritos.
 * @param {number|string} id - Identificador do produto
 * @returns {boolean}
 */
function verificarSeEhFavorito(id) {
    return produtosFavoritos.some(function (item) {
        return item.id === id;
    });
}

/**
 * Adiciona ou remove um produto da lista de favoritos.
 * Cria um objeto JavaScript bem estruturado para representar o favorito.
 * @param {Object} produto - Objeto do produto
 */
function alternarFavorito(produto) {
    const indice = produtosFavoritos.findIndex(function (item) {
        return item.id === produto.id;
    });

    if (indice >= 0) {
        // Já existe: remover dos favoritos
        produtosFavoritos.splice(indice, 1);
    } else {
        // Novo favorito: criar objeto com os atributos essenciais
        const objetoFavorito = {
            id: produto.id,
            title: produto.title,
            description: produto.description || "",
            price: produto.price,
            discountPercentage: produto.discountPercentage || 0,
            rating: produto.rating || 0,
            stock: produto.stock || 0,
            brand: produto.brand || "Geral",
            category: produto.category || "Geral",
            thumbnail: produto.thumbnail || (produto.images && produto.images[0]) || "",
            sku: produto.sku || `PROD-${produto.id}`,
            warrantyInformation: produto.warrantyInformation || "Garantia padrão",
            shippingInformation: produto.shippingInformation || "Envio padrão"
        };
        produtosFavoritos.push(objetoFavorito);
    }

    // Persiste no LocalStorage
    salvarFavoritosNoStorage();
    atualizarContadoresFavoritos();

    // Se estivermos visualizando a aba de favoritos, re-renderiza a lista
    if (visualizacaoAtual === "favoritos") {
        renderizarProdutos(produtosFavoritos);
    } else {
        // Atualiza visualmente o botão do card correspondente
        atualizarIconeFavoritoNoCard(produto.id);
    }

    // Atualiza também o botão do modal se ele estiver aberto com este produto
    if (produtoSelecionadoModal && produtoSelecionadoModal.id === produto.id) {
        atualizarBotaoFavoritoModal(produtoSelecionadoModal.id);
    }
}

/**
 * Atualiza o ícone de coração no card de um produto específico.
 * @param {number} id - ID do produto
 */
function atualizarIconeFavoritoNoCard(id) {
    const botaoCard = document.querySelector(`.botao-favoritar-card[data-id="${id}"]`);
    if (botaoCard) {
        const ehFav = verificarSeEhFavorito(id);
        if (ehFav) {
            botaoCard.classList.add("favoritado");
            botaoCard.textContent = "❤️";
            botaoCard.setAttribute("aria-label", "Remover dos favoritos");
        } else {
            botaoCard.classList.remove("favoritado");
            botaoCard.textContent = "🤍";
            botaoCard.setAttribute("aria-label", "Adicionar aos favoritos");
        }
    }
}

// ==============================================================================
// 5. CONSUMO DA API COM FETCH, GET E ASYNC/AWAIT
// ==============================================================================

/**
 * Realiza requisição assíncrona HTTP GET para a API DummyJSON.
 * Trata erros de resposta HTTP (como 404, 500) e falhas de rede com try/catch.
 * @param {string} termo - Termo opcional para busca
 */
async function buscarProdutosDaAPI(termo = "") {
    termoBuscaAtual = termo.trim();

    // Prepara a interface para o carregamento
    mostrarCarregando(true);
    ocultarErro();
    ocultarVazio();
    gradeProdutos.innerHTML = "";
    textoResumo.textContent = "Carregando catálogo de produtos...";

    // Constrói a URL de acordo com o termo de busca
    let urlRequisicao = `${URL_BASE_API}?limit=${LIMITE_PRODUTOS}`;
    if (termoBuscaAtual !== "") {
        urlRequisicao = `${URL_BASE_API}/search?q=${encodeURIComponent(termoBuscaAtual)}`;
    }

    try {
        // Executa a requisição assíncrona com método GET
        const resposta = await fetch(urlRequisicao, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        // Validação da resposta HTTP (200 a 299)
        if (!resposta.ok) {
            throw new Error(`Falha na requisição HTTP: código de status ${resposta.status} (${resposta.statusText})`);
        }

        // Converte o corpo da resposta em JSON
        const dados = await resposta.json();

        // O DummyJSON retorna um objeto com a propriedade 'products' (array de objetos)
        produtosCarregados = Array.isArray(dados.products) ? dados.products : [];

        // Exibe os dados na interface
        mostrarCarregando(false);

        if (visualizacaoAtual === "todos") {
            renderizarProdutos(produtosCarregados);
        } else {
            renderizarProdutos(produtosFavoritos);
        }

    } catch (erro) {
        console.error("Erro ao buscar produtos da API:", erro);
        mostrarCarregando(false);
        mostrarErro(erro.message || "Não foi possível conectar ao servidor da API. Verifique sua conexão com a internet.");
    }
}

// ==============================================================================
// 6. MANIPULAÇÃO DO DOM E CRIAÇÃO DINÂMICA DE ELEMENTOS
// ==============================================================================

/**
 * Cria elementos HTML dinamicamente e os anexa à grade de produtos.
 * Percorre o array de objetos com laço de repetição (forEach).
 * @param {Array} lista - Array de objetos de produtos a exibir
 */
function renderizarProdutos(lista) {
    gradeProdutos.innerHTML = "";
    ocultarVazio();

    if (!Array.isArray(lista) || lista.length === 0) {
        if (visualizacaoAtual === "favoritos") {
            mostrarVazio("Você ainda não adicionou nenhum produto aos favoritos. Clique no coração (🤍) em qualquer produto para salvá-lo aqui!");
            textoResumo.textContent = "Nenhum produto favorito encontrado.";
        } else {
            const mensagemBusca = termoBuscaAtual !== ""
                ? `Nenhum produto encontrado para o termo "${termoBuscaAtual}". Tente outro nome.`
                : "Nenhum produto disponível no momento.";
            mostrarVazio(mensagemBusca);
            textoResumo.textContent = "0 produtos encontrados.";
        }
        return;
    }

    // Atualiza o texto do resumo
    const total = lista.length;
    if (visualizacaoAtual === "favoritos") {
        textoResumo.textContent = `Exibindo ${total} produto(s) favorito(s).`;
    } else if (termoBuscaAtual !== "") {
        textoResumo.textContent = `Exibindo ${total} produto(s) para a busca "${termoBuscaAtual}".`;
    } else {
        textoResumo.textContent = `Exibindo ${total} produtos do catálogo.`;
    }

    // Laço de repetição percorrendo cada objeto de produto retornado
    lista.forEach(function (produto) {
        const card = criarCardProduto(produto);
        gradeProdutos.appendChild(card);
    });
}

/**
 * Cria dinamicamente um elemento <article> com as tags e classes do produto.
 * @param {Object} produto - Objeto do produto
 * @returns {HTMLElement} Elemento article criado
 */
function criarCardProduto(produto) {
    const article = document.createElement("article");
    article.className = "card-produto";
    article.setAttribute("data-id", produto.id);

    // Contêiner de Imagem
    const containerImagem = document.createElement("div");
    containerImagem.className = "card-imagem-container";

    const img = document.createElement("img");
    img.className = "card-imagem";
    img.src = produto.thumbnail || (produto.images && produto.images[0]) || "https://via.placeholder.com/260x200?text=Sem+Imagem";
    img.alt = produto.title || "Imagem do produto";
    img.loading = "lazy";

    // Botão de Favoritar no topo da imagem
    const botaoFav = document.createElement("button");
    botaoFav.type = "button";
    botaoFav.className = "botao-favoritar-card";
    botaoFav.setAttribute("data-id", produto.id);

    const ehFav = verificarSeEhFavorito(produto.id);
    if (ehFav) {
        botaoFav.classList.add("favoritado");
        botaoFav.textContent = "❤️";
        botaoFav.setAttribute("aria-label", `Remover ${produto.title} dos favoritos`);
    } else {
        botaoFav.textContent = "🤍";
        botaoFav.setAttribute("aria-label", `Adicionar ${produto.title} aos favoritos`);
    }

    // Evento de clique para favoritar/desfavoritar
    botaoFav.addEventListener("click", function (evento) {
        evento.stopPropagation();
        alternarFavorito(produto);
    });

    containerImagem.appendChild(img);
    containerImagem.appendChild(botaoFav);

    // Conteúdo textual do card
    const conteudo = document.createElement("div");
    conteudo.className = "card-conteudo";

    const categoria = document.createElement("span");
    categoria.className = "card-categoria";
    categoria.textContent = produto.category || "Diversos";

    const titulo = document.createElement("h3");
    titulo.className = "card-titulo";
    titulo.textContent = produto.title;

    const avaliacao = document.createElement("div");
    avaliacao.className = "card-avaliacao";
    avaliacao.innerHTML = `⭐ <span>${produto.rating ? produto.rating.toFixed(1) : "0.0"}</span>`;

    // Rodapé do card com preço e botão de detalhes
    const rodape = document.createElement("div");
    rodape.className = "card-rodape";

    const preco = document.createElement("span");
    preco.className = "card-preco";
    preco.textContent = formatarPreco(produto.price);

    const botaoDetalhes = document.createElement("button");
    botaoDetalhes.type = "button";
    botaoDetalhes.className = "botao-secundario botao-detalhes-card";
    botaoDetalhes.textContent = "Ver Detalhes";

    // Evento de clique para abrir o modal de detalhes adicionais
    botaoDetalhes.addEventListener("click", function () {
        abrirModalDetalhes(produto);
    });

    rodape.appendChild(preco);
    rodape.appendChild(botaoDetalhes);

    conteudo.appendChild(categoria);
    conteudo.appendChild(titulo);
    conteudo.appendChild(avaliacao);
    conteudo.appendChild(rodape);

    article.appendChild(containerImagem);
    article.appendChild(conteudo);

    return article;
}

/**
 * Formata um número para moeda americana ($ XX.XX).
 * @param {number} valor
 * @returns {string}
 */
function formatarPreco(valor) {
    if (typeof valor !== "number") {
        return "$ 0.00";
    }
    return `$ ${valor.toFixed(2)}`;
}

// ==============================================================================
// 7. MODAL DE DETALHES ADICIONAIS
// ==============================================================================

/**
 * Exibe informações detalhadas de um produto selecionado em um modal acessível.
 * @param {Object} produto - Objeto do produto selecionado
 */
function abrirModalDetalhes(produto) {
    produtoSelecionadoModal = produto;

    modalImagem.src = produto.thumbnail || (produto.images && produto.images[0]) || "";
    modalImagem.alt = produto.title || "Imagem do produto";
    modalCategoria.textContent = produto.category || "Geral";
    modalTitulo.textContent = produto.title;
    modalMarca.textContent = `Marca: ${produto.brand || "Não informada"}`;
    modalAvaliacao.textContent = `⭐ ${produto.rating ? produto.rating.toFixed(2) : "0.0"} / 5`;
    modalEstoque.textContent = `Estoque: ${produto.stock || 0} un.`;
    modalPreco.textContent = formatarPreco(produto.price);

    if (produto.discountPercentage && produto.discountPercentage > 0) {
        modalDesconto.classList.remove("escondido");
        modalDesconto.textContent = `-${produto.discountPercentage.toFixed(0)}% OFF`;
    } else {
        modalDesconto.classList.add("escondido");
    }

    modalDescricao.textContent = produto.description || "Nenhuma descrição detalhada disponível.";
    modalSku.textContent = produto.sku || `PROD-${produto.id}`;
    modalGarantia.textContent = produto.warrantyInformation || "Garantia legal de 90 dias";
    modalEnvio.textContent = produto.shippingInformation || "Entrega para todo o Brasil";

    atualizarBotaoFavoritoModal(produto.id);

    // Mostra o modal retirando a classe escondido
    modalDetalhes.classList.remove("escondido");
    document.body.style.overflow = "hidden"; // Evita scroll de fundo
}

/**
 * Fecha a janela modal de detalhes.
 */
function fecharModalDetalhes() {
    modalDetalhes.classList.add("escondido");
    document.body.style.overflow = "";
    produtoSelecionadoModal = null;
}

/**
 * Atualiza o texto e estilo do botão de favoritar dentro do modal.
 * @param {number} id - ID do produto
 */
function atualizarBotaoFavoritoModal(id) {
    const ehFav = verificarSeEhFavorito(id);
    if (ehFav) {
        modalBotaoFavorito.textContent = "💔 Remover dos Favoritos";
        modalBotaoFavorito.className = "botao-destaque";
    } else {
        modalBotaoFavorito.textContent = "❤️ Adicionar aos Favoritos";
        modalBotaoFavorito.className = "botao-primario";
    }
}

// ==============================================================================
// 8. CONTROLE DE ESTADOS VISUAIS (LOADING, ERRO, VAZIO)
// ==============================================================================

function mostrarCarregando(ativo) {
    if (ativo) {
        statusCarregando.classList.remove("escondido");
    } else {
        statusCarregando.classList.add("escondido");
    }
}

function mostrarErro(mensagem) {
    mensagemErroDetalhe.textContent = mensagem;
    statusErro.classList.remove("escondido");
}

function ocultarErro() {
    statusErro.classList.add("escondido");
}

function mostrarVazio(mensagem) {
    mensagemVazioTexto.textContent = mensagem;
    statusVazio.classList.remove("escondido");
}

function ocultarVazio() {
    statusVazio.classList.add("escondido");
}

// ==============================================================================
// 9. EVENTOS DE FORMULÁRIO, CLIQUES E NAVEGAÇÃO
// ==============================================================================

// Envio do formulário de busca (evento 'submit')
formularioBusca.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Impede o recarregamento padrão da página

    const termo = campoBusca.value.trim();

    // Se estiver na aba favoritos, mudamos para "todos" para buscar na API
    if (visualizacaoAtual === "favoritos") {
        ativarAba("todos");
    }

    buscarProdutosDaAPI(termo);
});

// Botão de limpar busca
botaoLimparBusca.addEventListener("click", function () {
    campoBusca.value = "";
    if (termoBuscaAtual !== "") {
        buscarProdutosDaAPI("");
    }
});

// Alternância entre abas de visualização
abaTodos.addEventListener("click", function () {
    ativarAba("todos");
});

abaFavoritos.addEventListener("click", function () {
    ativarAba("favoritos");
});

// Atalho do topo para favoritos
botaoFavoritosTopo.addEventListener("click", function () {
    ativarAba("favoritos");
    // Scroll suave até a grade de produtos
    gradeProdutos.scrollIntoView({ behavior: "smooth" });
});

/**
 * Alterna entre a visualização de 'todos' e 'favoritos'.
 * @param {"todos"|"favoritos"} aba
 */
function ativarAba(aba) {
    visualizacaoAtual = aba;

    if (aba === "todos") {
        abaTodos.classList.add("ativa");
        abaFavoritos.classList.remove("ativa");
        renderizarProdutos(produtosCarregados);
    } else {
        abaFavoritos.classList.add("ativa");
        abaTodos.classList.remove("ativa");
        renderizarProdutos(produtosFavoritos);
    }
}

// Botão de tentar novamente em caso de erro de rede
botaoTentarNovamente.addEventListener("click", function () {
    buscarProdutosDaAPI(termoBuscaAtual);
});

// Eventos do Modal
botaoFecharModal.addEventListener("click", fecharModalDetalhes);

// Fechar modal ao clicar no fundo escuro (backdrop)
modalDetalhes.addEventListener("click", function (evento) {
    if (evento.target === modalDetalhes) {
        fecharModalDetalhes();
    }
});

// Fechar modal ao pressionar a tecla 'Escape'
window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !modalDetalhes.classList.contains("escondido")) {
        fecharModalDetalhes();
    }
});

// Ação de favoritar dentro do modal
modalBotaoFavorito.addEventListener("click", function () {
    if (produtoSelecionadoModal) {
        alternarFavorito(produtoSelecionadoModal);
    }
});

// ==============================================================================
// 10. TEMA CLARO / ESCURO COM PERSISTÊNCIA
// ==============================================================================

function aplicarTema(temaSalvo) {
    if (temaSalvo === "claro") {
        corpoDocumento.classList.add("modo-claro");
        botaoModoEscuro.textContent = "🌞 Modo Claro";
    } else {
        corpoDocumento.classList.remove("modo-claro");
        botaoModoEscuro.textContent = "🌙 Modo Escuro";
    }
}

botaoModoEscuro.addEventListener("click", function () {
    const estaClaro = corpoDocumento.classList.toggle("modo-claro");
    if (estaClaro) {
        botaoModoEscuro.textContent = "🌞 Modo Claro";
        localStorage.setItem(CHAVE_LOCAL_STORAGE_TEMA, "claro");
    } else {
        botaoModoEscuro.textContent = "🌙 Modo Escuro";
        localStorage.setItem(CHAVE_LOCAL_STORAGE_TEMA, "escuro");
    }
});

// ==============================================================================
// 11. INICIALIZAÇÃO DA APLICAÇÃO
// ==============================================================================

function inicializarAplicacao() {
    // 1. Carrega o tema salvo no LocalStorage
    const temaSalvo = localStorage.getItem(CHAVE_LOCAL_STORAGE_TEMA);
    aplicarTema(temaSalvo);

    // 2. Recupera os favoritos salvos no LocalStorage
    produtosFavoritos = carregarFavoritosDoStorage();
    atualizarContadoresFavoritos();

    // 3. Realiza a primeira chamada assíncrona à API pública
    buscarProdutosDaAPI("");
}

// Dispara a inicialização assim que o script é carregado
inicializarAplicacao();
