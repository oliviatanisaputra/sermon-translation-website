import { useState } from 'react';
import Login from './components/Login.js';
import InputSermon from './components/InputSermon.js';
import SermonList from './components/SermonList.js';
import Output from './components/Output.js';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [koreanText, setKoreanText] = useState(""); // Lifted state
  const [translatedText, setTranslatedText] = useState(null); // Lifted state
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger sermon list refresh



  const handleLogin = (data) => {
    if (data.success) {
      setUser({ username: data.username, role: 'editor'});
    } else {
      alert(data.message);
    }
  };


  const handleGuest = () => {
    setUser({ role: 'guest'})
  }


  const handleLogout = () => {
    setUser(null);
    setKoreanText("");
    setTranslatedText(null);
    setResult(null);
  };


  return (
    <div className="app">
      {/* NAVIGATION BAR */}
      <div class="navbar">
        <div class="header">
          <img src="/charis-logo-lands.png" alt="Logo" class="logo" />
          <h2 class="app-title">Translation Room</h2>
        </div>
        { user && (
          <button class="btn-logout" onClick={handleLogout}>Logout</button>
        )}
      </div>

      { !user && (
        <Login onLogin={handleLogin} onGuest = {handleGuest}/>
      )}

      { user && (
        <div class="editor-page">
          <h1>Welcome { user.role === 'editor'
          ? user.username
          : 'Guest'
          }</h1>

          { user.role === 'editor' && (
            <div>
              <InputSermon
                setResult={setResult}
                username={user.username}
                koreanText={koreanText}
                setKoreanText={setKoreanText}
                translatedText={translatedText}
                setTranslatedText={setTranslatedText}
              />
    
              {translatedText && (
                <Output
                  result={result}
                  translatedText={translatedText}
                  setTranslatedText={setTranslatedText}
                  username={user.username}
                  onSaveSuccess={() => {
                    // Clear states after successful save
                    setKoreanText("");
                    setTranslatedText(null);
                    setResult(null);
                    // Trigger sermon list refresh
                    setRefreshTrigger(prev => prev + 1);
                  }}
                />
              )}
            </div>)}
          
            <SermonList
              isEditor ={user.role === 'editor'}
              refreshTrigger={refreshTrigger}  
            />

        </div>)}

    </div>
  )
}

export default App;
