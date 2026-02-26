import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Heading
} from '@chakra-ui/react';

const EmpireTimeline = ({ onEmpireSelect, selectedYear, onYearChange, allCivilizations = {} }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const formatYear = (year) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  // Process real civilization data
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
        color: civ.color || '#4682B4',
        capital: civ.capital || 'Unknown',
        period: civ.period,
        description: civ.description || 'Ancient civilization'
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start);

    return { activeEmpires, empireSpans };
  };

  const { activeEmpires, empireSpans } = processTimelineData();

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
        <Heading size="md" color="blue.400">
          Empire Timeline: {formatYear(selectedYear)} <Badge colorScheme="blue" fontSize="xs">REAL DATA</Badge>
        </Heading>

        <Text fontSize="sm" color="gray.600">
          Drag to explore different time periods
        </Text>

        {/* Timeline Slider */}
        <Box px={4}>
          <Slider
            value={selectedYear}
            min={-10000}
            max={2024}
            step={50}
            onChange={onYearChange}
            colorScheme="blue"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
          
          {/* Timeline Labels */}
          <HStack justify="space-between" mt={2} fontSize="xs" color="gray.500">
            <Text>10000 BCE</Text>
            <Text>5000 BCE</Text>
            <Text>1000 BCE</Text>
            <Text>0</Text>
            <Text>500 CE</Text>
          </HStack>
        </Box>

        {/* Active Empires */}
        <Box>
          <Text fontWeight="bold" mb={3}>
            Active Empires in {formatYear(selectedYear)}:
          </Text>
          {activeEmpires.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
              {activeEmpires.slice(0, 5).map(empire => (
                <Box
                  key={empire.name}
                  p={3}
                  borderWidth="1px"
                  borderColor="blue.200"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => onEmpireSelect(empire)}
                >
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Badge colorScheme="blue" variant="solid" fontSize="xs">
                        {empire.name}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {formatYear(empire.period[0])} - {formatYear(empire.period[1])}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      <strong>Capital:</strong> {empire.capital}
                    </Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={2}>
                      {empire.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
              {activeEmpires.length > 5 && (
                <Text fontSize="xs" color="gray.500">
                  +{activeEmpires.length - 5} more empires...
                </Text>
              )}
            </SimpleGrid>
          ) : (
            <Text color="gray.500" fontSize="sm">
              No major empires active during this period. Try moving the slider to explore different eras.
            </Text>
          )}
        </Box>

        {/* Empire Spans Visualization */}
        <Box>
          <Text fontWeight="bold" mb={3}>Empire Spans:</Text>
          <VStack align="stretch" spacing={2}>
            {empireSpans.slice(0, 5).map(empire => (
              <HStack key={empire.name} spacing={3}>
                <Text fontSize="xs" minW="120px" color="gray.600">
                  {empire.name}
                </Text>
                <Box flex={1} position="relative" h="20px" bg="gray.100" borderRadius="md">
                  <Box
                    position="absolute"
                    left={`${Math.max(0, ((empire.start + 10000) / 12024) * 100)}%`}
                    width={`${Math.min(100, (empire.duration / 12024) * 100)}%`}
                    h="full"
                    bg={empire.color}
                    borderRadius="md"
                  />
                </Box>
                <Text fontSize="xs" color="gray.500" minW="80px">
                  {empire.duration} years
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default EmpireTimeline;