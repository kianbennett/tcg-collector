import React, { Component } from 'react';
import 'scss/SidePanel.scss';

class SidePanel extends Component {
    state = {
        hideOwned: true
    }

    // Updates the state when the toggle is clicked
    // React requires this function for the toggle to work
    onChangeHideOwned = event => this.setState({ hideOwned: event.target.checked })

    render() {
        return (
            <div id='side-panel'>
                <div id='search-area'>
                    <form id='search-form'>
                        <input id='search-box' type='text' placeholder='Search' autoComplete='off' />
                        <button id='button-submit' type='submit'>
                            <i className='fas fa-search'></i>
                        </button>
                    </form>
                    <button id='button-cancel-search'>
                        <i className='fas fa-times'></i>
                    </button>
                </div>

                <div className='divider-hori'></div>

                <div className='labelled-dropdown'>
                    <div className='label'>Sort By:</div>
                    <button className='button-dropdown' type='submit'>
                        <span>Name</span>&nbsp; <i className='fas fa-caret-down'></i>
                    </button>

                    {/* Commented out to avoid href non-valid link warnings */}
                    {/* <div className='dropdown-content'>
                        <a className='active' href='#'>Name <i className='fas fa-check'></i></a>
                        <a href='#'>Release Date <i className='fas fa-check'></i></a>
                        <a href='#'>Level <i className='fas fa-check'></i></a>
                        <a href='#'>ATK <i className='fas fa-check'></i></a>
                        <a href='#'>DEF <i className='fas fa-check'></i></a>
                    </div> */}
                </div>

                <div className='labelled-checkbox'>
                    <div className='label'>Hide Owned:</div>
                    <input className='checkbox' id='checkbox-hide-owned' type='checkbox'
                        checked={this.state.hideOwned} onChange={this.onChangeHideOwned} />
                    <label htmlFor='checkbox-hide-owned'>
                        <i className='checkmark fas fa-check'></i>
                    </label>
                </div>

                <div className='divider-hori'></div>

                <div className='scroll-area'>
                    <div id='container-coll' className='collection-container'>
                        <div className='title'>Collections</div><i className='arrow fas fa-caret-down'></i>

                        <button className='collection-button' type='button'>
                            <div className='colour-marker'></div>
                            <div className='label'>Binder 1</div>
                            <div className='count'>360</div>
                            <i className='fas fa-angle-right'></i>
                        </button>
                        <button className='collection-button' type='button'>
                            <div className='colour-marker'></div>
                            <div className='label'>Bulk 1</div>
                            <div className='count'>32</div>
                            <i className='fas fa-angle-right'></i>
                        </button>
                        <button className='collection-button' type='button'>
                            <div className='colour-marker'></div>
                            <div className='label'>Bulk 2 this is actually where i keep the good cards</div>
                            <div className='count'>1654</div>
                            <i className='fas fa-angle-right'></i>
                        </button>
                    </div>

                    <div id='container-decks' className='collection-container'>
                        <div className='title'>Decks</div><i className='arrow fas fa-caret-down'></i>

                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>Blue-Eyes Deck</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>Blue-Eyes Deck 2</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>Blue-Eyes Deck 3</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>Blue-Eyes Deck 4</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>Blue-Eyes Deck 5</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>i luv blu eyes</div>
                        </button>
                        <button className='deck-button' type='button'>
                            <div className='colour-marker'></div><i className='fas fa-angle-right'></i>
                            <div className='label'>blu eyes 4 eva</div>
                        </button>
                    </div>
                </div>

                <div className='divider-hori'></div>
            </div>
        );
    }
}

export default SidePanel;