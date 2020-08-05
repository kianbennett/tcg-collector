import React, { Component } from 'react';
import 'scss/CardArea.scss';
// import CardImage from 'assets/blue-eyes.png';
// import CardBack from 'assets/card-back.png';
// import CardBase from 'assets/card-base.jpg';
// import * as database from './card-database.js';

class CardArea extends Component {

    handleCardClick(card) {
        this.props.showCardDetails(card)
    }

    getCardCount(card) {
		let count = 0;
		if(localStorage.collection) {
			let collection = JSON.parse(localStorage.collection);
			if(collection.cards[card.id]) {
				for(let set in collection.cards[card.id]) {
					for(let condition in collection.cards[card.id][set]) {
						count += collection.cards[card.id][set][condition];
					}
				}
			}
        }
		return count;
	}

    renderCardContainer(card, index) {
        let count = this.getCardCount(card);
        let countElement;
        if (count > 0) countElement = <div className='count'>{count}</div>;
        return (
            <div className='card-container' onClick={() => this.handleCardClick(card)} key={card.id === 0 ? index : card.id}>
                <img src={card.card_images[0].image_url} alt='card_image' />
                <div className='label'>{card.name}</div>
                {countElement}
            </div>
        );
    }

    renderCardContainerEmpty(index) {
        return (
            <div className={'card-container-empty'} key={index}></div>
        );
    }

    render() {
        let containers = [];

        let resultsPerPage = this.props.resultsPerPage;
        let pageResults = this.props.pageResults;

        for (let i = 0; i < resultsPerPage; i++) {
            if (i < pageResults.length) {
                containers.push(this.renderCardContainer(pageResults[i], i));
            } else {
                containers.push(this.renderCardContainerEmpty(i));
            }
        }

        return (
            <div className='content'>
                <div id='card-area'>
                    {containers}
                </div>
            </div>
        );
    }
}

export default CardArea;