import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';

import { ApplicationState } from '../../utils/reduxStore';
import { ViewDefinition } from '../Header';
import { ThemeState } from '../../utils/reducers/theme';
import { ViewportDimensions } from '../../App';

import packageJSON from '../../../package.json';

import './styles.css';

interface HeaderStandardProps {
  views: ViewDefinition[]
  viewport: ViewportDimensions
  isIndex: boolean

  theme: ThemeState
}

interface HeaderStandardState {
  mobileNavOpen: boolean
}

class HeaderStandard extends React.Component<HeaderStandardProps, HeaderStandardState> {
  constructor(props: HeaderStandardProps) {
    super(props);

    this.state = {
      mobileNavOpen: false
    };

    this.triggerClickHandler = this.triggerClickHandler.bind(this);
    this.navlinkClickHandler = this.navlinkClickHandler.bind(this);
  }

  triggerClickHandler = () => {
    if (!this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: true });
    } else {
      this.setState({ mobileNavOpen: false });
    }
  };

  navlinkClickHandler = () => {
    if (this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: false });
    }
  };

  render() {
    let viewsRender = (
      <div className='views'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.navlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    let viewsInline = false;
    if (this.props.viewport.width > 1000) {
      viewsInline = true;
    }

    let mobileNav = (
      <div className='nav'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.navlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <div id='header' className={cx('standard', this.props.theme.selected, { navOpen: this.state.mobileNavOpen, isIndex: this.props.isIndex })}>
        <div className='braytech'>
          <div className='logo'>
            <Link to='/'>
              <span className='destiny-clovis_bray_device' />
              Braytech {packageJSON.version}
            </Link>
          </div>
          {!viewsInline ? (
            this.state.mobileNavOpen ? (
              <div className='trigger' onClick={this.triggerClickHandler}>
                <i className='uniE106' />
                Exit
              </div>
            ) : (
              <div className='trigger' onClick={this.triggerClickHandler}>
                <i className='uniEA55' />
                Views
              </div>
            )
          ) : (
            <div className='ui'>{viewsRender}</div>
          )}
          {this.state.mobileNavOpen ? mobileNav : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    theme: state.theme
  };
}

export default compose(
  connect(
    mapStateToProps
  )
)(HeaderStandard);
