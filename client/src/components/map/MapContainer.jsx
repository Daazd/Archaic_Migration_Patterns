import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Spinner, Alert, AlertIcon, Badge, Text, VStack, Button } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../contexts/MapContext';
import { useFilter } from '../../contexts/FilterContext';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapContainer = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Use Map instead of objects for better layer tracking
  const markersRef = useRef(new Map());
  const pathsRef = useRef(new Map());
  const movementLayersRef = useRef(new Map());
  const allLayersRef = useRef(new Set()); // Track all layers for complete clearing
  
  const {
    center,
    zoom,
    locations,
    visibleMovements,
    setMapInstance,
    loading: locationsLoading,
    error: locationsError
  } = useMap();
  
  const { timePeriodRange } = useFilter();
  
  const [mapLoading, setMapLoading] = useState(true);
  const [activeMovements, setActiveMovements] = useState([]);

  // Comprehensive clear all layers function
  const clearAllLayers = useCallback(() => {
    if (!mapInstanceRef.current) return;
    
    console.log('🧹 Clearing all biblical map layers...');
    
    // Method 1: Clear tracked layers
    [markersRef, pathsRef, movementLayersRef].forEach(layerMap => {
      layerMap.current.forEach((layer, key) => {
        try {
          if (layer && layer.path) {
            mapInstanceRef.current.removeLayer(layer.path);
            allLayersRef.current.delete(layer.path);
          }
          if (layer && layer.arrow) {
            mapInstanceRef.current.removeLayer(layer.arrow);
            allLayersRef.current.delete(layer.arrow);
          }
          if (layer && typeof layer.removeFrom === 'function') {
            layer.removeFrom(mapInstanceRef.current);
            allLayersRef.current.delete(layer);
          } else if (layer) {
            mapInstanceRef.current.removeLayer(layer);
            allLayersRef.current.delete(layer);
          }
        } catch (e) {
          console.warn(`Failed to remove layer ${key}:`, e);
        }
      });
      layerMap.current.clear();
    });
    
    // Method 2: Clear all tracked layers from set
    allLayersRef.current.forEach(layer => {
      try {
        if (layer && mapInstanceRef.current.hasLayer(layer)) {
          mapInstanceRef.current.removeLayer(layer);
        }
      } catch (e) {
        console.warn('Failed to remove tracked layer:', e);
      }
    });
    allLayersRef.current.clear();
    
    // Method 3: Clear map layers by iterating through map's layers
    if (mapInstanceRef.current && mapInstanceRef.current.eachLayer) {
      const layersToRemove = [];
      mapInstanceRef.current.eachLayer((layer) => {
        // Keep only the base tile layer
        if (!layer._url) { // Not a tile layer
          layersToRemove.push(layer);
        }
      });
      
      layersToRemove.forEach(layer => {
        try {
          mapInstanceRef.current.removeLayer(layer);
        } catch (e) {
          console.warn('Failed to remove map layer:', e);
        }
      });
    }
    
    console.log('✅ All biblical map layers cleared');
  }, []);

  // Helper function to track layers
  const addLayerWithTracking = useCallback((layer, layerMap, key) => {
    if (layer && mapInstanceRef.current) {
      layer.addTo(mapInstanceRef.current);
      layerMap.current.set(key, layer);
      allLayersRef.current.add(layer);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    setMapLoading(true);
    
    try {
      const map = L.map(mapRef.current, {
        center: [31.7683, 35.2137], // Jerusalem
        zoom: 6,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Biblical Data: Bible API, Pleiades, Historical Records',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapInstance(map);
      setMapLoading(false);

      // Add map click handler to clear selections
      map.on('click', () => {
        setActiveMovements([]);
        clearAllLayers();
      });

      return () => {
        if (mapInstanceRef.current) {
          clearAllLayers();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing biblical map:', error);
      setMapLoading(false);
    }
  }, [setMapInstance, clearAllLayers]);

  // Update biblical location markers
  useEffect(() => {
    if (!mapInstanceRef.current || !locations || locationsLoading) return;

    console.log('📍 Updating biblical location markers...');

    // Clear existing markers properly
    markersRef.current.forEach((marker, key) => {
      try {
        mapInstanceRef.current.removeLayer(marker);
        allLayersRef.current.delete(marker);
      } catch (e) {
        console.warn(`Failed to remove marker ${key}:`, e);
      }
    });
    markersRef.current.clear();

    // Add biblical location markers
    Object.entries(locations).forEach(([name, location]) => {
      const [startYear, endYear] = location.period || [-Infinity, Infinity];
      
      // Extended biblical period filter (10,000 BCE to 1300 CE)
      const biblicalPeriod = startYear <= 1300 && endYear >= -10000;
      const inTimePeriod = startYear <= timePeriodRange[1] && endYear >= timePeriodRange[0];
      
      if (biblicalPeriod && inTimePeriod && location.coords && location.coords.length === 2) {
        try {
          const [lng, lat] = location.coords;
          
          const getBiblicalIcon = (importance, name) => {
            if (name.toLowerCase().includes('jerusalem')) return '✡️';
            if (name.toLowerCase().includes('bethlehem')) return '⭐';
            if (name.toLowerCase().includes('egypt')) return '🏺';
            if (name.toLowerCase().includes('babylon')) return '🏛️';
            if (name.toLowerCase().includes('rome')) return '🏛️';
            if (name.toLowerCase().includes('damascus')) return '🕌';
            if (name.toLowerCase().includes('antioch')) return '⛪';
            if (importance === 'major') return '🏙️';
            return '🏘️';
          };

          const iconSize = location.importance === 'major' ? [30, 30] : [20, 20];
          
          const customIcon = L.divIcon({
            html: `<div style="
              background: white;
              border: 2px solid #3182ce;
              border-radius: 50%;
              width: ${iconSize[0]}px;
              height: ${iconSize[1]}px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${iconSize[0] * 0.6}px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">${getBiblicalIcon(location.importance, name)}</div>`,
            className: 'biblical-marker',
            iconSize: iconSize,
            iconAnchor: [iconSize[0]/2, iconSize[1]/2]
          });

          const marker = L.marker([lat, lng], { icon: customIcon });

          const popupContent = `
            <div style="min-width: 250px; font-family: 'Georgia', serif;">
              <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 18px; font-weight: bold; border-bottom: 2px solid #3182ce; padding-bottom: 4px;">
                ${name}
              </h3>
              <div style="margin: 8px 0;">
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">
                  <strong>📍 Region:</strong> ${location.region}
                </p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">
                  <strong>⏳ Period:</strong> ${startYear < 0 ? Math.abs(startYear) + ' BCE' : startYear + ' CE'} - 
                  ${endYear < 0 ? Math.abs(endYear) + ' BCE' : endYear + ' CE'}
                </p>
                ${location.alternateNames && location.alternateNames.length > 0 ? 
                  `<p style="margin: 4px 0; color: #4a5568; font-size: 14px;">
                    <strong>📜 Also known as:</strong> ${location.alternateNames.join(', ')}
                  </p>` : ''
                }
                <p style="margin: 8px 0 0 0; color: #718096; font-size: 12px; font-style: italic;">
                  ${location.description || 'Ancient historical location'}
                </p>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          addLayerWithTracking(marker, markersRef, name);
          
        } catch (error) {
          console.error(`Error adding biblical marker for ${name}:`, error);
        }
      }
    });

    console.log(`✅ Added ${markersRef.current.size} location markers`);
  }, [locations, timePeriodRange, locationsLoading, addLayerWithTracking]);

  // Create movement flow visualization with proper clearing
  useEffect(() => {
    if (!mapInstanceRef.current || !locations) return;

    console.log('🌊 Updating movement flows...');

    // Clear existing movement layers properly
    movementLayersRef.current.forEach((layers, key) => {
      try {
        if (layers.path) {
          mapInstanceRef.current.removeLayer(layers.path);
          allLayersRef.current.delete(layers.path);
        }
        if (layers.arrow) {
          mapInstanceRef.current.removeLayer(layers.arrow);
          allLayersRef.current.delete(layers.arrow);
        }
      } catch (e) {
        console.warn(`Failed to remove movement layer ${key}:`, e);
      }
    });
    movementLayersRef.current.clear();

    // Create movement flows for active movements
    activeMovements.forEach((movement, index) => {
      const fromLocation = locations[movement.fromLocation];
      const toLocation = locations[movement.toLocation];

      if (fromLocation && toLocation && fromLocation.coords && toLocation.coords) {
        try {
          const fromCoords = [fromLocation.coords[1], fromLocation.coords[0]];
          const toCoords = [toLocation.coords[1], toLocation.coords[0]];

          // Create animated movement flow
          const getMovementStyle = (type) => {
            const styles = {
              'Exodus': { color: '#e53e3e', weight: 6, opacity: 0.8, dashArray: null },
              'Exile': { color: '#fd9801', weight: 4, opacity: 0.7, dashArray: '10, 5' },
              'Return': { color: '#38a169', weight: 4, opacity: 0.8, dashArray: null },
              'Missionary': { color: '#3182ce', weight: 3, opacity: 0.7, dashArray: '5, 5' },
              'Migration': { color: '#805ad5', weight: 3, opacity: 0.6, dashArray: null },
              'Conquest': { color: '#d53f8c', weight: 5, opacity: 0.8, dashArray: '2, 8' }
            };
            return styles[type] || styles['Migration'];
          };

          const style = getMovementStyle(movement.type);
          
          // Create curved path for better visualization
          const midPoint = [
            (fromCoords[0] + toCoords[0]) / 2 + (Math.random() - 0.5) * 0.5,
            (fromCoords[1] + toCoords[1]) / 2 + (Math.random() - 0.5) * 0.5
          ];

          const pathLine = L.polyline([fromCoords, midPoint, toCoords], {
            color: style.color,
            weight: style.weight,
            opacity: style.opacity,
            dashArray: style.dashArray,
            className: 'movement-path-animated'
          });

          // Add directional arrow
          const arrowIcon = L.divIcon({
            html: `<div style="
              color: ${style.color};
              font-size: 16px;
              transform: rotate(${getArrowRotation(fromCoords, toCoords)}deg);
            ">➤</div>`,
            className: 'movement-arrow',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const arrowMarker = L.marker(midPoint, { icon: arrowIcon });

          // Enhanced popup with more details
          const popupContent = `
            <div style="min-width: 300px; font-family: 'Georgia', serif;">
              <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 16px; font-weight: bold;">
                📍 ${movement.group} Movement
              </h3>
              <div style="background: #f7fafc; padding: 12px; border-radius: 8px; margin: 8px 0;">
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 8px;">
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: #4a5568;">${movement.fromLocation}</div>
                    <div style="font-size: 12px; color: #718096;">Origin</div>
                  </div>
                  <div style="color: ${style.color}; font-size: 24px;">→</div>
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: #4a5568;">${movement.toLocation}</div>
                    <div style="font-size: 12px; color: #718096;">Destination</div>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                  <div><strong>Type:</strong> ${movement.type}</div>
                  <div><strong>Period:</strong> ${movement.timePeriod < 0 ? Math.abs(movement.timePeriod) + ' BCE' : movement.timePeriod + ' CE'}</div>
                </div>
              </div>
              <p style="margin: 8px 0; color: #2d3748; font-size: 14px; line-height: 1.5;">
                ${movement.description}
              </p>
              ${movement.book ? 
                `<div style="margin-top: 12px; padding: 8px; background: #e6fffa; border-radius: 6px; border-left: 4px solid #38a169;">
                  <div style="font-size: 12px; color: #38a169; font-weight: bold;">📖 Biblical Reference</div>
                  <div style="font-size: 13px; color: #2d3748;">${movement.book} ${movement.chapter}:${movement.verse}</div>
                </div>` : ''
              }
              ${movement.historical_cross_references && movement.historical_cross_references.length > 0 ? 
                `<div style="margin-top: 8px; padding: 8px; background: #fff5ee; border-radius: 6px; border-left: 4px solid #fd9801;">
                  <div style="font-size: 12px; color: #fd9801; font-weight: bold;">🏛️ Historical Verification</div>
                  <div style="font-size: 11px; color: #2d3748;">${movement.historical_cross_references[0].source}</div>
                </div>` : ''
              }
            </div>
          `;

          pathLine.bindPopup(popupContent);
          arrowMarker.bindPopup(popupContent);

          // Add layers with tracking
          addLayerWithTracking(pathLine, movementLayersRef, `${movement.id}-path`);
          addLayerWithTracking(arrowMarker, movementLayersRef, `${movement.id}-arrow`);
          
          // Store both in movement layers
          movementLayersRef.current.set(movement.id, {
            path: pathLine,
            arrow: arrowMarker
          });

          // Animate the path
          setTimeout(() => {
            if (mapInstanceRef.current.hasLayer(pathLine)) {
              pathLine.setStyle({ opacity: style.opacity * 1.2 });
            }
          }, 100);

        } catch (error) {
          console.error(`Error adding movement path for ${movement.id}:`, error);
        }
      }
    });
  }, [activeMovements, locations, addLayerWithTracking]);

  // Helper function to calculate arrow rotation
  const getArrowRotation = (from, to) => {
    const dx = to[1] - from[1];
    const dy = to[0] - from[0];
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };

  // Function to be called from MovementList to show movement
  const showMovement = useCallback((movement) => {
    setActiveMovements(prev => {
      const existing = prev.find(m => m.id === movement.id);
      if (existing) {
        return prev; // Already showing
      }
      return [...prev, movement];
    });

    // Center map on movement
    const fromLocation = locations[movement.fromLocation];
    if (fromLocation && fromLocation.coords) {
      mapInstanceRef.current.setView([fromLocation.coords[1], fromLocation.coords[0]], 8);
    }
  }, [locations]);

  const clearMovements = useCallback(() => {
    setActiveMovements([]);
    clearAllLayers();
  }, [clearAllLayers]);

  // Expose functions to parent components
  useEffect(() => {
    if (mapInstanceRef.current) {
      window.biblicalMapActions = {
        showMovement,
        clearMovements,
        clearAllLayers
      };
    }
  }, [showMovement, clearMovements, clearAllLayers]);

  if (locationsError) {
    return (
      <Alert status="error" h="full">
        <AlertIcon />
        Error loading biblical map: {locationsError}
      </Alert>
    );
  }

  return (
    <Box position="relative" w="full" h="full">
      {/* Map Info */}
      <Box
        position="absolute"
        top={4}
        right={4}
        bg="white"
        p={3}
        borderRadius="md"
        shadow="lg"
        zIndex={1000}
      >
        <VStack spacing={2} align="start">
          <Badge colorScheme="blue" variant="solid">Biblical Movements</Badge>
          <Text fontSize="xs" color="gray.600">Active: {activeMovements.length}</Text>
          <Text fontSize="xs" color="gray.600">Locations: {markersRef.current.size}</Text>
          {activeMovements.length > 0 && (
            <Button size="xs" colorScheme="red" variant="outline" onClick={clearMovements}>
              Clear All Movements
            </Button>
          )}
        </VStack>
      </Box>

      {(mapLoading || locationsLoading) && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={1000}
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="lg"
        >
          <Spinner size="lg" color="blue.500" />
          <Text mt={2}>Loading biblical locations...</Text>
        </Box>
      )}
      
      <Box
        ref={mapRef}
        w="full"
        h="full"
        borderRadius="md"
        overflow="hidden"
        bg="gray.100"
      />

      {/* Add CSS for animations */}
      <style jsx>{`
        .movement-path-animated {
          animation: pathPulse 2s infinite;
        }
        
        @keyframes pathPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .movement-arrow {
          animation: arrowBounce 1.5s infinite;
        }
        
        @keyframes arrowBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </Box>
  );
};

export default MapContainer;