import React, { Component } from 'react';
import 'scss/Navbar.scss';
import LogoSmall from 'assets/logo2.png';
import LogoFull from 'assets/logo-full.png';
// import CardIconYugioh from 'assets/card-icon-yugioh.png';
// import CardIconPokemon from 'assets/card-icon-pokemon.png';
// import CardIconMtg from 'assets/card-icon-mtg.png';
// import CardIconHp from 'assets/card-icon-hp.png';

class Navbar extends Component {
    render() {
        let buttonReturn;
        if(this.props.cardDetails) {
            buttonReturn = 
                <div id='button-return' onClick={() => this.props.hideCardDetails()}>
                    <i className='fas fa-arrow-left' />
                </div>
        }

        return (
            <nav id='navbar'>
                <img id='logo-small' src={LogoSmall} alt='logo small'></img>
                <img id='logo-full' src={LogoFull} alt='logo full'></img>

                {/* <div className='dropdown'>
                    <a href='#!' className='button dropdown-btn'>
                        <img className='card-icon' src={CardIconYugioh} alt='yugioh-icon'/>
                        <span>Yu-Gi-Oh!</span> <i className='fas fa-caret-down'></i>
                    </a>
                    <div className='dropdown-content'>
                        <a href='#!'><img className='card-icon' src={CardIconPokemon} alt='pokemon-icon' /> Pokemon</a>
                        <a href='#!'><img className='card-icon' src={CardIconMtg} alt='mtg-icon' /> Magic: The Gathering</a>
                        <a href='#!'><img className='card-icon' src={CardIconHp} alt='hp-icon' /> Harry Potter TCG</a>
                    </div>
                </div> */}
                
                <div className='labelled-checkbox'>
                    <div className='label'>Owned Only:</div>
                    <input className='checkbox' id='checkbox-hide-owned' type='checkbox'
                        checked={this.props.hideUnowned} onChange={this.props.onChangeHideUnowned} />
                    <label htmlFor='checkbox-hide-owned'>
                        <i className='checkmark fas fa-check'></i>
                    </label>
                </div>

                <div className='labelled-dropdown'>
                    <div className='label'>Sort By:</div>
                    <select name='sort' className='sort-dropdown' value={this.props.sortMode} onChange={this.props.onChangeSortMode}>
                        <option value='number'>Number</option>
                        <option value='a-z'>A-Z</option>
                        <option value='z-a'>Z-A</option>
                        <option value='level'>Level</option>
                        <option value='atk'>ATK</option>
                        <option value='def'>DEF</option>
                        <option value='price'>Price</option>
                    </select>
                </div>
                
                <div id='search-area'>
                    <div id='search-form'>
                        <input id='search-box' type='text' placeholder='Search' autoComplete='off' onChange={e => this.props.search(e.target.value)}/>
                        <button id='button-submit' onClick={e => this.props.search(document.getElementById('search-box').value)}>
                            <i className='fas fa-search'></i>
                        </button>
                    </div>
                    <button id='button-cancel-search' onClick={() => this.props.search('')}>
                        <i className='fas fa-times'></i>
                    </button>
                </div>
                {buttonReturn}
            </nav >
        );
    }
}

export default Navbar;