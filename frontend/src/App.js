import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Homepage';
import Chat from './pages/Chatpage';
import './App.css';

import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
     <Router>
       <ChatProvider>
          <Routes>
            <Route path='/' element={<Home/>} exact></Route>
            <Route path='/chats' element={<Chat/>} exact></Route>
          </Routes>
       </ChatProvider>
     </Router>
    </div>
  );
}

export default App;
