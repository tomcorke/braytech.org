import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';
import { enumerateRecordState } from '../../utils/destinyEnums';

import './styles.css';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */

function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

class NotificationProgress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: {
        type: false,
        hash: false,
        timedOut: true
      }
    };
    this.timer = false;
  }

  timeOut = () => {
    if (!this.timer && !this.state.progress.timedOut && this.state.progress.hash) {
      this.timer = setTimeout((prevState = this.state) => {
        this.timer = false;
        console.log('timed out')
        this.setState({
          progress: {
            type: prevState.progress.type,
            hash: prevState.progress.hash,
            timedOut: true
          }
        });
      }, 10000);
    }
  }

  componentDidUpdate(prevProps) {

    console.log(this)
    this.timeOut();

    const fresh = this.props.profile.data;
    const stale = this.props.profile.prevData ? this.props.profile.prevData : this.props.profile.data;
    const characterId = this.props.profile.characterId;

    // console.log('characters', difference(fresh.profile.characters, stale.profile.characters));
    console.log('profileRecords', difference(fresh.profile.profileRecords.data.records, stale.profile.profileRecords.data.records));
    // console.log('characterRecords', difference(fresh.profile.characterRecords.data[characterId].records, stale.profile.characterRecords.data[characterId].records));
    // console.log('profileProgression', difference(fresh.profile.profileProgression, stale.profile.profileProgression));
    // console.log('characterProgressions', difference(fresh.profile.characterProgressions.data[characterId], stale.profile.characterProgressions.data[characterId]));
    // console.log('profileCollectibles', difference(fresh.profile.profileCollectibles.data.collectibles, stale.profile.profileCollectibles.data.collectibles));
    // console.log('characterCollectibles', difference(fresh.profile.characterCollectibles.data[characterId].collectibles, stale.profile.characterCollectibles.data[characterId].collectibles));

    if (!this.state.progress.timedOut) {
      return;
    }

    let profileRecords = difference(fresh.profile.profileRecords.data.records, stale.profile.profileRecords.data.records);

    let progress = {
      type: false,
      hash: false,
      timedOut: false
    };

    if (Object.keys(profileRecords).length > 0) {
      Object.keys(profileRecords).forEach(key => {
        if (profileRecords[key].state === undefined) {
          return;
        }
        let state = enumerateRecordState(profileRecords[key].state);
        console.log(state);
        if (!state.objectiveNotCompleted) { //  && !state.recordRedeemed
          progress.type = 'record';
          progress.hash = key;
        }
      });

      if (this.state.progress.timedOut && progress.type && (this.state.progress.hash !== progress.hash)) {
        this.setState({
          progress: progress
        });
      }
    }
  }

  render() {
    const { t, manifest } = this.props;
    
    const fresh = this.props.profile.data;
    const stale = this.props.profile.prevData ? this.props.profile.prevData : this.props.profile.data;
    const characterId = this.props.profile.characterId;

    if (this.state.progress.type === 'record') {
      let record = manifest.DestinyRecordDefinition[this.state.progress.hash];
      return (
        <div id='notification-progress' className={cx('record', { timedOut: this.state.progress.timedOut })}>
          <div className='type'>
            <div className='text'>Triumph completed</div>
          </div>
          <div className='item'>
            <div className='properties'>
              <div className='name'>{record.displayProperties.name}</div>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${record.displayProperties.icon}`} />
              <div className='description'>{record.displayProperties.description}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withNamespaces()
)(NotificationProgress);