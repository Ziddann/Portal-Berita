import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [artikels, setArtikels] = useState([]);

  // Mengambil data artikel dari API Laravel
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/artikels')
      .then(response => {
        setArtikels(response.data); // Menyimpan data ke state
      })
      .catch(error => {
        console.error('Ada kesalahan saat mengambil data:', error);
      });
  }, []); // Hanya menjalankan sekali saat pertama kali render

  return (
    <div className="App">
      <h1>Daftar Artikel</h1>
      <ul>
        {artikels.map(artikel => (
          <li key={artikel.id}>{artikel.judul}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
