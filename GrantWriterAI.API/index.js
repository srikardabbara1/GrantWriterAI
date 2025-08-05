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

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
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

app.post('/api/search-grants', async (req, res) => {
  console.log('Received search request:', req.body);
  const searchData = req.body;
  if (!searchData) {
    console.log('No search data provided');
    return res.status(400).json({ error: 'Search data is required.' });
  }

  // Craft the prompt for grant search
  const prompt = `
You are a grant research specialist. Based on the following organization and project information, recommend 5-8 specific grants that would be a good match.

Organization and Project Information:
${JSON.stringify(searchData, null, 2)}

Please return a JSON array of grant objects with the following structure:
[
  {
    "title": "Grant Title",
    "funder": "Funder Name",
    "amount": "Funding amount (e.g., $50,000)",
    "deadline": "Application deadline (e.g., March 15, 2024)",
    "description": "Brief description of the grant opportunity",
    "eligibility": "Eligibility requirements",
    "url": "https://example.com/grant-details",
    "categories": ["category1", "category2"],
    "organization_types": ["nonprofit", "school"],
    "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"]
  }
]

Make sure the grants are realistic, well-known funders, and match the organization type, project category, and funding amount requested. Include a mix of federal, state, and private foundation grants.
  `;

  try {
    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a grant research specialist. Return only valid JSON arrays of grant recommendations.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000
    });
    
    const aiResponse = completion.choices[0].message.content;
    console.log('OpenAI response:', aiResponse);
    
    // Parse the JSON response
    let grants;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        grants = JSON.parse(jsonMatch[0]);
      } else {
        grants = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      return res.status(500).json({ error: 'Failed to parse grant recommendations.' });
    }

    res.json({ grants: grants });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to search for grants.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get(' /writing-prompts', (req, res) => {
    res.send('Hello World');
  });