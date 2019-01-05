import React from 'react';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

const sleeperNodes = props => {
  let profileProgressions = props.response.profile.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[365218222]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let checklist = false;
    Object.entries(manifest.DestinyChecklistDefinition[365218222].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[365218222].entries[pear].hash === hash) {
        checklist = manifest.DestinyChecklistDefinition[365218222].entries[pear];
        return;
      }
    });

    let itemDefintion = manifest.DestinyInventoryItemDefinition[checklist.itemHash];
    let name = itemDefintion.displayProperties.description
      .toString()
      .replace('CB.NAV/RUN.()', '')
      .match(/.*?(?=\.)/)[0];

    list.push({
      completed: completed ? 1 : 0,
      name: name,
      element: (
        <li key={checklist.hash} data-state={completed ? `complete` : `incomplete`}>
          <div
            className={cx('state', {
              completed: completed
            })}
          />
          <div className='text'>
            <p>{itemDefintion.displayProperties.description.toString().replace('CB.NAV/RUN.()', '')}</p>
          </div>
          <div className='lowlines'>
            <a href={`https://lowlidev.com.au/destiny/maps/mars/${checklist.hash}?origin=BRAYTECH`} target='_blank' rel='noopener noreferrer'>
              <i className='uniE1C4' />
            </a>
          </div>
        </li>
      )
    });
  });

  list = orderBy(list, [item => item.name], ['asc']);

  return list;
};

export default sleeperNodes;
