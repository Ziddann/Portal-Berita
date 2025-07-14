import { useEffect, useState } from 'react';

export default function useAuthorNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/news/mine')
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  return { news, loading, refresh: () => setLoading(true) };
}
