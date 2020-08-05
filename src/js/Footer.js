import React, { Component } from 'react';
import 'scss/Footer.scss';

class Footer extends Component {

    render() {
        let resultsCount = this.props.resultsCount;
        let page = this.props.page;
        let maxPage = Math.ceil(resultsCount / this.props.resultsPerPage) - 1;
        let numberLow = page * this.props.resultsPerPage;
        let numberHigh = numberLow + this.props.pageResultsCount;

        let n0 = 1, n1 = 2, n2 = 3;

        if (maxPage > 3) {
            if (page === maxPage) {
                n0 = maxPage - 1;
                n1 = maxPage;
                n2 = maxPage + 1;
            } else if (page > 0) {
                n0 = page;
                n1 = page + 1;
                n2 = page + 2;
            }
        } else {
            n1 = maxPage > 0 ? 2 : ' ';
            n2 = maxPage > 1 ? 3 : ' ';
        }

        let lastUpdated = undefined;
        if (localStorage.collection) {
            let collection = JSON.parse(localStorage.collection);
            lastUpdated = new Date(collection.lastUpdated).toLocaleString();
        }

        return (
            <div id='footer'>
                <span id='app-info'>
                    Created by <a href="https://twitter.com/_kianbennett" target="_blank" rel="noopener noreferrer" >@_kianbennett</a>
                    {/* <span id='update-info'> | Database updated {lastUpdated}</span> */}
                </span>
                <div id='pagination'>
                    <span id='results-info'>Found {resultsCount} cards [showing {numberLow + 1}-{numberHigh}]</span>
                    <button id='page-first' className='button-page-nav' onClick={() => this.props.firstPage()} disabled={this.props.page === 0 ? true : null}>
                        <span className='fas fa-angle-double-left'></span>
                    </button>
                    <button id='page-prev' className='button-page-nav' onClick={() => this.props.prevPage()} disabled={this.props.page === 0 ? true : null}>
                        <span className='fas fa-caret-left'></span>
                    </button>
                    <div className='page-buttons'>
                        <button id='page-1' className={'button-page' + (page === 0 ? ' button-page-active' : '')}>{n0}</button>
                        <button id='page-2' className={'button-page' + (page > 0 && (maxPage === 1 || page < maxPage) ? ' button-page-active' : '')}>{n1}</button>
                        <button id='page-3' className={'button-page' + (page === maxPage && maxPage > 1 ? ' button-page-active' : '')}>{n2}</button>
                    </div>
                    <button id='page-next' className='button-page-nav' onClick={() => this.props.nextPage()} disabled={this.props.page === maxPage ? true : null}>
                        <span className='fas fa-caret-right'></span>
                    </button>
                    <button id='page-last' className='button-page-nav' onClick={() => this.props.lastPage()} disabled={this.props.page === maxPage ? true : null}>
                        <span className='fas fa-angle-double-right'></span>
                    </button>
                </div>
            </div>
        );
    }
}

export default Footer;