import React from 'react';
import cx from 'classnames';

import BraytechContext from '../../BraytechContext';

import './styles.css';

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classNames, text, action, invisible, disabled } = this.props;

    return (
      <BraytechContext.Consumer>
        {theme => (
          <button
            className={cx(classNames, { disabled: disabled, invisible: invisible }, theme.selected)}
            onClick={() => {
              if (action) {
                action();
              }
            }}
          >
            <div className='text'>{text}</div>
          </button>
        )}
      </BraytechContext.Consumer>
    );
  }
}

export default Button;
