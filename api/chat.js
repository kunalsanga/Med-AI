const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC2qN_TrBQITilmz65a_mkPVo3zZ1871FY';

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
};
