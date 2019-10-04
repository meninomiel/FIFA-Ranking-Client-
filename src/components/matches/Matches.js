import React, { Component, Fragment } from 'react';
import './Matches.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import MatchContent from './MatchContent';

export default class Matches extends Component {
   constructor(props) {
      super(props);

      this.state = {
         match: {
            data: '',
            timeA: {
               id: 'timeA',
               jogador1: {},
               jogador2: {}
            },
            timeB: {
               id: 'timeB',
               jogador1: {},
               jogador2: {}
            },
            placar: {
               timeA: 0,
               timeB: 0
            },
            empate: null
         },
         players: [],
         matches: [],
         selectedPlayers: []
      };
   }

   render() {
      return (
         <Fragment>
            <form onSubmit={this.sendNewMatch.bind(this)} id="rankingForm">
               <MatchContent componentState={this.state} />
               <input type="submit" value="Enviar" />
            </form>
            {
               this.state.matches.map((match, index) => {
                  return (
                     <div className="tableWrapper" key={`k${index}`}>
                        <div className="matchItem">
                           <h5 className="matchTitle">{`${match.data.toString()}`}</h5>
                           <div className="matchBody">
                              <div className="matchTeam">
                                 <div className="players">
                                    <h4 className="teamTitle">Equipe A</h4>
                                    <p className="playerName">{match.timeA.jogador1.nome}</p>
                                    <p className="playerName">{match.timeA.jogador2.nome}</p>
                                 </div>
                              </div>
                              <div className="score">
                                 <p className="scoreNumber">{match.placar.timeA}</p>
                                 <p className="versus">X</p>
                                 <p className="scoreNumber lose">{match.placar.timeB}</p>
                              </div>
                              <div className="matchTeam">
                                 <div className="players">
                                    <h4 className="teamTitle">Team B</h4>
                                    <p className="playerName">{match.timeB.jogador1.nome}</p>
                                    <p className="playerName">{match.timeB.jogador2.nome}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               })
            }
         </Fragment>
      );
   }

   componentDidMount() {
      $.ajax({
         url: "http://192.168.0.140:8080/api/jogadores",
         dataType: 'JSON',
         success: resposta => this.setState({ players: resposta })
      });
      // $.ajax({
      //    url: "http://192.168.0.140:8080/api/partidas",
      //    dataType: 'JSON',
      //    success: resposta => this.setState({ matches: resposta })
      // });

      PubSub.subscribe('player-list-update', (topico, novaLista) => this.setState({ players: novaLista }));

      //PubSub.subscribe('match-list-update', (topico, novaLista) => this.setState({ matches: novaLista }));
   }


   updateStats(timeVencedor, timePerdedor, partida, empate = false) {

      let scoreVencedor = parseInt(partida.placar[timeVencedor.id], 10);
      let scorePerdedor = parseInt(partida.placar[timePerdedor.id], 10);
      let players = this.state.players;

      // loop no time vencedor para obter cada jogador dinamicamente 
      // e acessar os atributos
      Object.keys(timeVencedor).forEach(jogador => {

         // retorna no primeiro key "id"                      
         if (timeVencedor[jogador] === timeVencedor.id) {
            return;
         }

         // caso empate
         if (empate === true) {

            // lê os valores guardados no estado e atualiza as estatísticas
            let statePlayer = players.find(player => player.nome === timeVencedor[jogador].nome);

            // TIME A //
            statePlayer.partidas++;
            statePlayer.empates++;
            statePlayer.pontos = (statePlayer.vitorias * 3) + (statePlayer.empates);
            statePlayer.gPro = statePlayer.gPro + scoreVencedor;
            statePlayer.gContra = statePlayer.gContra + scorePerdedor;
            statePlayer.saldo = statePlayer.saldo + (scoreVencedor - scorePerdedor);
            statePlayer.historico.push('e');

            // TIME B //
            statePlayer = players.find(player => player.nome === timePerdedor[jogador].nome);
            statePlayer.partidas++;
            statePlayer.empates++;
            statePlayer.pontos = (statePlayer.vitorias * 3) + (statePlayer.empates);
            statePlayer.gPro = statePlayer.gPro + scorePerdedor;
            statePlayer.gContra = statePlayer.gContra + scoreVencedor;
            statePlayer.saldo = statePlayer.saldo + (scorePerdedor - scoreVencedor);
            statePlayer.historico.push('e');

            return;
         }


         // lê os valores guardados no estado e atualiza as estatísticas
         let statePlayer = players.find(player => player.nome === timeVencedor[jogador].nome);

         // TIME VENCEDOR //
         statePlayer.partidas++;
         statePlayer.vitorias++;
         statePlayer.pontos = (statePlayer.vitorias * 3) + (statePlayer.empates);
         statePlayer.gPro = statePlayer.gPro + scoreVencedor;
         statePlayer.gContra = statePlayer.gContra + scorePerdedor;
         statePlayer.saldo = statePlayer.saldo + (scoreVencedor - scorePerdedor);
         statePlayer.historico.push('v');

         // TIME PERDEDOR //
         statePlayer = players.find(player => player.nome === timePerdedor[jogador].nome);
         statePlayer.partidas++;
         statePlayer.derrotas++;
         statePlayer.pontos = (statePlayer.vitorias * 3) + (statePlayer.empates);
         statePlayer.gPro = statePlayer.gPro + scorePerdedor;
         statePlayer.gContra = statePlayer.gContra + scoreVencedor;
         statePlayer.saldo = statePlayer.saldo + (scorePerdedor - scoreVencedor);
         statePlayer.historico.push('d');

      });

   }

   sendNewMatch(sender) {
      sender.preventDefault();
      

      let partida = this.state.match;
      partida.data = new Date();

      if (partida.placar.timeA > partida.placar.timeB) {
         this.updateStats(partida.timeA, partida.timeB, partida);
      } else if (partida.placar.timeB > partida.placar.timeA) {
         this.updateStats(partida.timeB, partida.timeA, partida);
      } else {
         this.updateStats(partida.timeA, partida.timeB, partida, true);
      }

      // registrar jogadores
      this.state.players.map(player => {
         return (
            $.ajax({
               url: "http://192.168.0.140:8080/api/jogadores/",
               dataType: "json",
               contentType: "application/json",
               type: "post",
               data: JSON.stringify(player),
               success: novaListagem => {
                  PubSub.publish('player-list-update', novaListagem);
                  this.setState({ players: novaListagem });

                  //resetar form
                  //document.querySelector("#rankingForm").reset();
                  //this.setState({[placar.]:''}); limpar placar
               },
               error: resposta => console.log(resposta)
            })
         );
      });

      //registrar partida (duplicando)
      this.setState({ matches: [...this.state.matches, partida] }, () => {
        console.log(this.state.matches);
      });
      //        
   }
}