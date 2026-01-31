import React from 'react';
import { createRoot } from 'react-dom/client';
import MiddleEarthMap from '../middle_earth_map (1).jsx';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

createRoot(root).render(
  <React.StrictMode>
    <MiddleEarthMap />
  </React.StrictMode>
);
