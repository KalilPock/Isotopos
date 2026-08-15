# Sistema Isótopos

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-emerald?style=for-the-badge)
![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Resumo
-------

`Sistema Isótopos` é um repositório de referência para experimentos de arquitetura web, autenticação e pipelines CI/CD. O objetivo é prover um projeto modular (frontend separado do backend) com integração a Supabase e deploys automatizados.

Arquitetura e tecnologias
-------------------------

- Frontend: Astro (SSG/Edge), Tailwind CSS
- Backend: Node.js + Express (API REST)
- Autenticação e DB: Supabase (PostgreSQL)
- Deploy: Netlify (frontend) e Render (backend)

Principais funcionalidades
-------------------------

- Login e autenticação via Supabase
- Emissão e validação de JWTs no backend
- Middleware de proteção de rotas
- Dashboard protegido consumindo API
- Pipeline CI/CD integrado (GitHub → Netlify/Render)

Executando localmente
---------------------

Pré-requisitos:

- Node.js 18+
- Conta e projeto no Supabase (URL e API key)

Backend

```bash
cd backend
npm install
npm run dev
```

Frontend

```bash
cd view
npm install
npm run dev
```

Variáveis de ambiente
---------------------

- Backend: configure `SUPABASE_URL`, `SUPABASE_KEY` e `JWT_SECRET` conforme necessário.
- Frontend: configure a URL e quaisquer chaves do Supabase usadas pelo cliente.

Deploy
------

- Frontend: conectar repositório ao Netlify (build: `npm run build` em `view`).
- Backend: deploy contínuo no Render ou serviço equivalente.

Contribuição
------------

Pull requests são bem-vindos. Mantenha mudanças pequenas e documente decisões arquiteturais.

Licença
-------

Projeto pessoal — adapte conforme sua necessidade.

Contato
-------

Abra issues para bugs ou sugestões.

