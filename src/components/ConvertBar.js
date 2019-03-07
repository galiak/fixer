import React from 'react';
import SymbolsList from './SymbolsList';
import fixer from '../api/fixer';
import _ from 'lodash';


class ConverthBar extends React.Component {
  state = {
    symbols: {},
    originalSymbol: '',
    convertedSymbol: ''
  };

  componentWillMount = async () => {
    const response = await fixer.get('/symbols');
    const firstSymbol = _.first(Object.keys(response.data.symbols));

    this.setState({
      symbols: response.data.symbols,
      originalSymbol: firstSymbol,
      convertedSymbol: firstSymbol,
      result: null
    });
  }

  onFormSubmit = async event => {
    event.preventDefault();
    
    // error 105: Access Restricted - Your current Subscription Plan does not support this API Function
    // const response = await fixer.get('/convert', {
    //   params: {
    //     from: this.state.originalSymbol,
    //     to: this.state.convertedSymbol,
    //     amount:  1
    //   }
    // });
    const selectedSymbols = `EUR, ${this.state.originalSymbol}, ${this.state.convertedSymbol}`
    const response = await fixer.get('/latest', {
      params: {
        symbols: selectedSymbols,
      }
    });

    this.calculateConversion(response.data.rates);
  }

  calculateConversion(rates) {
    const conversion = rates[this.state.originalSymbol] * (1 / rates[this.state.convertedSymbol]);
    this.setState({
      result: conversion.toFixed(3)
    });
  }

  onInputChange = event => {
    event.preventDefault();

    const selected = event.target.name === 'original' ? 'originalSymbol' : 'convertedSymbol'

    this.setState({
      [selected]: event.target.value
    });
  }

  render() {
    return (
      <div className="search-bar ui segment">
        <form className="ui form" onSubmit={this.onFormSubmit} >
          <div className="fields">
            <div className="inline field">
              <label className="ui right pointing label">Convert</label>
              <SymbolsList onChangeHandler={this.onInputChange} name="original" symbols={this.state.symbols} />
            </div>
            <div className="inline field">
              <label className="ui right pointing label">To</label>
              <SymbolsList onChangeHandler={this.onInputChange} name="converted" symbols={this.state.symbols} />
            </div>
            <button onClick={this.onFormSubmit} className="positive ui button">Convert</button>
          </div>
        </form>
        <div className="ui divider"></div>
        {this.state.result}
      </div>
    );
  }
}

export default ConverthBar;