import React, { useState, useEffect } from 'react';

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
      console.error('Error obtaining user location:', error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="App">
      {/*yet empty */}
    </div>
  );
}

export default App;
