import React, { Component } from 'react';
import { parse } from 'url';
//import update from 'immutability-helper';

export default class MatchPlayerSelect extends Component {

   render() {
      const {players} = this.props;

      return (
         <div className="match-player">
            <select select-id={this.props.selectId} data-id={this.props.playerId} name={this.props.name} onChange={this.setPlayer}>
               <option defaultValue value="">-</option>
               {
                  /* ARRUMAR ESSA DESGRAÇA */
                  players.map((player, i) => {                                                   
                     return(
                        <option key={i} value={player.nome}>
                           {player.nome}
                        </option>
                     )
                  })                
               }
            </select>
         </div>
      );
   }

   setPlayer = sender => {         

      let obj = sender.target.getAttribute('data-id'); //jogadorX
      let player = this.props.componentState.match[sender.target.name][obj]; //timeX.jogadorX
      let selected = this.props.componentState.selectedPlayers;

      let index = parseInt(sender.target.getAttribute('select-id') - 1);
      player.nome = sender.target.value;

      selected[index] = this.props.componentState.players.filter(arrayItem => arrayItem.nome === player.nome)[0];

      console.log(this.props.componentState.selectedPlayers)

      if(selected.length > 1){
         let counter = selected.filter(arrayItem => arrayItem.nome === player.nome).length;
         console.log(counter)
         selected.forEach((playerObj, index) => {
            if(counter > 1){
               console.log("Jogador já existe");
            } else {
               this.setState({ player, selected });
            }
         })
      }
      
      
      
   }

}