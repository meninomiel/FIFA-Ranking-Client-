import React, { Component } from 'react';
import './Ranking.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class Ranking extends Component {
    constructor(props){
        super(props);
        this.state = {players:[]};
    }
    
    render(){
        return(
            <table className="ranking">
                <thead>
                    <tr>
                    <th colSpan="3" className="player-title">Jogador</th>                        
                    <th>Pts</th>
                    <th>PJ</th>
                    <th>VIT</th>
                    <th>E</th>
                    <th>DER</th>
                    <th>GP</th>
                    <th>GC</th>
                    <th>SG</th>
                    <th className="last-five-title">Últimas Partidas</th>
                    </tr>            
                </thead>
                <tbody>
                    {
                        this.state.players.map(player => {
                            return (
                                <tr>
                                    <td>{player.posicao}</td>
                                    <td className="cell-pic">
                                        <img className="player-pic"/>
                                    </td>
                                    <td className="player-name">{player.nome}</td>
                                    <td>{player.pontos}</td>
                                    <td>{player.partidas}</td>
                                    <td>{player.vitorias}</td>
                                    <td>{player.empates}</td>
                                    <td>{player.derrotas}</td>
                                    <td>{player.gPro}</td>
                                    <td>{player.gContra}</td>
                                    <td>{player.saldo}</td>
                                    <td>
                                        <div className="last-five">
                                            {
                                                player.historico.map(partida => {
                                                    if(player.historico.length > 5){
                                                        player.historico.reverse();
                                                        player.historico.length = 5;
                                                        player.historico.reverse();
                                                    }

                                                    switch (partida) {
                                                        case 'v':
                                                            return (<img src={require('../../images/ranking/win.svg')} alt="vitória" />);
                                                        case 'e':
                                                            return (<img src={require('../../images/ranking/draw.svg')} alt="empate" />);
                                                        case 'd':
                                                            return (<img src={require('../../images/ranking/lose.svg')} alt="derrota" />);
                                                    }
                                                })
                                            }
                                        </div>
                                    </td>
                                    </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        );
    }

    componentDidMount(){
        $.ajax({
            url:"http://192.168.0.140:8080/api/jogadores",
            dataType: 'JSON',
            success: resposta => this.setState({players: resposta})
        });

        PubSub.subscribe('player-list-update', (topico, novaLista) => {
            this.setState({players:novaLista});
        });
    }
}