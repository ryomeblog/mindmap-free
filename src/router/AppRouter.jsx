import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MindMapPage from '../pages/MindMapPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MindMapPage />} />
        <Route path="/mindmap-free" element={<MindMapPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;