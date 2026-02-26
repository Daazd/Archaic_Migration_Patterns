import React, { createContext, useState, useContext, useEffect } from 'react';
import { getBibleText, getBibleStructure } from '../services/bibleApi';

const BibleContext = createContext();

export const useBible = () => useContext(BibleContext);

export const BibleProvider = ({ children }) => {
  const [translation, setTranslation] = useState('ESV');
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [bibleText, setBibleText] = useState('');
  const [bibleStructure, setBibleStructure] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBibleStructure = async () => {
      try {
        setLoading(true);
        const structure = await getBibleStructure();
        setBibleStructure(structure);
      } catch (err) {
        console.error('Bible structure error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBibleStructure();
  }, []);

  const navigateToReference = (book, chapter, verse) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setCurrentVerse(verse);
  };

  const getAvailableTranslations = () => {
    return ['ESV', 'KJV', 'NIV', 'NASB', 'NKJV'];
  };

  return (
    <BibleContext.Provider
      value={{
        translation,
        setTranslation,
        currentBook,
        currentChapter,
        currentVerse,
        bibleText,
        bibleStructure,
        navigateToReference,
        getAvailableTranslations,
        loading,
        error
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};
