import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import transform from 'lodash/transform';
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import { withNamespaces, WithNamespaces } from 'react-i18next';
import cx from 'classnames';
import { DestinyRecordComponent, DestinyRecordDefinition, DestinyPresentationNodeDefinition } from 'bungie-api-ts/destiny2/interfaces';
import { diff } from 'deep-object-diff'

import ObservedImage from '../ObservedImage';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { ProfileState } from '../../utils/reducers/profile';

import './styles.css';
import { ApplicationState } from '../../utils/reduxStore';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */

/*
function difference(object, base) {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
*/

function difference<T extends object>(a: T, b: T): Partial<T> {
  return diff(a, b);
}

interface NotificationProgressProps {
  profile: ProfileState
  manifest?: DestinyManifestJsonContent
}

interface NotificationProgressState {
  progress: {
    type?: string
    hash?: string
    number?: number
    timedOut?: boolean
  }
}

class NotificationProgress extends React.Component<NotificationProgressProps & WithNamespaces, NotificationProgressState> {

  timer?: number

  constructor(props: NotificationProgressProps & WithNamespaces) {
    super(props);

    this.state = {
      progress: {
        number: 0,
        timedOut: true
      }
    };
  }

  timeOut = () => {
    if (!this.timer && !this.state.progress.timedOut && this.state.progress.hash) {
      this.timer = window.setTimeout((prevState = this.state) => {
        this.timer = undefined;
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

  componentDidUpdate(prevProps: NotificationProgressProps & WithNamespaces) {

    console.log(this)
    this.timeOut();

    const fresh = this.props.profile.data;
    const stale = this.props.profile.prevData ? this.props.profile.prevData : this.props.profile.data;

    if (!fresh || !stale) return

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

    let progress: {
      type?: string
      hash?: string
      number?: number
    } = {};

    if (Object.keys(profileRecords).length > 0) {
      Object.keys(profileRecords).forEach(key => {

        const record = profileRecords[+key];

        if (!record || record.state === undefined) return

        let state = enumerateRecordState(record.state);
        console.log(state);
        if (!state.objectiveNotCompleted) { //  && !state.recordRedeemed
          if (progress.hash) {
            progress.number = (progress.number || 0) + 1;
            return;
          }
          progress.type = 'record';
          progress.hash = key;
          progress.number = (progress.number || 0) + 1;
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

    if (!manifest) return

    if (this.state.progress.type === 'record' && this.state.progress.hash) {
      let record = manifest.DestinyRecordDefinition[+this.state.progress.hash];

      let link: string | undefined;

      try {
        let reverse1: DestinyPresentationNodeDefinition | undefined;
        let reverse2: DestinyPresentationNodeDefinition | undefined;
        let reverse3: DestinyPresentationNodeDefinition | undefined;

        manifest.DestinyRecordDefinition[record.hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
          if (manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
            return; // if hash is a child of seals, skip it
          }
          if (reverse1) {
            return;
          }
          reverse1 = manifest.DestinyPresentationNodeDefinition[element];
        });

        let iteratees = reverse1 ? reverse1.parentNodeHashes : [];
        iteratees.forEach(element => {
          if (reverse2) {
            return;
          }
          reverse2 = manifest.DestinyPresentationNodeDefinition[element];
        });

        if (reverse2 && reverse2.parentNodeHashes) {
          reverse3 = manifest.DestinyPresentationNodeDefinition[reverse2.parentNodeHashes[0]];
        }

        if (reverse1 && reverse2 && reverse3) {
          link = `/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${record.hash}`;
        }
      } catch (e) {
        // console.log(e);
      }

      let description = record.displayProperties.description !== '' ? record.displayProperties.description : false;
          description = !description && record.loreHash ? manifest.DestinyLoreDefinition[record.loreHash].displayProperties.description.slice(0, 117).trim() + '...' : description;
      return (
        <div id='notification-progress' className={cx('record', { timedOut: this.state.progress.timedOut })}>
          <div className='type'>
            <div className='text'>Triumph completed</div>
          </div>
          <div className='item'>
            <div className='properties'>
              <div className='name'>{record.displayProperties.name}</div>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${record.displayProperties.icon}`} noConstraints />
              <div className='description'>{description}</div>
            </div>
            { this.state.progress.number && this.state.progress.number > 1 ? <div className='more'>And {this.state.progress.number - 1} more</div> : null }
          </div>
          {link ? <Link to={link} /> : null}
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    profile: state.profile,
    theme: state.theme,
    manifest: state.manifest.manifestContent
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps
  )(NotificationProgress)
);