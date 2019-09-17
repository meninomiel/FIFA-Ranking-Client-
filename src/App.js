import React from 'react';
import logo from './logo.svg';
import './App.css';

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
        <table className="ranking">
          <thead>
            <tr>
              <th colSpan="3" className="player-title">Jogador</th>                        
              <th>Pts</th>
              <th>VIT</th>
              <th>E</th>
              <th>DER</th>
              <th>GP</th>
              <th>GC</th>
              <th>SG</th>
              <th className="last-five-title">Últimas Cinco</th>
            </tr>            
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className="cell-pic">
                <img className="player-pic"/>
              </td>
              <td className="player-name">Edmiel</td>
              <td>10</td>
              <td>3</td>
              <td>1</td>
              <td>3</td>
              <td>5</td>
              <td>2</td>
              <td>2</td>
              <td>
                <div className="last-five">
                  <img src={require('./images/ranking/win.svg')} alt="vitória" />
                  <img src={require('./images/ranking/lose.svg')} alt="vitória" />
                  <img src={require('./images/ranking/draw.svg')} alt="vitória" />
                  <img src={require('./images/ranking/lose.svg')} alt="vitória" />
                  <img src={require('./images/ranking/win.svg')} alt="vitória" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
    
  );
}

export default App;
