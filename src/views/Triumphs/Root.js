import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateRecordState } from '../../utils/destinyEnums';
import RecordsAlmost from '../../components/RecordsAlmost';

class Root extends React.Component {
  render() {
    const {t} = this.props;
    const manifest = this.props.manifest;
    const characterId = this.props.profile.characterId;

    const characters = this.props.profile.data.profile.characters.data;
    const genderHash = characters[characterId].genderHash;
    const profileRecords = this.props.profile.data.profile.profileRecords.data.records;
    const characterRecords = this.props.profile.data.profile.characterRecords.data;

    const sealBars = {
      2588182977: {
        text: manifest.DestinyRecordDefinition[2757681677].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-00001367.PNG',
        nodeHash: 2588182977,
        recordHash: 2757681677,
        total: profileRecords[2757681677].objectives[0].completionValue,
        completed: profileRecords[2757681677].objectives[0].progress
      },
      3481101973: {
        text: manifest.DestinyRecordDefinition[3798931976].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-00001343.PNG',
        nodeHash: 3481101973,
        recordHash: 3798931976,
        total: profileRecords[3798931976].objectives[0].completionValue,
        completed: profileRecords[3798931976].objectives[0].progress
      },
      147928983: {
        text: manifest.DestinyRecordDefinition[3369119720].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-0000134A.PNG',
        nodeHash: 147928983,
        recordHash: 3369119720,
        total: profileRecords[3369119720].objectives[0].completionValue,
        completed: profileRecords[3369119720].objectives[0].progress
      },
      2693736750: {
        text: manifest.DestinyRecordDefinition[1754983323].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-0000133C.PNG',
        nodeHash: 2693736750,
        recordHash: 1754983323,
        total: profileRecords[1754983323].objectives[0].completionValue,
        completed: profileRecords[1754983323].objectives[0].progress
      },
      2516503814: {
        text: manifest.DestinyRecordDefinition[1693645129].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-00001351.PNG',
        nodeHash: 2516503814,
        recordHash: 1693645129,
        total: profileRecords[1693645129].objectives[0].completionValue,
        completed: profileRecords[1693645129].objectives[0].progress
      },
      1162218545: {
        text: manifest.DestinyRecordDefinition[2182090828].titleInfo.titlesByGenderHash[genderHash],
        image: '037E-00001358.PNG',
        nodeHash: 1162218545,
        recordHash: 2182090828,
        total: profileRecords[2182090828].objectives[0].completionValue,
        completed: profileRecords[2182090828].objectives[0].progress
      },
      2039028930: {
        text: manifest.DestinyRecordDefinition[2053985130].titleInfo.titlesByGenderHash[genderHash],
        image: '0560-000000EB.PNG',
        nodeHash: 2039028930,
        recordHash: 2053985130,
        total: profileRecords[2053985130].objectives[0].completionValue,
        completed: profileRecords[2053985130].objectives[0].progress
      }
    };

    let parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
    let sealsParent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

    let nodes = [];
    let sealNodes = [];
    let recordsStates = [];

    parent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];
        nodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          let nodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];
          if (nodeChildNodeChildNode.redacted) {
            // console.log(nodeChildNodeChildNode)
            return;
          }
          nodeChildNodeChildNode.children.records.forEach(record => {
            let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId].records[record.recordHash];
            if (scope) {
              states.push(scope);
              recordsStates.push(scope);
            } else {
              // console.log(`107 Undefined state for ${record.recordHash}`);
              states.push({ state: 0 });
              recordsStates.push({ state: 0 });
            }
          });
        });
      });

      nodes.push(
        <div key={node.hash} className='node'>
          <Link to={`/triumphs/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
            {node.displayProperties.name}
          </Link>
          <div className='state'>
            <span>{states.filter(record => enumerateRecordState(record.state).recordRedeemed).length}</span> / {states.filter(record => !enumerateRecordState(record.state).invisible).length}
          </div>
        </div>
      );
    });

    sealsParent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.records.forEach(record => {
        let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId].records[record.recordHash];
        if (scope) {
          states.push(scope);
          recordsStates.push(scope);
        } else {
          // console.log(`138 Undefined state for ${record.recordHash}`);
        }
      });

      sealNodes.push(
        <div
          key={node.hash}
          className={cx('node', {
            completed: sealBars[node.hash].completed === sealBars[node.hash].total
          })}
        >
          <Link to={`/triumphs/seal/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`/static/images/extracts/badges/${sealBars[node.hash].image}`} />
            {node.displayProperties.name}
          </Link>
          <div className='state'>
            <span>{sealBars[node.hash].completed}</span> / {sealBars[node.hash].total}
          </div>
        </div>
      );
    });

    return (
      <>
        <div className='parent-nodes'>
          <div className='sub-header'>
            <div>{t('Triumphs')}</div>
            <div>
              {recordsStates.filter(record => enumerateRecordState(record.state).recordRedeemed).length}/{recordsStates.filter(record => !enumerateRecordState(record.state).invisible).length}
            </div>
          </div>
          <div className='nodes'>{nodes}</div>
          <div className='sub-header'>
            <div>{t('Seals')}</div>
          </div>
          <div className='nodes seals'>{sealNodes}</div>
        </div>
        <div className='sidebar'>
          <div className='sub-header'>
            <div>{t('Total score')}</div>
          </div>
          <div className='total-score'>{this.props.profile.data.profile.profileRecords.data.score}</div>
          <div className='sub-header'>
            <div>{t('Almost complete')}</div>
          </div>
          <div className='almost-complete'>
            <RecordsAlmost {...this.props} limit='3' pageLink />
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Root);
