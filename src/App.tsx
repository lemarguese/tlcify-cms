import { useState } from 'react'

import './App.css';
import './styles/normalize.scss';
import CustomerPage from "./pages/Customer/CustomerPage.tsx";

function App() {
  return (
    <div className='main'>
      <CustomerPage />
    </div>
  )
}

export default App
