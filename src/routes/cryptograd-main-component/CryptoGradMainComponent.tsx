import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../../components/nav-bar/NavBar';
import './CryptoGradMainComponent.scss';
import '../../styles/common-styles.scss';
import CryptoGradAnalyser from '../../components/cryptograd-analyser/CryptoGradAnalyser';
import CryptoGradAiSummary from '../../components/cryptograd-ai-summary/CryptoGradAiSummary';

function CryptoGradMainComponent() {
  return (
    <div className='d-flex'>
      <NavBar />
      <div className='right-child'>
        <Routes>
          <Route path="/" element={<CryptoGradAnalyser />} />
          <Route path="/insight-ai" element={<CryptoGradAnalyser />} />
          <Route path="/vertex" element={<CryptoGradAiSummary />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default CryptoGradMainComponent;
