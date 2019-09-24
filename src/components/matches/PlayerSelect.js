import React, { Component } from 'react';

export default class MatchPlayerSelect extends Component {
    constructor(props){
        super(props);
        this.state = this.props.componentState;
    }

    render(){
        return(
            <div className="match-player">
                <select data-id={this.props.playerId} name={this.props.name} onChange={this.setPlayer.bind(this)}>
                    <option defaultValue value="">-</option>
                    {
                        this.props.players.map((player, index) => 
                            <option key={index} value={player.nome}>
                                {player.nome}
                            </option>
                        )
                    }                                
                </select>
            </div>
        );
    }

    setPlayer(sender){
        
        let obj = sender.target.getAttribute('data-id');
        let player = this.props.componentState.match[sender.target.name][obj];
        //let value = JSON.parse(sender.target.value);        
        //let returnedObj = Object.assign(player, value);

        player.nome = sender.target.value;
        this.setState({player});   //envia apenas o nome    
    }
}