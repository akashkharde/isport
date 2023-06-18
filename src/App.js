import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {
  Home,
  MatchDetails,
  MatchTest
} from './Theme/Components/index';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/details" element={<MatchDetails />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
