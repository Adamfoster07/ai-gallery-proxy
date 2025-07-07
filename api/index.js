// api/index.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

// The specific Perchance generator we want to use
const PERCHANCE_GENERATOR = "bj56i6xlxu";

app.get('/api', async (req, res) => {
  try {
    // Get all the parameters from our gallery's request
    const { description, negative, artStyle, shape } = req.query;

    if (!description) {
      return res.status(400).json({ error: 'A prompt is required.' });
    }

    // Combine parameters into the format the Perchance generator expects
    const fullPrompt = `${description}, ${artStyle}, ${shape}`;

    // Construct the final URL to call the Perchance API
    const perchanceUrl = new URL(`https://perchance.org/api/${PERCHANCE_GENERATOR}`);
    perchanceUrl.searchParams.set("prompt", fullPrompt);
    if (negative) {
      perchanceUrl.searchParams.set("negative_prompt", negative);
    }

    const perchanceResponse = await fetch(perchanceUrl.toString());
    const result = await perchanceResponse.json();

    if (result.error) throw new Error(result.error);
    if (result.status === 'error') throw new Error(result.message);

    // Send the final image URL back to our gallery
    res.json({ imageUrl: result.output });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
