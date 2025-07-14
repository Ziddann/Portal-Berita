import config from '../config';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/SearchBar.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/news/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowDropdown(false);
      }
    }
  };

  const handleSelect = (newsId) => {
    navigate(`/news/${newsId}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search news..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
      />
      {showDropdown && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((item) => (
            <li key={item.id} onClick={() => handleSelect(item.id)}>
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
