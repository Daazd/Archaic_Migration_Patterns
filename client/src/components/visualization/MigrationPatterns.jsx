import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Heading
} from '@chakra-ui/react';

const MigrationPatterns = ({ selectedEmpire, selectedYear, allCivilizations = {} }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Process real civilization data instead of mock data
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
    
    const earliestStart = allPeriods.length > 0 ? Math.min(...allPeriods.map(p => p[0])) : -10000;
    const latestEnd = allPeriods.length > 0 ? Math.max(...allPeriods.map(p => p[1])) : 2024;
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

  const formatYear = (year) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const migrationData = processMigrationData();

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={6}>
        <Heading size="md" color="orange.400">
          Migration Patterns <Badge colorScheme="orange" fontSize="xs">REAL DATA</Badge>
        </Heading>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat>
            <StatLabel>Major Relocations</StatLabel>
            <StatNumber>{migrationData.majorRelocations}</StatNumber>
            <StatHelpText>Documented movements</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Time Span</StatLabel>
            <StatNumber>{Math.abs(migrationData.timeSpan)} years</StatNumber>
            <StatHelpText>Civilization duration</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Impact Areas</StatLabel>
            <StatNumber>{migrationData.impactAreas}</StatNumber>
            <StatHelpText>Geographic regions</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Documented Relocations */}
        <Box>
          <Text fontWeight="bold" fontSize="sm" mb={3}>Documented Relocations</Text>
          <VStack align="stretch" spacing={3}>
            {migrationData.movements.length > 0 ? (
              migrationData.movements.map((movement, index) => (
                <Box key={movement.name} p={3} bg="gray.50" borderRadius="md">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium">{movement.name}</Text>
                    <Badge colorScheme="blue" fontSize="xs">
                      {movement.period ? formatYear(movement.period[0]) : 'Ancient'}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.600" noOfLines={3}>
                    {movement.description || 'Historical migration documented in ancient sources'}
                  </Text>
                  <Text fontSize="xs" color="green.600" mt={1}>
                    Source: {movement.source || 'Historical APIs'}
                  </Text>
                </Box>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">
                No documented migrations found in current dataset
              </Text>
            )}
          </VStack>
        </Box>

        {/* Sociological Impact */}
        <Box>
          <Text fontWeight="bold" fontSize="sm" mb={3}>Sociological Impact</Text>
          <SimpleGrid columns={2} spacing={3}>
            <Box p={3} border="1px solid" borderColor="red.200" borderRadius="md">
              <Text fontSize="xs" fontWeight="medium" color="red.600">
                Population Displacement
              </Text>
              <Text fontSize="xs" color="gray.600">
                {migrationData.majorRelocations} documented cases
              </Text>
            </Box>
            <Box p={3} border="1px solid" borderColor="blue.200" borderRadius="md">
              <Text fontSize="xs" fontWeight="medium" color="blue.600">
                Cultural Exchange
              </Text>
              <Text fontSize="xs" color="gray.600">
                Cross-regional influence patterns
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default MigrationPatterns;