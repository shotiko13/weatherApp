import React, { useState, useEffect } from 'react';
import Widget from "./Widget";

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

  const [visibleCards, SetVisibleCards] = useState([]);

  useEffect(() => {
    if (location) {

    }
  }, location);

  const handleRemove = (id) => {
    SetVisibleCards(visibleCards.filter((card) => card.id != id));
  };

  const widgets = visibleCards.map((x) => {
    return (
      <Widget
        key={x.id}
        id={x.id}
        img={x.img}
        weather={x.weather}
        city={x.city} />
    )
  })
  return (
    <div className="App">
      {widgets}
    </div>
  );
}

export default App;
