require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
const port = 3000;

const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

app.use(express.json());

app.get(' /', (req, res) => {
  res.send('Hello World');
});

app.post('/api/generate', async (req, res) => {
  const formData = req.body;
  if (!formData) {
    return res.status(400).json({ error: 'Form data is required.' });
  }

  // Craft the prompt
  const prompt = `
You are a professional grant writer. Using the following information, write a complete, compelling, and well-structured grant proposal.
Be sure to include all relevant sections, use clear and persuasive language, and organize the content logically.

Grant Information (in JSON format):
${JSON.stringify(formData, null, 2)}

Please return only the grant proposal text, ready for review.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful grant writing assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048
    });
    const aiResponse = completion.choices[0].message.content;

    // Save the grant to a text file
    const filePath = path.join(__dirname, 'generated_grant.txt');
    fs.writeFileSync(filePath, aiResponse, 'utf8');

    res.json({ result: aiResponse, file: 'generated_grant.txt' });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response from OpenAI.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get(' /writing-prompts', (req, res) => {
    res.send('Hello World');
  });