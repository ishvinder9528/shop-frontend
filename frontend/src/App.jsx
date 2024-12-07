import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import KhataPage from '@/pages/KhataPage';

function App() {

  return (
    <Routes>
      <Route path="/khata" element={<KhataPage />} />
    </Routes>
  )
}

export default App
