import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Button,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Tooltip,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, CloseIcon } from '@chakra-ui/icons';
import { useFilter } from '../../contexts/FilterContext';
import { fetchMovements } from '../../services/movementsApi';

const MovementList = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMovements, setActiveMovements] = useState([]);
  
  const { applyFilters } = useFilter();
  
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');

  // Load movements data
  useEffect(() => {
    const loadMovements = async () => {
      setLoading(true);
      try {
        const data = await fetchMovements();
        
        // Add biblical movements with enhanced data
        const biblicalMovements = [
          {
            id: 'exodus-egypt-canaan',
            group: 'Israelites',
            fromLocation: 'Egypt',
            toLocation: 'Canaan',
            type: 'Exodus',
            timePeriod: -1446,
            description: 'The great exodus from Egyptian bondage under Moses\' leadership, crossing the Red Sea and wandering in the wilderness for 40 years',
            book: 'Exodus',
            chapter: 12,
            verse: 31,
            source: 'Biblical narrative + Archaeological evidence',
            verified: true,
            historical_context: 'Late Bronze Age collapse period',
            archaeological_notes: 'Archaeological evidence supports major population movements in this period',
            participants: '600,000+ Israelites',
            duration: '40 years',
            route: 'Egypt → Sinai Peninsula → Jordan → Canaan'
          },
          {
            id: 'abraham-ur-canaan',
            group: 'Abraham and household',
            fromLocation: 'Ur',
            toLocation: 'Canaan',
            type: 'Migration',
            timePeriod: -2000,
            description: 'Abraham\'s journey from Ur of the Chaldeans to the promised land at God\'s calling',
            book: 'Genesis',
            chapter: 12,
            verse: 1,
            source: 'Biblical narrative + Archaeological context',
            verified: true,
            historical_context: 'Middle Bronze Age migrations',
            archaeological_notes: 'Period of Amorite migrations corroborates narrative',
            participants: 'Abraham, Sarah, Lot, and their households',
            duration: 'Lifetime journey',
            route: 'Ur → Haran → Canaan'
          },
          {
            id: 'babylonian-exile-597',
            group: 'Judean Elite',
            fromLocation: 'Jerusalem',
            toLocation: 'Babylon',
            type: 'Exile',
            timePeriod: -597,
            description: 'First deportation of Judean nobility and skilled workers to Babylon by Nebuchadnezzar',
            book: '2 Kings',
            chapter: 24,
            verse: 14,
            source: 'Biblical narrative + Babylonian Chronicles',
            verified: true,
            historical_context: 'Neo-Babylonian expansion',
            archaeological_notes: 'Babylonian Chronicles confirm siege and deportation',
            participants: '10,000 nobles and craftsmen',
            duration: '70 years',
            route: 'Jerusalem → Babylon',
            historical_cross_references: [
              {
                source: 'Babylonian Chronicles',
                reference: 'Chronicle 5 (BM 21946)',
                content: 'Records Nebuchadnezzar\'s siege of Jerusalem in 597 BCE',
                verification: 'Confirms biblical chronology and deportation numbers'
              }
            ]
          },
          {
            id: 'babylonian-exile-586',
            group: 'Judean Population',
            fromLocation: 'Jerusalem',
            toLocation: 'Babylon',
            type: 'Exile',
            timePeriod: -586,
            description: 'Final destruction of Jerusalem and mass deportation after failed rebellion',
            book: '2 Kings',
            chapter: 25,
            verse: 11,
            source: 'Biblical narrative + Archaeological evidence',
            verified: true,
            historical_context: 'Fall of Kingdom of Judah',
            archaeological_notes: 'Destruction layers in Jerusalem confirm biblical account',
            participants: 'Majority of Judean population',
            duration: '70 years total',
            route: 'Jerusalem → Babylon'
          },
          {
            id: 'assyrian-exile-722',
            group: 'Northern Kingdom of Israel',
            fromLocation: 'Samaria',
            toLocation: 'Assyria',
            type: 'Exile',
            timePeriod: -722,
            description: 'Assyrian deportation of the Northern Kingdom resulting in the "Lost Tribes of Israel"',
            book: '2 Kings',
            chapter: 17,
            verse: 6,
            source: 'Biblical narrative + Assyrian records',
            verified: true,
            historical_context: 'Assyrian imperial expansion',
            archaeological_notes: 'Assyrian royal inscriptions document deportation policy',
            participants: '27,290 Israelites (per Assyrian records)',
            duration: 'Permanent',
            route: 'Samaria → Various Assyrian provinces',
            historical_cross_references: [
              {
                source: 'Assyrian Royal Inscriptions',
                reference: 'Sargon II Prism',
                content: 'Records deportation of 27,290 Israelites from Samaria',
                verification: 'Corroborates biblical account with specific numbers'
              }
            ]
          },
          {
            id: 'return-from-exile-538',
            group: 'Jewish Exiles',
            fromLocation: 'Babylon',
            toLocation: 'Jerusalem',
            type: 'Return',
            timePeriod: -538,
            description: 'Return of Jewish exiles under Cyrus the Great\'s restoration decree',
            book: 'Ezra',
            chapter: 1,
            verse: 1,
            source: 'Biblical narrative + Persian administrative records',
            verified: true,
            historical_context: 'Persian restoration policy',
            archaeological_notes: 'Cyrus Cylinder confirms policy of returning displaced peoples',
            participants: '42,360 returnees (first wave)',
            duration: 'Multiple waves over decades',
            route: 'Babylon → Jerusalem',
            historical_cross_references: [
              {
                source: 'Cyrus Cylinder',
                reference: 'BM 90920 (British Museum)',
                content: 'Cyrus\'s policy of returning displaced peoples to their homelands',
                verification: 'Supports biblical account of return and temple restoration'
              }
            ]
          },
          {
            id: 'christian-dispersion-35',
            group: 'Early Christians',
            fromLocation: 'Jerusalem',
            toLocation: 'Judea and Samaria',
            type: 'Missionary',
            timePeriod: 35,
            description: 'Dispersion of Christians following persecution after Stephen\'s martyrdom',
            book: 'Acts',
            chapter: 8,
            verse: 1,
            source: 'Biblical narrative + Early Christian writings',
            verified: true,
            historical_context: 'Early Roman period',
            archaeological_notes: 'Early Christian inscriptions found throughout region',
            participants: 'Early Christian community',
            duration: 'Ongoing expansion',
            route: 'Jerusalem → Judea → Samaria → Gentile regions'
          },
          {
            id: 'paul-missionary-journeys',
            group: 'Paul and companions',
            fromLocation: 'Antioch',
            toLocation: 'Mediterranean regions',
            type: 'Missionary',
            timePeriod: 47,
            description: 'Paul\'s missionary journeys establishing Christian churches across the Roman Empire',
            book: 'Acts',
            chapter: 13,
            verse: 4,
            source: 'Biblical narrative + Archaeological evidence',
            verified: true,
            historical_context: 'Roman period missionary expansion',
            archaeological_notes: 'Roman road network facilitated travel; archaeological evidence of early Christian communities',
            participants: 'Paul, Barnabas, Silas, Timothy, and others',
            duration: '20+ years of journeys',
            route: 'Antioch → Cyprus → Asia Minor → Macedonia → Greece → Rome'
          }
        ];
        
        setMovements([...data, ...biblicalMovements]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMovements();
  }, []);

  // Apply filters and search
  const filteredMovements = applyFilters(movements);
  const searchedMovements = filteredMovements.filter(movement => {
    const query = searchQuery.toLowerCase();
    return (
      movement.group?.toLowerCase().includes(query) ||
      movement.fromLocation?.toLowerCase().includes(query) ||
      movement.toLocation?.toLowerCase().includes(query) ||
      movement.description?.toLowerCase().includes(query) ||
      movement.type?.toLowerCase().includes(query)
    );
  });

  const handleShowMovement = (movement) => {
    // Add to active movements
    setActiveMovements(prev => {
      const existing = prev.find(m => m.id === movement.id);
      if (existing) return prev;
      return [...prev, movement];
    });

    // Trigger map visualization
    if (window.biblicalMapActions) {
      window.biblicalMapActions.showMovement(movement);
    }
  };

  const handleRemoveMovement = (movementId) => {
    setActiveMovements(prev => prev.filter(m => m.id !== movementId));
  };

  const handleClearAll = () => {
    setActiveMovements([]);
    if (window.biblicalMapActions) {
      window.biblicalMapActions.clearMovements();
    }
  };

  const getMovementTypeColor = (type) => {
    const colors = {
      Exodus: 'red',
      Exile: 'orange', 
      Return: 'green',
      Missionary: 'blue',
      Conquest: 'purple',
      Migration: 'teal'
    };
    return colors[type] || 'gray';
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" color="blue.500" />
        <Text mt={2}>Loading biblical movements...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" m={4}>
        <AlertIcon />
        Error loading movements: {error}
      </Alert>
    );
  }

  return (
    <Box bg={bg} h="full" display="flex" flexDirection="column">
      <Box p={4} borderBottom="1px" borderColor={borderColor} flexShrink={0}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading size="md" color="gray.700">
            Biblical Movements
          </Heading>
          <Badge colorScheme="blue" variant="solid">
            Real Data
          </Badge>
        </Flex>
        
        <InputGroup size="sm" mb={3}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search biblical movements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {/* Active Movements Display */}
        {activeMovements.length > 0 && (
          <Box mb={3} p={2} bg={activeBg} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="bold" color="blue.700">
                Active on Map ({activeMovements.length})
              </Text>
              <Button size="xs" onClick={handleClearAll} variant="ghost" colorScheme="blue">
                Clear All
              </Button>
            </HStack>
            <VStack spacing={1} align="stretch">
              {activeMovements.map(movement => (
                <HStack key={movement.id} justify="space-between" fontSize="xs">
                  <Text noOfLines={1}>{movement.group}: {movement.fromLocation} → {movement.toLocation}</Text>
                  <IconButton
                    size="xs"
                    icon={<CloseIcon />}
                    onClick={() => handleRemoveMovement(movement.id)}
                    variant="ghost"
                    colorScheme="red"
                  />
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        <Text fontSize="xs" color="gray.500" mb={2}>
         {searchedMovements.length} biblical movements found • Click to visualize on map
       </Text>
     </Box>

     {/* Scrollable movement list */}
     <Box flex={1} overflowY="auto" p={2}>
       <VStack spacing={1} align="stretch">
         {searchedMovements.map(movement => {
           const isActive = activeMovements.some(m => m.id === movement.id);
           
           return (
             <Box
               key={movement.id}
               p={3}
               borderRadius="md"
               borderWidth="1px"
               borderColor={isActive ? 'blue.400' : borderColor}
               bg={isActive ? activeBg : 'transparent'}
               _hover={{ bg: hoverBg, cursor: 'pointer', shadow: 'sm', borderColor: 'blue.300' }}
               onClick={() => handleShowMovement(movement)}
               transition="all 0.2s"
               position="relative"
             >
               {isActive && (
                 <Box
                   position="absolute"
                   top={2}
                   right={2}
                   w={2}
                   h={2}
                   bg="blue.500"
                   borderRadius="full"
                 />
               )}
               
               <Flex alignItems="center" justifyContent="space-between" mb={2}>
                 <Text fontWeight="bold" fontSize="sm" color="gray.700" noOfLines={1}>
                   {movement.group}
                 </Text>
                 <HStack spacing={1}>
                   <Badge
                     colorScheme={getMovementTypeColor(movement.type)}
                     size="sm"
                   >
                     {movement.type}
                   </Badge>
                   {movement.verified && (
                     <Badge colorScheme="green" size="sm" variant="outline">
                       ✓
                     </Badge>
                   )}
                 </HStack>
               </Flex>
               
               <Text fontSize="xs" color="gray.500" mb={1}>
                 <strong>{movement.fromLocation}</strong> → <strong>{movement.toLocation}</strong>
               </Text>
               
               <HStack spacing={4} fontSize="xs" color="gray.400" mb={2}>
                 <Text>
                   📅 {movement.timePeriod < 0 
                     ? `${Math.abs(movement.timePeriod)} BCE` 
                     : `${movement.timePeriod} CE`
                   }
                 </Text>
                 {movement.participants && (
                   <Text>👥 {movement.participants}</Text>
                 )}
               </HStack>
               
               <Text fontSize="xs" color="gray.600" noOfLines={2} mb={2}>
                 {movement.description}
               </Text>

               {/* Enhanced details for biblical movements */}
               {movement.route && (
                 <Box mt={2} p={2} bg="purple.50" borderRadius="sm">
                   <Text fontSize="xs" color="purple.700">
                     🗺️ <strong>Route:</strong> {movement.route}
                   </Text>
                 </Box>
               )}

               {movement.duration && (
                 <Box mt={1} p={2} bg="orange.50" borderRadius="sm">
                   <Text fontSize="xs" color="orange.700">
                     ⏱️ <strong>Duration:</strong> {movement.duration}
                   </Text>
                 </Box>
               )}

               {/* Source information */}
               <Flex justify="space-between" align="center" mt={2}>
                 <Text fontSize="xs" color="gray.400">
                   📖 {movement.book} {movement.chapter}:{movement.verse}
                 </Text>
                 <Button
                   size="xs"
                   leftIcon={<ViewIcon />}
                   colorScheme={isActive ? "green" : "blue"}
                   variant={isActive ? "solid" : "ghost"}
                   onClick={(e) => {
                     e.stopPropagation();
                     handleShowMovement(movement);
                   }}
                 >
                   {isActive ? "On Map" : "Show"}
                 </Button>
               </Flex>

               {/* Historical cross-references */}
               {movement.historical_cross_references && movement.historical_cross_references.length > 0 && (
                 <Box mt={2} p={2} bg="green.50" borderRadius="sm">
                   <Text fontSize="xs" color="green.700" fontWeight="bold">
                     🏛️ Historical Verification:
                   </Text>
                   <Text fontSize="xs" color="green.600">
                     {movement.historical_cross_references[0].source} - {movement.historical_cross_references[0].reference}
                   </Text>
                 </Box>
               )}
             </Box>
           );
         })}
         
         {searchedMovements.length === 0 && (
           <Box p={4} textAlign="center">
             <Text color="gray.500" fontSize="sm">
               No biblical movements found matching your search criteria
             </Text>
           </Box>
         )}
       </VStack>
     </Box>
   </Box>
 );
};

export default MovementList;