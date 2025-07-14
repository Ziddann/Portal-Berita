import React from 'react';
import Navbar from '../components/Navbar';
import TrendingSection from './NewsComponent/TrendingSection';
import KategoriSection from './NewsComponent/KategoriSection';
import BeritaTerbaru from './NewsComponent/BeritaTerbaru';
import NewsCard from './NewsComponent/NewsCard';
import Footer from '../components/Footer';

import './Home.css'

const Home = () => {
  return (
    <div className="page-container">
      <Navbar />

      <div className="content-wrapper">
        <TrendingSection />
        <KategoriSection />
        <BeritaTerbaru />
        <NewsCard />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
