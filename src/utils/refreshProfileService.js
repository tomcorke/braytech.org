import { connect } from 'react-redux';

function refreshProfile(props) {

  console.log('Hello.', props);

};

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile
  };
}

export default connect(
  mapStateToProps
)(refreshProfile);