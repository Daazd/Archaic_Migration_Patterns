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
  Button,
  Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import EmpireTimeline from '../components/visualization/EmpireTimeline';
import MigrationPatterns from '../components/visualization/MigrationPatterns';
import EmpireMapContainer from '../components/map/EmpireMapContainer';

const ExploreMapPage = () => {
  const [selectedEmpire, setSelectedEmpire] = useState(null);
  const [selectedYear, setSelectedYear] = useState(-1000);
  const [allCivilizations, setAllCivilizations] = useState({});
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Fetch civilizations data for the panels
  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        console.log('🔄 ExploreMapPage: Fetching civilizations for panels...');
        const response = await fetch('http://localhost:5000/api/empires/discover');
        if (response.ok) {
          const data = await response.json();
          if (data.civilizations && Array.isArray(data.civilizations)) {
            const civilizationsObj = {};
            data.civilizations.forEach(civ => {
              if (civ && civ.name) {
                civilizationsObj[civ.name] = civ;
              }
            });
            console.log('✅ ExploreMapPage: Loaded', Object.keys(civilizationsObj).length, 'civilizations for panels');
            setAllCivilizations(civilizationsObj);
          }
        }
      } catch (error) {
        console.error('❌ ExploreMapPage: Error fetching civilizations:', error);
      }
    };

    fetchCivilizations();
  }, []);

  return (
    <Box bg={bg} minH="calc(100vh - 80px)">
      <Container maxW="full" py={4}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" color="blue.500" mb={4}>
              Historical Empire Analysis
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="4xl" mx="auto">
              Explore the rise and fall of ancient empires and their migration patterns
            </Text>
          </Box>

          {/* Navigation Buttons */}
          <Flex justify="center" gap={4} mb={4}>
            <Button as={Link} to="/maps" colorScheme="blue" variant="solid">
              📍 Biblical Movements Map
            </Button>
            <Button as={Link} to="/maps/empires" colorScheme="orange" variant="solid">
              🏛️ Empire Timeline Analysis
            </Button>
          </Flex>

          {/* Map Container */}
          <Box height="60vh" borderRadius="lg" overflow="hidden" boxShadow="lg">
            <EmpireMapContainer />
          </Box>

          {/* Bottom Panels with Real Data */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <EmpireTimeline
              onEmpireSelect={setSelectedEmpire}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              allCivilizations={allCivilizations}
            />
            <MigrationPatterns
              selectedEmpire={selectedEmpire}
              selectedYear={selectedYear}
              allCivilizations={allCivilizations}
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ExploreMapPage;