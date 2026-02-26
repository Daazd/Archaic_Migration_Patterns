import React from 'react';
import {
 Box,
 Flex,
 Heading,
 Spacer,
 ButtonGroup,
 Button,
 IconButton,
 useColorMode,
 useColorModeValue,
 Menu,
 MenuButton,
 MenuList,
 MenuItem
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
 const location = useLocation();
 const { colorMode, toggleColorMode } = useColorMode();
 const bg = useColorModeValue('white', 'gray.800');
 const borderColor = useColorModeValue('gray.200', 'gray.700');

 const isActive = (path) => location.pathname === path;

 return (
   <Box bg={bg} borderBottom="1px" borderColor={borderColor} px={6} py={4} shadow="sm">
     <Flex alignItems="center">
       <Heading as={Link} to="/" size="lg" color="blue.500" cursor="pointer">
         Historical Movements & Empires
       </Heading>
       <Spacer />
       <ButtonGroup spacing={4}>
         <Button
           as={Link}
           to="/"
           variant={isActive('/') ? 'solid' : 'ghost'}
           colorScheme="blue"
         >
           Home
         </Button>
         
         {/* Maps Dropdown */}
         <Menu>
           <MenuButton 
             as={Button} 
             rightIcon={<ChevronDownIcon />}
             variant={isActive('/biblical-movements') || isActive('/explore') ? 'solid' : 'ghost'}
             colorScheme="blue"
           >
             Maps
           </MenuButton>
           <MenuList>
             <MenuItem as={Link} to="/biblical-movements">
               📖 Biblical Movements Map
             </MenuItem>
             <MenuItem as={Link} to="/explore">
               🏛️ Historical Empires Map
             </MenuItem>
           </MenuList>
         </Menu>

         <Button
           as={Link}
           to="/scripture"
           variant={isActive('/scripture') ? 'solid' : 'ghost'}
           colorScheme="blue"
         >
           Scripture
         </Button>
         <Button
           as={Link}
           to="/movements"
           variant={isActive('/movements') ? 'solid' : 'ghost'}
           colorScheme="blue"
         >
           Movements
         </Button>
         <Button
           as={Link}
           to="/empires"
           variant={isActive('/empires') ? 'solid' : 'ghost'}
           colorScheme="blue"
         >
           Empire Analysis
         </Button>
         <IconButton
           aria-label="Toggle color mode"
           icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
           onClick={toggleColorMode}
           variant="ghost"
         />
       </ButtonGroup>
     </Flex>
   </Box>
 );
};

export default Header;