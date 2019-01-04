import React from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import * as ls from '../../utils/localStorage';
import Root from './Root';
import SealNode from './SealNode';
import PresentationNode from './PresentationNode';

import './styles.css';

class Triumphs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collectibleDisplayState: ls.get('setting.collectibleDisplayState')
    };

    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  toggleCompleted = () => {
    let currentState = this.state.collectibleDisplayState;
    let newState = {
      hideTriumphRecords: !currentState.hideTriumphRecords,
      hideChecklistItems: currentState.hideChecklistItems
    }

    this.setState({
      collectibleDisplayState: newState
    });

    ls.set('setting.collectibleDisplayState', newState);
  };


  componentDidMount() {
    
  }

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps.location.pathname !== this.props.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {t} = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let toggleCompletedLink = (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a onClick={this.toggleCompleted}>
        {this.state.collectibleDisplayState.hideTriumphRecords ? (
          <>
            <i className='uniE0522' />
            {t('Show acquired')}
          </>
        ) : (
          <>
            <i className='uniE0522' />
            {t('Hide acquired')}
            
          </>
        )}
      </a>
    );

    if (!primaryHash) {
      return (
        <div className='view presentation-node' id='triumphs'>
          <Root {...this.props} />
        </div>
      );
    } else if (primaryHash === 'seal') {
      return (
        <>
          <div className='view presentation-node' id='triumphs'>
            <SealNode {...this.props} collectibleDisplayState={this.state.collectibleDisplayState} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <Link to='/triumphs'>
                  <i className='uniE742' />
                  {t('Triumphs')}
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='view presentation-node' id='triumphs'>
            <PresentationNode {...this.props} collectibleDisplayState={this.state.collectibleDisplayState} primaryHash={primaryHash} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
              <li>
                <Link to='/triumphs'>
                  <i className='uniE742' />
                  {t('Triumphs')}
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

export default withNamespaces()(Triumphs);
