import React from 'react';
import SymbolsList from './SymbolsList';
import fixer from '../api/fixer';
import _ from 'lodash';


class ConverthBar extends React.Component {
  state = {
    symbols: {},
    originalSymbol: '',
    convertedSymbol: '',
    amount: 1,
    showError: false
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

    if (this.state.amount) {
      this.calculateConversion(response.data.rates);
    } else {
      this.setState({
        showError: true
      });
    }
  }

  calculateConversion(rates) {
    const conversion = (this.state.amount * rates[this.state.originalSymbol]) * (1 / rates[this.state.convertedSymbol]);
    this.setState({
      result: conversion.toFixed(3)
    });
  }

  onAmountChanged = event => {
    event.preventDefault();
    this.setState({
      amount: event.target.value,
      showError: false,
      result: null
    });
  }

  onInputChange = event => {
    event.preventDefault();

    const selected = event.target.name === 'original' ? 'originalSymbol' : 'convertedSymbol'

    this.setState({
      result: null,
      [selected]: event.target.value
    });
  }

  render() {
    return (
      <div className="convert-bar ui segment">
        <form className="ui form" onSubmit={this.onFormSubmit} >
          <div className="fields">
            <div className="inline field">
              <label className="ui right pointing label">Convert</label>
              <input 
                className="mini" 
                type="number" 
                name="amount" 
                onChange={this.onAmountChanged} 
                value={this.state.amount}
              />
              <span className="text">x</span>
              <SymbolsList onChangeHandler={this.onInputChange} name="original" symbols={this.state.symbols} />
            </div>
            <div className="inline field">
              <label className="ui right pointing label">To</label>
              <SymbolsList onChangeHandler={this.onInputChange} name="converted" symbols={this.state.symbols} />
            </div>
            <button onClick={this.onFormSubmit} className="positive ui button">Convert</button>
          </div>
        </form>
        {this.state.result && 
          <div className="ui message">
            <p>
              {`${this.state.symbols[this.state.originalSymbol]} is ${this.state.result} ${this.state.symbols[this.state.convertedSymbol]}`}
            </p>
          </div>}
          {this.state.showError &&
            <div className="ui error message">
              <p>Conversion amount must be a positive number</p>
            </div>}
      </div>
    );
  }
}

export default ConverthBar;