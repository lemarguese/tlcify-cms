import './App.css';
import './styles/normalize.scss';
import Router from "./layout/Router/Router.tsx";
import { Toaster } from "react-hot-toast";

function App () {
  return (
    <div className='main'>
      <Router/>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#fff',
            fontSize: 14,
            minWidth: 300,
            borderRadius: 8,
            color: 'black',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            removeDelay: 1000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App;
