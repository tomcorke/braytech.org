import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const ChecklistItem = props => {
  return (
    <li>
      <div
        className={cx('state', {
          completed: props.completed
        })}
      />
      {props.children}
      {props.mapPath && (
        <div className='lowlines'>
          <a
            href={`https://lowlidev.com.au/${props.mapPath}?origin=BRAYTECH`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <i className='uniE1C4' />
          </a>
        </div>
      )}
    </li>
  );
};
ChecklistItem.props = {
  completed: PropTypes.bool,
  mapPath: PropTypes.string
};

export default ChecklistItem;
