import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Sidebar from '../components/layout/Sidebar';
import BiblicalMapContainer from '../components/map/MapContainer';

const BiblicalMovementsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bg} h="calc(100vh - 80px)" overflow="hidden">
      <Flex h="full">
        {/* Mobile menu button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          position="absolute"
          top={4}
          left={4}
          zIndex={30}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
          variant="solid"
          colorScheme="blue"
          size="sm"
        />

        {/* Sidebar for biblical movements */}
        <Sidebar isOpen={isOpen} onClose={onClose} />

        {/* Biblical map area */}
        <Box flex={1} position="relative">
          <BiblicalMapContainer />
        </Box>
      </Flex>
    </Box>
  );
};

export default BiblicalMovementsPage;