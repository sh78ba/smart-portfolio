# 📈 Smart Portfolio

**Smart Portfolio** is an AI-powered web application designed to enhance investment decision-making by intelligently aggregating and analyzing Indian stock market news. The app links user portfolios (or uses mock data) to provide filtered, insightful, and sentiment-based analysis of news impacting their holdings.

---

## 🚀 Features

### 📰 News Scraping Module
- Automatically scrapes stock market news headlines from Indian sources like:
  - [Moneycontrol](https://www.moneycontrol.com)
  - [Economic Times - Markets](https://economictimes.indiatimes.com/markets)
- Displays news in a **General News** section.

### 💼 Portfolio Linking Module
- Users can link their stock portfolio using:
  - users can input a **mock portfolio** manually (e.g., list of stock symbols).

### 🔍 Filtered News Section
- Automatically filters and displays news articles relevant to the user’s stock holdings.

### 🧠 AI Analysis Module
- Integrates with **OpenAI / ChatGPT API** to:
  - Analyze filtered headlines.
  - Generate impact indicators:
    - ✅ Positive Impact
    - ➖ Neutral
    - ❌ Negative Impact
  - Provide market-wide sentiment if portfolio is not linked.

---

## 🛠 Tech Stack

| Layer       | Tech                           |
|-------------|--------------------------------|
| Frontend    | React, Tailwind CSS |
| Backend     | Node.js , Express.js |
| AI          | OpenAI API |         
| Deployment  | Vercel & Render |

---