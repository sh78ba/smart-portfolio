import { fetchAllFeeds } from '../utils/rssFetcher.js';

export const getNews = async (req, res) => {
  try {
    const news = await fetchAllFeeds();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RSS feeds' });
  }
};