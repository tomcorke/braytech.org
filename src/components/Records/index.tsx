import React from 'react';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';
import { connect } from 'react-redux';
import { DestinyPresentationNodeDefinition, DestinyObjectiveProgress } from 'bungie-api-ts/destiny2/interfaces';

import ObservedImage from '../ObservedImage';
import ProgressBar from '../ProgressBar';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { DestinyManifestJsonContent, DestinySettings } from '../../utils/reducers/manifest';
import { ProfileState } from '../../utils/reducers/profile';
import { CollectiblesState } from '../../utils/reducers/collectibles';

import './styles.css';
import { ApplicationState } from '../../utils/reduxStore';

interface RecordsProps {
  manifest?: DestinyManifestJsonContent
  settings?: DestinySettings
  profile: ProfileState
  collectibles: CollectiblesState

  highlight?: number
  node?: number
  hashes: number[]
  selfLink?: boolean
  selfLinkFrom?: string
  ordered?: boolean
}

class Records extends React.Component<RecordsProps> {

  private scrollToRecordRef: HTMLLIElement | undefined

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef) {
      window.scrollTo({
        top: this.scrollToRecordRef.offsetTop + this.scrollToRecordRef.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    const { manifest, settings, profile, highlight } = this.props

    if (!manifest || !settings || !profile.data) return

    const characterRecords = profile.data.profile.characterRecords.data;
    const profileRecords = profile.data.profile.profileRecords.data.records;
    const characterId = profile.characterId;

    let records: {
      completed?: boolean
      hash?: number
      element: JSX.Element
    }[] = [];

    if (this.props.node && characterId) {
      let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.node];

      tertiaryDefinition.children.records.forEach(child => {
        let recordDefinition = manifest.DestinyRecordDefinition[child.recordHash];

        let objectives: JSX.Element[] = [];
        if (recordDefinition.objectiveHashes) {
          recordDefinition.objectiveHashes.forEach(hash => {
            let objectiveDefinition = manifest.DestinyObjectiveDefinition[hash];

            if (profileRecords[recordDefinition.hash]) {
              let playerProgress: DestinyObjectiveProgress | undefined;
              profileRecords[recordDefinition.hash].objectives.forEach(objective => {
                if (objective.objectiveHash === hash) {
                  playerProgress = objective;
                }
              });

              objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
            } else if (characterRecords[characterId].records[recordDefinition.hash]) {
              let playerProgress: DestinyObjectiveProgress | undefined;
              characterRecords[characterId].records[recordDefinition.hash].objectives.forEach(objective => {
                if (objective.objectiveHash === hash) {
                  playerProgress = objective;
                }
              });

              objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
            }
          });
        }

        let state;
        if (profileRecords[recordDefinition.hash]) {
          state = profileRecords[recordDefinition.hash] ? profileRecords[recordDefinition.hash].state : 0;
        } else if (characterRecords[characterId].records[recordDefinition.hash]) {
          state = characterRecords[characterId].records[recordDefinition.hash] ? characterRecords[characterId].records[recordDefinition.hash].state : 0;
        } else {
          state = 0;
        }

        if (enumerateRecordState(state).invisible) {
          return;
        }

        if (enumerateRecordState(state).recordRedeemed && this.props.collectibles.hideTriumphRecords) {
          return;
        }

        const setScrollToRecordRef = (element: HTMLLIElement) => {
          this.scrollToRecordRef = undefined
          if (highlight === recordDefinition.hash) { return this.scrollToRecordRef = element }
        }

        if (recordDefinition.redacted) {
          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={setScrollToRecordRef}
                className={cx('redacted', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>Classified record</div>
                    <div className='description'>This record is classified and may be revealed at a later time.</div>
                  </div>
                </div>
              </li>
            )
          });
        } else {
          let description = recordDefinition.displayProperties.description !== '' ? recordDefinition.displayProperties.description : false;
          description = !description && recordDefinition.loreHash ? manifest.DestinyLoreDefinition[recordDefinition.loreHash].displayProperties.description.slice(0, 48) + '...' : description;

          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={setScrollToRecordRef}
                className={cx({
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash,
                  completed: enumerateRecordState(state).recordRedeemed,
                  'no-description': !description
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{recordDefinition.displayProperties.name}</div>
                    {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
                <div className='objectives'>{objectives}</div>
              </li>
            )
          });
        }
      });
    } else {
      let recordsRequested = this.props.hashes;
      recordsRequested.forEach(hash => {
        const recordDefinition = manifest.DestinyRecordDefinition[hash];

        let objectives: JSX.Element[] = [];
        let link: string | undefined

        // selfLink

        try {
          let reverse1: DestinyPresentationNodeDefinition | undefined;
          let reverse2: DestinyPresentationNodeDefinition | undefined;
          let reverse3: DestinyPresentationNodeDefinition | undefined;

          manifest.DestinyRecordDefinition[hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
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
            link = `/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
          }
        } catch (e) {
          // console.log(e);
        }

        if (recordDefinition.objectiveHashes) {
          recordDefinition.objectiveHashes.forEach(hash => {
            let objectiveDefinition = manifest.DestinyObjectiveDefinition[hash];

            if (profileRecords[recordDefinition.hash]) {
              let playerProgress: DestinyObjectiveProgress | undefined;
              profileRecords[recordDefinition.hash].objectives.forEach(objective => {
                if (objective.objectiveHash === hash) {
                  playerProgress = objective;
                }
              });

              // override
              if (hash === 1278866930 && playerProgress && playerProgress.complete) {
                playerProgress  = { ...playerProgress, progress: 16 };
              }

              objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
            } else if (characterId && characterRecords[characterId].records[recordDefinition.hash]) {
              let playerProgress: DestinyObjectiveProgress | undefined;
              characterRecords[characterId].records[recordDefinition.hash].objectives.forEach(objective => {
                if (objective.objectiveHash === hash) {
                  playerProgress = objective;
                }
              });

              objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
            }
          });
        }

        let state;
        if (profileRecords[recordDefinition.hash]) {
          state = profileRecords[recordDefinition.hash] ? profileRecords[recordDefinition.hash].state : 0;
        } else if (characterId && characterRecords[characterId].records[recordDefinition.hash]) {
          state = characterRecords[characterId].records[recordDefinition.hash] ? characterRecords[characterId].records[recordDefinition.hash].state : 0;
        } else {
          state = 0;
        }

        if (enumerateRecordState(state).invisible) {
          return;
        }

        if (enumerateRecordState(state).recordRedeemed && this.props.collectibles && this.props.collectibles.hideTriumphRecords) {
          return;
        }

        const setScrollToRecordRef = (element: HTMLLIElement) => {
          this.scrollToRecordRef = undefined
          if (highlight === recordDefinition.hash) { return this.scrollToRecordRef = element }
        }

        if (recordDefinition.redacted) {
          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={setScrollToRecordRef}
                className={cx('redacted', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>Classified record</div>
                    <div className='description'>This record is classified and may be revealed at a later time.</div>
                  </div>
                </div>
              </li>
            )
          });
        } else {
          let description = recordDefinition.displayProperties.description !== '' ? recordDefinition.displayProperties.description : false;
          description = !description && recordDefinition.loreHash ? manifest.DestinyLoreDefinition[recordDefinition.loreHash].displayProperties.description.slice(0, 117).trim() + '...' : description;
          if (recordDefinition.hash === 2367932631) {
            console.log(enumerateRecordState(state));
          }

          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={setScrollToRecordRef}
                className={cx({
                  linked: link && this.props.selfLink,
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash,
                  completed: enumerateRecordState(state).recordRedeemed,
                  unRedeemed: !enumerateRecordState(state).recordRedeemed && !enumerateRecordState(state).objectiveNotCompleted,
                  'no-description': !description
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{recordDefinition.displayProperties.name}</div>
                    {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
                <div className='objectives'>{objectives}</div>
                {link && this.props.selfLink ? <Link to={{ pathname: link, state: { from: this.props.selfLinkFrom ? this.props.selfLinkFrom : false } }} /> : null}
              </li>
            )
          });
        }
      });
    }

    if (records.length === 0 && this.props.collectibles.hideTriumphRecords) {
      records.push({
        element: (
          <li key='lol' className='all-completed'>
            <div className='properties'>
              <div className='text'>
                <div className='name'>When all is said and done</div>
                <div className='description'>You've completed these records</div>
              </div>
            </div>
          </li>
        )
      });
    }

    records = this.props.ordered ? orderBy(records, [item => item.completed], ['asc']) : records;

    return records.map(obj => obj.element);
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  profile: state.profile,
  manifest: state.manifest.manifestContent,
  collectibles: state.collectibles
})

export default connect(
  mapStateToProps
)(Records);
