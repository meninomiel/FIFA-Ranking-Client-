import React, { Component } from 'react';

export default class MatchPlayerSelect extends Component {

   render() {
      const {players, selectedPlayers} = this.props.componentState;

      return (
         <div className="match-player">
            <select select-id={this.props.selectId} data-id={this.props.playerId} name={this.props.name} onChange={this.setPlayer.bind(this)}>
               <option defaultValue value="">-</option>
               {
                  /* ARRUMAR ESSA DESGRAÇA */
                  players.filter(p => !selectedPlayers.includes(p)).concat(this).map((player, index) => {
                     return(
                        <option key={index} value={player.nome}>
                           {player.nome}
                        </option>
                     )
                  })
               }
            </select>
         </div>
      );
   }

   setPlayer(sender) {

      let obj = sender.target.getAttribute('data-id');
      let player = this.props.componentState.match[sender.target.name][obj];
      let selected = this.props.componentState.selectedPlayers;

      let index = sender.target.getAttribute('select-id') - 1;
      player.nome = sender.target.value;

      selected[index] = this.props.componentState.players[index];

      this.setState({ player, selected });
   }

}