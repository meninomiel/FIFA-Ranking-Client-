import React, {Component} from 'react';
import MatchPlayerSelect from './PlayerSelect';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class MatchContent extends Component {
    constructor(props){
        super(props);
        this.state = this.props.componentState;
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
            <div className="match-content">
                    <div className="match-team">
                        <h4 className="team-title">Equipe A</h4>
                        <MatchPlayerSelect players={this.state.players} 
                            componentState={this.state} playerId="jogador1"
                            name="timeA" selectId="1"/>

                        <MatchPlayerSelect players={this.state.players} 
                            componentState={this.state} playerId="jogador2"
                            name="timeA" selectId="2"/>
                    </div>

                    <div className="match-score">
                        <input className="score-input" type="Number" max="99" name="timeA" maxLength="2"
                            value={this.state.match.placar.timeA} onChange={this.setScore.bind(this)}
                            onFocus={this.cleanScore.bind(this)} onBlur={this.defaultValue.bind(this)} />

                        <span className="score-versus">X</span>

                        <input className="score-input" type="Number" max="99"
                            value={this.state.match.placar.timeB}
                            onChange={this.setScore.bind(this)} name="timeB"
                            onFocus={this.cleanScore.bind(this)} onBlur={this.defaultValue.bind(this)} />
                    </div>

                    <div className="match-team">
                        <h4 className="team-title">Equipe B</h4>
                        <MatchPlayerSelect players={this.state.players} 
                            componentState={this.state} playerId="jogador1"
                            name="timeB" selectId="3"/>
                            
                        <MatchPlayerSelect players={this.state.players} 
                            componentState={this.state} playerId="jogador2"
                            name="timeB" selectId="4"/>
                    </div>
                </div>
        );
    }

    setScore(sender){
        let placar = this.state.match.placar;
        placar[sender.target.name] = parseInt(sender.target.value);
        this.setState({placar});
    }

    cleanScore(sender){
        let placar = this.state.match.placar;
        placar[sender.target.name] = "";        
            
        this.setState({placar}); 
    }

    defaultValue(sender){
        let placar = this.state.match.placar;

        if (sender.target.value === "")
            placar[sender.target.name] = 0;        
            
        this.setState({placar});
    }
}