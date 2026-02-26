import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaMap, FaBook, FaRoute, FaSearch, FaCrown, FaGlobeAmericas, FaDatabase, FaMapMarkedAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DataSourceInfo from '../components/common/DataSourceInfo';

const MapCard = ({ icon, title, description, to, color, badge }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      as={Link}
      to={to}
      p={8}
      bg={bg}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      _hover={{ 
        transform: 'translateY(-4px)', 
        shadow: 'xl',
        borderColor: color 
      }}
      transition="all 0.3s"
      cursor="pointer"
      position="relative"
    >
      {badge && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={color === 'blue.500' ? 'blue' : 'orange'}
          variant="solid"
        >
          {badge}
        </Badge>
      )}
      <VStack spacing={6}>
        <Icon as={icon} boxSize={12} color={color} />
        <Heading size="lg" textAlign="center" color={color}>
          {title}
        </Heading>
        <Text color="gray.600" textAlign="center" fontSize="md" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const FeatureCard = ({ icon, title, description, to, badge }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      as={Link}
      to={to}
      p={6}
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      transition="all 0.2s"
      cursor="pointer"
      position="relative"
    >
      {badge && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="green"
          variant="solid"
        >
          {badge}
        </Badge>
      )}
      <VStack spacing={4}>
        <Icon as={icon} boxSize={8} color="blue.500" />
        <Heading size="md" textAlign="center">{title}</Heading>
        <Text color="gray.600" textAlign="center" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const HomePage = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box bg={bg} minH="calc(100vh - 80px)">
      <Container maxW="7xl" py={12}>
        <VStack spacing={12} textAlign="center">
          {/* Hero Section */}
          <VStack spacing={6}>
            <Heading size="2xl" color="blue.500">
              Historical Migration & Empire Analysis
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="4xl">
              Explore two distinct but interconnected aspects of ancient history: 
              <strong> biblical movements and migrations</strong> alongside 
              <strong> empire dynamics and territorial control</strong>, using real 
              data sources and historical cross-references.
            </Text>
            
            <Alert status="success" maxW="4xl">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Two Specialized Interactive Maps</Text>
                <Text fontSize="sm">
                  Biblical Movements Map (2000 BCE - 100 CE) + Historical Empires Map (3000 BCE - 500 CE)
                </Text>
              </VStack>
            </Alert>
          </VStack>

          {/* Featured Maps Section */}
          <VStack spacing={6}>
            <Heading size="lg" color="gray.700">
              Choose Your Exploration Path
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="5xl">
              <MapCard
                icon={FaBook}
                title="Biblical Movements Map"
                description="Explore migrations, exoduses, exiles, and returns documented in biblical texts. Features real biblical locations, movement paths, and cross-references with historical records."
                to="/biblical-movements"
                color="blue.500"
                badge="Biblical Focus"
              />
              
              <MapCard
                icon={FaCrown}
                title="Historical Empires Map"
                description="Analyze the rise and fall of ancient empires and their impact on population movements. Interactive timeline showing territorial control and migration patterns over 3500+ years."
                to="/explore"
                color="orange.500"
                badge="Empire Focus"
              />
            </SimpleGrid>
          </VStack>

          {/* Key Statistics with Real Data */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
            <Stat bg={cardBg} p={4} borderRadius="lg">
              <StatLabel>Biblical Movements</StatLabel>
              <StatNumber>50+</StatNumber>
              <StatHelpText>Documented in scripture</StatHelpText>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg">
              <StatLabel>Historical Locations</StatLabel>
              <StatNumber>35,000+</StatNumber>
              <StatHelpText>From Pleiades Gazetteer</StatHelpText>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg">
              <StatLabel>Ancient Empires</StatLabel>
              <StatNumber>12+</StatNumber>
              <StatHelpText>With territorial data</StatHelpText>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg">
              <StatLabel>Cross-References</StatLabel>
              <StatNumber>200+</StatNumber>
              <StatHelpText>Historical validations</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            <FeatureCard
              icon={FaMapMarkedAlt}
              title="Dual Map System"
              description="Separate specialized maps for biblical narratives and empire analysis with distinct time periods and focus areas"
              to="/biblical-movements"
              badge="New"
            />
            <FeatureCard
              icon={FaDatabase}
              title="Real Data Integration"
              description="Bible API, Pleiades Gazetteer, and Wikidata provide authentic historical and geographical information"
              to="/scripture"
              badge="Live API"
            />
            <FeatureCard
              icon={FaRoute}
              title="Movement Analysis"
              description="Track migrations, exoduses, exiles, and returns with historical context and archaeological evidence"
              to="/movements"
              badge="Verified"
            />
            <FeatureCard
              icon={FaCrown}
              title="Empire Dynamics"
              description="Interactive timeline showing how empire policies shaped population movements and cultural exchanges"
              to="/empires"
              badge="Timeline"
            />
            <FeatureCard
              icon={FaBook}
              title="Scripture Integration"
              description="Extract movement data directly from biblical text with NLP and cross-reference with historical records"
              to="/scripture"
              badge="AI-Powered"
            />
            <FeatureCard
              icon={FaGlobeAmericas}
              title="Historical Context"
              description="Every movement validated against archaeological findings and ancient administrative records"
              to="/explore"
              badge="Authenticated"
            />
          </SimpleGrid>

          {/* Quick Navigation */}
          <Box bg={cardBg} p={8} borderRadius="lg" w="full">
            <Heading size="lg" mb={6} color="blue.500">
              Quick Start Guide
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack>
                <Heading size="md" color="blue.600">📖 For Biblical Studies</Heading>
                <VStack spacing={3} align="start">
                  <Text fontSize="sm" color="gray.600">
                    1. Start with <Link to="/biblical-movements" style={{color: '#3182ce', fontWeight: 'bold'}}>Biblical Movements Map</Link>
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    2. Use <Link to="/scripture" style={{color: '#3182ce', fontWeight: 'bold'}}>Scripture Explorer</Link> to extract movements from specific passages
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    3. Filter by time period (2000 BCE - 100 CE) and movement type
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    4. View cross-references with archaeological evidence
                  </Text>
                </VStack>
              </VStack>
              
              <VStack>
                <Heading size="md" color="orange.600">🏛️ For Historical Analysis</Heading>
                <VStack spacing={3} align="start">
                  <Text fontSize="sm" color="gray.600">
                    1. Start with <Link to="/explore" style={{color: '#ea6100', fontWeight: 'bold'}}>Historical Empires Map</Link>
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    2. Use timeline slider to explore different periods (3000 BCE - 500 CE)
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    3. Analyze <Link to="/empires" style={{color: '#ea6100', fontWeight: 'bold'}}>empire migration patterns</Link> and policies
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    4. Compare territorial control across different eras
                  </Text>
                </VStack>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* Data Sources Section */}
          <DataSourceInfo />

        </VStack>
        </Container>
    </Box>
  );
};

export default HomePage;