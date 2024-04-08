import { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Character from './components/Character';
import NotFound from './components/NotFound';
import './styles.scss'; 

export const HistoryContext = createContext(null);

const App = () => {
  const [history, setHistory] = useState([]);

  return (
    <Router >
      <HistoryContext.Provider value={{ history, setHistory }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character/:id" element={<Character />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </HistoryContext.Provider>
    </Router>
  );
};

export default App;