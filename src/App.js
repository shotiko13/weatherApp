import React, { useState, useEffect } from 'react';
import Widget from "./Widget";
import { useQuery } from '@apollo/client';
import './App.css';
import { WEATHER_QUERY } from './queries';

function App() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('Tbilisi');

  const { loading, error, data } = useQuery(WEATHER_QUERY, {
    variables: { city },
  });

  const weatherData = data?.weatherData;

  

  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longtitude: position.coords.longtitude,
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

  const [visibleCards, SetVisibleCards] = useState([]);

  async function getCity(latitude, longtitude) {
    
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longtitude}`;
      console.log('Latitude:', latitude, 'Longitude:', longtitude);
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
  

  // useEffect(() => {
  //   if (location) {
  //     const fetchCity = async () => {
  //       const name = await getCity(location.latitude, location.longtitude)
  //       if (name) {
  //         setCity(name);
  //         if (weatherData){
  //         addCityToVisibleCards(weatherData);
  //         }
  //       }
  //     };
  //     fetchCity();
  //   }
  // }, [location, weatherData]);

  
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
  

  useEffect(() => {
    if (city && weatherData) {
      addCityToVisibleCards(weatherData);
    }
  }, [city, weatherData]);

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
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
