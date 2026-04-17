<div align="center">

# 🔐 DevLocker — Snippets Vault

### Cofre de Snippets para Desenvolvedores

<br/>

![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)

<br/>

> **Projeto Open Source** desenvolvido como portfólio para demonstrar domínio em
> **Autenticação JWT**, **Autorização a nível de recurso** e **Integração Fullstack**
> com Fastify (Node.js) e Flutter.

**🌐 API em produção:** [`https://<SEU-LINK-NO-RENDER>.onrender.com`](https://seu-link-no-render.onrender.com)

</div>

---

## 📌 Sobre o Projeto

O **DevLocker** é um cofre de snippets de código. Desenvolvedores podem armazenar, organizar e consultar trechos de código úteis — seja publicamente ou em sua área privada protegida.

O projeto foi construído com o objetivo de evidenciar boas práticas de **segurança de APIs**, **autenticação stateless com JWT**, **armazenamento seguro no dispositivo móvel** e **autorização granular por recurso**, dentro de um contexto Fullstack moderno.

> Este repositório é **100% open source**. Fique à vontade para estudar, clonar e contribuir.

---

## 🏛️ Arquitetura de Segurança

O fluxo de autenticação e autorização segue o padrão stateless baseado em **JSON Web Tokens (JWT)**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE AUTENTICAÇÃO                       │
│                                                                     │
│  Flutter App          API (Fastify)            Banco de Dados       │
│  ──────────           ────────────             ──────────────       │
│                                                                     │
│  1. POST /auth/login ──────────────────────►                        │
│     { email, senha }                                                │
│                       2. Valida credenciais ──► SELECT user         │
│                       3. Verifica hash Bcrypt ◄── user row          │
│                       4. Gera JWT (payload:                         │
│                          userId, exp)                               │
│  5. Recebe JWT ◄──────────────────────────────                      │
│  6. Salva em                                                        │
│     FlutterSecureStorage                                            │
│                                                                     │
│  7. GET /snippets/my                                                │
│     Header: Bearer <TOKEN> ──────────────►                          │
│                       8. @fastify/jwt verifica                      │
│                          assinatura e expiração                     │
│                       9. Extrai userId do payload                   │
│                      10. SELECT WHERE userId ──► Retorna apenas     │
│                                                  os snippets        │
│                                                  do dono            │
│  11. Renderiza lista ◄────────────────────────────                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Pontos-chave de segurança implementados:**

| Camada | Mecanismo | Detalhe |
|--------|-----------|---------|
| Senha | Bcrypt | Hash + salt antes de persistir no banco (**RN01**) |
| Autenticação | JWT (RS256/HS256) | Token stateless com expiração configurável (**RN03**) |
| Autorização | Resource-level check | Verifica `userId` do token contra o dono do recurso (**RN04**) |
| Armazenamento Mobile | Flutter Secure Storage | Token gravado no Keychain (iOS) / Keystore (Android) — nunca em SharedPreferences (**RN05**) |
| Área Pública | Rotas abertas | Somente leitura de snippets em destaque, sem autenticação (**RN02**) |

---

## 📐 Regras de Negócio

| ID | Regra | Detalhe |
|----|-------|---------|
| **RN01** | Cadastro de Usuários | Qualquer pessoa pode se cadastrar. A senha é hasheada com **Bcrypt** antes de ser persistida. |
| **RN02** | Acesso Público | Usuários não autenticados podem visualizar a lista de *Snippets em Destaque*, sem acesso a detalhes ou criação. |
| **RN03** | Autenticação via JWT | Funcionalidades de escrita e área privada exigem um **Token JWT válido** no header `Authorization: Bearer <token>`. |
| **RN04** | Propriedade dos Dados | Um usuário autenticado só pode **editar ou excluir** snippets que ele mesmo criou (autorização a nível de recurso). |
| **RN05** | Persistência Segura no Mobile | O JWT nunca é salvo em SharedPreferences. Utiliza-se **Flutter Secure Storage** (Keychain/Keystore) para garantir isolamento de processo. |

---

## 📡 Documentação da API

**Base URL:** `https://<SEU-LINK-NO-RENDER>.onrender.com`

### Autenticação

| Método | Endpoint | Acesso | Descrição |
|--------|----------|--------|-----------|
| `POST` | `/auth/register` | Público | Cadastra um novo usuário. Senha é hasheada com Bcrypt. |
| `POST` | `/auth/login` | Público | Valida credenciais e retorna um **JWT** no corpo da resposta. |

#### `POST /auth/register`

**Body:**
```json
{
  "name": "Igor Dev",
  "email": "igor@email.com",
  "password": "senhaSegura123"
}
```

**Response `201 Created`:**
```json
{
  "id": "uuid",
  "name": "Igor Dev",
  "email": "igor@email.com"
}
```

---

#### `POST /auth/login`

**Body:**
```json
{
  "email": "igor@email.com",
  "password": "senhaSegura123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Snippets

| Método | Endpoint | Acesso | Descrição |
|--------|----------|--------|-----------|
| `GET` | `/snippets` | Público | Lista os *Snippets em Destaque* (sem autenticação). |
| `POST` | `/snippets` | 🔒 Privado | Cria um novo snippet. Requer `Authorization: Bearer <token>`. |
| `GET` | `/snippets/my` | 🔒 Privado | Retorna apenas os snippets do usuário autenticado. |
| `PUT` | `/snippets/:id` | 🔒 Privado (Dono) | Edita um snippet. Retorna `403` se o usuário não for o dono. |
| `DELETE` | `/snippets/:id` | 🔒 Privado (Dono) | Exclui um snippet. Retorna `403` se o usuário não for o dono. |

#### `POST /snippets` — Header obrigatório

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "title": "Debounce em Flutter",
  "language": "dart",
  "code": "Timer? _debounce;\nvoid onChanged(String v) {\n  _debounce?.cancel();\n  _debounce = Timer(Duration(milliseconds: 500), () { ... });\n}",
  "description": "Evitar chamadas excessivas em campos de busca"
}
```

**Response `201 Created`:**
```json
{
  "id": "uuid",
  "title": "Debounce em Flutter",
  "language": "dart",
  "ownerId": "uuid-do-usuario",
  "createdAt": "2026-04-17T00:00:00.000Z"
}
```

---

## 🛠️ Stack Técnica

### Backend — Fastify (Node.js)

| Tecnologia | Função |
|------------|--------|
| **Node.js** | Runtime JavaScript server-side |
| **Fastify** | Framework HTTP de alta performance |
| **Prisma ORM** | Mapeamento objeto-relacional e migrations |
| **SQLite** | Banco de dados relacional leve (dev/prod) |
| **@fastify/jwt** | Geração e verificação de tokens JWT |
| **Bcrypt** | Hash de senhas com salt rounds configurável |

### Mobile — Flutter

| Tecnologia | Função |
|------------|--------|
| **Flutter** | Framework UI multiplataforma (Android/iOS) |
| **Dio** | Cliente HTTP com interceptors para injeção do JWT |
| **Flutter Secure Storage** | Armazenamento seguro do token (Keychain/Keystore) |
| **Provider / Bloc** | Gerenciamento de estado da aplicação |

---

## 🚀 Rodando o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 20.x`
- [Flutter SDK](https://flutter.dev/docs/get-started/install) `>= 3.11.0`
- Um emulador Android/iOS ou dispositivo físico

---

### Backend (API Fastify)

```bash
# 1. Entre na pasta da API
cd api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seu JWT_SECRET e DATABASE_URL

# 4. Execute as migrations do banco
npx prisma migrate dev

# 5. Inicie o servidor em modo desenvolvimento
npm run dev
```

> A API estará disponível em `http://localhost:3000`

**Variáveis de ambiente (`.env`):**

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_muito_forte_aqui"
JWT_EXPIRES_IN="7d"
PORT=3000
```

---

### Mobile (Flutter App)

```bash
# 1. Entre na pasta do app
cd app

# 2. Instale as dependências do Flutter
flutter pub get

# 3. Configure a base URL da API
# Edite o arquivo lib/core/constants/api_constants.dart
# const String baseUrl = 'http://10.0.2.2:3000'; // Android Emulator
# const String baseUrl = 'http://localhost:3000'; // iOS Simulator

# 4. Execute o app
flutter run
```

> **Nota:** Em emulador Android, use `10.0.2.2` como host para acessar o `localhost` da máquina.

---

## 📁 Estrutura do Projeto

```
flutter_snippets_vault/
├── api/                      # Backend Fastify
│   ├── src/
│   │   ├── routes/           # Definição dos endpoints
│   │   │   ├── auth.routes.js
│   │   │   └── snippets.routes.js
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── middlewares/      # Verificação de JWT
│   │   └── plugins/          # Registro de plugins Fastify
│   ├── prisma/
│   │   └── schema.prisma     # Schema do banco de dados
│   ├── .env.example
│   └── server.js
│
└── app/                      # Mobile Flutter
    └── lib/
        ├── core/
        │   ├── constants/    # URLs, configs
        │   └── services/     # AuthService, TokenService
        ├── features/
        │   ├── auth/         # Login, Register
        │   └── snippets/     # Listagem, criação, meus snippets
        └── main.dart
```

---

## 🤝 Contribuindo

Este projeto é open source e contribuições são bem-vindas!

1. Faça um **fork** do repositório
2. Crie uma branch para sua feature: `git checkout -b feat/minha-feature`
3. Faça o commit das suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Faça o push para a branch: `git push origin feat/minha-feature`
5. Abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">

Desenvolvido com foco em **Segurança**, **Boas Práticas** e **Engenharia de Software**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#)

</div>
