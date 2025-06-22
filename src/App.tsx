import './App.css';
import './styles/normalize.scss';
import Router from "./layout/Router/Router.tsx";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App () {
  return (
    <div className='main'>
      <Router/>
      <ToastContainer position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover/>
    </div>
  )
}

export default App
