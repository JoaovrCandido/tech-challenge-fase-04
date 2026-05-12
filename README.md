# ByteBank - SaaS Financeiro (Tech Challenge Fase 4)

Este projeto evoluiu de uma aplicação financeira estática para uma plataforma **SaaS completa**, focada em escalabilidade, segurança e experiência do usuário (UX). A aplicação permite o gerenciamento completo de transações financeiras com insights em tempo real e um dashboard personalizado.

## 🚀 Funcionalidades Principais

* **Dashboard Analítico:** Gráficos interativos (Recharts) que mostram a evolução mensal e o resumo de entradas/saídas.
* **Gestão de Transações:** CRUD completo (Criação, Leitura, Atualização e Exclusão) com atualizações otimistas (Optimistic UI) para uma interface extremamente rápida.
* **Filtros Avançados:** Busca por descrição, tipo de transação e período de datas.
* **Personalização de Widgets:** O usuário pode configurar quais indicadores e metas de economia deseja visualizar no painel.
* **Acessibilidade e UX:** Suporte a Modo Escuro (Dark Mode) e ajuste de tamanho de fonte, com persistência automática de preferências no navegador.
* **Anexos de Comprovante:** Suporte ao upload de comprovantes para cada transação.

## 🏗️ Padrões de Arquitetura

Para garantir que o código seja escalável, testável e de fácil manutenção, o projeto foi construído aplicando dois conceitos fundamentais de engenharia de software:

### 1. Clean Architecture (Arquitetura Limpa)
As responsabilidades do sistema foram separadas em camadas estritas, garantindo alto desacoplamento (a regra de dependência aponta sempre para o centro):
* **Core (Domínio e Casos de Uso):** Contém as entidades de negócio (`Transaction`) e as regras da aplicação (`CalculateBalance`, `SortTransactions`, `FilterTransactions`, `GenerateDashboardInsights`). Esta camada é puramente escrita em TypeScript e não possui conhecimento sobre o React ou o banco de dados.
* **Infrastructure (Infraestrutura):** Isola a comunicação com o mundo externo. Aqui residem as integrações do **Firebase Firestore**, o serviço de **Autenticação** e a implementação da **Criptografia**.
* **Presentation (Apresentação):** A interface visual construída com **Next.js**, **React Query** (gerenciamento assíncrono e cache) e **CSS Modules**. Os componentes visuais são "burros", apenas orquestram as interações e delegam a lógica pesada para a camada Core.

### 2. Arquitetura Modular
O sistema foi desenvolvido em blocos independentes (módulos). 
* **Componentização Avançada:** Funcionalidades como o `DashboardContainer` e o `TransactionsContainer` operam de forma autônoma. O painel de gráficos pode ser removido ou movido para outra tela sem quebrar a lógica de transações.
* **Desacoplamento de Serviços:** A autenticação e o banco de dados são injetados como contratos (Interfaces). Isso significa que substituir o Firebase por um backend REST em Node.js exigiria apenas a criação de um novo arquivo na camada de Infraestrutura, sem alterar uma única linha de código dos componentes visuais do React.

## 🔒 Segurança no Desenvolvimento

Seguindo padrões rigorosos de segurança financeira:

* **Autenticação Segura:** Implementada via **Firebase Auth**, utilizando tokens JWT e proteção nativa contra força bruta.
* **Criptografia AES (Client-Side Encryption):** Dados sensíveis como descrição de transação e anexos são criptografados no navegador utilizando o algoritmo **AES-256 (crypto-js)** antes de serem enviados para o banco de dados. Nem mesmo o provedor de nuvem consegue ler os dados em texto puro.
* **Blindagem de Variáveis:** Chaves de segurança e configurações de infraestrutura são gerenciadas via variáveis de ambiente (`.env.local`).

## 🛠️ Tecnologias Utilizadas

* **Frontend:** Next.js 15, TypeScript, React Query.
* **Backend & DB:** Firebase (Firestore, Authentication).
* **Gráficos:** Recharts.
* **Criptografia:** Crypto-js.
* **Testes:** Vitest e MSW (para simulação de ambientes).

---

## 🏃 Como rodar o projeto

### 1. Pré-requisitos

* Node.js (versão 18 ou superior)
* Conta no Firebase (para configurar seu próprio ambiente, se desejar)

### 2. Clonar e Instalar

```bash
git clone [link-do-seu-repo]
cd tech-challenge-fase-04
npm install

```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo na raiz do projeto chamado **`.env.local`** e adicione a chave secreta da criptografia:

```env
NEXT_PUBLIC_CRYPTO_SECRET="S3cr3t_K3y_P4r4_0_P41n3l_F1n4nc31r0"

```

### 4. Executar

```bash
npm run dev

```

A aplicação estará disponível em `http://localhost:3000`.

---