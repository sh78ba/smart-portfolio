import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const sources = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://b2b.economictimes.indiatimes.com/rss/recentstories',
];

export const fetchAllFeeds = async () => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const allNews = [];

  for (let url of sources) {
    try {
      const { data } = await axios.get(url);
      const parsed = parser.parse(data);
      const items = parsed.rss.channel.item;
      items.forEach((item) => {
        allNews.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.description,
        });
      });
    } catch (err) {
      console.error(`RSS fetch error from ${url}:`, err.message);
    }
  }

  return allNews.slice(0, 18);
};

