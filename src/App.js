import React from 'react';
import logo from './logo.svg';
import './App.css';
import Ranking from './components/ranking/Ranking';
import Players from './components/players/Players';
import Matches from './components/matches/Matches';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

function App() {
  return (
    <Router>
      <main>
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h2 className="title">FIFA Ranking</h2>
            </div>
            <div className="header-nav">
              <nav className="nav">
                <NavLink exact to="/" activeClassName="active">Tabela</NavLink>              
                <a>Estatísticas</a>
                <NavLink to="/partidas" activeClassName="active">Partidas</NavLink>
                <NavLink to="/jogadores" activeClassName="active">Jogadores</NavLink>              
              </nav>
            </div>
          </div>        
        </header>

        <section className="content">
          {/* <Ranking /> */}
          <Route path="/" exact component={Ranking}/>
          <Route path="/jogadores" component={Players}/>
          <Route path="/partidas" component={Matches}/>
        </section>
    </main>
    </Router>
  );
}

export default App;
