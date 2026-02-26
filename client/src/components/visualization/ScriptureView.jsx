import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Select,
  Button,
  ButtonGroup,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  Badge
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useBible } from '../../contexts/BibleContext';

const ScriptureView = () => {
  const {
    translation,
    setTranslation,
    currentBook,
    currentChapter,
    bibleStructure,
    navigateToReference,
    getAvailableTranslations,
    loading,
    error
  } = useBible();

  const [bibleText, setBibleText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [detectedMovements, setDetectedMovements] = useState([]);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Load Bible text when reference changes
  useEffect(() => {
    const loadText = async () => {
      setLoadingText(true);
      try {
        const response = await fetch(`http://localhost:5000/api/bible/passage/${currentBook}/${currentChapter}`);
        const data = await response.json();
        
        if (data.success) {
          setBibleText(data.data.text);
          
          // Try to extract movements from the text
          try {
            const movementResponse = await fetch('http://localhost:5000/api/movements/extract', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                book: currentBook,
                chapter: currentChapter,
                startVerse: 1
              })
            });
            
            const movementData = await movementResponse.json();
            if (movementData.success) {
              setDetectedMovements(movementData.data);
            }
          } catch (err) {
            console.log('Movement extraction not available');
          }
        } else {
          setBibleText('Error loading scripture. Please check your API configuration.');
        }
      } catch (err) {
        setBibleText('Unable to connect to scripture service.');
      } finally {
        setLoadingText(false);
      }
    };

    if (currentBook && currentChapter) {
      loadText();
    }
  }, [currentBook, currentChapter]);

  // Navigate to previous chapter
  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      navigateToReference(currentBook, currentChapter - 1, 1);
    } else {
      // Go to previous book's last chapter
      const books = Object.keys(bibleStructure);
      const currentIndex = books.indexOf(currentBook);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        const lastChapter = bibleStructure[prevBook]?.chapters || 1;
        navigateToReference(prevBook, lastChapter, 1);
      }
    }
  };

  // Navigate to next chapter
  const goToNextChapter = () => {
    const maxChapter = bibleStructure[currentBook]?.chapters || 1;
    if (currentChapter < maxChapter) {
      navigateToReference(currentBook, currentChapter + 1, 1);
    } else {
      // Go to next book's first chapter
      const books = Object.keys(bibleStructure);
      const currentIndex = books.indexOf(currentBook);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        navigateToReference(nextBook, 1, 1);
      }
    }
  };

  const chapterOptions = bibleStructure[currentBook] 
    ? Array.from({ length: bibleStructure[currentBook].chapters }, (_, i) => i + 1)
    : [];

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Loading Bible structure...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading scripture: {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Controls */}
      <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
          <HStack spacing={4} flex={1}>
            <Select
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              w="120px"
            >
              {getAvailableTranslations().map(trans => (
                <option key={trans} value={trans}>{trans}</option>
              ))}
            </Select>

            <Select
              value={currentBook}
              onChange={(e) => navigateToReference(e.target.value, 1, 1)}
              w="150px"
            >
              {Object.keys(bibleStructure).map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </Select>

            <Select
              value={currentChapter}
              onChange={(e) => navigateToReference(currentBook, parseInt(e.target.value), 1)}
              w="120px"
            >
              {chapterOptions.map(chapter => (
                <option key={chapter} value={chapter}>Chapter {chapter}</option>
              ))}
            </Select>
          </HStack>

          <ButtonGroup size="sm" isAttached>
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={goToPreviousChapter}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={goToNextChapter}
              variant="outline"
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>

      {/* Content */}
      <HStack spacing={6} align="stretch">
        {/* Scripture Text */}
        <Box
          flex={2}
          bg={bg}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          minH="500px"
        >
          <Heading size="lg" mb={4} color="blue.600">
            {currentBook} {currentChapter}
          </Heading>

          {loadingText ? (
            <Box textAlign="center" py={8}>
              <Spinner color="blue.500" />
              <Text mt={2}>Loading scripture...</Text>
            </Box>
          ) : (
            <Box
              fontSize="md"
              lineHeight="tall"
              color="gray.700"
              whiteSpace="pre-wrap"
              fontFamily="Georgia, serif"
            >
              {bibleText || 'Select a book and chapter to view scripture.'}
            </Box>
          )}
        </Box>

        {/* Detected Movements */}
        <Box
          flex={1}
          bg={bg}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          minH="500px"
        >
          <Heading size="md" mb={4} color="blue.600">
            Detected Movements
          </Heading>

          {detectedMovements.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {detectedMovements.map((movement, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="sm">
                      {movement.group}
                    </Text>
                    <Badge colorScheme="blue" size="sm">
                      {movement.type}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600">
                    {movement.fromLocation} → {movement.toLocation}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    {movement.description}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500" fontSize="sm">
              No movements detected in this passage. Try chapters with journey narratives like Genesis 12, Exodus 12, or Acts 13.
            </Text>
          )}
        </Box>
      </HStack>
    </VStack>
  );
};

export default ScriptureView;
