import React, { useState, useEffect } from 'react';
import {
 Box,
 Container,
 VStack,
 HStack,
 Heading,
 Text,
 useColorModeValue,
 SimpleGrid,
 Input,
 InputGroup,
 InputLeftElement,
 Select,
 Button,
 Badge,
 Stat,
 StatLabel,
 StatNumber,
 StatHelpText,
 Card,
 CardBody,
 Flex,
 Divider,
 Spinner,
 Link
} from '@chakra-ui/react';
import { SearchIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { fetchMovements } from '../services/movementsApi';

const MovementsPage = () => {
 const [movements, setMovements] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [timeFilter, setTimeFilter] = useState('all');
 const [typeFilter, setTypeFilter] = useState('all');
 
 const bg = useColorModeValue('gray.50', 'gray.900');
 const cardBg = useColorModeValue('white', 'gray.800');

 useEffect(() => {
   const loadComprehensiveMovements = async () => {
     setLoading(true);
     try {
       const baseMovements = await fetchMovements();
       
       // Comprehensive historical movements dataset
       const comprehensiveMovements = [
         ...baseMovements,
         // Prehistoric Migrations
         {
           id: 'out-of-africa',
           group: 'Early Humans',
           fromLocation: 'Africa',
           toLocation: 'Middle East',
           type: 'Migration',
           timePeriod: -70000,
           description: 'Early human migration out of Africa into the Middle East and beyond',
           source: 'Archaeological Evidence',
           verified: true,
           historical_context: 'Paleolithic Period',
           significance: 'Foundation of human global distribution'
         },
         // Indo-European Migrations
         {
           id: 'indo-european-expansion',
           group: 'Proto-Indo-Europeans',
           fromLocation: 'Pontic-Caspian Steppe',
           toLocation: 'Europe and Asia',
           type: 'Migration',
           timePeriod: -3500,
           description: 'Massive expansion of Indo-European speaking peoples across Eurasia',
           source: 'Linguistic and Archaeological Evidence',
           verified: true,
           historical_context: 'Bronze Age',
           significance: 'Shaped linguistic landscape of Eurasia'
         },
         // Sea Peoples Migrations
         {
           id: 'sea-peoples',
           group: 'Sea Peoples',
           fromLocation: 'Aegean/Anatolia',
           toLocation: 'Eastern Mediterranean',
           type: 'Invasion',
           timePeriod: -1200,
           description: 'Mysterious confederation that attacked Egypt and Levant',
           source: 'Egyptian Records',
           verified: true,
           historical_context: 'Late Bronze Age Collapse',
           significance: 'Contributed to Bronze Age collapse'
         },
         // Greek Colonization
         {
           id: 'greek-colonization',
           group: 'Greek Colonists',
           fromLocation: 'Greek City-States',
           toLocation: 'Mediterranean and Black Sea',
           type: 'Colonization',
           timePeriod: -750,
           description: 'Greek colonization establishing cities across the Mediterranean',
           source: 'Classical Sources',
           verified: true,
           historical_context: 'Archaic Period',
           significance: 'Spread Greek culture and trade networks'
         },
         // Celtic Migrations
         {
           id: 'celtic-expansion',
           group: 'Celtic Tribes',
           fromLocation: 'Central Europe',
           toLocation: 'Western Europe',
           type: 'Migration',
           timePeriod: -500,
           description: 'Celtic expansion across Europe from Hallstatt culture',
           source: 'Archaeological Evidence',
           verified: true,
           historical_context: 'Iron Age',
           significance: 'Established Celtic culture across Europe'
         },
         // Roman Conquests
         {
           id: 'roman-expansion',
           group: 'Roman Legions',
           fromLocation: 'Rome',
           toLocation: 'Mediterranean Basin',
           type: 'Conquest',
           timePeriod: -264,
           description: 'Roman military expansion and colonization',
           source: 'Roman Historical Records',
           verified: true,
           historical_context: 'Roman Republic',
           significance: 'Created largest ancient western empire'
         },
         // Germanic Migrations
         {
           id: 'germanic-migrations',
           group: 'Germanic Tribes',
           fromLocation: 'Northern Europe',
           toLocation: 'Roman Territories',
           type: 'Migration',
           timePeriod: 375,
           description: 'Large-scale Germanic tribal migrations into Roman Empire',
           source: 'Roman and Germanic Sources',
           verified: true,
           historical_context: 'Late Antiquity',
           significance: 'Led to transformation of Western Europe'
         },
         // Hun Invasions
         {
           id: 'hun-invasions',
           group: 'Huns',
           fromLocation: 'Central Asia',
           toLocation: 'Eastern Europe',
           type: 'Invasion',
           timePeriod: 370,
           description: 'Hun invasions under Attila that triggered Germanic migrations',
           source: 'Roman and Byzantine Sources',
           verified: true,
           historical_context: 'Migration Period',
           significance: 'Catalyst for fall of Western Roman Empire'
         },
         // Arab Expansion
         {
           id: 'arab-conquests',
           group: 'Arab Muslims',
           fromLocation: 'Arabian Peninsula',
           toLocation: 'Middle East, North Africa, Iberia',
           type: 'Conquest',
           timePeriod: 634,
           description: 'Rapid Islamic conquests creating vast caliphate',
           source: 'Islamic Chronicles',
           verified: true,
           historical_context: 'Early Islamic Period',
           significance: 'Established Islamic civilization'
         },
         // Viking Expansions
         {
           id: 'viking-expansion',
           group: 'Vikings',
           fromLocation: 'Scandinavia',
           toLocation: 'Europe, North Atlantic, Russia',
           type: 'Expansion',
           timePeriod: 793,
           description: 'Viking raids, trade, and settlement across Europe and beyond',
           source: 'Sagas and Chronicles',
           verified: true,
           historical_context: 'Viking Age',
           significance: 'Connected Scandinavia to wider European world'
         },
         // Magyar Migrations
         {
           id: 'magyar-settlement',
           group: 'Magyars',
           fromLocation: 'Pontic Steppe',
           toLocation: 'Carpathian Basin',
           type: 'Settlement',
           timePeriod: 896,
           description: 'Magyar conquest and settlement of Hungary',
           source: 'Hungarian Chronicles',
           verified: true,
           historical_context: 'Medieval Period',
           significance: 'Established Kingdom of Hungary'
         },
         // Crusades
         {
           id: 'first-crusade',
           group: 'Crusaders',
           fromLocation: 'Western Europe',
           toLocation: 'Holy Land',
           type: 'Crusade',
           timePeriod: 1096,
           description: 'First Crusade leading to conquest of Jerusalem',
           source: 'Medieval Chronicles',
           verified: true,
           historical_context: 'High Middle Ages',
           significance: 'Established Crusader states'
         },
         {
           id: 'fourth-crusade',
           group: 'Crusaders',
           fromLocation: 'Western Europe',
           toLocation: 'Constantinople',
           type: 'Crusade',
           timePeriod: 1204,
           description: 'Fourth Crusade that sacked Constantinople',
           source: 'Byzantine and Western Sources',
           verified: true,
           historical_context: 'High Middle Ages',
           significance: 'Weakened Byzantine Empire'
         },
         // Mongol Conquests
         {
           id: 'mongol-conquests',
           group: 'Mongol Empire',
           fromLocation: 'Mongolia',
           toLocation: 'Eurasia',
           type: 'Conquest',
           timePeriod: 1206,
           description: 'Mongol expansion creating largest contiguous empire',
           source: 'Chinese, Persian, and European Sources',
           verified: true,
           historical_context: 'High Middle Ages',
           significance: 'Connected East and West through trade'
         },
         // Turkic Expansions
         {
           id: 'seljuk-expansion',
           group: 'Seljuk Turks',
           fromLocation: 'Central Asia',
           toLocation: 'Anatolia and Middle East',
           type: 'Conquest',
           timePeriod: 1040,
           description: 'Seljuk Turkish conquest of Anatolia and establishment of sultanate',
           source: 'Islamic and Byzantine Sources',
           verified: true,
           historical_context: 'Medieval Islamic Period',
           significance: 'Turkification of Anatolia'
         },
         // Ottoman Expansion
         {
           id: 'ottoman-expansion',
           group: 'Ottoman Turks',
           fromLocation: 'Northwestern Anatolia',
           toLocation: 'Balkans and Middle East',
           type: 'Conquest',
           timePeriod: 1299,
           description: 'Early Ottoman expansion into Byzantine territories',
           source: 'Ottoman and Byzantine Chronicles',
           verified: true,
           historical_context: 'Late Medieval Period',
           significance: 'Foundation of Ottoman Empire'
         }
       ];
       
       setMovements(comprehensiveMovements);
     } catch (error) {
       console.error('Error loading movements:', error);
     } finally {
       setLoading(false);
     }
   };

   loadComprehensiveMovements();
 }, []);

 // Filter movements based on search and filters
 const filteredMovements = movements.filter(movement => {
   const matchesSearch = !searchQuery || 
     movement.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
     movement.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
     movement.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
     movement.description.toLowerCase().includes(searchQuery.toLowerCase());

   const matchesTime = timeFilter === 'all' || 
     (timeFilter === 'ancient' && movement.timePeriod < 500) ||
     (timeFilter === 'medieval' && movement.timePeriod >= 500 && movement.timePeriod < 1500);

   const matchesType = typeFilter === 'all' || movement.type === typeFilter;

   return matchesSearch && matchesTime && matchesType;
 });

 // Get statistics
 const totalMovements = filteredMovements.length;
 const movementTypes = [...new Set(movements.map(m => m.type))];
 const timeSpan = movements.length > 0 ? 
   Math.max(...movements.map(m => m.timePeriod)) - Math.min(...movements.map(m => m.timePeriod)) : 0;

 const getMovementTypeColor = (type) => {
   const colors = {
     Migration: 'blue',
     Conquest: 'red',
     Colonization: 'green',
     Expansion: 'purple',
     Invasion: 'orange',
     Crusade: 'pink',
     Settlement: 'teal',
     Exile: 'yellow'
   };
   return colors[type] || 'gray';
 };

 const formatYear = (year) => {
   return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
 };

 if (loading) {
   return (
     <Box bg={bg} minH="calc(100vh - 80px)" display="flex" alignItems="center" justifyContent="center">
       <VStack>
         <Spinner size="xl" color="blue.500" />
         <Text>Loading comprehensive historical movements...</Text>
       </VStack>
     </Box>
   );
 }

 return (
   <Box bg={bg} minH="calc(100vh - 80px)">
     <Container maxW="7xl" py={8}>
       <VStack spacing={8} align="stretch">
         {/* Header */}
         <Box textAlign="center">
           <Heading size="xl" color="blue.500" mb={4}>
             Comprehensive Historical Movements
           </Heading>
           <Text color="gray.600" fontSize="lg" maxW="4xl" mx="auto">
             Explore all documented movements of peoples and civilizations from prehistoric 
             migrations to medieval conquests, including biblical narratives, classical 
             expansions, barbarian migrations, and crusading movements.
           </Text>
         </Box>

         {/* Statistics */}
         <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
           <Stat bg={cardBg} p={4} borderRadius="lg">
             <StatLabel>Total Movements</StatLabel>
             <StatNumber>{totalMovements}</StatNumber>
             <StatHelpText>Documented migrations</StatHelpText>
           </Stat>
           <Stat bg={cardBg} p={4} borderRadius="lg">
             <StatLabel>Movement Types</StatLabel>
             <StatNumber>{movementTypes.length}</StatNumber>
             <StatHelpText>Different categories</StatHelpText>
           </Stat>
           <Stat bg={cardBg} p={4} borderRadius="lg">
             <StatLabel>Time Span</StatLabel>
             <StatNumber>{Math.round(timeSpan / 1000)}k</StatNumber>
             <StatHelpText>Years of history</StatHelpText>
           </Stat>
           <Stat bg={cardBg} p={4} borderRadius="lg">
             <StatLabel>Verified Sources</StatLabel>
             <StatNumber>{movements.filter(m => m.verified).length}</StatNumber>
             <StatHelpText>Historical records</StatHelpText>
           </Stat>
         </SimpleGrid>

         {/* Filters */}
         <Card bg={cardBg}>
           <CardBody>
             <Heading size="md" mb={4}>Search & Filter Movements</Heading>
             <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
               <InputGroup>
                 <InputLeftElement pointerEvents="none">
                   <SearchIcon color="gray.300" />
                 </InputLeftElement>
                 <Input
                   placeholder="Search movements, peoples, or locations..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </InputGroup>
               
               <Select
                 value={timeFilter}
                 onChange={(e) => setTimeFilter(e.target.value)}
               >
                 <option value="all">All Time Periods</option>
                 <option value="ancient">Ancient (Before 500 CE)</option>
                 <option value="medieval">Medieval (500-1500 CE)</option>
               </Select>
               
               <Select
                 value={typeFilter}
                 onChange={(e) => setTypeFilter(e.target.value)}
               >
                 <option value="all">All Movement Types</option>
                 {movementTypes.map(type => (
                   <option key={type} value={type}>{type}</option>
                 ))}
               </Select>
             </SimpleGrid>
           </CardBody>
         </Card>

         {/* Movements List */}
         <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
           {filteredMovements.map(movement => (
             <Card key={movement.id} bg={cardBg} _hover={{ shadow: 'md' }} transition="all 0.2s">
               <CardBody>
                 <VStack align="stretch" spacing={3}>
                   <HStack justify="space-between" align="start">
                     <Heading size="sm" color="blue.600">
                       {movement.group}
                     </Heading>
                     <VStack spacing={1} align="end">
                       <Badge colorScheme={getMovementTypeColor(movement.type)}>
                         {movement.type}
                       </Badge>
                       {movement.verified && (
                         <Badge colorScheme="green" size="sm">✓ Verified</Badge>
                       )}
                     </VStack>
                   </HStack>

                   <HStack spacing={2} fontSize="sm" color="gray.600">
                     <Text fontWeight="semibold">{movement.fromLocation}</Text>
                     <Text>→</Text>
                     <Text fontWeight="semibold">{movement.toLocation}</Text>
                   </HStack>

                   <HStack spacing={4} fontSize="sm" color="gray.500">
                     <Text>📅 {formatYear(movement.timePeriod)}</Text>
                     <Text>📚 {movement.source}</Text>
                   </HStack>

                   <Text fontSize="sm" color="gray.700" lineHeight="tall">
                     {movement.description}
                   </Text>

                   {movement.historical_context && (
                     <Box p={2} bg="blue.50" borderRadius="md">
                       <Text fontSize="xs" color="blue.700">
                         <strong>Context:</strong> {movement.historical_context}
                       </Text>
                     </Box>
                   )}

                   {movement.significance && (
                     <Box p={2} bg="green.50" borderRadius="md">
                       <Text fontSize="xs" color="green.700">
                         <strong>Significance:</strong> {movement.significance}
                       </Text>
                     </Box>
                   )}

                   <Divider />

                   <HStack justify="space-between" align="center">
                     <Text fontSize="xs" color="gray.400">
                       Historical Impact: {movement.significance ? 'High' : 'Moderate'}
                     </Text>
                     <Button 
                       size="xs" 
                       colorScheme="blue" 
                       variant="outline"
                       rightIcon={<ExternalLinkIcon />}
                       as={Link}
                       href={`/biblical-movements?focus=${movement.id}`}
                     >
                       View on Map
                     </Button>
                   </HStack>
                 </VStack>
               </CardBody>
             </Card>
           ))}
         </SimpleGrid>

         {filteredMovements.length === 0 && (
           <Box textAlign="center" py={12}>
             <Text color="gray.500" fontSize="lg">
               No movements found matching your search criteria.
             </Text>
             <Button 
               mt={4} 
               colorScheme="blue" 
               variant="outline"
               onClick={() => {
                 setSearchQuery('');
                 setTimeFilter('all');
                 setTypeFilter('all');
               }}
             >
               Clear All Filters
             </Button>
           </Box>
         )}
       </VStack>
     </Container>
   </Box>
 );
};

export default MovementsPage;