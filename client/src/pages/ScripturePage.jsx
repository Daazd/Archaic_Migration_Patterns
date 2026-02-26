import React from 'react';
import {
 Box,
 Container,
 VStack,
 Heading,
 Text,
 useColorModeValue
} from '@chakra-ui/react';
import ScriptureView from '../components/visualization/ScriptureView';

const ScripturePage = () => {
 const bg = useColorModeValue('gray.50', 'gray.900');

 return (
   <Box bg={bg} minH="calc(100vh - 80px)">
     <Container maxW="6xl" py={8}>
       <VStack spacing={6} align="stretch">
         <Box textAlign="center">
           <Heading size="xl" color="blue.600" mb={4}>
             Scripture Explorer
           </Heading>
           <Text color="gray.600" fontSize="lg">
             Read biblical passages with movement detection and geographical context
           </Text>
         </Box>
         
         <ScriptureView />
       </VStack>
     </Container>
   </Box>
 );
};

export default ScripturePage;
