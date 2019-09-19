import React, { Component } from 'react';
import './Players.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class Players extends Component {
    constructor(){
        super();
        this.state = {
            posicao: 0,
            nome: '',
            pontos: 0,
            partidas: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            gPro: 0,
            gContra: 0,
            saldo:0,
            historico: []
        }; 
    }

    render(){
        return (
            <form onSubmit={this.sendNewPlayer.bind(this)}>
                <input type="Text" value={this.state.nome} onChange={this.setNome.bind(this)}/>
                <input type="submit"/>
            </form>
        );
    }

    sendNewPlayer(sender){
        sender.preventDefault();

        $.ajax({
            url:"http://192.168.0.140:8080/api/jogadores/",
            dataType: "json",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify(this.state),
            success: novaListagem => {
                PubSub.publish('player-list-update', novaListagem);
                this.setState({nome:''});
            },
            error: resposta => console.log(resposta)
        });    
    }

    setNome(sender){
        this.setState({nome: sender.target.value});
    }
}