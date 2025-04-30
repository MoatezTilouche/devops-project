import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamPage from './pages/Teampage';
import Navigation from './pages/Navigation';
import ContactPage from './pages/ContactPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<TeamPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;