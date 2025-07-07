// api/index.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', async (req, res) => {
  try {
    const { prompt } = req.query;
    if (!prompt) {
      return res.status(400).json({ error: 'A prompt is required.' });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const imageBuffer = await response.buffer();
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({ imageUrl: dataUrl });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
