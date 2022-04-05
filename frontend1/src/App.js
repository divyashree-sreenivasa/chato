import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Homepage';
import Chat from './pages/Chatpage';
import './App.css';

function App() {
  return (
    <div className="App">
     <Router>
       <Routes>
         <Route path='/' element={<Home/>} exact></Route>
         <Route path='/chats' element={<Chat/>}></Route>
       </Routes>
     </Router>
    </div>
  );
}

export default App;
