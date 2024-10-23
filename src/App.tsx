import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CryptoGradMainComponent from './routes/cryptograd-main-component/CryptoGradMainComponent';
import store from './app/redux/store';
import { setProjectID, setEmpID } from './app/redux/queryParams/queryParamsSlice';


const queryParams = new URLSearchParams(window.location.search);
const projectId = queryParams.get('projectId') || ''; 
const userId = queryParams.get('userId') || ''; 
console.log("helo",projectId,userId)

store.dispatch(setProjectID(projectId));
store.dispatch(setEmpID(userId));

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<CryptoGradMainComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
