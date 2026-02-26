import React from 'react';
import {
  Box,
  VStack,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import FilterPanel from '../controls/FilterPanel';
import MovementList from '../visualization/MovementList';

const Sidebar = ({ isOpen, onClose }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w={{ base: 'full', md: '350px' }}
      h="full"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      position={{ base: 'absolute', md: 'relative' }}
      zIndex={20}
      overflow="hidden"
    >
      <VStack h="full" spacing={0} align="stretch">
        <Box flex={1} overflow="hidden">
          <FilterPanel />
        </Box>
        <Box flex={1} overflow="hidden">
          <MovementList />
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
