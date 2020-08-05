import React, { Component } from 'react';
import 'scss/Settings.scss';

class Settings extends Component {

    render() {
        return (
            <div id='settings-panel'>
                <p>TCG Collector lets you catalogue your trading card collection.
                Built using <a href='https://ygoprodeck.com/' target='_blank' rel="noopener noreferrer">YGOPRODECK</a>,
                prices from <a href='https://www.tcgplayer.com/' target='_blank'rel="noopener noreferrer">TCG Player</a>.</p>
            </div>
        );
    }
}

export default Settings;