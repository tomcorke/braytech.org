import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import history from './history';

import { configureStore } from './utils/reduxStore';

class AppEntry extends React.Component {
  constructor(props) {
    super();
    this.state = {
      updateAvailable: false
    };
  }

  config = {
    onUpdate: registration => {
      this.setState({
        updateAvailable: true
      });
    },
    onSuccess: registration => {}
  };

  componentDidMount() {
    serviceWorker.register(this.config);
  }

  render() {
    return (
      <Provider store={configureStore(history)}>
        <App updateAvailable={this.state.updateAvailable} />
      </Provider>
    );
  }
}

ReactDOM.render(<AppEntry />, document.getElementById('root'));
