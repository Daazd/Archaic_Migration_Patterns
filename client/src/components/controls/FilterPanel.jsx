import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  CheckboxGroup,
  Checkbox,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  Flex,
  useColorModeValue,
  Badge,
  HStack
} from '@chakra-ui/react';
import { useFilter } from '../../contexts/FilterContext';

const FilterPanel = () => {
  const {
    timePeriodRange,
    setTimePeriodRange,
    selectedGroups,
    setSelectedGroups,
    availableGroups,
    selectedMovementTypes,
    setSelectedMovementTypes,
    availableMovementTypes,
    selectedRegions,
    setSelectedRegions,
    availableRegions,
    resetFilters
  } = useFilter();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Ensure time period range has valid numbers - extended to 1300 CE
  const safeTimePeriodRange = Array.isArray(timePeriodRange) && 
    timePeriodRange.length === 2 && 
    !isNaN(timePeriodRange[0]) && 
    !isNaN(timePeriodRange[1]) ? timePeriodRange : [-3000, 1300];

  // Format year for display
  const formatYear = (year) => {
    if (isNaN(year)) return 'Unknown';
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const handleTimeRangeChange = (values) => {
    if (Array.isArray(values) && values.length === 2 && 
        !isNaN(values[0]) && !isNaN(values[1])) {
      setTimePeriodRange(values);
    }
  };

  return (
    <Box p={4} bg={bg} h="full" overflowY="auto">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color="gray.700">
          Historical Filters
        </Heading>
        <Button size="sm" onClick={resetFilters} variant="outline" colorScheme="blue">
          Reset
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {/* Extended Time Period Filter */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold" color="gray.600">
              Time Period
            </Text>
            <Badge colorScheme="blue" variant="outline" fontSize="xs">
              3000 BCE - 1300 CE
            </Badge>
          </HStack>
          <Text fontSize="sm" mb={2} color="gray.500">
            {formatYear(safeTimePeriodRange[0])} - {formatYear(safeTimePeriodRange[1])}
          </Text>
          <RangeSlider
            min={-3000}
            max={1300}
            step={50}
            value={safeTimePeriodRange}
            onChange={handleTimeRangeChange}
            colorScheme="blue"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          
          {/* Historical period markers */}
          <Flex justify="space-between" mt={1} fontSize="xs" color="gray.400">
            <Text>3000 BCE</Text>
            <Text>1000 BCE</Text>
            <Text>0</Text>
            <Text>500 CE</Text>
            <Text>1300 CE</Text>
          </Flex>
          
          {/* Period indicators */}
          <VStack spacing={1} mt={2} fontSize="xs" color="gray.500">
            <Text>📜 Ancient (3000 BCE - 500 CE)</Text>
            <Text>🏰 Medieval (500 - 1300 CE)</Text>
          </VStack>
        </Box>

        {/* Accordion for other filters */}
        <Accordion allowMultiple defaultIndex={[0]} size="sm">
          {/* People Groups - Expanded */}
          <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                People Groups ({selectedGroups?.length || 0})
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} maxH="200px" overflowY="auto">
              <CheckboxGroup
                colorScheme="blue"
                value={selectedGroups || []}
                onChange={setSelectedGroups}
              >
                <Stack spacing={1}>
                  {(availableGroups || []).map(group => (
                    <Checkbox key={group} value={group} size="sm">
                      {group}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Movement Types - Expanded */}
          <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                Movement Types ({selectedMovementTypes?.length || 0})
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} maxH="200px" overflowY="auto">
              <CheckboxGroup
                colorScheme="blue"
                value={selectedMovementTypes || []}
                onChange={setSelectedMovementTypes}
              >
                <Stack spacing={1}>
                  {(availableMovementTypes || []).map(type => (
                    <Checkbox key={type} value={type} size="sm">
                      {type}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Regions - Expanded */}
          <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                Regions ({selectedRegions?.length || 0})
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} maxH="200px" overflowY="auto">
              <CheckboxGroup
                colorScheme="blue"
                value={selectedRegions || []}
                onChange={setSelectedRegions}
              >
                <Stack spacing={1}>
                  {(availableRegions || []).map(region => (
                    <Checkbox key={region} value={region} size="sm">
                      {region}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default FilterPanel;