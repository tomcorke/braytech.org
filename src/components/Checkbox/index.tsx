import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { ThemeState } from '../../utils/reducers/theme';
import { ApplicationState } from '../../utils/reduxStore';

import './styles.css';

interface CheckboxProps {
  classNames: string[]
  completed?: boolean
  checked?: boolean
  text: string
  linked?: boolean

  theme: ThemeState
}

const Checkbox = ({ classNames, completed, checked, text, linked, theme }: CheckboxProps) => {

  let isChecked = completed || checked

  return (
    <div className={cx('check-box', classNames, { checked: isChecked, linked: linked }, theme.selected)}>
      <div className={cx('check', { ed: checked })} />
      <div className='text'>
        {text}
      </div>
    </div>
  );
}

function mapStateToProps(state: ApplicationState) {
  return {
    theme: state.theme
  };
}

export default connect(
  mapStateToProps
)(Checkbox);
