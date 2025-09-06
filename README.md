# MedAI (https://med-ai-flax.vercel.app/)

Med AI is a fullstack AI-powered health consultation chatbot and virtual assistant designed for educational and demonstration purposes. It allows users to receive instant, AI-generated medical guidance using Google's Gemini AI by asking health-related questions or describing symptoms. Users can also switch to a general chat mode for non-medical conversations. The interface includes features like simulated health device integration (displaying mock stats such as heart rate and sleep data), light/dark theme toggling, chat clearing, and Markdown-formatted responses for enhanced readability. With seamless mode switching between medical and general inquiries, Med AI showcases the practical application of advanced AI in a secure, interactive web environment.

## Preview
![](https://github.com/kunalsanga/Med-AI/blob/main/main.png)
![](https://github.com/kunalsanga/Med-AI/blob/main/maindark.png)
![](https://github.com/kunalsanga/Med-AI/blob/main/smart.png)
![](https://github.com/kunalsanga/Med-AI/blob/main/chat.png)

## Deployment Link: https://med-ai-flax.vercel.app/

## Features
- **AI Chatbot:** Get medical and general answers powered by Gemini AI.
- **Rich Chat UI:** Modern, responsive chat interface with Markdown support for AI responses.
- **Device Integration (UI):** Simulated device scanning and health stats display.
- **Theme Support:** Switch between light and dark themes.
- **Chat Modes:** Toggle between Medical Consultation and General Inquiry.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (with [Marked.js](https://marked.js.org/) for Markdown rendering)
- **Backend:** Node.js, Express, Axios, CORS
- **AI:** Google Gemini API

## Getting Started

### 1. Clone the Repository
```
git clone <your-repo-url>
cd MedAI
```

### 2. Backend Setup
```
cd backend
npm install
```

#### Configure Gemini API Key
- Your API key is already set in `backend/server.js` (for demo/testing). For production, use environment variables for security.

### 3. Start the Backend Server
```
npm start
```
- The backend will run at `http://localhost:3000`

### 4. Frontend Setup
- Open `index.html` in your browser.
- The chat UI will connect to the backend for AI responses.

## Usage
1. Type your question or symptoms in the chat box and press send.
2. The AI will respond with professional advice or general answers, formatted with Markdown.
3. Switch chat modes or themes as desired.

## Project Structure
```
MedAI/
  index.html         # Main frontend HTML
  styles.css         # Frontend styles
  script.js          # Frontend logic
  backend/
    server.js        # Express backend server
    package.json     # Backend dependencies
```

## Customization
- To use your own Gemini API key, edit `backend/server.js` or use environment variables.
- You can deploy the backend to any Node.js hosting service and serve the frontend as static files.

## License
This project is for educational/demo purposes. For production use, ensure you comply with Google Gemini API terms and handle user data securely. 
