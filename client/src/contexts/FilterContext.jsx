import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  // Extended time period to include medieval periods (up to 1300 CE for Crusades)
  const [timePeriodRange, setTimePeriodRange] = useState([-3000, 1300]);
  
  // People group filters - expanded for all historical periods
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [availableGroups] = useState([
    'Israelites', 'Patriarchs', 'Apostles', 'Prophets', 'Gentiles',
    'Indo-Europeans', 'Greeks', 'Romans', 'Celts', 'Germans', 'Slavs',
    'Vikings', 'Arabs', 'Mongols', 'Crusaders', 'Turks', 'Persians'
  ]);
  
  // Movement type filters - expanded for all types
  const [selectedMovementTypes, setSelectedMovementTypes] = useState([]);
  const [availableMovementTypes] = useState([
    'Exodus', 'Exile', 'Return', 'Missionary', 'Conquest', 'Migration',
    'Colonization', 'Expansion', 'Crusade', 'Trade', 'Invasion', 'Settlement'
  ]);
  
  // Region filters - expanded globally
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [availableRegions] = useState([
    'Canaan', 'Egypt', 'Mesopotamia', 'Asia Minor', 'Mediterranean', 'Arabia',
    'Europe', 'North Africa', 'Central Asia', 'Scandinavia', 'British Isles',
    'Iberian Peninsula', 'Balkans', 'Caucasus', 'Pontic Steppe'
  ]);
  
  // Biblical book filters
  const [selectedBooks, setSelectedBooks] = useState([]);

  const applyFilters = (movements) => {
    return movements.filter(movement => {
      // Time period filter
      const inTimePeriod = movement.timePeriod >= timePeriodRange[0] && 
                         movement.timePeriod <= timePeriodRange[1];
      
      // Group filter
      const inSelectedGroups = selectedGroups.length === 0 || 
                             selectedGroups.includes(movement.group);
      
      // Movement type filter
      const inSelectedTypes = selectedMovementTypes.length === 0 || 
                            selectedMovementTypes.includes(movement.type);
      
      // Region filter - check both from and to locations
      const inSelectedRegions = selectedRegions.length === 0 || 
                              selectedRegions.some(region => 
                                movement.fromLocation?.includes(region) || 
                                movement.toLocation?.includes(region)
                              );
      
      // Book filter
      const inSelectedBooks = selectedBooks.length === 0 || 
                            selectedBooks.includes(movement.book);
      
      return inTimePeriod && inSelectedGroups && inSelectedTypes && 
             inSelectedRegions && inSelectedBooks;
    });
  };

  const resetFilters = () => {
    setTimePeriodRange([-3000, 1300]);
    setSelectedGroups([]);
    setSelectedMovementTypes([]);
    setSelectedRegions([]);
    setSelectedBooks([]);
  };

  return (
    <FilterContext.Provider
      value={{
        timePeriodRange,
        setTimePeriodRange,
        selectedGroups,
        setSelectedGroups,
        availableGroups,
        selectedMovementTypes,
        setSelectedMovementTypes,
        availableMovementTypes,
        selectedRegions,
        setSelectedRegions,
        availableRegions,
        selectedBooks,
        setSelectedBooks,
        applyFilters,
        resetFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
