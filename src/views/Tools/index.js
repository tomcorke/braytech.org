import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import './styles.css';

class Tools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    
  }

  render() {
    const { t } = this.props;
    return (
      <div className={cx('view', this.props.theme.selected)} id='tools'>
        <div className='tool'>
          <div className='name'>
            <Link to='/tools/clan-banner-builder'>{t('Clan Banner Builder')}</Link>
          </div>
          <div className='description'>
            <p>{t('Collaborate with clan members on a new clan banner.')}</p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Tools);
