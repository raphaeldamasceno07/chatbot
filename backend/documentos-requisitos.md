# 📝 Documento de Requisitos: Chatbot Platform (v2.0)

---

## 1. ⚙️ Requisitos Funcionais (RF)

> O que o sistema deve fazer.

### RF01 - 👤 Gestão de Operadores (Users)

- Permitir:
  - Cadastro
  - Login (via **JWT**)
  - Edição de perfil dos usuários do dashboard

---

### RF02 - 📱 Integração WhatsApp (Baileys)

- Permitir:
  - Vincular um número via **QR Code**
  - Desvincular o número a qualquer momento

---

### RF03 - 🔄 Gestão Automática de Contatos

- Ao receber uma mensagem do WhatsApp:
  - Se o contato **não existir**:
    - ➜ Criar automaticamente
  - Se já existir:
    - ➜ Atualizar dados (nome, foto, etc.)

---

### RF04 - 💬 Chat Multi-origem

- Diferenciar claramente:
  - `USER` → mensagens enviadas pelo operador
  - `CONTACT` → mensagens recebidas do cliente

---

### RF05 - ⚡ Comunicação em Tempo Real

- Atualizar o dashboard instantaneamente usando **Socket.io**:
  - Quando novas mensagens chegarem via WhatsApp

---

### RF06 - 📎 Gestão de Mídia (Bits/Buffer)

- Suporte para:
  - Upload de arquivos (operador)
  - Download de mídias (WhatsApp)

- Tipos suportados:
  - 🖼️ Imagens
  - 🎧 Áudios
  - 📄 PDFs

---

### RF07 - 🗂️ Histórico Centralizado

- Todas as mensagens devem:
  - Ser persistidas em uma única collection
  - Estar vinculadas ao respectivo `contactId`

---

## 2. 🧩 Requisitos Não Funcionais (RNF)

> Qualidades técnicas do sistema.

### RNF01 - 🚀 Processamento de Streams

- Uploads e downloads devem usar:
  - **Buffer / Stream**
- Objetivo:
  - Reduzir consumo de RAM
  - Melhor compatibilidade com **Baileys**

---

### RNF02 - 💾 Persistência de Sessão

- Sessões do WhatsApp devem:
  - Ser salvas em disco (`auth_info`)
  - Ser protegidas via **Docker volumes**

---

### RNF03 - 🏗️ Arquitetura Desacoplada

- O WhatsApp deve ser implementado como um **Provider**
- Benefício:
  - Permitir troca futura (ex: API oficial do WhatsApp)

---

### RNF04 - 🐳 Isolamento de Ambiente

- Utilizar:
  - **Monorepo (pnpm workspaces)**
  - **Docker Compose**

- Objetivo:
  - Subir frontend, backend e banco juntos

---

## 3. 📏 Regras de Negócio (RN)

> As leis que governam o sistema.

### RN01 - 🔗 Vínculo de Instância

- Cada **User** pode ter:
  - Apenas **1 conexão ativa de WhatsApp**

---

### RN02 - 🏷️ Identificação de Origem

- Toda mensagem deve conter obrigatoriamente:

```ts
senderType: 'USER' | 'CONTACT'
```
