import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { DestinyProfileResponse, DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';
import { GroupMember } from 'bungie-api-ts/groupv2/interfaces';

import Spinner from '../Spinner';
import ObservedImage from '../../components/ObservedImage';

import { classTypeToString } from '../../utils/destinyUtils';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';

import './styles.css';
import { connect } from 'react-redux';
import { ApplicationState, Dispatch } from '../../utils/reduxStore';
import { ProfileState } from '../../utils/reducers/profile';
import { updateClanRoster, enableClanRosterRefresh, disableClanRosterRefresh } from '../../utils/actions/roster';

interface RosterProps {
  mini?: boolean
  linked?: boolean
  keepFresh?: boolean
  isOnlineFilter?: boolean

  manifest?: DestinyManifestJsonContent
  profile: ProfileState
  roster: MemberData[]

  updateClanRoster: (clanId: string) => any
  enableClanRosterRefresh: () => any
  disableClanRosterRefresh: () => any
}

interface MemberData {
  member: GroupMember
  profile: DestinyProfileResponse
  sortedCharacters: DestinyCharacterComponent[]
}

interface RosterState {
  memberResponses: DestinyProfileResponse[]
  membersFetched: number
  freshnessCycles: number
}

class Roster extends React.Component<RosterProps & WithNamespaces, RosterState> {

  componentDidMount() {
    this.props.profile.data
      && this.props.profile.data.groups.results[0]
      && this.props.updateClanRoster(this.props.profile.data.groups.results[0].member.groupId);
    this.props.enableClanRosterRefresh();
  }

  componentWillUnmount() {
    this.props.disableClanRosterRefresh()
  }

  render() {
    const { t, mini, linked, roster, isOnlineFilter, manifest } = this.props;

    if (!manifest || roster.length === 0) return <Spinner />;

    const filteredRoster = isOnlineFilter ? roster.filter(result => result.member.isOnline) : roster

    const members: {
      isOnline: boolean
      lastActive: number
      lastActivity?: number
      element: JSX.Element
    }[] = []

    filteredRoster.forEach(member => {
      let blueberry = new Date().getTime() - new Date(member.member.joinDate).getTime() < 1209600000 ? true : false;

      if (!member.profile.characterActivities.data) {
        if (!mini) {
          members.push({
            isOnline: member.member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character', 'error')}>
                <div className='icon black' />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                <div className='error'>{t('Private profile')}</div>
                <div className='activity'>
                  <Moment fromNow>{member.profile.profile.data.dateLastPlayed}</Moment>
                </div>
              </li>
            )
          });
        }
        return;
      }

      const characterActivities = Object.entries(member.profile.characterActivities.data);
      const sortedCharacterActivities = orderBy(characterActivities, [characterActivity => characterActivity[1].dateActivityStarted], ['desc']);
      const lastCharacterActivity = characterActivities.length > 0 ? sortedCharacterActivities[0] : undefined;

      // console.log(member, lastCharacterActivity, lastCharacterTime)
      // console.log(lastCharacterTime, member.profile.characterActivities.data);
      // console.log(member,, lastCharacterActivity);

      if (lastCharacterActivity) {
        const [ lastActivityCharacterId, lastActivity] = lastCharacterActivity
        const lastCharacter = (Object.entries(member.profile.characters.data)
          .find(character => character[1].characterId === lastActivityCharacterId) || [])[1];

        if (!lastCharacter) return

        // let hsl = rgbToHsl(lastCharacter.emblemColor.red, lastCharacter.emblemColor.green, lastCharacter.emblemColor.blue);
        //  style={{ backgroundColor: `hsl(${hsl.h * 360}deg,${Math.max(hsl.s, 0.20) * 100}%,${Math.max(hsl.l, 0.30) * 100}%)` }}

        if (mini) {
          members.push({
            isOnline: member.member.isOnline,
            lastActive: lastActivity && member.member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: lastActivity && member.member.isOnline ? lastActivity.currentActivityHash : 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry })}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        } else {
          // console.log(lastActivity);

          let activityDisplay = null;
          if (lastActivity && member.member.isOnline) {
            let activity = manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
            let mode = activity ? (activity.placeHash === 2961497387 ? false : manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash]) : false;

            // console.log(lastActivity);

            activityDisplay = mode ? (
              <>
                {mode.displayProperties.name}: {activity.displayProperties.name}
              </>
            ) : activity ? (
              activity.placeHash === 2961497387 ? (
                'Orbit'
              ) : (
                activity.displayProperties.name
              )
            ) : null;
          }

          let character = (
            <>
              <span className='light'>{lastCharacter.light}</span>
              <span className={`destiny-class_${classTypeToString(lastCharacter.classType).toLowerCase()}`} />
            </>
          );

          members.push({
            isOnline: member.member.isOnline,
            lastActive: lastActivity && member.member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: lastActivity && member.member.isOnline ? lastActivity.currentActivityHash : 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({
                linked: linked,
                isOnline: member.member.isOnline,
                blueberry: blueberry,
                thisIsYou: member.member.destinyUserInfo.membershipId === this.props.profile.membershipId })}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                <div className='triumphScore'>{member.profile.profileRecords.data.score}</div>
                <div className='clanXp'>
                  <span>{Object.values(member.profile.characterProgressions.data).reduce((sum, member) => { return sum + member.progressions[540048094].weeklyProgress }, 0)}</span> / {Object.values(member.profile.characterProgressions.data).reduce((sum, member) => { return sum + 5000 }, 0)}
                </div>
                <div className='character'>{character}</div>
                <div className='activity'>
                  {activityDisplay ? <div className='name'>{activityDisplay}</div> : null}
                  <Moment fromNow>{lastActivity && member.member.isOnline ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed}</Moment>
                </div>
              </li>
            )
          });
        }
      } else {
        if (mini) {
          members.push({
            isOnline: member.member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character')}>
                <div className='icon black' />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        } else {
          members.push({
            isOnline: member.member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character')}>
                <div className='icon black' />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        }
      }
    });

    const sortedMembers = orderBy(members, [member => member.isOnline, member => member.lastActivity, member => member.lastActive], ['desc', 'desc', 'desc']);

    if (this.props.mini) {
      sortedMembers.push({
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='linked view-all'>
            <Link to='/clan/roster'>{t('View full roster')}</Link>
          </li>
        )
      });
    } else {
      sortedMembers.unshift({
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='grid-header'>
            <div className='icon' />
            <div className='displayName' />
            <div className='triumphScore'>{t('Triumph score')}</div>
            <div className='clanXp'>{t('Clan XP weekly')}</div>
            <div className='character'>{t('Character')}</div>
            <div className='activity'>{t('Activity')}</div>
          </li>
        )
      });
    }

    return <ul className={cx('list', 'roster', { mini: mini })}>{sortedMembers.map(member => member.element)}</ul>;
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  manifest: state.manifest.manifestContent,
  profile: state.profile
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateClanRoster: (clanId: string) => dispatch(updateClanRoster(clanId)),
  enableClanRosterRefresh,
  disableClanRosterRefresh,
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Roster)
);
