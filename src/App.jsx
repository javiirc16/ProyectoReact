import React from 'react';
import './App.css';
import { ApiPage, ComponentsPage, LoginPage, TaskPage, UserPage, VozPage, InformesPage } from './pages';
import { Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { LoginProvider } from './components/login/LoginProvider';
import { Chatbot } from './components/chat/Chatbot';

function App() {

  const [isChatVisible, setIsChatVisible] = React.useState(false);

  const handleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
      <div>
        <NavBar />
        <LoginProvider>
            <div className='principal'>
              <Routes>
                <Route path="/"/>
                <Route path='/api' element={<ApiPage />} />
                <Route path='/gestordetareas' element={<TaskPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/componentes" element={<ComponentsPage/>} />
                <Route path="/reconocimientovoz" element={<VozPage/>} />
                <Route path="/informes" element={<InformesPage/>}/>
              </Routes>
            </div>
            <Chatbot isVisible={isChatVisible} onClose={handleChatVisibility} />
          </LoginProvider>
      </div>
  );
}

export default App;