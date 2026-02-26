import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';
import EmpireTimeline from '../components/visualization/EmpireTimeline';
import MigrationPatterns from '../components/visualization/MigrationPatterns';

const EmpiresPage = () => {
  const [selectedEmpire, setSelectedEmpire] = useState(null);
  const [selectedYear, setSelectedYear] = useState(-1000);
  const [allCivilizations, setAllCivilizations] = useState({});
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch civilizations data
  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/empires/discover');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const civilizationsObj = {};
            data.forEach(civ => {
              if (civ && civ.name) {
                civilizationsObj[civ.name] = civ;
              }
            });
            setAllCivilizations(civilizationsObj);
          }
        }
      } catch (error) {
        console.error('Error fetching civilizations:', error);
      }
    };

    fetchCivilizations();
  }, []);

  return (
    <Box bg={bg} minH="calc(100vh - 80px)">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" color="blue.500" mb={4}>
              Empire Analysis & Migration Patterns
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="4xl" mx="auto">
              Explore how the rise and fall of ancient empires shaped migration patterns, 
              cultural exchanges, and sociological developments across the Fertile Crescent 
              and beyond, as documented in biblical and historical texts.
            </Text>
          </Box>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Empire Timeline */}
            <EmpireTimeline
              onEmpireSelect={setSelectedEmpire}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              allCivilizations={allCivilizations}
            />

            {/* Migration Patterns */}
            <MigrationPatterns
              selectedEmpire={selectedEmpire}
              selectedYear={selectedYear}
              allCivilizations={allCivilizations}
            />
          </SimpleGrid>

          {/* Analysis Summary */}
          {selectedEmpire && (
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={cardBorderColor}
            >
              <Heading size="md" mb={4} color="blue.500">
                Historical Context: {selectedEmpire.name}
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                {selectedEmpire.impact} This empire's policies and actions had lasting 
                effects on population movements, cultural development, and religious practices 
                throughout the ancient Near East. The biblical and historical records provide 
                valuable insights into how these large-scale political changes affected 
                ordinary people and established migration patterns that would influence 
                the region for centuries to come.
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EmpiresPage;