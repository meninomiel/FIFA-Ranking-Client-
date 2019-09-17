import React from 'react';
import logo from './logo.svg';
import './App.css';
import Ranking from './components/ranking/Ranking';
import Players from './components/players/Players';

function App() {
  return (
    <main>
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h2 className="title">FIFA Ranking</h2>
          </div>
          <div className="header-nav">
            <nav className="nav">
              <a>Tabela</a>
              <a>Estatísticas</a>
              <a>Partidas</a>
              <a>Jogadores</a>              
            </nav>
          </div>
        </div>        
      </header>

      <section className="content">
        {/* <Ranking /> */}
        <Players />
      </section>
    </main>
    
  );
}

export default App;
