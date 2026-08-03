# ☢️ Sistema Isótopos

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-emerald?style=for-the-badge)
![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📌 Sobre o Projeto

O **Isótopos** é um laboratório prático de desenvolvimento web e DevOps. Construído como um projeto pessoal de engenharia de software, o objetivo principal é testar a integração de tecnologias modernas do mercado, validando arquiteturas, separação estrita de responsabilidades (Frontend vs Backend) e pipelines de implantação contínua na nuvem.

Este repositório funciona como um ambiente de experimentação de infraestrutura e código, servindo para estruturar bases sólidas que podem ser aplicadas em consultorias de TI e na construção de sistemas corporativos escaláveis.

## 🏗️ Arquitetura e Tecnologias

A aplicação foi desenhada com uma arquitetura distribuída, separando completamente a interface do usuário das regras de negócio e banco de dados.

### Frontend (Edge / SSG)
- **Framework:** [Astro](https://astro.build/) - Focado em performance e entrega de HTML otimizado.
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS com foco em *Dark Mode*.
- **Hospedagem:** Netlify (Deploy automatizado via GitHub).

### Backend (API REST)
- **Ambiente:** Node.js com Express.
- **Segurança:** Proteção de rotas via JWT (JSON Web Tokens) e políticas de CORS.
- **Hospedagem:** Render (Web Service contínuo).

### Banco de Dados e Autenticação
- **BaaS:** [Supabase](https://supabase.com/).
- **Recursos:** Autenticação de usuários isolada e banco de dados relacional (PostgreSQL).

## 🚀 Funcionalidades Implementadas

- [x] Interface de Login moderna e responsiva.
- [x] Integração de autenticação via Supabase Auth.
- [x] Geração e validação de Tokens de Acesso (JWT).
- [x] Middleware de proteção de rotas no Node.js (Leão de chácara).
- [x] Redirecionamento seguro no frontend utilizando `localStorage`.
- [x] Painel de Controle (*Dashboard*) consumindo dados de rotas protegidas.
- [x] CI/CD configurado conectando GitHub, Netlify e Render.

## ⚙️ Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v18+)
- Conta no Supabase (com URL e API Key em mãos)

### 1. Configurando o Backend
```bash
cd backend
npm install
