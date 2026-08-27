import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/analyze', async (req, res) => {
    try {
      const { input, mode } = req.body;
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }
      if (!mode || (mode !== 'credibility' && mode !== 'sentiment')) {
        return res.status(400).json({ error: 'Valid mode (credibility or sentiment) is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let contents = '';
      let responseSchema: any = {};

      if (mode === 'credibility') {
        contents = `Analyze the following news text or URL and determine if it is likely fake or real. 
          Provide your reasoning and a credibility score between 0 and 100 for the specific article.
          Additionally, act as an expert fact-checker (aggregating knowledge from reputable fact-checking sources like PolitiFact and Snopes).
          Identify the source publisher (if mentioned or inferable from the URL or text). Provide a comprehensive credibility profile of this source, including its estimated domain age/establishment, known political or editorial biases, its historical track record with fact-checking organizations, and an overarching source credibility score from 1 to 10.
          
          Input:
          ${input}`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: 'Classification: "Fake", "Real", or "Unsure"',
            },
            score: {
              type: Type.NUMBER,
              description: 'Article credibility score from 0 to 100, where 100 is completely credible',
            },
            reasoning: {
              type: Type.STRING,
              description: 'A detailed explanation of why this conclusion was reached based on patterns of misinformation, biases, or factuality of claims.',
            },
            sourceAnalysis: {
              type: Type.OBJECT,
              properties: {
                sourceName: { type: Type.STRING, description: 'The name of the publisher or source (e.g., "The New York Times", "Local Blog", "Unknown").' },
                sourceCredibilityScore: { type: Type.NUMBER, description: 'Source credibility score from 1 to 10.' },
                domainAge: { type: Type.STRING, description: 'Estimated age or establishment level of the source.' },
                knownBiases: { type: Type.STRING, description: 'Known political or editorial biases of the source.' },
                factCheckHistory: { type: Type.STRING, description: 'Summary of how fact-checking sites like Snopes or PolitiFact historically rate this source.' }
              },
              required: ['sourceName', 'sourceCredibilityScore', 'domainAge', 'knownBiases', 'factCheckHistory']
            }
          },
          required: ['status', 'score', 'reasoning', 'sourceAnalysis']
        };
      } else if (mode === 'sentiment') {
        contents = `Perform a sentiment analysis on the following text to determine the overall emotional tone (e.g., Positive, Negative, Neutral) and a brief explanation of the sentiment.
        
        Input:
        ${input}`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: 'The overall sentiment of the text: "Positive", "Negative", or "Neutral".'
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief explanation of why this sentiment was detected.'
            }
          },
          required: ['sentiment', 'explanation']
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema
        }
      });
      
      const text = response.text;
      if (!text) {
          return res.status(500).json({ error: 'Failed to generate content' });
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error analyzing news:', error);
      
      let errorMessage = 'An error occurred during analysis.';
      if (error?.status === 503) {
        errorMessage = 'The AI model is currently experiencing high demand. Please try again later.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      res.status(error?.status || 500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
