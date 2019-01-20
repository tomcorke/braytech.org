import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import captainsLog from '../../data/captainsLog';

import './styles.css';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className={cx('view', this.props.theme.selected)} id='index'>
        <ObservedImage className='image bg' src='/static/images/jesse-van-dijk-i-010.jpg' />
        <div className='logo-feature'>
          <div className='device'>
            <span className='destiny-clovis_bray_device' />
          </div>
          Braytech
        </div>
        <div className='changelog'>
          {captainsLog
            .map(entry => {
              return (
                <div key={entry.version} className='entry'>
                  <div className='header'>
                    <div className='version'>{entry.version}</div>
                    <Moment fromNow>{entry.date}</Moment>
                  </div>
                  <ReactMarkdown className='content' source={entry.content} />
                </div>
              );
            })
            .reverse()}
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
  connect(mapStateToProps)
)(Index);
