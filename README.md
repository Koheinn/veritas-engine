# Veritas Engine: AI Fake News & Sentiment Analyzer

A full-stack web application featuring two distinct analytical tools: a News Credibility Auditor and a Linguistic Sentiment Analyzer. Leveraging Google's Gemini AI, the Veritas Engine provides real-time factual analysis, source verification, and emotional tone detection through an optimized, decoupled backend.

## ✨ Features

- **Dual-Tool Interface:** Independent side-by-side modules for Credibility Auditing and Sentiment Analysis, allowing users to run focused queries without interference.
- **Decoupled AI Logic:** Optimized API endpoints that dynamically route AI prompts based on the requested tool mode (`credibility` vs `sentiment`), saving latency and compute.
- **Categorical Classification:** Accurately labels content as **Likely Real**, **Likely Fake**, or **Unsure**.
- **Credibility Scoring:** Provides a granular 0-100 score for the specific article.
- **Sentiment Analysis:** Analyzes the overall emotional tone of the text (Positive, Negative, or Neutral) with a brief explanation.
- **Source Verification Profile:** Acts as an expert fact-checker aggregator (simulating knowledge from sources like PolitiFact and Snopes) to extract:
  - Source Name & Overall Source Credibility (1-10)
  - Domain Age & Establishment Level
  - Known Editorial/Political Biases
  - Historical Fact-Check Track Record
- **Geometric Balance UI:** A modern, highly structured, and professional interface utilizing strict block boundaries, typography-driven layouts, and semantic status colors.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express
- **AI Integration:** Google Gen AI SDK (`gemini-3.6-flash` model)
- **Architecture:** Client-Server model with a secure backend API to keep API keys hidden from the browser.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Google Gemini API Key
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/veritas-engine.git
   cd veritas-engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

### Running the Application

**Development Mode:**
To run both the Vite frontend and Express backend concurrently with hot-reloading (via `tsx`):
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

**Production Build:**
To build the React frontend and compile the Express backend into a single bundled CommonJS server:
```bash
npm run build
npm run start
```

### 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` optimized for lightweight, production-ready deployments.

1. **Build the image:**
   ```bash
   docker build -t veritas-engine .
   ```

2. **Run the container:**
   Pass your Gemini API key as an environment variable and map port 3000:
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY="your_gemini_api_key_here" veritas-engine
   ```

## 📁 Project Structure

- `/src/App.tsx`: Main React application containing the UI and client-side logic.
- `/server.ts`: Express backend handling the `/api/analyze` endpoint and AI API communication.
- `/vite.config.ts`: Vite configuration for the frontend React application.
- `/tailwind.css` (via `index.css`): Styling utilizing Tailwind v4.
- `Dockerfile` & `.dockerignore`: Multi-stage Docker configuration for production deployment.

## 🔒 Security

All communications with the Gemini API are handled server-side within `server.ts`. The client only communicates with the local Express `/api/analyze` endpoint. **Never expose your `GEMINI_API_KEY` to the client-side code.**

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
