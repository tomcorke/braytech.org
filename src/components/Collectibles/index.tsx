import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';
import { ApplicationState } from '../../utils/reduxStore';

import './styles.css';
import { DestinyManifestJsonContent, DestinySettings } from '../../utils/reducers/manifest';
import { ProfileState } from '../../utils/reducers/profile';
import { DestinyCollectibleState, DestinyPresentationNodeDefinition } from 'bungie-api-ts/destiny2/interfaces';

interface CollectiblesProps {
  manifest?: DestinyManifestJsonContent
  settings?: DestinySettings
  profile: ProfileState

  quaternaryHash?: string
  highlight?: number
  node?: number
  hashes: number[]
  selfLink?: string
}

class Collectibles extends React.Component<CollectiblesProps> {

  scrollToRecordRef?: HTMLElement;

  componentDidMount() {
    if (this.props.quaternaryHash && this.scrollToRecordRef) {
      window.scrollTo({
        top: this.scrollToRecordRef.offsetTop + this.scrollToRecordRef.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {

    if (!this.props.profile.characterId
      || !this.props.profile.data
      || !this.props.manifest
      || !this.props.settings) return null

    const manifest = this.props.manifest;
    const settings = this.props.settings;
    const characterId = this.props.profile.characterId;

    const characterCollectibles = this.props.profile.data.profile.characterCollectibles.data;
    const profileCollectibles = this.props.profile.data.profile.profileCollectibles.data;

    const highlight = this.props.highlight;

    let collectibles: JSX.Element[] = [];

    if (this.props.node) {
      let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.node];

      if (tertiaryDefinition.children.presentationNodes.length > 0) {
        tertiaryDefinition.children.presentationNodes.forEach(node => {
          let nodeDefinition = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

          let row: JSX.Element[] = [];
          let rowState: DestinyCollectibleState[] = [];

          nodeDefinition.children.collectibles.forEach(child => {
            let collectibleDefinition = manifest.DestinyCollectibleDefinition[child.collectibleHash];

            let state = 0;
            let scope = profileCollectibles.collectibles[child.collectibleHash]
              ? profileCollectibles.collectibles[child.collectibleHash]
              : characterCollectibles[characterId].collectibles[child.collectibleHash];
            if (scope) {
              state = scope.state;
            }

            rowState.push(state);

            row.push(
              <li
                key={collectibleDefinition.hash}
                className={cx('item', 'tooltip', {
                  completed: !enumerateCollectibleState(state).notAcquired && !enumerateCollectibleState(state).invisible
                })}
                data-itemhash={collectibleDefinition.itemHash}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
                </div>
              </li>
            );
          });

          collectibles.push(
            <li
              key={nodeDefinition.hash}
              className={cx('is-set', {
                completed: rowState.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === rowState.length
              })}
            >
              <div className='set'>
                <ul className='list'>{row}</ul>
              </div>
              <div className='text'>
                <div className='name'>{nodeDefinition.displayProperties.name}</div>
              </div>
            </li>
          );
        });
      } else {
        tertiaryDefinition.children.collectibles.forEach(child => {
          let collectibleDefinition = manifest.DestinyCollectibleDefinition[child.collectibleHash];

          let state = 0;
          let scope = profileCollectibles.collectibles[child.collectibleHash] ? profileCollectibles.collectibles[child.collectibleHash] : characterCollectibles[characterId].collectibles[child.collectibleHash];
          if (scope) {
            state = scope.state;
          }

          if (enumerateCollectibleState(state).invisible) {
            return;
          }

          const setRefIfHighlighted = (element: HTMLLIElement) => {
            if (highlight === collectibleDefinition.hash) {
              this.scrollToRecordRef = element
            }
          }

          if (collectibleDefinition.redacted) {
            collectibles.push(
              <li
                key={collectibleDefinition.hash}
                ref={setRefIfHighlighted}
                className={cx('redacted', 'tooltip', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == collectibleDefinition.hash
                })}
                data-itemhash='343'
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>Classified</div>
                </div>
              </li>
            );
          } else {
            collectibles.push(
              <li
                key={collectibleDefinition.hash}
                ref={setRefIfHighlighted}
                className={cx('tooltip', {
                  completed: !enumerateCollectibleState(state).notAcquired,
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == collectibleDefinition.hash
                })}
                data-itemhash={collectibleDefinition.itemHash}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{collectibleDefinition.displayProperties.name}</div>
                </div>
              </li>
            );
          }
        });
      }
    } else {
      let collectiblesRequested = this.props.hashes;

      collectiblesRequested.forEach(hash => {
        let collectibleDefinition = manifest.DestinyCollectibleDefinition[hash];

        let link: string | undefined;

        // selfLink

        try {
          let reverse1: DestinyPresentationNodeDefinition | undefined;
          let reverse2: DestinyPresentationNodeDefinition | undefined;
          let reverse3: DestinyPresentationNodeDefinition | undefined;

          manifest.DestinyCollectibleDefinition[hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
            let skip = false;
            manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(parentsChild => {
              if (manifest.DestinyPresentationNodeDefinition[parentsChild.presentationNodeHash].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
                skip = true;
                return; // if hash is a child of badges, skip it
              }
            });

            if (reverse1 || skip) {
              return;
            }
            reverse1 = manifest.DestinyPresentationNodeDefinition[element];
          });

          let iteratees: number[] = reverse1 ? reverse1.parentNodeHashes : [];
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
            link = `/collections/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
          }
        } catch (e) {
          console.log(e);
        }

        //
        let state = 0;
        let scope = profileCollectibles.collectibles[hash] ? profileCollectibles.collectibles[hash] : characterCollectibles[characterId].collectibles[hash];
        if (scope) {
          state = scope.state;
        }

        if (enumerateCollectibleState(state).invisible) {
          return;
        }

        collectibles.push(
          <li
            key={collectibleDefinition.hash}
            className={cx('tooltip', {
              linked: link && this.props.selfLink,
              completed: !enumerateCollectibleState(state).notAcquired
            })}
            data-itemhash={collectibleDefinition.itemHash}
          >
            <div className='icon'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{collectibleDefinition.displayProperties.name}</div>
            </div>
            {link && this.props.selfLink ? <Link to={link} /> : null}
          </li>
        );
      });
    }

    return collectibles;
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    profile: state.profile,
    manifest: state.manifest.manifestContent,
    settings: state.manifest.settings
  };
}

export default connect(
  mapStateToProps
)(Collectibles);
