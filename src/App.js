import React, { Component, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Candidates from './Candidates';

import StockAgregation from './stockAggregator/stock';

function App() {


  return (

    <StockAgregation />
  );
}

export default App;