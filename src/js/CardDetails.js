import React, { Component } from 'react';
import 'scss/CardDetails.scss'
import 'scss/ContextMenu.scss'
// import CardImage from 'assets/blue-eyes.png';
// import IconLevel from 'assets/icon-level.png';
// import IconLight from 'assets/icon-light.png';
import IconWiki from 'assets/icon-wiki.png';

let formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

class CardDetails extends Component {

    constructor(props) {
        super(props);

        this.nextImage = this.nextImage.bind(this);
        this.prevImage = this.prevImage.bind(this);

        this.state = {
            imageNumber: 0,
            collectionInfo: {}
        };
    }

    componentDidMount() {
        this.setState({
            imageNumber: 0,
            collectionInfo: this.getCardCollectionInfo(this.props.card)
        });
    }

    getCardCollectionInfo(card) {
		if (localStorage.collection) {
			let collection = JSON.parse(localStorage.collection);
			return collection.cards[card.id];
		}
		return undefined;
	}

    nextImage() {
        let n = this.state.imageNumber + 1;
        if (n > this.props.card.card_images.length - 1) {
            n = 0;
        }
        this.setState({ imageNumber: n });
    }

    prevImage() {
        let n = this.state.imageNumber - 1;
        if (n < 0) {
            n = this.props.card.card_images.length - 1;
        }
        this.setState({ imageNumber: n });
    }

    addCardToCollection(card, set, condition, count, newCondition) {
        this.props.addCardToCollection(card, set, condition, count, newCondition);
        this.setState({ collectionInfo: this.getCardCollectionInfo(this.props.card) });
    }

    removeCardFromCollection(card, set, condition, count) {
        this.props.removeCardFromCollection(card, set, condition, count);
        this.setState({ collectionInfo: this.getCardCollectionInfo(this.props.card) });
    }

    changeCondition(card, set, conditionOld, conditionNew, count) {
        this.props.removeCardFromCollection(card, set, conditionOld, count);
        this.props.addCardToCollection(card, set, conditionNew, count);
        this.setState({ collectionInfo: this.getCardCollectionInfo(this.props.card) });
    }

    renderSetRow(set, count, index) {
        let purchaseUrl = 'https://shop.tcgplayer.com/yugioh/' + set.set_name.replace(':', '') + '/' + this.props.card.name;

        return(
            <div className='table-row' key={set.set_code + index}>
                <span>{set.set_code}</span>
                <span onClick={() => this.props.search('set: ' + set.set_name)}>{set.set_name}</span>
                <span>{set.set_rarity}</span>
                <span><a href={purchaseUrl} target='_blank' rel="noopener noreferrer"><span className='currency'>$</span>{formatter.format(set.set_price).replace('US$', '')}</a></span>
                <span>{count} <span className='button-add' onClick={() => this.addCardToCollection(this.props.card, set, 'nm', 1, true)}>+</span></span>
            </div>
        );
    }

    renderConditionRow(set, condition, count, index) {
        return (
            <div className='table-row-condition' key={index}>
                <select name='condition' className='condition-select' value={condition} onChange={e => this.changeCondition(this.props.card, set, condition, e.target.value, count)}>
                    <option value='nm'>NM</option>
                    <option value='lp'>LP</option>
                    <option value='mp'>MP</option>
                    <option value='hp'>HP</option>
                    <option value='dmg'>DMG</option>
                </select>
                <span className='count'>{count}</span>
                <span className='buttons'>
                    <span className='button-add' onClick={() => this.addCardToCollection(this.props.card, set, condition, 1)}>+</span>
                    <span className='button-remove' onClick={() => this.removeCardFromCollection(this.props.card, set, condition, 1)}>-</span>
                </span>
            </div>
        );
    }

    renderCardDesc(desc) {
        // Splits the description by quotes - every other string is a name and given its own span
        let split = desc.split('"');
        for (let i = 1; i < split.length; i += 2) {
            const s = split[i];
            split[i] = <span key={i}>"<span className='card-link' onClick={() => this.props.search(s)}>{split[i]}</span>"</span>;
        }

        // Italicise normal monster text
        if(this.props.card.type === "Normal Monster") {
            return <i>{split}</i>
        } else {
            return split;
        }
    }

    render() {
        let card = this.props.card;
        let collectionInfo = this.state.collectionInfo;

        let setRows = [];
        if(card.card_sets !== undefined) {
            for(let i = 0; i < card.card_sets.length; i++) {
                let count = 0;
                if(collectionInfo !== undefined && collectionInfo[card.card_sets[i].set_code]) {
                    for(let condition in collectionInfo[card.card_sets[i].set_code]) {
                        count += collectionInfo[card.card_sets[i].set_code][condition];
                    }
                }
                setRows.push(this.renderSetRow(card.card_sets[i], count, i));
    
                if(collectionInfo !== undefined && collectionInfo[card.card_sets[i].set_code]) {
                    for(let condition in collectionInfo[card.card_sets[i].set_code]) {
                        setRows.push(this.renderConditionRow(card.card_sets[i], condition, collectionInfo[card.card_sets[i].set_code][condition], i + condition));
                    }
                }
            }
        }

        return (
            <div className='content'>
                {/* <div id='button-return' onClick={() => this.props.hideCardDetails()}><i className='fas fa-arrow-left' /></div> */}
                <div className='container'>
                    <div className='card-info'>
                        <div className='gallery-area'>
                            <img src={card.card_images[this.state.imageNumber].image_url} className='card-image' alt='card' />
                            <div className='gallery-nav'>
                                <button id='gallery-prev' className='button-gallery-nav' onClick={() => this.prevImage()}>
                                    <span className='fas fa-caret-left'></span>
                                </button>
                                <span id='gallery-info'>{(this.state.imageNumber + 1) + ' / ' + card.card_images.length}</span>
                                <button id='gallery-prev' className='button-gallery-nav' onClick={() => this.nextImage()}>
                                    <span className='fas fa-caret-right'></span>
                                </button>
                            </div>
                        </div>
                        <div className='card-data'>
                            <div id='card-data-details'>
                                <span id='card-data-name'>{card.name}</span>
                                {/* <img id='card-data-attribute-icon' src={IconLight} alt='attr-icon' /> */}
                                <div id='card-data-stats'>
                                    <span>
                                        <span className='stat-label'>TYPE:</span>
                                        <span className='stat-value-link' onClick={() => this.props.search('type: ' + card.race)}>{card.race}</span>
                                    </span>
                                    <span>
                                        <span className='stat-label'>ARCHETYPE:</span>
                                        <span className='stat-value-link' onClick={() => this.props.search('archetype: ' + card.archetype)}>{card.archetype}</span>
                                    </span>
                                    <span>
                                        <span className='stat-label'>Number:</span>
                                        <span className='stat-value'>{card.id}</span>
                                    </span>
                                </div>
                            </div>

                            <div id='card-data-buttons'>
                                <a className='card-data-link' href={'https://yugipedia.com/wiki/' + card.name} target='_blank' rel="noopener noreferrer"><img src={IconWiki} alt='wiki-icon' /> Wiki</a>
                                <a className='card-data-link' href={'https://yugipedia.com/wiki/Card_Tips:' + card.name} target='_blank' rel="noopener noreferrer"><i className="far fa-thumbs-up" /> Tips</a>
                                <a className='card-data-link' href={'https://yugipedia.com/wiki/Card_Trivia:' + card.name} target='_blank' rel="noopener noreferrer"><i className="far fa-lightbulb" /> Trivia</a>
                                <a className='card-data-link' href={'https://yugipedia.com/wiki/Card_Errata:' + card.name} target='_blank' rel="noopener noreferrer"><i className="fas fa-edit" /> Errata</a>
                                <a className='card-data-link' href={'https://yugipedia.com/wiki/Card_Rulings:' + card.name} target='_blank' rel="noopener noreferrer"><i className="fas fa-ruler" /> Rulings</a>
                            </div>

                            <div id='card-data-desc'>{this.renderCardDesc(card.desc)}</div>
                        </div>
                    </div>

                    <div id='set-container'>
                        <div className='header'>
                            <span>Number</span>
                            <span>Name</span>
                            <span>Rarity</span>
                            <span>Price</span>
                            <span>Owned</span>
                        </div>
                        <div className='table-contents'>
                            {setRows}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default CardDetails;