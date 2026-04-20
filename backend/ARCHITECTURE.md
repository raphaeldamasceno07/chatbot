# 📄 Especificação Funcional: Sistema de Mensageria Chatbot

---

## 1. 🔐 Gestão de Acesso e Autenticação

O sistema opera sob um modelo de acesso restrito para operadores.

### 👤 Perfil do Operador (User)

- Para interagir com a plataforma, é obrigatória a criação de uma conta de usuário.

### 🔑 Fluxo de Sessão

- O acesso às funcionalidades de leitura e escrita de mensagens é condicionado à autenticação via **JWT (JSON Web Token)**.

### 🔒 Privacidade

- Cada operador gerencia suas próprias interações e vinculações de dispositivos.

---

## 2. 📱 Domínio de Contatos (WhatsApp Integration)

A plataforma distingue quem opera o sistema de quem consome o serviço via WhatsApp.

### 🔄 Identificação Automática (Upsert)

Toda mensagem originada do WhatsApp dispara uma verificação no banco de dados:

- Se o número (`phoneNumber`) **não existir** na coleção `contacts`:
  - ➜ O sistema cria um novo registro automaticamente.

- Se **existir**:
  - ➜ Os dados do contato são atualizados (ex: nome, foto de perfil).

### 🗂️ Centralização

- As mensagens não ficam presas ao aparelho celular.
- Elas são centralizadas na coleção `messages`, vinculadas ao `contact_id`.

---

## 3. 🔗 Gestão de Instâncias (Vínculo de Dispositivo)

O "coração" da comunicação depende da integração com a biblioteca **Baileys**.

### 📲 Vinculação (Pairing)

- O usuário deve realizar o pareamento de um número de WhatsApp ao seu perfil:
  - ➜ Através da leitura de um **QR Code** gerado dinamicamente pelo backend.

### 📡 Estado da Conexão

O sistema deve monitorar e exibir o status da conexão:

- ⏳ Conectando
- ✅ Conectado
- ❌ Desconectado

### 🔌 Desvinculação (Unpair)

- O usuário pode remover o vínculo do número:
  - Encerra a sessão da Baileys
  - Remove os arquivos de autenticação (`auth_info`)

---

## 4. 💬 Interface e Fluxo de Mensagens (Workflow)

### 🖥️ Interface de Chat (Dashboard)

O operador interage com os clientes através de uma lista de conversas.

Ao selecionar um **Contact**, abre-se uma janela de chat:

- ⬅️ **Balões à Esquerda**
  - Mensagens vindas do WhatsApp
  - `senderType: 'CONTACT'`

- ➡️ **Balões à Direita**
  - Mensagens enviadas pelo operador
  - `senderType: 'USER'`

---

### 📤 Fluxo de Saída (Outbound)

#### 1. Ação no Frontend

- O operador:
  - Digita uma mensagem **ou**
  - Anexa um arquivo
  - Clica em **Enviar**

#### 2. Requisição HTTP

- O frontend faz um `POST` para a API:

```http
POST /messages/send
```
