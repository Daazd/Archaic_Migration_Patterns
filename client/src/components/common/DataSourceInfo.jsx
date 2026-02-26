// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   VStack,
//   HStack,
//   Heading,
//   Text,
//   Badge,
//   Accordion,
//   AccordionItem,
//   AccordionButton,
//   AccordionPanel,
//   AccordionIcon,
//   useColorModeValue,
//   Link
// } from '@chakra-ui/react';
// import { ExternalLinkIcon } from '@chakra-ui/icons';

// const DataSourceInfo = () => {
//   const [dataSources, setDataSources] = useState(null);
//   const bg = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');

//   useEffect(() => {
//     const fetchDataSources = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/data-sources');
//         const data = await response.json();
//         setDataSources(data.sources);
//       } catch (error) {
//         console.error('Error fetching data sources:', error);
//       }
//     };

//     fetchDataSources();
//   }, []);

//   if (!dataSources) return null;

//   return (
//     <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
//       <VStack spacing={4} align="stretch">
//         <HStack>
//           <Heading size="md" color="blue.500">
//             Data Sources & Verification
//           </Heading>
//           <Badge colorScheme="green" variant="solid">
//             Real Historical Data
//           </Badge>
//         </HStack>

//         <Accordion allowMultiple>
//           <AccordionItem>
//             <AccordionButton>
//               <Box flex="1" textAlign="left">
//                 <Text fontWeight="bold">Biblical Text Sources</Text>
//               </Box>
//               <AccordionIcon />
//             </AccordionButton>
//             <AccordionPanel pb={4}>
//               <VStack align="start" spacing={2}>
//                 <HStack>
//                   <Text fontWeight="semibold">{dataSources.biblical_text.name}</Text>
//                   <Link href={dataSources.biblical_text.url} isExternal color="blue.500">
//                     <ExternalLinkIcon />
//                   </Link>
//                 </HStack>
//                 <Text fontSize="sm" color="gray.600">
//                   {dataSources.biblical_text.description}
//                 </Text>
//                 <Badge colorScheme="blue" variant="outline">
//                   {dataSources.biblical_text.coverage}
//                 </Badge>
//               </VStack>
//             </AccordionPanel>
//           </AccordionItem>

//           <AccordionItem>
//             <AccordionButton>
//               <Box flex="1" textAlign="left">
//                 <Text fontWeight="bold">Geographical Data</Text>
//               </Box>
//               <AccordionIcon />
//             </AccordionButton>
//             <AccordionPanel pb={4}>
//               <VStack align="start" spacing={2}>
//                 <HStack>
//                   <Text fontWeight="semibold">{dataSources.geographical.name}</Text>
//                   <Link href={dataSources.geographical.url} isExternal color="blue.500">
//                     <ExternalLinkIcon />
//                   </Link>
//                 </HStack>
//                 <Text fontSize="sm" color="gray.600">
//                   {dataSources.geographical.description}
//                 </Text>
//                 <Badge colorScheme="orange" variant="outline">
//                   {dataSources.geographical.coverage}
//                 </Badge>
//               </VStack>
//             </AccordionPanel>
//           </AccordionItem>

//           <AccordionItem>
//             <AccordionButton>
//               <Box flex="1" textAlign="left">
//                 <Text fontWeight="bold">Historical Cross-References</Text>
//               </Box>
//               <AccordionIcon />
//             </AccordionButton>
//             <AccordionPanel pb={4}>
//               <VStack align="start" spacing={3}>
//                 {Object.entries(dataSources.historical_records).map(([empire, description]) => (
//                   <Box key={empire}>
//                     <Text fontWeight="semibold" textTransform="capitalize" color="purple.600">
//                       {empire} Records
//                     </Text>
//                     <Text fontSize="sm" color="gray.600">{description}</Text>
//                   </Box>
//                 ))}
//               </VStack>
//             </AccordionPanel>
//           </AccordionItem>
//         </Accordion>

//         <Box p={3} bg="green.50" borderRadius="md" borderLeftWidth="4px" borderLeftColor="green.400">
//           <Text fontSize="sm" color="green.700">
//             <strong>Data Verification:</strong> All movements are extracted from actual biblical text 
//             and cross-referenced with archaeological findings and historical records from ancient 
//             Assyrian, Babylonian, Persian, and Roman sources.
//           </Text>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// export default DataSourceInfo;


import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Collapse,
  Button,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaDatabase, FaMapMarkedAlt, FaBook, FaGlobe, FaUniversity, FaScroll } from 'react-icons/fa';

const DataSourceInfo = () => {
  const [dataSources, setDataSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/data-sources');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.sources) {
          setDataSources(data);
        } else {
          throw new Error('Invalid data source response format');
        }
      } catch (err) {
        console.error('Error fetching data sources:', err);
        setError(err.message);
        
        // Fallback data sources
        setDataSources({
          success: true,
          version: '2.0 - Fallback Mode',
          methodology: 'Static fallback data (API unavailable)',
          sources: {
            biblical_text: {
              name: 'Bible API',
              url: 'https://scripture.api.bible',
              description: 'Biblical text extraction and analysis',
              coverage: '66 books, 783,000+ words',
              usage: 'Movement extraction'
            },
            geographical: {
              name: 'Pleiades Gazetteer',
              url: 'https://pleiades.stoa.org',
              description: 'Ancient world geographical database',
              coverage: '35,000+ ancient places',
              usage: 'Historical coordinates'
            },
            archaeological: {
              name: 'Wikidata',
              url: 'https://query.wikidata.org/sparql',
              description: 'Archaeological sites and civilizations',
              coverage: 'Comprehensive linked data',
              usage: 'Civilization discovery'
            },
            historical_entities: {
              name: 'DBpedia',
              url: 'http://dbpedia.org/sparql',
              description: 'Historical entities and battles',
              coverage: 'Structured Wikipedia data',
              usage: 'Battle and empire data'
            }
          },
          geographic_scope: {
            region: 'Fertile Crescent / Middle East',
            bounding_box: '10°-70°E longitude, 25°-45°N latitude'
          },
          temporal_scope: {
            start: '10,000 BCE',
            end: '1300 CE',
            total_span: '11,300 years'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, []);

  const getSourceIcon = (sourceKey) => {
    const icons = {
      biblical_text: FaBook,
      geographical: FaMapMarkedAlt,
      archaeological: FaDatabase,
      historical_entities: FaGlobe,
      french_historical: FaScroll,
      museum_artifacts: FaUniversity
    };
    return icons[sourceKey] || FaDatabase;
  };

  const getSourceColor = (sourceKey) => {
    const colors = {
      biblical_text: 'blue',
      geographical: 'green',
      archaeological: 'purple',
      historical_entities: 'orange',
      french_historical: 'red',
      museum_artifacts: 'teal'
    };
    return colors[sourceKey] || 'gray';
  };

  if (loading) {
    return (
      <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" />
          <Text>Loading data source information...</Text>
        </VStack>
      </Box>
    );
  }

  if (error && !dataSources) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Error Loading Data Sources</Text>
          <Text fontSize="sm">{error}</Text>
        </Box>
      </Alert>
    );
  }

  const sources = dataSources?.sources || {};
  const sourceEntries = Object.entries(sources);

  return (
    <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={3} textAlign="center">
          <Heading size="lg" color="blue.500">
            📊 Real Data Sources & Methodology
          </Heading>
          <HStack spacing={2} justify="center" flexWrap="wrap">
            <Badge colorScheme="green" variant="solid">
              {dataSources?.version || 'Version 2.0'}
            </Badge>
            <Badge colorScheme="blue" variant="outline">
              {sourceEntries.length} APIs
            </Badge>
            {error && (
              <Badge colorScheme="yellow" variant="solid">
                Fallback Mode
              </Badge>
            )}
          </HStack>
          <Text color="gray.600" maxW="4xl">
            {dataSources?.methodology || 'Dynamic API integration with comprehensive historical coverage'}
          </Text>
        </VStack>

        {/* Coverage Summary */}
        {dataSources?.geographic_scope && dataSources?.temporal_scope && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box p={4} bg="blue.50" borderRadius="md">
              <Heading size="sm" color="blue.700" mb={2}>🌍 Geographic Scope</Heading>
              <Text fontSize="sm" color="blue.600">
                <strong>Region:</strong> {dataSources.geographic_scope.region}
              </Text>
              {dataSources.geographic_scope.bounding_box && (
                <Text fontSize="sm" color="blue.600">
                  <strong>Area:</strong> {dataSources.geographic_scope.bounding_box}
                </Text>
              )}
            </Box>
            
            <Box p={4} bg="green.50" borderRadius="md">
              <Heading size="sm" color="green.700" mb={2}>⏳ Temporal Scope</Heading>
              <Text fontSize="sm" color="green.600">
                <strong>Period:</strong> {dataSources.temporal_scope.start} - {dataSources.temporal_scope.end}
              </Text>
              {dataSources.temporal_scope.total_span && (
                <Text fontSize="sm" color="green.600">
                  <strong>Span:</strong> {dataSources.temporal_scope.total_span}
                </Text>
              )}
            </Box>
          </SimpleGrid>
        )}

        {/* Data Sources Grid */}
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="md" color="gray.700">
              Active Data Sources
            </Heading>
            <Button
              size="sm"
              variant="outline"
              rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'} Details
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {sourceEntries.map(([key, source]) => (
              <Box
                key={key}
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon 
                      as={getSourceIcon(key)} 
                      color={`${getSourceColor(key)}.500`} 
                      boxSize={5} 
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="sm">
                        {source?.name || 'Unknown Source'}
                      </Text>
                      <Badge 
                        colorScheme={getSourceColor(key)} 
                        size="sm"
                        variant="subtle"
                      >
                        {source?.coverage ? 'Active' : 'Limited'}
                      </Badge>
                    </VStack>
                  </HStack>
                  
                  <Text fontSize="xs" color="gray.600" noOfLines={2}>
                    {source?.description || 'Historical data source'}
                  </Text>

                  <Collapse in={isExpanded} animateOpacity>
                    <VStack align="start" spacing={2} pt={2}>
                      {source?.coverage && (
                        <Text fontSize="xs" color="gray.500">
                          <strong>Coverage:</strong> {source.coverage}
                        </Text>
                      )}
                      {source?.usage && (
                        <Text fontSize="xs" color="gray.500">
                          <strong>Usage:</strong> {source.usage}
                        </Text>
                      )}
                      {source?.url && (
                        <Text fontSize="xs" color="blue.500" 
                              cursor="pointer" 
                              onClick={() => window.open(source.url, '_blank')}
                              _hover={{ textDecoration: 'underline' }}>
                          🔗 {source.url}
                        </Text>
                      )}
                    </VStack>
                  </Collapse>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Discovery Process */}
        {dataSources?.discovery_process && (
          <Collapse in={isExpanded} animateOpacity>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Heading size="sm" color="gray.700" mb={3}>
                🔍 Discovery Process
              </Heading>
              <VStack align="start" spacing={1}>
                {Object.entries(dataSources.discovery_process).map(([step, description]) => (
                  <Text key={step} fontSize="xs" color="gray.600">
                    <strong>{step.replace('_', ' ').toUpperCase()}:</strong> {description}
                  </Text>
                ))}
              </VStack>
            </Box>
          </Collapse>
        )}

        {/* Error Alert */}
        {error && (
          <Alert status="warning" size="sm">
            <AlertIcon />
            <Box>
              <Text fontSize="sm" fontWeight="bold">API Connection Issue</Text>
              <Text fontSize="xs">Using fallback data. API: {error}</Text>
            </Box>
          </Alert>
        )}

        {/* Footer */}
        <Box textAlign="center" pt={4} borderTop="1px" borderColor={borderColor}>
          <Text fontSize="xs" color="gray.500">
            All data sourced from verified historical databases and archaeological records.
            {dataSources?.methodology?.includes('Real-time') && ' Updated in real-time from APIs.'}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default DataSourceInfo;