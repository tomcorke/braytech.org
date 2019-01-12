import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import './styles.css';

import ChecklistFactory from './ChecklistFactory';

function getItemsPerPage(width) {
  if (width >= 2000) return 5;
  if (width >= 1600) return 4;
  if (width >= 1200) return 3;
  if (width >= 800) return 2;
  return 1;
}

export class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      itemsPerPage: getItemsPerPage(props.viewport.width)
    };
  }

  componentDidUpdate(prev) {
    if (prev.viewport.width !== this.props.viewport.width) {
      this.setState({ itemsPerPage: getItemsPerPage(this.props.viewport.width) });
    }
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
      this.props.profile.data.profile,
      this.props.manifest,
      this.props.profile.characterId,
      this.props.collectibles.hideChecklistItems
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
      f.latentMemories(),
      f.ghostStories()
    ];

    if (
      Object.values(this.props.profile.data.profile.profileProgression.data.checklists[2448912219]).filter(i => i).length === 4
    ) {
      lists.push(f.caydesJournals());
    }

    let sliceStart = parseInt(this.state.page, 10) * this.state.itemsPerPage;
    let sliceEnd = sliceStart + this.state.itemsPerPage;

    const visible = this.props.showAllItems ? lists : lists.slice(sliceStart, sliceEnd);

    return (
      <div className={cx('view', this.props.theme.selected)} id='checklists'>
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

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    collectibles: state.collectibles,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Checklists);
