# 🧩 Projeto Next.js com TypeScript e Storybook

Este projeto é uma aplicação financeira, o usuário pode registrar novas transações, editar informações existentes e excluir lançamentos quando necessário.

Além das funcionalidades principais, o projeto também inclui recursos de acessibilidade para melhorar a experiência do usuário, como alternância entre tema claro e escuro e a possibilidade de ajustar o tamanho da fonte, garantindo maior conforto visual e acessibilidade para diferentes perfis de usuários.

O projeto foi criado com [Next.js](https://nextjs.org/) utilizando **TypeScript** e **ESLint** para garantir qualidade de código.
Também inclui **Storybook** para documentação e visualização de componentes.

---

## 🚀 Requisitos

Antes de começar, verifique se você tem instalado:

* [Node.js](https://nodejs.org/) (versão **16** ou superior recomendada)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
# Clonar o repositório
git clone https://github.com/JoaovrCandido/tech-challenge-fase-01.git

# Entrar na pasta do projeto
cd tech-challenge-fase-01

# Instalar dependências
npm install
# ou
yarn
```

---

## ▶️ Rodando o projeto localmente

Para iniciar o servidor de desenvolvimento do Next.js:

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📖 Storybook

Este projeto utiliza **Storybook** para visualizar e documentar os componentes.

### Rodar o Storybook

```bash
npm run storybook
# ou
yarn storybook
```

Após o carregamento, o Storybook estará disponível em:
👉 **[http://localhost:6006](http://localhost:6006)**
---

## 📁 Estrutura básica do projeto

```
├── .storybook
├── app/
│   ├── api/
│   ├── transacoes/
│   ├──     ├── layout.tsx
│   ├──     └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── components
├── hooks
├── lib
├── public
├── styles
├── types
└── utils
```

---

## 🧠 Tecnologias principais

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [ESLint](https://eslint.org/)
* [Storybook](https://storybook.js.org/)

---

