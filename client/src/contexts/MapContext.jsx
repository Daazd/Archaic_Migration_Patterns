import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchHistoricalLocations } from '../services/geocodeApi';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [center, setCenter] = useState([31.7683, 35.2137]);
  const [zoom, setZoom] = useState(7);
  const [locations, setLocations] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [visibleMovements, setVisibleMovements] = useState([]);
  const [basemap, setBasemap] = useState('biblical');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await fetchHistoricalLocations();
        setLocations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const centerOnLocation = (locationName) => {
    const location = locations[locationName];
    if (location && location.coords) {
      setCenter(location.coords);
      setZoom(10);
      setSelectedLocation(locationName);
    }
  };

  const addMovementPath = (movement) => {
    setVisibleMovements(prev => [...prev, movement]);
  };

  const removeMovementPath = (movementId) => {
    setVisibleMovements(prev => prev.filter(m => m.id !== movementId));
  };

  const clearMovementPaths = () => {
    setVisibleMovements([]);
  };

  return (
    <MapContext.Provider
      value={{
        mapInstance,
        setMapInstance,
        center,
        setCenter,
        zoom,
        setZoom,
        locations,
        selectedLocation,
        setSelectedLocation,
        visibleMovements,
        addMovementPath,
        removeMovementPath,
        clearMovementPaths,
        basemap,
        setBasemap,
        centerOnLocation,
        loading,
        error
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
