import React from 'react';
import { withNamespaces } from 'react-i18next';

import ProgressCheckbox from '../../components/ProgressCheckbox';
import { getLanguageInfo } from '../../utils/languageInfo';
import * as braytech from '../../utils/braytechEnums';
import * as ls from '../../utils/localStorage';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    let initLanguage = this.props.i18n.getCurrentLanguage();
    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage
      },
      collectibleDisplayState: ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : false
    };
  }

  selectCollectibleDisplayState(state) {

    let currentState = this.state.collectibleDisplayState;
    let newState = currentState;

    if (state === 'showAll') {
      newState = {
        hideTriumphRecords: false,
        hideChecklistItems: false
      }
    } else {
      newState = {
        hideTriumphRecords: state === 'hideTriumphRecords' ? !currentState.hideTriumphRecords : currentState.hideTriumphRecords,
        hideChecklistItems: state === 'hideChecklistItems' ? !currentState.hideChecklistItems : currentState.hideChecklistItems
      }
    }

    this.setState({
      collectibleDisplayState: newState
    });
    ls.set('setting.collectibleDisplayState', newState);
  }

  selectLanguage(lang) {
    let temp = this.state.language;
    temp.selected = lang;
    this.setState(temp);
  }

  saveAndRestart() {
    const { i18n } = this.props;
    i18n.setCurrentLanguage(this.state.language.selected);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  componentDidMount() {
    this.props.setPageDefault('light');
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    const { t, availableLanguages } = this.props;

    let languageButtons = availableLanguages.map(code => {
      let langInfo = getLanguageInfo(code);
      return (
        <li
          key={code}
          onClick={() => {
            this.selectLanguage(code);
          }}
        >
          <ProgressCheckbox checked={this.state.language.selected === code} text={langInfo.name || langInfo.code} />
        </li>
      );
    });

    let collectiblesButtons = (
      <>
        <li key='showAll' onClick={() => { this.selectCollectibleDisplayState('showAll') }}>
          <ProgressCheckbox checked={!this.state.collectibleDisplayState.hideTriumphRecords && !this.state.collectibleDisplayState.hideChecklistItems} text='Show everything' />
        </li>
        <li key='hideTriumphRecords' onClick={() => { this.selectCollectibleDisplayState('hideTriumphRecords') }}>
          <ProgressCheckbox checked={this.state.collectibleDisplayState.hideTriumphRecords} text='Hide completed triumphs' />
        </li>
        <li key='hideChecklistItems' onClick={() => { this.selectCollectibleDisplayState('hideChecklistItems') }}>
          <ProgressCheckbox checked={this.state.collectibleDisplayState.hideChecklistItems} text='Hide discovered checklist items' />
        </li>
      </>
    );

    return (
      <div className='view' id='settings'>
        <div className='module language'>
          <div className='sub-header sub'>
            <div>{t('Language')}</div>
          </div>
          <ul className='list settings'>{languageButtons}</ul>
          {this.state.language.current !== this.state.language.selected ? (
            <ul className='list'>
              <li
                className='linked'
                onClick={() => {
                  this.saveAndRestart();
                }}
              >
                <div className='name'>{t('Save and restart')}</div>
              </li>
            </ul>
          ) : null}
        </div>
        <div className='module collectibles'>
          <div className='sub-header sub'>
            <div>{t('Collectibles')}</div>
          </div>
          <ul className='list settings'>{collectiblesButtons}</ul>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Settings);