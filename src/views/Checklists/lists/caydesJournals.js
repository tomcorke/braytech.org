import React from 'react';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';
import ReactMarkdown from 'react-markdown';

const caydesJournals = props => {
  let profileProgressions = props.response.profile.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[2448912219]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    var actual = [78905203, 1394016600, 1399126202, 4195138678];
    if (actual.includes(hash)) {
      var completed = value;
      var item = false;
      Object.entries(manifest.DestinyChecklistDefinition[2448912219].entries).forEach(([pear, peach]) => {
        if (manifest.DestinyChecklistDefinition[2448912219].entries[pear].hash === hash) {
          item = manifest.DestinyChecklistDefinition[2448912219].entries[pear];
          return;
        }
      });

      list.push({
        completed: completed ? 1 : 0,
        element: (
          <li key={item.hash} data-state={completed ? `complete` : `incomplete`}>
            <div
              className={cx('state', {
                completed: completed
              })}
            />
            <ReactMarkdown className='text' source={item.displayProperties.description} />
          </li>
        )
      });
    }
  });

  list = orderBy(list, [item => item.completed], ['asc']);

  return list;
};

export default caydesJournals;
