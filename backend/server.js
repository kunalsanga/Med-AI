const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC2qN_TrBQITilmz65a_mkPVo3zZ1871FY';

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
