import React, { Component } from 'react';
import './Matches.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import MatchContent from './MatchContent';

export default class Matches extends Component {
    constructor(props){
        super(props);
        this.state = {            
            match: {
                jogoId:0,
                data:'',
                timeA: {
                    id:'timeA',
                    jogador1: {},
                    jogador2: {}
                },
                timeB: {
                    id:'timeB',
                    jogador1: {},
                    jogador2: {}
                },
                placar: {
                    timeA: 0,
                    timeB: 0
                },
                vencedor: null,
                perdedor: null,
                empate: null
            },
            players:[],
            matches: []
        };
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

    render(){
        return(
            <form onSubmit={this.sendNewMatch.bind(this)} id="rankingForm">
                <MatchContent componentState={this.state} />
                <input type="submit" value="Enviar"/>
            </form>
        );
    }

    updateStats(timeVencedor, timePerdedor, partida){

        let scoreVencedor = parseInt(partida.placar[timeVencedor.id], 10);
        let scorePerdedor = parseInt(partida.placar[timePerdedor.id], 10);
        let players = this.state.players;

        console.log(timeVencedor);

        // loop no time vencedor para obter cada jogador dinamicamente 
        // e acessar os atributos
        Object.keys(timeVencedor).forEach(jogador => {
            
            // retorna no primeiro key "id"                      
            if (timeVencedor[jogador] == timeVencedor.id){
                return;
            }
            
            // verifica o jogador atual com os jogadores armazenados no estado
            // atualiza as estatisticas cruzando dados da partida e os armazenados 
            players.map((player, index) => {
                if (timeVencedor[jogador].nome == player.nome){
                    
                                        
                    timeVencedor[jogador].vitorias = (player.vitorias + 1);
                    timeVencedor[jogador].derrotas = player.derrotas;
                    timeVencedor[jogador].empates = player.empates;

                    timeVencedor[jogador].pontos = timeVencedor[jogador].vitorias * 3;
                    timeVencedor[jogador].partidas = parseInt(player.partidas) + 1;
                    timeVencedor[jogador].gPro = player.gPro + scoreVencedor;
                    timeVencedor[jogador].gContra = player.gContra +scorePerdedor;
                    timeVencedor[jogador].saldo = player.saldo + (scoreVencedor - scorePerdedor)
                    
                    timeVencedor[jogador].historico = player.historico;
                    timeVencedor[jogador].historico.push('v');


                    delete players[index];
                    players[index] = timeVencedor[jogador];

                }

            });       

        });

        // Object.keys(timePerdedor).forEach(jogador => {
        //     // retorna no primeiro key "id"                      
        //     if (timeVencedor[jogador] == timeVencedor.id){
        //         return;
        //     }

        //     players.map((player, index) => {
                
        //         if (timePerdedor[jogador].nome == player.nome){
                    
                                        
        //             timePerdedor[jogador].vitorias = player.vitorias;
        //             timePerdedor[jogador].derrotas = player.derrotas + 1;
        //             timePerdedor[jogador].empates = player.empates;

        //             timePerdedor[jogador].pontos = timePerdedor[jogador].vitorias * 3;
        //             timePerdedor[jogador].partidas = player.partidas + 1;
        //             timePerdedor[jogador].gPro = player.gPro + scorePerdedor;
        //             timePerdedor[jogador].gContra = player.gContra +scoreVencedor;
        //             timePerdedor[jogador].saldo = player.saldo + (scorePerdedor - scoreVencedor)
                    
        //             timePerdedor[jogador].historico = player.historico;
        //             timePerdedor[jogador].historico.push('f');

        //             delete players[index];
        //             players[index] = timePerdedor[jogador];
                    
        //         }
        //     });

        // });

        // for (var jogador in time){
        //     if (time.hasOwnProperty(jogador)){
                
        //         
                
        //         // let jogador1 = partida.timeA.jogador1;

        //         // $.ajax({
        //         //     url:"http://192.168.0.140:8080/api/jogadores/",
        //         //     dataType: "json",
        //         //     contentType: "application/json",
        //         //     type: "post",
        //         //     data: JSON.stringify(jogador1),
        //         //     success: novaListagem => {
        //         //         console.log(jogador1);
        //         //         PubSub.publish('player-list-update', novaListagem);
        //         //         //this.setState({nome:''});
        //         //     },
        //         //     error: resposta => console.log(resposta)
        //         // });

        //         // console.log(this.state.players);
        //     }
        // }

        this.setState({players: players});
        console.log(this.state.players);
    }

    sendNewMatch(sender){
        sender.preventDefault();

        let partida = this.state.match;
        partida.data = new Date();

        if(partida.placar.timeA > partida.placar.timeB){

            this.updateStats(partida.timeA, partida.timeB, partida); 
                       
            
            // partida.vencedor = partida.timeA;
            // partida.timeA.jogador1.vitorias++;
            // partida.timeA.jogador1.gPro = partida.placar.timeA;
            // partida.timeA.jogador1.gContra = partida.placar.timeB;
            // partida.timeA.jogador1.saldo = partida.placar.timeA - partida.placar.timeB
            // partida.timeA.jogador1.historico.push('v');
            // partida.timeA.jogador1.pontos = partida.timeA.jogador1.pontos + 3;
            
            // let jogador1 = partida.timeA.jogador1;

            // $.ajax({
            //     url:"http://192.168.0.140:8080/api/jogadores/",
            //     dataType: "json",
            //     contentType: "application/json",
            //     type: "post",
            //     data: JSON.stringify(jogador1),
            //     success: novaListagem => {
            //         console.log(jogador1);
            //         PubSub.publish('player-list-update', novaListagem);
            //         //this.setState({nome:''});
            //     },
            //     error: resposta => console.log(resposta)
            // });

            // console.log(this.state.players);
        }

        // $.ajax({
        //     url:"http://192.168.0.140:8080/api/partidas/",
        //     dataType: "json",
        //     contentType: "application/json",
        //     type: "post",
        //     data: JSON.stringify(this.state),
        //     success: novaListagem => {
        //         console.log(this.state);
        //         PubSub.publish('player-list-update', novaListagem);
        //         this.setState({nome:''});
        //     },
        //     error: resposta => console.log(resposta)
        // });    
    }
}