import React from 'react';
import _ from 'lodash';

const SymbolsList = ({symbols, name, onChangeHandler}) => {

  if (_.isEmpty(symbols)) {
    return <div>Loading...</div>;
  }  
  
  const renderedList = _.map(symbols, (symbolName, symbolKey) => {
    return (
      <option value={symbolKey} key={symbolKey}>{symbolName}</option>
    );
  });
  
  return (
    <select 
      className="ui fluid dropdown" 
      onChange={onChangeHandler}
      name={name}
    >
      {renderedList}
    </select>
  );
};

export default SymbolsList;
