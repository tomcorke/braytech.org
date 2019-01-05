import React from 'react';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import ProgressBar from '../../components/ProgressBar';
import * as ls from '../../utils/localStorage';

import regionChests from './lists/regionChests';
import lostSectors from './lists/lostSectors';
import adventures from './lists/adventures';
import corruptedEggs from './lists/corruptedEggs';
import ahamkaraBones from './lists/ahamkaraBones';
import catStatues from './lists/catStatues';
import sleeperNodes from './lists/sleeperNodes';
import ghostScans from './lists/ghostScans';
import latentMemories from './lists/latentMemories';
import caydesJournals from './lists/caydesJournals';

import './styles.css';

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      collectibleDisplayState: ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : false
    };

    this.changeSkip = this.changeSkip.bind(this);
  }

  itemsPerPage = 5;

  changeSkip = e => {
    e.preventDefault();

    let index = e.currentTarget.dataset.index;

    this.setState({
      page: Math.floor(index / this.itemsPerPage)
    });
  };

  render() {
    const { t, characterId } = this.props;
    const characterProgressions = this.props.response.profile.characterProgressions.data[characterId];
    const profileProgressions = this.props.response.profile.profileProgression.data;

    if (this.props.viewport.width >= 2000) {
      this.itemsPerPage = 5;
    }
    if (this.props.viewport.width < 2000) {
      this.itemsPerPage = 4;
    }
    if (this.props.viewport.width < 1600) {
      this.itemsPerPage = 3;
    }
    if (this.props.viewport.width < 1200) {
      this.itemsPerPage = 2;
    }
    if (this.props.viewport.width < 800) {
      this.itemsPerPage = 1;
    }

    const lists = [
      {
        id: 1697465175,
        scope: characterProgressions,
        name: t('Region Chests'),
        binding: (
          <>
            Profile bound with the exception of <em>Curse of Osiris</em> and <em>Warmind</em> chests
          </>
        ),
        progressDescription: t('Region chests opened'),
        icon: 'destiny-region_chests',
        items: regionChests(this)
      },
      {
        id: 3142056444,
        scope: characterProgressions,
        name: t('Lost Sectors'),
        binding: t('Character bound'),
        progressDescription: t('Lost Sectors discovered'),
        icon: 'destiny-lost_sectors',
        items: lostSectors(this.props)
      },
      {
        id: 4178338182,
        scope: characterProgressions,
        name: t('Adventures'),
        binding: t('Character bound'),
        progressDescription: t('Adventures undertaken'),
        icon: 'destiny-adventure',
        items: adventures(this.props)
      },
      {
        id: 2609997025,
        scope: profileProgressions,
        name: t('Corrupted Eggs'),
        binding: t('Profile bound'),
        progressDescription: t('Eggs scrambled'),
        icon: 'destiny-corrupted_eggs',
        items: corruptedEggs(this.props)
      },
      {
        id: 1297424116,
        scope: profileProgressions,
        name: t('Ahamkara Bones'),
        binding: t('Profile bound'),
        progressDescription: t('Bones found'),
        icon: 'destiny-ahamkara_bones',
        items: ahamkaraBones(this.props)
      },
      {
        id: 2726513366,
        scope: profileProgressions,
        name: t('Cat Statues'),
        binding: t('Profile bound'),
        progressDescription: t('Feline friends satisfied'),
        icon: 'destiny-cat_statues',
        items: catStatues(this.props)
      },
      {
        id: 365218222,
        scope: profileProgressions,
        name: t('Sleeper Nodes'),
        binding: t('Profile bound'),
        progressDescription: t('Sleeper nodes hacked'),
        icon: 'destiny-sleeper_nodes',
        items: sleeperNodes(this.props)
      },
      {
        id: 2360931290,
        scope: profileProgressions,
        name: t('Ghost Scans'),
        binding: t('Profile bound'),
        progressDescription: t('Ghost scans performed'),
        icon: 'destiny-ghost',
        items: ghostScans(this.props)
      },
      {
        id: 2955980198,
        scope: profileProgressions,
        name: t('Lost Memory Fragments'),
        binding: t('Profile bound'),
        progressDescription: t('Memories destroyed'),
        icon: 'destiny-lost_memory_fragments',
        items: latentMemories(this.props)
      }
    ];

    if (Object.values(this.props.response.profile.profileProgression.data.checklists[2448912219]).filter(value => value === true).length === 4) {
      lists.push({
        id: 2448912219,
        scope: profileProgressions,
        name: t("Cayde's Journals"),
        binding: t('Profile bound'),
        progressDescription: t('Journals recovered'),
        icon: 'destiny-ace_of_spades',
        items: caydesJournals(this.props)
      });
    }

    let sliceStart = parseInt(this.state.page, 10) * this.itemsPerPage;
    let sliceEnd = sliceStart + this.itemsPerPage;

    return (
      <div className='view' id='checklists'>
        <div className='views'>
          <div className='sub-header sub'>
            <div>Checklists</div>
          </div>
          <ul className='list'>
            {lists.map((list, index) => {
              let active = false;

              if (index >= sliceStart && index < sliceEnd) {
                active = true;
              }

              return (
                <li key={list.name} className='linked'>
                  <a
                    href='/'
                    className={cx({
                      active: active
                    })}
                    data-index={index}
                    onClick={this.changeSkip}
                  >
                    <div className={list.icon} />
                    <div className='name'>{list.name}</div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={cx('lists', 'col-' + this.itemsPerPage)}>
          {lists.slice(sliceStart, sliceEnd).map(list => {
            return (
              <div className='col' key={list.name}>
                <div className='head'>
                  <h4>{list.name}</h4>
                  <div className='binding'>
                    <p>{list.binding}</p>
                  </div>
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: list.progressDescription,
                      completionValue: list.id === 2448912219 ? 4 : Object.keys(list.scope.checklists[list.id]).length
                    }}
                    playerProgress={{
                      progress: Object.values(list.scope.checklists[list.id]).filter(value => value === true).length
                    }}
                    hideCheck
                    chunky
                  />
                </div>
                <ul className='list no-interaction'>
                  {list.items.map(obj => {
                    if (this.state.collectibleDisplayState.hideChecklistItems && obj.completed) {
                      return null;
                    } else {
                      return obj.element;
                    }
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Checklists);
