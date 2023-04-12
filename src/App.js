import React, { useState, useEffect } from 'react';
import Widget from "./Widget";
import { useQuery } from '@apollo/client';
import './App.css';
import { WEATHER_QUERY } from './queries';

function App() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('Kutaisi');

  //get latitude and longtitude
  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longtitude: position.coords.longitude,
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

  async function getCity(latitude, longtitude) {
    console.log('Latitude:', latitude, 'Longtitude:', longtitude);

    
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${parseFloat(latitude)}&lon=${parseFloat(longtitude)}`;
    console.log('Latitude:', latitude, 'Longtitude:', longtitude);
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      console.log('Data from Nominatim API:', data);
      if (data && data.address) {
        return data.address.city || data.address.town || data.address.village;
      }
    } catch (error) {
      console.error("Can't get your city based on your coordinates:", error);
    }
    return null;
  }

  const { loading, error, data } = useQuery(WEATHER_QUERY, {
    variables: { city },
  });

  useEffect(() => {
    if (location) {
      const fetchCity = async () => {
        const name = await getCity(location.latitude, location.longtitude)
        if (name) {
          setCity(name);
        }
      };
      fetchCity();
    }
  }, [location]);

  const weatherData = data?.weatherData;
  
  
  useEffect(() => {
    if (city && weatherData) {
      addCityToVisibleCards(weatherData);
    }
  }, [city, weatherData]);

  



  
  const [visibleCards, SetVisibleCards] = useState([]);

  function addCityToVisibleCards(weatherData) {
    SetVisibleCards((prev) => {
      const thisCity = prev.find((x) => x.city === weatherData.city);

      if (!thisCity) {
        return [...prev, weatherData];
      } else {
        return prev;
      }
    });
  }


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
            forecast={card.forecast}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
