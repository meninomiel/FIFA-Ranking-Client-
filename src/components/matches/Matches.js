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
                    jogador1: {},
                    jogador2: {}
                },
                timeB: {
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
            <form onSubmit={this.sendNewMatch.bind(this)}>
                <MatchContent componentState={this.state} />
                <input type="submit" value="Enviar"/>
            </form>
        );
    }

    sendNewMatch(sender){
        sender.preventDefault();

        let partida = this.state.match;
        partida.data = new Date();
        console.log(partida);

        if(partida.placar.timeA > partida.placar.timeB){
            
            partida.vencedor = partida.timeA;
            partida.timeA.jogador1.vitorias++;
            partida.timeA.jogador1.gPro = partida.placar.timeA;
            partida.timeA.jogador1.gContra = partida.placar.timeB;
            partida.timeA.jogador1.saldo = partida.placar.timeA - partida.placar.timeB
            partida.timeA.jogador1.historico.push('v');
            partida.timeA.jogador1.pontos = partida.timeA.jogador1.pontos + 3;
            
            let jogadores = this.state.players;
            jogadores.map(player => {
                if (player.nome == partida.timeA.jogador1.nome){
                   
                    let updatedPlayer = []
                    player = Object.assign(player, partida.timeA.jogador1);
                    updatedPlayer.push(player)
                    
                }
            });

            console.log(this.state.players);
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