import { OpenAI } from 'openai';
import stringSimilarity from 'string-similarity';

export const analyzeNews = async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let { headlines, portfolio } = req.body;

  if (!Array.isArray(headlines)) headlines = [headlines];
  if (!Array.isArray(portfolio)) portfolio = [portfolio];

  const THRESHOLD = 0.65; // Tune as needed (0.6-0.7 = balanced)

  try {
    const results = [];

    for (const headline of headlines) {
      const headlineLower = headline.toLowerCase();
      const headlineTokens = headlineLower.split(/\W+/); // Words from headline

      const matchedStocks = portfolio.filter(stock => {
        const stockTokens = stock.toLowerCase().split(/[\s\-\.]/).filter(Boolean);

        return stockTokens.some(token => {
          if (headlineLower.includes(token)) return true; // Fast exact match

          // Fuzzy compare token with all headline words
          return headlineTokens.some(word =>
            stringSimilarity.compareTwoStrings(token, word) >= THRESHOLD
          );
        });
      });

      if (matchedStocks.length === 0) {
        results.push({
          headline,
          stock: null,
          sentiment: 'Neutral',
          reason: 'Headline does not match any portfolio stocks',
          confidence: 0.5,
        });
        continue;
      }

      for (const stock of matchedStocks) {
        const prompt = `Stock: ${stock}\nHeadline: "${headline}"\nWhat is the impact of this news on ${stock}?\nRespond with one word (Positive / Neutral / Negative) and a short reason under 20 words.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
        });

        const response = completion.choices[0].message.content || '';
        const sentiment = response.match(/(Positive|Negative|Neutral)/i)?.[0] || 'Neutral';

        const reason = response.replace(sentiment, '').replace(':', '').trim();
        const shortReason =
          reason.length > 15 ? reason.split(' ').slice(0, 15).join(' ') + '...' : reason;

        results.push({
          headline,
          stock,
          sentiment,
          reason: shortReason || 'No reason provided.',
          confidence: sentiment.toLowerCase() === 'neutral' ? 0.6 : 0.9, // Simple scoring logic
        });
      }
    }

    res.json(results);
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: 'AI analysis failed' });
  }
};
