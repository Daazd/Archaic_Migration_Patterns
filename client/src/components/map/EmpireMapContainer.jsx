import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Badge, 
  useColorModeValue, 
  Spinner,
  Button,
  SimpleGrid,
  Heading,
  Progress,
  Alert,
  AlertIcon,
  Tooltip
} from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const EmpireMapContainer = ({ selectedEmpire, selectedYear }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const empireBordersRef = useRef(new Map());
  const battlesRef = useRef(new Map());
  const markersRef = useRef(new Map());
  
  const bg = useColorModeValue('white', 'gray.800');
  const [mapLoading, setMapLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationYear, setAnimationYear] = useState(null);
  
  // State for dynamic API data
  const [allCivilizations, setAllCivilizations] = useState({});
  const [empireData, setEmpireData] = useState(null);
  const [battles, setBattles] = useState([]);
  const [expansionData, setExpansionData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [discoveringCivilizations, setDiscoveringCivilizations] = useState(false);

  // Refs to prevent duplicate calls
  const hasDiscovered = useRef(false);

  const clearAllLayers = () => {
    if (!mapInstanceRef.current) return;
    
    console.log('🧹 Clearing all map layers...');
    
    // Clear all layer maps
    [empireBordersRef, battlesRef, markersRef].forEach(layerMap => {
      layerMap.current.forEach((layer, key) => {
        try {
          if (layer.path) mapInstanceRef.current.removeLayer(layer.path);
          if (layer.arrow) mapInstanceRef.current.removeLayer(layer.arrow);
          if (layer) mapInstanceRef.current.removeLayer(layer);
        } catch (e) {
          console.warn(`Failed to remove layer ${key}:`, e);
        }
      });
      layerMap.current.clear();
    });
    
    console.log('✅ All layers cleared');
  };

  // Initialize map FIRST, before discovering civilizations
  useEffect(() => {
    console.log('🔍 Map initialization useEffect triggered', {
      mapRefCurrent: !!mapRef.current,
      mapInstanceRefCurrent: !!mapInstanceRef.current
    });

    if (!mapRef.current) {
      console.log('❌ mapRef.current is null, waiting...');
      return;
    }

    if (mapInstanceRef.current) {
      console.log('❌ mapInstanceRef.current already exists, skipping...');
      return;
    }

    console.log('🗺️ Initializing map...');
    setMapLoading(true);
    
    try {
      const map = L.map(mapRef.current, {
        center: [35.0, 35.0], // Center on Middle East
        zoom: 5,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap | Real Data: Wikidata, DBpedia, Pleiades APIs',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      console.log('✅ Map initialized successfully');
      setMapLoading(false);

      // Add map click handler
      map.on('click', () => {
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
      console.error('❌ Error initializing empire map:', error);
      setMapLoading(false);
    }
  });

  // Discover civilizations AFTER map is initialized
  useEffect(() => {
    // Wait for map to be ready before discovering civilizations
    if (!mapInstanceRef.current) {
      console.log('⏳ Waiting for map to initialize before discovering civilizations...');
      return;
    }

    const discoverCivilizations = async () => {
      if (hasDiscovered.current) return;
      hasDiscovered.current = true;

      setDiscoveringCivilizations(true);
      setApiError(null);

      try {
        console.log('🔄 Discovering civilizations...');
        
        const response = await fetch('http://localhost:5000/api/empires/discover', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Discovered civilizations:', data);

        if (data.success && data.civilizations) {
          // Convert array to object format
          const civilizationsObj = {};
          let convertedCount = 0;
          
          data.civilizations.forEach((civ, index) => {
            if (civ.name) {
              civilizationsObj[civ.name] = civ;
              convertedCount++;
            }
          });
          
          console.log(`🏛️ Converted ${convertedCount} civilizations to object format`);
          setAllCivilizations(civilizationsObj);
          console.log('✅ setAllCivilizations called with', Object.keys(civilizationsObj).length, 'civilizations');
        }

      } catch (error) {
        console.error('❌ Error discovering civilizations:', error);
        setApiError(error.message);
      } finally {
        setDiscoveringCivilizations(false);
      }
    };

    discoverCivilizations();
  }, [mapLoading]); // Change dependency to mapLoading instead of mapInstanceRef.current

  // Fetch specific empire data when empire is selected
  useEffect(() => {
    const fetchEmpireData = async () => {
      if (!selectedEmpire || !selectedEmpire.name) return;
      
      setApiLoading(true);
      setApiError(null);
      
      try {
        console.log(`🔄 Fetching real data for ${selectedEmpire.name} from APIs...`);
        
        // Only fetch battles for now (since other endpoints return 404)
        const battlesResponse = await fetch(
          `http://localhost:5000/api/empires/battles/${encodeURIComponent(selectedEmpire.name)}`
        );
        
        if (battlesResponse.ok) {
          const battlesResult = await battlesResponse.json();
          if (battlesResult.success) {
            setBattles(battlesResult.data);
            console.log('✅ Battles from APIs:', battlesResult.data);
          }
        }
        
        // Try other endpoints but don't fail if they're not available
        try {
          const empireResponse = await fetch(
            `http://localhost:5000/api/empires/data/${encodeURIComponent(selectedEmpire.name)}`
          );
          if (empireResponse.ok) {
            const empireResult = await empireResponse.json();
            if (empireResult.success) {
              setEmpireData(empireResult.data);
              console.log('✅ Empire data from APIs:', empireResult.data);
            }
          }
        } catch (err) {
          console.log('ℹ️ Empire data endpoint not available');
        }

        try {
          const expansionResponse = await fetch(
            `http://localhost:5000/api/empires/expansion/${encodeURIComponent(selectedEmpire.name)}`
          );
          if (expansionResponse.ok) {
            const expansionResult = await expansionResponse.json();
            if (expansionResult.success) {
              setExpansionData(expansionResult.data);
              console.log('✅ Expansion data from APIs:', expansionResult.data);
            }
          }
        } catch (err) {
          console.log('ℹ️ Expansion data endpoint not available');
        }
        
      } catch (err) {
        setApiError(`Error loading empire data: ${err.message}`);
        console.error('Error fetching empire data from APIs:', err);
      } finally {
        setApiLoading(false);
      }
    };

    fetchEmpireData();
  }, [selectedEmpire?.name]); // Only depend on empire name

  // Render markers when both map AND civilizations are ready
  useEffect(() => {
    console.log('🎯 Marker rendering useEffect triggered');
    console.log('📊 Current state:', {
      hasMap: !!mapInstanceRef.current,
      civilizationsCount: Object.keys(allCivilizations).length,
      mapLoading: mapLoading
    });

    if (!mapInstanceRef.current) {
      console.log('❌ No map instance, skipping marker rendering');
      return;
    }
    
    if (mapLoading) {
      console.log('⏳ Map still loading, skipping marker rendering');
      return;
    }
    
    if (Object.keys(allCivilizations).length === 0) {
      console.log('❌ No civilizations data, skipping marker rendering');
      return;
    }

    console.log(`🗺️ Starting to add ${Object.keys(allCivilizations).length} civilization markers...`);

    // Clear existing markers first
    console.log('🧹 Clearing existing markers...');
    markersRef.current.forEach((marker, key) => {
      try {
        mapInstanceRef.current.removeLayer(marker);
      } catch (e) {
        console.warn(`Failed to remove marker ${key}:`, e);
      }
    });
    markersRef.current.clear();
    console.log('✅ Existing markers cleared');

    // Add markers one by one
    const civilizations = Object.entries(allCivilizations);
    let addedCount = 0;
    let skippedCount = 0;

    console.log('🚀 Starting marker creation loop...');

    civilizations.forEach(([name, civilization], index) => {
      setTimeout(() => {
        try {
          const coords = civilization.coordinates;
          if (!coords || !Array.isArray(coords) || coords.length < 2) {
            console.warn(`❌ Invalid coordinates for ${name}:`, coords);
            skippedCount++;
            return;
          }

          let [lat, lon] = coords;
          
          if (isNaN(lat) || isNaN(lon)) {
            skippedCount++;
            return;
          }
          
          if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            [lon, lat] = coords;
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
              skippedCount++;
              return;
            }
          }

          const marker = L.circleMarker([lat, lon], {
            radius: 6,
            fillColor: civilization.color || '#4682B4',
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          });

          marker.bindPopup(`<b>${name}</b><br/>${civilization.type || 'Civilization'}`);
          marker.addTo(mapInstanceRef.current);
          markersRef.current.set(name, marker);
          addedCount++;

          if (addedCount % 20 === 0) {
            console.log(`📊 Progress: ${addedCount}/${civilizations.length} markers added`);
          }

        } catch (error) {
          console.error(`❌ Failed to add marker for ${name}:`, error);
          skippedCount++;
        }
      }, index * 5); // Faster rendering since map is ready
    });

    setTimeout(() => {
      console.log(`🎉 Marker rendering completed: ${addedCount} added, ${skippedCount} skipped`);
    }, civilizations.length * 5 + 100);

  }, [allCivilizations, mapLoading]); // Depend on both civilizations AND map loading state

  // Animate empire expansion using real API data
  const animateEmpireExpansion = () => {
    if (!mapInstanceRef.current || !expansionData || !expansionData.expansion_phases) return;

    console.log('🎬 Animating expansion using real API data...');
    
    setIsAnimating(true);
    const phases = expansionData.expansion_phases;
    let currentPhase = 0;

    const showNextPhase = () => {
      if (currentPhase >= phases.length) {
        setIsAnimating(false);
        setAnimationYear(null);
        console.log('✅ Animation complete');
        return;
      }

      const phase = phases[currentPhase];
      setAnimationYear(phase.year);

      console.log(`📍 Showing phase: ${phase.description}`);

      // Clear previous borders
      empireBordersRef.current.forEach((border, key) => {
        mapInstanceRef.current.removeLayer(border);
      });
      empireBordersRef.current.clear();

      if (phase.territory_coords && phase.territory_coords.length >= 3) {
        // Create polygon from real coordinate data
        const polygon = L.polygon(phase.territory_coords, {
          color: selectedEmpire.color || '#8B0000',
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.3,
          fillColor: selectedEmpire.color || '#8B0000'
        });

        polygon.bindPopup(`
          <div style="min-width: 300px;">
            <h3 style="color: ${selectedEmpire.color}; font-weight: bold;">
              ${selectedEmpire.name}
            </h3>
            <p><strong>Phase:</strong> ${phase.description}</p>
            <p><strong>Year:</strong> ${phase.year < 0 ? Math.abs(phase.year) + ' BCE' : phase.year + ' CE'}</p>
            ${phase.locations ? `<p><strong>Locations:</strong> ${phase.locations.slice(0, 3).join(', ')}</p>` : ''}
            <div style="margin-top: 8px; padding: 6px; background: #e6fffa; border-radius: 4px; font-size: 12px;">
              📊 Real data from APIs: ${phase.source || 'Pleiades + Wikidata'}
            </div>
          </div>
        `);

        polygon.addTo(mapInstanceRef.current);
        empireBordersRef.current.set(`${selectedEmpire.name}-${currentPhase}`, polygon);

        // Fit map to show expansion
        mapInstanceRef.current.fitBounds(polygon.getBounds(), { padding: [20, 20] });
      }

      currentPhase++;
      setTimeout(showNextPhase, 2500); // 2.5 seconds per phase
    };

    showNextPhase();
  };

  // Show battles from real API data
  const showRealBattles = () => {
    if (!mapInstanceRef.current || !battles || !battles.length) {
      console.log('⚠️ No real battle data available');
      return;
    }

    console.log(`⚔️ Showing ${battles.length} battles from APIs...`);

    // Clear existing battle markers
    battlesRef.current.forEach((marker, key) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    battlesRef.current.clear();

    battles.forEach((battle, index) => {
      if (!battle.coordinates || battle.coordinates.length < 2) return;

      const battleIcon = L.divIcon({
        html: `<div style="
          background: #e53e3e;
          border: 2px solid #3182ce;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        ">⚔</div>`,
        className: 'battle-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const battleMarker = L.marker(battle.coordinates, { icon: battleIcon });

      battleMarker.bindPopup(`
        <div style="min-width: 300px;">
          <h4 style="margin: 0 0 12px 0; color: #2d3748; font-weight: bold;">
            ⚔️ ${battle.name}
          </h4>
          <p><strong>Date:</strong> ${battle.date}</p>
          <p><strong>Location:</strong> ${battle.location}</p>
          <p><strong>Result:</strong> ${battle.result}</p>
          <p><strong>Description:</strong> ${battle.description}</p>
          <div style="margin-top: 8px; padding: 8px; background: #e6fffa; border-radius: 6px;">
            <div style="font-size: 12px; color: #38a169; font-weight: bold;">📚 Data Source</div>
            <div style="font-size: 13px; color: #2d3748;">${battle.source} - Real API data</div>
          </div>
        </div>
      `);

      battleMarker.addTo(mapInstanceRef.current);
      battlesRef.current.set(`${selectedEmpire.name}-battle-${index}`, battleMarker);
    });
  };

  const formatYear = (year) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  // Add this right after the mapRef declaration
  useEffect(() => {
    console.log('🔍 Component mounted, checking mapRef...', {
      mapRefCurrent: mapRef.current,
      mapRefType: typeof mapRef.current
    });
  }, []);

  // Add this helper function to process real civilization data
  const processTimelineData = () => {
    const civilizations = Object.values(allCivilizations);
    
    // Calculate active empires for the selected year
    const activeEmpires = civilizations.filter(civ => {
      if (!civ.period) return false;
      const [start, end] = civ.period;
      return start <= selectedYear && end >= selectedYear;
    });

    // Calculate empire spans for the timeline
    const empireSpans = civilizations.map(civ => {
      if (!civ.period) return null;
      const [start, end] = civ.period;
      const duration = end - start;
      return {
        name: civ.name,
        start,
        end,
        duration,
        color: civ.color || '#4682B4'
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start);

    return { activeEmpires, empireSpans };
  };

  // Add this helper for migration patterns
  const processMigrationData = () => {
    const civilizations = Object.values(allCivilizations);
    
    // Count documented movements/relocations
    const movements = civilizations.filter(civ => 
      civ.description && (
        civ.description.toLowerCase().includes('migrat') ||
        civ.description.toLowerCase().includes('moved') ||
        civ.description.toLowerCase().includes('relocated') ||
        civ.description.toLowerCase().includes('expansion')
      )
    );

    // Calculate time span of all civilizations
    const allPeriods = civilizations
      .filter(civ => civ.period)
      .map(civ => civ.period);
    
    const earliestStart = Math.min(...allPeriods.map(p => p[0]));
    const latestEnd = Math.max(...allPeriods.map(p => p[1]));
    const totalTimeSpan = latestEnd - earliestStart;

    // Count impact areas (unique regions/coordinates)
    const impactAreas = new Set();
    civilizations.forEach(civ => {
      if (civ.coordinates) {
        const region = `${Math.round(civ.coordinates[0]/5)*5},${Math.round(civ.coordinates[1]/5)*5}`;
        impactAreas.add(region);
      }
    });

    return {
      majorRelocations: movements.length,
      timeSpan: totalTimeSpan,
      impactAreas: impactAreas.size,
      movements: movements.slice(0, 2) // Show top 2 movements
    };
  };

  if (mapLoading) {
    return (
      <Box position="relative" height="100%" width="100%">
        {/* Map container */}
        <Box
          ref={mapRef}
          height="100%"
          width="100%"
          position="relative"
          bg="gray.100"
        />
        
        {/* Debug info */}
        <Box position="absolute" top={2} left={2} bg="white" p={2} borderRadius="md" fontSize="sm" zIndex={1000}>
          <Text>Map Ref: {mapRef.current ? '✅' : '❌'}</Text>
          <Text>Map Instance: {mapInstanceRef.current ? '✅' : '❌'}</Text>
          <Text>Map Loading: {mapLoading ? 'Yes' : 'No'}</Text>
          <Text>Civilizations: {Object.keys(allCivilizations).length}</Text>
        </Box>

        {/* Loading overlay */}
        {mapLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255,255,255,0.8)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={999}
          >
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Initializing Empire Map...</Text>
            </VStack>
          </Box>
        )}

        {/* Error display */}
        {apiError && (
          <Box
            position="absolute"
            top={4}
            right={4}
            bg="red.100"
            border="1px solid"
            borderColor="red.300"
            p={3}
            borderRadius="md"
            maxWidth="300px"
            zIndex={1000}
          >
            <Text color="red.700" fontSize="sm">
              Error: {apiError}
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box position="relative" height="100%" width="100%">
      {/* Map Container */}
      <Box
        ref={mapRef}
        w="full"
        h="full"
        borderRadius="md"
        overflow="hidden"
        bg="gray.100"
      />

      {/* Loading Overlay */}
      {(apiLoading || discoveringCivilizations) && (
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
          <VStack>
            <Spinner size="lg" color="orange.500" />
            <Text mt={2}>
              {discoveringCivilizations ? 'Discovering civilizations from APIs...' : 'Loading empire data...'}
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default EmpireMapContainer;