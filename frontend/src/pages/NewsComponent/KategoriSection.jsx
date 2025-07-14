import config from '../../config';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './styles/KategoriSection.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function NextArrow(props) {
  const { onClick } = props;
  return <div className="arrow next" onClick={onClick}>❯</div>;
}

function PrevArrow(props) {
  const { onClick } = props;
  return <div className="arrow prev" onClick={onClick}>❮</div>;
}

function KategoriSection() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/news/category/${category}`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error('Error:', err));
  }, [category]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: '15px'
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '10px'
        }
      }
    ]
  };

  return (
    <div className="kategori-section">
      <div className="kategori-header">
        <h3>Kategori</h3>
        <div className="kategori-tabs">
          {['all', 'teknologi', 'politik', 'olahraga', 'hiburan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'active' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Slider {...settings}>
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="kategori-card">
              <div className="card-inner">
                <img src={item.imageUrl} alt={item.title} />
                <div className="card-content">
                  <span className="tag">{item.category.toUpperCase()}</span>
                  <h4>{item.title}</h4>
                  <p className="desc">{item.description}</p>
                  <p className="date">
  {new Date(item.date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: '2-digit',
    minute: '2-digit'
  })}
</p>

                  <Link to={`/news/${item.id}`} className="read-more">Baca Selengkapnya</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Belum ada berita</p>
        )}
      </Slider>
    </div>
  );
}

export default KategoriSection;
