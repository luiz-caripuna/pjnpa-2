# 🌿 Amazônia Store — Catálogo Interativo de Produtos

Aplicação Web frontend interativa que consome uma API pública RESTful para exibição, busca, detalhamento e persistência de produtos favoritos. Desenvolvida como atividade prática avaliativa da disciplina de **Programação Web** da Universidade Federal do Oeste do Pará (**UFOPA**).

---

## 👥 Equipe de Desenvolvimento

* **Lucas Patrik Lopes dos Santos** — Matrícula: `2021015036`
* **Luiz Otavio Caripuna da Cunha** — Matrícula: `2022004270`

---

## 📌 Visão Geral do Projeto

O objetivo do projeto é consolidar de forma prática e integrada os pilares do desenvolvimento Web moderno no lado do cliente:
* **HTML5 Semântico** estruturado para acessibilidade e organização.
* **CSS3 Moderno e Responsivo** autoral, sem dependência de bibliotecas ou frameworks externos (Grid, Flexbox, variáveis CSS, transições e animações).
* **JavaScript Puro (Vanilla ES6+)** com consumo assíncrono de API via **Fetch API** (`async/await`, método `GET`), manipulação do DOM em tempo real e persistência local via **`localStorage`** (`JSON.stringify()` e `JSON.parse()`).

---

## 🌐 API Pública Consumida

A aplicação consome a API pública **[DummyJSON Products](https://dummyjson.com/)**, conforme sugerido e recomendado no documento da proposta:

* **Listagem Geral:** `GET https://dummyjson.com/products?limit=30`
* **Busca por Nome:** `GET https://dummyjson.com/products/search?q={termo}`

---

## ✨ Funcionalidades Implementadas

| Funcionalidade | Descrição |
| :--- | :--- |
| **📦 Listagem de Produtos** | Consulta a API e renderiza dinamicamente os produtos em formato de cartões (cards) contendo imagem, título, categoria, avaliação e preço formatado. |
| **🔍 Pesquisa Dinâmica** | Formulário de busca que permite pesquisar produtos por nome diretamente na API pública através do evento de envio (`submit`), com botão de limpeza rápida. |
| **📄 Detalhes do Produto** | Janela modal interativa que exibe informações aprofundadas do produto selecionado: imagens ampliadas, categoria, marca, avaliação (rating), desconto percentual, estoque, descrição completa, SKU, informações de garantia e prazos de envio. Pode ser fechado pelo botão, clicando no fundo ou pela tecla `Esc`. |
| **❤️ Gerenciamento de Favoritos** | Permite ao usuário adicionar e remover qualquer produto dos favoritos com um clique no ícone de coração, tanto nos cartões quanto dentro da janela de detalhes. |
| **💾 Persistência com LocalStorage** | Os produtos favoritados permanecem salvos mesmo após fechar ou recarregar a página, utilizando serialização e deserialização com `JSON.stringify()` e `JSON.parse()`. |
| **⏳ Feedback de Carregamento (Loading)** | Indicador visual com spinner animado em CSS enquanto as requisições assíncronas à API estão em andamento. |
| **⚠️ Tratamento de Erros de Rede / HTTP** | Verificação de `response.ok`, captura com `try/catch` e exibição de mensagens amigáveis na interface, com botão de "Tentar Novamente" para reexecutar a consulta. |
| **🌙 Alternador de Modo Escuro / Claro** | Sistema de temas personalizável com paleta inspirada na floresta amazônica, com o estado do tema também salvo no `localStorage`. |

---

## 📁 Estrutura de Arquivos

```text
pjnpa/
├── index.html       # Estrutura semântica da página e marcação do modal
├── estilo.css       # Estilos autorais, variáveis, grid responsivo, temas e animações
├── script.js        # Lógica JavaScript, Fetch assíncrono, DOM e LocalStorage
├── README.md        # Documentação completa do projeto e equipe
└── .gitignore       # Arquivos ignorados pelo controle de versão
```

---

## 🚀 Como Executar o Projeto

Como a aplicação é 100% frontend e não utiliza frameworks nem processos de compilação, a execução é simples e direta:

### Opção 1: Diretamente no Navegador
1. Baixe ou clone o repositório em seu computador.
2. Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, etc.).

### Opção 2: Com o VS Code (Live Server)
1. Abra a pasta do projeto no **Visual Studio Code**.
2. Certifique-se de ter a extensão **Live Server** instalada.
3. Clique com o botão direito sobre o arquivo `index.html` e selecione **"Open with Live Server"**.
4. O navegador abrirá automaticamente no endereço local `http://127.0.0.1:5500`.

> **Nota:** Certifique-se de estar conectado à internet durante os testes para que a aplicação consiga consultar a API do DummyJSON.

---

## 📋 Checklist de Critérios de Avaliação Atendidos

- [x] **2.1 Interface com HTML e CSS:** Interface organizada, responsiva, HTML semântico (`header`, `main`, `section`, `article`, `footer`), estilos próprios em CSS sem frameworks e layout em cartões.
- [x] **2.2 JavaScript e manipulação do DOM:** Uso de variáveis, condicionais, funções, laços (`forEach`), manipulação de nós do DOM, criação dinâmica de elementos (`document.createElement`) e eventos de formulário/clique.
- [x] **2.3 Objetos e JSON:** Manipulação de dados de objetos da API, percurso de arrays de objetos, decodificação de JSON e estruturação de objetos para favoritos.
- [x] **2.4 APIs e requisições HTTP:** Consumo de API pública via `fetch()`, método `GET`, requisições com `async/await`, tratamento de erros com `try/catch` e exibição dinâmica.
- [x] **2.5 Persistência com localStorage:** Adição/remoção de favoritos com persistência via `JSON.stringify()` e `JSON.parse()`, restaurados automaticamente ao recarregar a página.
- [x] **3. Funcionalidades mínimas:** Listagem, pesquisa, detalhes em modal, favoritos, persistência, carregamento e tratamento de erros.
- [x] **6. Entrega:** Documentação completa no `README.md` com integrantes e instruções de execução.
