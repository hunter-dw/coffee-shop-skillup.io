# CoffeeShop — Website with Telegram Booking Integration

Welcome to the **CoffeeShop** project! This repository contains a fully responsive, modern coffee shop website with table reservation functionality powered by a serverless **Cloudflare Worker** connected to a **Telegram Bot**, ready for deployment on **GitHub Pages**.

---

## 🏗️ Architecture Overview

### Old Architecture
- **Frontend**: HTML / CSS / JS served by Node.js.
- **Backend**: Express.js server (`server.js`) handling `/api/book-table` and holding `BOT_TOKEN` locally.
- **Limitation**: Cannot be hosted on GitHub Pages because GitHub Pages is static and does not run Node.js/Express.

### New Production Architecture
1. **GitHub Pages**: Hosts static frontend files (`index.html`, `css/`, `js/`, `images/`).
2. **Cloudflare Worker (`worker.js`)**: Serverless API endpoint (`https://YOUR-WORKER.workers.dev`) handling form submissions.
3. **Telegram Bot API**: Receives booking notifications securely without exposing tokens on the frontend.

---

## 🚀 Getting Started Locally

Since the Express backend (`server.js`) has been moved to `legacy/` (as it's not needed for production GitHub Pages), you can preview the frontend locally:

1. Open `index.html` directly in your browser, or
2. Use a static server extension (such as Live Server in VS Code).

---

## 🛠️ Step-by-Step Deployment Guide

### 1. GitHub Repository & GitHub Pages

1. Create a new repository on GitHub (e.g., `CoffeeShop`).
2. Initialize git and push your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CoffeeShop ready for GitHub Pages & Cloudflare Worker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/CoffeeShop.git
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to your repository on GitHub → **Settings** → **Pages**.
   - Under **Build and deployment**, select **Source**: `Deploy from a branch`.
   - Select **Branch**: `main` (or `gh-pages`), folder `/ (root)`.
   - Click **Save**.
   - Your site will be published at: `https://YOUR_USERNAME.github.io/CoffeeShop/` (or `https://YOUR_USERNAME.github.io/` if using a user/organization site).

---

### 2. Cloudflare Worker Setup

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → **Create application** → **Create Worker**.
3. Name your worker (e.g., `coffee-shop-api`) and click **Deploy**.
4. Once created, click **Edit code** and paste the contents of `worker.js` from this repository. Click **Save and deploy**.
5. Go to your Worker's settings → **Settings** → **Variables** (Environment Variables):
   - Add variable `BOT_TOKEN`: Set to your Telegram Bot Token (obtained from [@BotFather](https://t.me/BotFather)).
   - Add variable `CHAT_ID`: Set to your Telegram Chat ID (obtained via chat ID bots or API).
6. Click **Save** / **Deploy**.
7. Copy your worker URL (e.g., `https://coffee-shop-api.username.workers.dev`).

---

### 3. Connecting Frontend to Cloudflare Worker

1. Open `js/app.js`.
2. Locate the configuration constant at the top:
   ```javascript
   const API_URL = 'PLACEHOLDER_WORKER_URL';
   ```
3. Replace `'PLACEHOLDER_WORKER_URL'` with your actual Cloudflare Worker URL:
   ```javascript
   const API_URL = 'https://coffee-shop-api.username.workers.dev';
   ```
4. Save and commit/push changes to GitHub.

---

### 4. Telegram Bot Configuration

1. **BOT_TOKEN**: Create a bot via [@BotFather](https://t.me/BotFather) on Telegram and copy the HTTP API token.
2. **CHAT_ID**: Send a message to your bot, then open your browser to:
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   Look for `"chat":{"id":XXXXXXXXX,...}` to find your numeric Chat ID.

⚠️ **SECURITY WARNING**: If your `.env` file containing a real `BOT_TOKEN` was previously committed to a public GitHub repository, please immediately revoke and regenerate your token via [@BotFather](https://t.me/BotFather). Never commit `.env` or tokens to GitHub.

---

## 🔒 Security Best Practices

- `.env` and `node_modules/` are strictly ignored via `.gitignore`.
- Secrets (`BOT_TOKEN`, `CHAT_ID`) are securely stored in Cloudflare Worker environment variables, completely hidden from users and frontend code.
- CORS is configured in `worker.js` to ensure safe API communication.
