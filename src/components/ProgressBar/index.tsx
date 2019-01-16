import React from 'react';
import cx from 'classnames';

import './styles.css';
import { DestinyObjectiveDefinition, DestinyObjectiveProgress } from 'bungie-api-ts/destiny2/interfaces';

interface ProgressBarProps {
  objectiveDefinition: DestinyObjectiveDefinition
  playerProgress?: DestinyObjectiveProgress

  classNames?: string[]
  hideCheck?: boolean
  chunky?: boolean
}

const ProgressBar = (props: ProgressBarProps) => {

  let { progressDescription, completionValue, allowOvercompletion = true, hash: objectiveHash } = props.objectiveDefinition;
  let { complete = false, progress = 0 } = (props.playerProgress || {});

  let { classNames, hideCheck, chunky } = props

  progress = allowOvercompletion ? progress : Math.min(progress, completionValue);
  let wholeFraction = completionValue === 1 ? true : false;
  let completeText = complete ? 'Complete' : 'Incomplete';

  return (
    <div key={objectiveHash} className={cx('progress-bar', classNames, { complete: complete, chunky: chunky })}>
      {!hideCheck ? <div className={cx('check', { ed: complete })} /> : null}
      <div className={cx('bar', { full: hideCheck })}>
        <div className='text'>
          <div className='description'>{progressDescription !== '' ? progressDescription : completeText}</div>
          {!wholeFraction ? (
            <div className='fraction'>
              {progress}/{completionValue}
            </div>
          ) : null}
        </div>
        <div className='fill' style={{ width: `${(progress / completionValue) * 100}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
