# 📱 WhatsApp API & Webhook

A robust, production-ready API and Webhook system for sending and receiving WhatsApp messages. Built with **Express.js** and powered by [whatsapp-web.js](https://docs.wwebjs.dev/), this service provides a secure way to integrate WhatsApp messaging into your existing applications.

---

## ✨ Features

- **🚀 Send Messages via API**: Easily send text messages to any WhatsApp number using a secure RESTful endpoint.
- **🔄 Real-time Webhooks**: Receive incoming messages instantly via a secure webhook with HMAC SHA256 signature verification.
- **🔐 Multi-method Authentication**: Secure your API using either `Authorization: Bearer <API_KEY>` or `x-api-key: <API_KEY>` headers.
- **📂 Modular Architecture**: Clean, layered design (Routes $\rightarrow$ Handlers $\rightarrow$ Services) for easy maintenance and scalability.
- **💾 Persistent Session**: Uses `LocalAuth` to save your WhatsApp session, so you don't need to scan the QR code every time you restart.
- **🛡️ Production-Grade Security**: Integrated with `helmet` for HTTP header security and custom middleware for API key validation.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher recommended)
- **npm** (comes with Node.js)
- A smartphone with **WhatsApp** installed (to scan the initial QR code)

---

## 🚀 Installation & Setup

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-url>
   cd wa-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your configuration:
   ```env
   PORT=3000
   API_KEY=your_super_secret_api_key
   WEBHOOK_URL=https://your-domain.com/webhook
   WEBHOOK_SECRET=your_super_secret_webhook_signature_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Link your WhatsApp Account**:
   Upon starting, a **QR code** will be generated in your terminal. 
   - Open WhatsApp on your phone.
   - Go to **Settings** $\rightarrow$ **Linked Devices**.
   - Tap **Link a Device** and scan the QR code in your terminal.

---

## 🔌 API Reference

### 1. Send a Message
Send a text message to a specific WhatsApp number.

**Endpoint:** `POST /api/v1/messages/send`

**Authentication:**
- `Authorization: Bearer <API_KEY>`
- **OR** `x-api-key: <API_KEY>`

**Request Body (`application/json`):**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `number` | `string` | Yes | The recipient's phone number (e.g., `"1234567890"`). Do not include `+` or spaces. |
| `message` | `string` | Yes | The text content of the message. |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
     -H "x-api-key: your_super_secret_api_key" \
     -H "Content-Type: application/json" \
     -d '{"number": "1234567890", "message": "Hello from secure API!"}'
```

**Example Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "chatId": "1234567890@c.us"
}
```

---

## 📡 Webhook Integration

The application acts as a forwarder for incoming WhatsApp messages. When a message is received, it is dispatched to your configured `WEBHOOK_URL`.

### 🛡️ Security: Signature Verification

To prevent unauthorized entities from spoofing messages to your webhook, every request includes an **HMAC SHA256** signature in the `X-Webhook-Signature` header.

**How to verify on your server:**
1. Retrieve the raw request body.
2. Compute the HMAC SHA256 hash using your `WEBHOOK_SECRET`.
3. Compare your computed hash with the value in the `X-Webhook-Signature` header.

---

## 📂 Project Structure

The project follows a modular, layered architecture:

```text
src/
├── app.js              # Express application configuration & middleware setup
├── index.js            # Server entry point & WhatsApp client initialization
├── config/             # Environment variable management
├── handlers/           # Request/Response logic (Controllers)
├── middlewares/        # Auth, Error handling, and Security middlewares
├── routes/             # API route definitions
├── services/           # Business logic & WhatsApp client interactions
└── whatsapp/           # WhatsApp client instance & configuration
```

---

## 🔒 Security Measures

- **Helmet.js**: Automatically sets various HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, etc.).
- **API Key Protection**: All sensitive endpoints are protected by a mandatory API key check.
- **Input Validation**: Basic validation ensures required fields are present before processing requests.
- **Secure Webhooks**: HMAC signatures ensure the integrity and authenticity of incoming data.

---

## 🎖️ Credits

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **WhatsApp Engine**: [whatsapp-web.js](https://docs.wwebjs.dev/)
- **Security**: [Helmet.js](https://helmetjs.github.io/)
- **QR Code Terminal**: [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)

---

## 📄 License

This project is licensed under the MIT License.

