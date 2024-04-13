import {BrowserRouter, Route, Routes,Navigate} from 'react-router-dom'
import { useAuthContext } from './Hooks/useAuthContext';
import Home from "./Components/Home"
import Footer from "./Components/Footer"
import Navbar from "./Components/Navbar"
import Login from "./Components/Login"
import SignUp from "./Components/SignUp"
import AboutMe from './Components/AboutMe'
import Create from './Components/Create'
import AllLists from './Components/AllLists'
import Update from './Components/Update'
function App() {
  const {user} = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <div>
      <Routes>
        <Route
          exact path="/"
          element={<Home/>}
          />
        <Route
          path="/about"
          element={<AboutMe/>}
          />
        <Route
          path="/create"
          element={<Create/>}
          />
        <Route
          path="/update/:id"
          element={<Update/>}
          />
        <Route
          path="/all-Lists"
          element={user ? <AllLists/> : <Navigate to="/"/>}

          />
        <Route
          path="/login"
          element={!user ? <Login/> : <Navigate to="/"/>}
          />
        <Route
          path="/signup"
          element={!user ? <SignUp/> : <Navigate to="/"/>}
          />
      </Routes>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
