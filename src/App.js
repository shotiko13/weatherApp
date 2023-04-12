import React, { useState, useEffect } from 'react';
import Widget from "./Widget";
import './App.css';

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (error) => {
      console.error('Error obtaining your location:', error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log("Geoloc not supported, Use another browser.");
    }
  }, []);

  const [visibleCards, SetVisibleCards] = useState([
    {
      id: 1,
      img: 'https://via.placeholder.com/50',
      weather: '22°C',
      city: 'San Francisco',
    },
    {
      id: 2,
      img: 'https://via.placeholder.com/50',
      weather: '30°C',
      city: 'Los Angeles',
    },
  ]);

  useEffect(() => {
    if (location) {

    }
  }, location);

  const handleRemove = (id) => {
    SetVisibleCards(visibleCards.filter((card) => card.id != id));
  };

  return (
    <div className="App">
      <div className="widget-container">
        {visibleCards.map((card) => (
          <Widget
            key={card.id}
            id={card.id}
            img={card.img}
            weather={card.weather}
            city={card.city}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
