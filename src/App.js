import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <div className="App">

      <div>
        <Toaster
        position = "bottom-center"
        toastOptions={{

          style: {
            background: 'black', 
            color: 'white',
          },
          success: {
            theme : {
              pimary: 'white',
              secondary: '#eeb600'
            }
          }
        }}></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
