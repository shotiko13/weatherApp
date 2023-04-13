import React, { useState, useEffect } from 'react';
import Widget from "./Widget";
import { useQuery } from '@apollo/client';
import './App.css';
import { WEATHER_QUERY } from './queries';
// import './Widget.css'

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
      console.error('Error finding you:', error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log("Geoloc not supported, Use another browser.");
    }
  }, []);

  async function getCity(latitude, longitude) {
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data && data.address) {
        return data.address.city || data.address.town || data.address.village;
      }
    } catch (error) {
      console.error("Can't get your city based on your coordinates:", error);
    }
    return null;
  }

  useEffect(() => {
    if (location) {
      const fetchCity = async () => {
        const name = await getCity(location.latitude, location.longitude)
        if (name) {
          setCity(name);
        }
      };
      fetchCity();
    }
  }, [location]);
  
  const [city, setCity] = useState('Kutaisi');

  const { loading, error, data } = useQuery(WEATHER_QUERY, {
    variables: { city },
  });

  const weatherData = data?.weatherData;

  const [visibleCards, setVisibleCards] = useState([]);

  function addCityToVisibleCards(weatherData) {
    setVisibleCards((prev) => {
      const thisCity = prev.find((x) => x.city === weatherData.city);

      if (!thisCity) {
        return [...prev, weatherData];
      } else {
        return prev;
      }
    });
  }

  useEffect(() => {
    if (city && weatherData) {
      addCityToVisibleCards(weatherData);
    }
  }, [city, weatherData]);

  const handleRemove = (id) => {
    setVisibleCards(visibleCards.filter((card) => card.id !== id));
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
