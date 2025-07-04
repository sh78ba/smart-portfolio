import { OpenAI } from 'openai';

export const analyzeNews = async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let { headlines, portfolio } = req.body;

  if (!Array.isArray(headlines)) headlines = [headlines];
  if (!Array.isArray(portfolio)) portfolio = [portfolio];

  try {
    const results = []

    for (const headline of headlines) {
      const headlineLower = headline.toLowerCase();

      const matchedStocks = portfolio.filter(stock =>
        headlineLower.includes(stock.toLowerCase())
      );

      if (matchedStocks.length === 0) {
        results.push({
          headline,
          stock: null,
          sentiment: 'Neutral',
          reason: 'Headline does not match any portfolio stocks',
        });
        continue;
      }

      for (const stock of matchedStocks) {
        const prompt = `Stock: ${stock}\nHeadline: "${headline}"\nWhat is the impact of this news on ${stock}?\nJust respond with: Positive / Neutral / Negative — and a reason under 20 words.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
        });

        const response = completion.choices[0].message.content;
        const sentiment = response.match(/(Positive|Negative|Neutral)/i)?.[0] || 'Neutral';

        const reason = response.replace(sentiment, '').replace(':', '').trim();
        const shortReason =
          reason.length > 15 ? reason.split(' ').slice(0, 15).join(' ') + '...' : reason;

        results.push({
          headline,
          stock,
          sentiment,
          reason: shortReason,
        });
      }
    }

    res.json(results);
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: 'AI analysis failed' });
  }
};
