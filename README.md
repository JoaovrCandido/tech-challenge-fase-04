# ByteBank - SaaS Financeiro (Tech Challenge Fase 4)

Este projeto evoluiu de uma aplicação financeira estática para uma plataforma **SaaS completa**, focada em escalabilidade, segurança e experiência do usuário (UX). A aplicação permite o gerenciamento completo de transações financeiras com insights em tempo real e um dashboard personalizado.

## 🚀 Funcionalidades Principais

* **Dashboard Analítico:** Gráficos interativos (Recharts) que mostram a evolução mensal e o resumo de entradas/saídas.
* **Gestão de Transações:** CRUD completo (Criação, Leitura, Atualização e Exclusão) com atualizações otimistas (Optimistic UI) para uma interface extremamente rápida.
* **Filtros Avançados:** Busca por descrição, tipo de transação e período de datas.
* **Personalização de Widgets:** O usuário pode configurar quais indicadores e metas de economia deseja visualizar no painel.
* **Acessibilidade e UX:** Suporte a Modo Escuro (Dark Mode) e ajuste de tamanho de fonte, com persistência automática de preferências no navegador.
* **Anexos de Comprovante:** Suporte ao upload de comprovantes para cada transação.

## 🏗️ Arquitetura Modular (Clean Architecture)

O projeto foi totalmente refatorado seguindo os princípios da **Clean Architecture**, separando as responsabilidades em camadas isoladas para facilitar a manutenção e testes:

1. **Core (Domínio):** Contém as entidades de negócio (`Transaction`) e os Casos de Uso (`Use Cases`) puramente em TypeScript. Esta camada não conhece frameworks externos.
2. **Infrastructure (Infraestrutura):** Implementa a comunicação com o mundo externo. Aqui residem os repositórios do **Firebase Firestore**, o serviço de **Autenticação** e o serviço de **Criptografia**.
3. **Presentation (Apresentação):** Camada visual construída com **Next.js 15**, **React Query** (gerenciamento de cache) e **CSS Modules**. Os componentes são "burros" e delegam toda a lógica para os Casos de Uso e Hooks.

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