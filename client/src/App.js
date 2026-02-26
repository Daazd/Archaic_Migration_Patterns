import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './contexts/FilterContext';
import { BibleProvider } from './contexts/BibleContext';
import { MapProvider } from './contexts/MapContext';
import theme from './styles/theme';

// Layout components
import Header from './components/layout/Header';

// Page components
import HomePage from './pages/HomePage';
import ExploreMapPage from './pages/ExploreMapPage';
import BiblicalMovementsPage from './pages/BiblicalMovementsPage';
import ScripturePage from './pages/ScripturePage';
import MovementsPage from './pages/MovementsPage';
import EmpiresPage from './pages/EmpiresPage';

function App() {
 return (
   <>
     <ColorModeScript initialColorMode={theme.config.initialColorMode} />
     <ChakraProvider theme={theme}>
       <BibleProvider>
         <MapProvider>
           <FilterProvider>
             <Router>
               <Header />
               <Routes>
                 <Route path="/" element={<HomePage />} />
                 <Route path="/explore" element={<ExploreMapPage />} />
                 <Route path="/biblical-movements" element={<BiblicalMovementsPage />} />
                 <Route path="/scripture" element={<ScripturePage />} />
                 <Route path="/movements" element={<MovementsPage />} />
                 <Route path="/empires" element={<EmpiresPage />} />
               </Routes>
             </Router>
           </FilterProvider>
         </MapProvider>
       </BibleProvider>
     </ChakraProvider>
   </>
 );
}

export default App;