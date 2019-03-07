import React from 'react';
import ConvertBar from './ConvertBar';


class App extends React.Component {
  render() {
    return (
      <div className="ui container">
        <ConvertBar onFormSubmit={this.onTermSubmit} />
      </div>
    );
  }
}

export default App;