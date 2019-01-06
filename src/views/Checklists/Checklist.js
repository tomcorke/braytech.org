import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../../components/ProgressBar';

const Checklist = props => {
  return (
    <>
      <div className='head'>
        <h4>{props.name}</h4>
        <div className='binding'>
          <p>{props.binding}</p>
        </div>
        <ProgressBar
          objectiveDefinition={{
            progressDescription: props.progressDescription,
            completionValue: props.totalItems
          }}
          playerProgress={{
            progress: props.completedItems
          }}
          hideCheck
          chunky
        />
      </div>
      <ul className='list no-interaction'>{props.children}</ul>
    </>
  );
};
Checklist.propTypes = {
  name: PropTypes.node.isRequired,
  binding: PropTypes.node.isRequired,
  progressDescription: PropTypes.string.isRequired,
  totalItems: PropTypes.number.isRequired,
  completedItems: PropTypes.number.isRequired
};
export default Checklist;
