import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import { ApplicationState } from '../../utils/reduxStore';
import { ThemeState } from '../../utils/reducers/theme';

import './styles.css';

interface ButtonProps {
  classNames: string[],
  text: string,
  action: () => any
  invisible?: boolean
  disabled?: boolean

  theme: ThemeState
}

const Button = ({ classNames, text, action, invisible, disabled, theme }: ButtonProps) => {
  return (
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
  );
}

function mapStateToProps(state: ApplicationState) {
  return {
    theme: state.theme
  };
}

export default compose(
  connect(
    mapStateToProps
  )
)(Button);
