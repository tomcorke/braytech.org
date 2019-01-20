import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

import Records from '../Records';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';
import { ProfileState } from '../../utils/reducers/profile';
import { Location } from 'history';
import { ApplicationState } from '../../utils/reduxStore';

interface RecordsAlmostProps {
  manifest?: DestinyManifestJsonContent
  profile: ProfileState
  location: Location

  selfLinkFrom?: string
  limit?: number
  pageLink?: string
}

class RecordsAlmost extends React.Component<RecordsAlmostProps> {

  private scrollToRecordRef = React.createRef<HTMLElement>();

  render() {
    const { manifest, profile } = this.props;

    if (!manifest || !profile.data) return

    const characterId = this.props.profile.characterId;

    const characterRecords = profile.data.profile.characterRecords.data;
    const profileRecords = profile.data.profile.profileRecords.data.records;

    let almost: {
      distance?: number,
      item: JSX.Element
    }[] = [];
    let ignores: number[] = [];

    // ignore collections badges
    manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(child => {
      const childDefinition = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash]
      if (childDefinition.completionRecordHash) ignores.push(childDefinition.completionRecordHash);

      childDefinition.children.presentationNodes.forEach(subchild => {
        const subChildDefinition = manifest.DestinyPresentationNodeDefinition[subchild.presentationNodeHash]
        if (subChildDefinition.completionRecordHash) ignores.push(subChildDefinition.completionRecordHash);
      });

    });

    // ignore triumph seals
    manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.forEach(child => {
      const childDefinition = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash]
      if (childDefinition.completionRecordHash) ignores.push(childDefinition.completionRecordHash);
    });

    Object.entries(profileRecords).forEach(([key, record]) => {

      if (manifest.DestinyRecordDefinition[+key].redacted) {
        return;
      }

      // ignore collections badges etc
      if (ignores.includes(parseInt(key, 10))) {
        return;
      }

      if (enumerateRecordState(record.state).invisible || enumerateRecordState(record.state).recordRedeemed) {
        return;
      }

      let completionValueTotal = 0;
      let progressValueTotal = 0;

      record.objectives.forEach(obj => {
        let v = obj.completionValue;
        let p = obj.progress || 0;

        completionValueTotal = completionValueTotal + v;
        progressValueTotal = progressValueTotal + (p > v ? v : p); // prevents progress values that are greater than the completion value from affecting the average
      });

      // var mark = false;

      const distance = progressValueTotal / completionValueTotal;
      // if (distance > 0.81 && distance < 1.0) {
      //   mark = true;
      // }

      if (distance >= 1.0) {
        return;
      }

      let objectives: JSX.Element[] = [];

      record.objectives.forEach(obj => {
        let objDef = manifest.DestinyObjectiveDefinition[obj.objectiveHash];

        objectives.push(
          <li key={objDef.hash}>
            <div
              className={cx('progress', {
                complete: obj.progress && obj.progress >= obj.completionValue ? true : false
              })}
            >
              <div className='title'>{objDef.progressDescription}</div>
              <div className='fraction'>
                {obj.progress}/{obj.completionValue}
              </div>
              <div
                className='bar'
                style={{
                  width: `${((obj.progress || 0) / obj.completionValue) * 100}%`
                }}
              />
            </div>
          </li>
        );
      });

      let selfLinkFrom = this.props.selfLinkFrom ? this.props.location.pathname : undefined;

      almost.push({
        distance,
        item: <Records key={key} {...this.props} selfLink selfLinkFrom={selfLinkFrom} hashes={[+key]} />
      });
    });

    almost = orderBy(almost, [record => record.distance], ['desc']);
    almost = this.props.limit ? almost.slice(0, this.props.limit) : almost;
    if (this.props.pageLink) {
      almost.push({
        item: (
          <li key='pageLink' className='linked'>
            <Link to={{ pathname: '/triumphs/almost-complete', state: { from: '/triumphs' } }}>See next 100</Link>
          </li>
        )
      })
    }

    return (
      <ul className={cx('list record-items almost')}>
        {almost.map((value, index) => {
          return value.item;
        })}
      </ul>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    manifest: state.manifest.manifestContent,
    profile: state.profile,
    location: state.router.location
  };
}

export default compose(
  connect(mapStateToProps)
)(RecordsAlmost);
