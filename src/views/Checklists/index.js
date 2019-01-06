import React from 'react';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import * as ls from '../../utils/localStorage';

import './styles.css';

import ChecklistFactory from './ChecklistFactory';

function getItemsPerPage(width) {
  if (width >= 2000) return 5;
  if (width >= 1600) return 4;
  if (width >= 1200) return 3;
  if (width >= 800) return 2;
  return 1;
}

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      collectibleDisplayState: ls.get('setting.collectibleDisplayState')
        ? ls.get('setting.collectibleDisplayState')
        : false,
      itemsPerPage: getItemsPerPage(props.viewport.width)
    };
  }

  changeSkip = e => {
    e.preventDefault();

    let index = e.currentTarget.dataset.index;

    this.setState({
      page: Math.floor(index / this.state.itemsPerPage)
    });
  };

  render() {
    const { t } = this.props;

    const f = new ChecklistFactory(
      t,
      this.props.response.profile,
      this.props.manifest,
      this.props.characterId,
      this.state.collectibleDisplayState.hideChecklistItems
    );

    const lists = [
      f.regionChests(),
      f.lostSectors(),
      f.adventures(),
      f.corruptedEggs(),
      f.amkaharaBones(),
      f.catStatues(),
      f.sleeperNodes(),
      f.ghostScans(),
      f.latentMemories()
    ];

    if (
      Object.values(this.props.response.profile.profileProgression.data.checklists[2448912219]).filter(i => i)
        .length === 4
    ) {
      lists.push(f.caydesJournals());
    }

    let sliceStart = parseInt(this.state.page, 10) * this.state.itemsPerPage;
    let sliceEnd = sliceStart + this.state.itemsPerPage;

    const visible = this.props.showAllItems ? lists : lists.slice(sliceStart, sliceEnd);

    return (
      <div className='view' id='checklists'>
        <div className='views'>
          <div className='sub-header sub'>
            <div>Checklists</div>
          </div>
          <ul className='list'>
            {lists.map((list, index) => (
              <li key={list.name} className='linked'>
                <a
                  href='/'
                  className={cx({
                    active: visible.includes(list)
                  })}
                  data-index={index}
                  onClick={this.changeSkip}
                >
                  <div className={list.icon} />
                  <div className='name'>{list.name}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx('lists', 'col-' + this.state.itemsPerPage)}>
          {visible.map(list => (
            <div className='col' key={list.name}>
              {list.checklist}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Checklists);
