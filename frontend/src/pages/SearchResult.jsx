import config from '../config';
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./SearchResult.css"; // Buat styling khusus

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResult = () => {
  const query = useQuery();
  const searchTerm = query.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${config.API_BASE_URL}/api/news/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div className="search-result-container">
        <h2>Hasil pencarian untuk: <em>{searchTerm}</em></h2>

        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>Tidak ada berita ditemukan untuk "<strong>{searchTerm}</strong>".</p>
        ) : (
          <div className="search-result-grid">
            {results.map((news) => (
              <Link to={`/news/${news.id}`} className="search-result-card" key={news.id}>
                <img src={news.imageUrl} alt={news.title} className="result-image" />
                <div className="result-content">
                  <span className="result-category">{news.category?.toUpperCase() || 'BERITA'}</span>
                  <h3 className="result-title">{news.title}</h3>
                  <div className="result-footer">
                    <span>👍 {news.likes || 0}</span>
                    <span>👁 {news.views || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResult;
