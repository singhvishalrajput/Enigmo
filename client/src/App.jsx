import React from 'react'
import Header from './components/Header'
import Contact from './components/Contact'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Compute from './components/Compute';
import EncryptDecrypt from './components/EncryptDecrypt';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Compute />
      <Contact />

      
    </div>
  )
}

export default App