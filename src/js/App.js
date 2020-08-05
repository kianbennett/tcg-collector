import React, { Component } from 'react';
import Navbar from './Navbar';
// import SidePanel from './SidePanel';
import Footer from './Footer';
import CardArea from './CardArea';
import CardDetails from './CardDetails';
// import Settings from './Settings';
// import cardList from 'assets/cardinfo.json';
import 'scss/App.scss';

class App extends Component {
	// Props contains properties that are assigned once and do not change (immutable)
	constructor(props) {
		super(props)

		this.addCardToCollection = this.addCardToCollection.bind(this);
		this.removeCardFromCollection = this.removeCardFromCollection.bind(this);
		this.showCardDetails = this.showCardDetails.bind(this);
		this.hideCardDetails = this.hideCardDetails.bind(this);
		this.onChangeHideUnowned = this.onChangeHideUnowned.bind(this);
		this.search = this.search.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.firstPage = this.firstPage.bind(this);
		this.lastPage = this.lastPage.bind(this);

		// Assign initial state (state contains properties that are mutable)
		this.state = {
			cardDetails: null,
			cardList: null,
			resultsPerPage: 18,
			hideUnowned: false,
			sortMode: 'number',
			page: 0,
			results: []
		};
	}

	componentDidMount() {  
		console.log('Loading database...');
    	fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
        	.then(response => response.json())
			.then(data => {
				this.setState({ cardList: data.data });
				this.search('');
				console.log('Loaded database with ' + data.data.length + ' cards');
			});

		// if (localStorage.collection) {
		// 	let collection = JSON.parse(localStorage.collection);
		// 	collection.lastUpdated = new Date();
		// 	localStorage.collection = JSON.stringify(collection);
		// }
	}

	addCardToCollection(card, set, condition, count, newCondition) {
		let collection = { cards: {} };
		if (localStorage.collection) {
			collection = JSON.parse(localStorage.collection);
		}

		if(!collection.cards[card.id]) collection.cards[card.id] = {};
		if(!collection.cards[card.id][set.set_code]) collection.cards[card.id][set.set_code] = {};

		// Find a condition that hasn't been used
		if(newCondition) {
			if(!collection.cards[card.id][set.set_code]['nm']) condition = 'nm';	
			else if(!collection.cards[card.id][set.set_code]['lp']) condition = 'lp';
			else if(!collection.cards[card.id][set.set_code]['mp']) condition = 'mp';
			else if(!collection.cards[card.id][set.set_code]['hp']) condition = 'hp';
			else if(!collection.cards[card.id][set.set_code]['dmg']) condition = 'dmg';
		}

		if(!collection.cards[card.id][set.set_code][condition]) collection.cards[card.id][set.set_code][condition] = 0;
		
		collection.cards[card.id][set.set_code][condition] += count;

		localStorage.collection = JSON.stringify(collection);
	}

	removeCardFromCollection(card, set, condition, count) {
		let collection = { cards: {} };
		if (localStorage.collection) {
			collection = JSON.parse(localStorage.collection);
		}

		if(collection.cards[card.id] && collection.cards[card.id][set.set_code] && collection.cards[card.id][set.set_code][condition]) {
			collection.cards[card.id][set.set_code][condition] -= count;
			// If there are no more cards with a particular condition, remove the condition object
			if(collection.cards[card.id][set.set_code][condition] <= 0) {
				delete collection.cards[card.id][set.set_code][condition];
				// If there are no more cards (only one remaining, i.e. the one set to undefined) 
				// in an entire set, remove the set object
				if(Object.keys(collection.cards[card.id][set.set_code]).length === 0) {
					delete collection.cards[card.id][set.set_code];
				}
				// If ther are no more cards with that id, remove the card object
				if(Object.keys(collection.cards[card.id]).length === 0) {
					delete collection.cards[card.id];
				}
			}
		}

		localStorage.collection = JSON.stringify(collection);
	}

	showCardDetails(card) {
		this.setState({ cardDetails: card });
	}

	hideCardDetails() {
		this.showCardDetails(null);
	}

	onChangeHideUnowned = event => {
		this.setState({ hideUnowned: event.target.checked }, () => this.search(document.getElementById('search-box').value))
	};
	onChangeSortMode = event => {
		this.setState({ sortMode: event.target.value }, () => this.search(document.getElementById('search-box').value));
	};

	search(searchTerm) {
		document.getElementById('search-box').value = searchTerm;
		let cardList = this.state.cardList;

		// let cards = JSON.parse(JSON.stringify(cardList));
		let cards = [...cardList];

		searchTerm = searchTerm.trim().toLowerCase();
		let results;
		if (searchTerm.startsWith('set:')) {
			let set = searchTerm.replace('set:', '').trim();
			results = cards.filter(card => card.card_sets !== undefined && card.card_sets.find(e => e.set_name.toLowerCase() === set) !== undefined);
			// results.sort((a, b) => a.card_sets.find(e => e.set_name.toLowerCase() === set).set_code > 
			// 	b.card_sets.find(e => e.set_name.toLowerCase() === set).set_code);
		} else if (searchTerm.startsWith('type:')) {
			let type = searchTerm.replace('type:', '').trim();
			results = cards.filter(card => card.race.toLowerCase() === type);
		} else if (searchTerm.startsWith('archetype:')) {
			let archetype = searchTerm.replace('archetype:', '').trim();
			results = cards.filter(card => card.archetype !== undefined && card.archetype.toLowerCase() === archetype);
		} else {
			results = cards.filter(card => card.name.toLowerCase().includes(searchTerm));
		}

		if(this.state.hideUnowned && localStorage.collection) {
			let collection = JSON.parse(localStorage.collection);
			results = cards.filter(card => collection.cards[card.id] !== undefined);
		}

		// results = cardList;

		// Sort results based on sort mode
		switch(this.state.sortMode) {
			case 'number':
				if (searchTerm.startsWith('set:')) {
					let set = searchTerm.replace('set:', '').trim();
					results.sort((a, b) => a.card_sets.find(e => e.set_name.toLowerCase() === set).set_code > 
						b.card_sets.find(e => e.set_name.toLowerCase() === set).set_code);
				} else {
					results.sort((a, b) => a.id > b.id);
				}
				break;
			case 'a-z':
				results.sort((a, b) => a.name > b.name);
				break;
			case 'z-a':
				results.sort((a, b) => a.name < b.name);
				break;
			case 'level':
				// results.sort((a, b) => parseInt(b.level) - parseInt(a.level));
				results.sort((a, b) => (a.level === undefined) - (b.level === undefined) || b.level > a.level || -(b.level < a.level));
				break;
			case 'atk':
				results.sort((a, b) => (a.atk === undefined) - (b.atk === undefined) || b.atk > a.atk || -(b.atk < a.atk));
				break;
			case 'def':
				results.sort((a, b) => (a.def === undefined) - (b.def === undefined) || b.def > a.def || -(b.def < a.def));
				break;
			case 'price':
				results.sort((a, b) => {
					let aPrice = a.card_sets !== undefined ? parseFloat([...a.card_sets].sort((c, d) => parseFloat(c.set_price) < parseFloat(d.set_price))[0].set_price) : 0;
					let bPrice = b.card_sets !== undefined ? parseFloat([...b.card_sets].sort((c, d) => parseFloat(c.set_price) < parseFloat(d.set_price))[0].set_price) : 0;
					return (a.card_sets === undefined) - (b.card_sets === undefined) || bPrice > aPrice || -(bPrice < aPrice);
					// a.card_sets !== undefined && b.card_sets !== undefined &&
					// a.card_sets.sort((c, d) => parseInt(c.set_price) < parseInt(d.set_price))[0].set_price < 
					// b.card_sets.sort((c, d) => parseInt(c.set_price) < parseInt(d.set_price))[0].set_price
				});
				break;
			default:
		}

		this.setState({
			results: results,
			cardDetails: null,
			page: 0
		});
	}

	nextPage() {
		if(this.state.page < Math.ceil(this.state.results.length / this.state.resultsPerPage) - 1) {
			this.setState({ page: this.state.page + 1 });
		}
	}

	prevPage() {
		if(this.state.page > 0) {
			this.setState({ page: this.state.page - 1 });
		}
	}

	firstPage() {
		this.setState({ page: 0 });
	}

	lastPage() {
		this.setState({ page: Math.ceil(this.state.results.length / this.state.resultsPerPage) - 1 });
	}

	// Render is called whenever an update happens and returns the DOM element to render
	render() {
		let content;
		let footer;

		if (this.state.cardDetails != null) {
			content = <CardDetails card={this.state.cardDetails} search={this.search} 
						addCardToCollection={this.addCardToCollection} removeCardFromCollection={this.removeCardFromCollection}/>
		} else if (this.state.cardList != null) {
			let page = this.state.page;
			let results = this.state.results;
			let resultsPerPage = this.state.resultsPerPage;
			let pageResults = results.slice(page * resultsPerPage, (page + 1) * resultsPerPage);

			content = <CardArea resultsPerPage={resultsPerPage} pageResults={pageResults} showCardDetails={this.showCardDetails} />
			footer = <Footer page={page} resultsCount={this.state.results.length} pageResultsCount={pageResults.length} resultsPerPage={resultsPerPage} 
				nextPage={this.nextPage} prevPage={this.prevPage} lastPage={this.lastPage} firstPage={this.firstPage} />
		} else {
			content = <div className='loading-icon'><div className='circle'></div></div>
		}

		return (
			<div className='app'>
				<div id='background'></div>
				<Navbar search={this.search} sortMode={this.state.sortMode} onChangeSortMode={this.onChangeSortMode} hideUnowned={this.state.hideUnowned} onChangeHideUnowned={this.onChangeHideUnowned} cardDetails={this.state.cardDetails} hideCardDetails={this.hideCardDetails} />
				{ content }
				{ footer }
			</div>
		);
	}
}

export default App;