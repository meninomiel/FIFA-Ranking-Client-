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

        // loop no time vencedor para obter cada jogador dinamicamente 
        // e acessar os atributos
        Object.keys(timeVencedor).forEach(jogador => {
            
            console.log(`entro no ${timeVencedor[jogador].nome}`);

            // retorna no primeiro key "id"                      
            if (timeVencedor[jogador] === timeVencedor.id){
                return;
            }

            // lê os valores guardados no estado e atualiza as estatísticas
            players.every((player, index) => {

                //confere se o registro corresponde
                if (player.nome === timeVencedor[jogador].nome){

                    // timeVencedor[jogador].partidas = player.partidas + 1;
                    // timeVencedor[jogador].pontos = timeVencedor[jogador].partidas * 3;
                    // timeVencedor[jogador].vitorias = player.vitorias + 1;
                    // timeVencedor[jogador].empates = player.empates;
                    // timeVencedor[jogador].derrotas = player.derrotas;
                    // timeVencedor[jogador].gPro = scoreVencedor;
                    // timeVencedor[jogador].gContra = scorePerdedor;
                    // timeVencedor[jogador].saldo = scoreVencedor - scorePerdedor;

                    // timeVencedor[jogador].historico = player.historico;
                    // timeVencedor[jogador].historico.push('v');
                    
                    //delete players[index];
                    players[index] = timeVencedor[jogador];
                    
                    return true;                    
                }

            })

        });


        this.setState({players: players});
        console.log(this.state.players);
    }

    sendNewMatch(sender){
        sender.preventDefault();

        let partida = this.state.match;
        partida.data = new Date();
        console.log(partida);

        if(partida.placar.timeA > partida.placar.timeB){
            this.updateStats(partida.timeA, partida.timeB, partida);                        
        }

        document.querySelector("#rankingForm").reset();

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