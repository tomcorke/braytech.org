import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { DestinyManifest, DestinyCharacterComponent, DestinyItemActionRequest } from 'bungie-api-ts/destiny2/interfaces';
import objectValues from 'lodash/values'

import ObservedImage from '../ObservedImage';
import * as utils from '../../utils/destinyUtils';

import './styles.css';
import { getAccountUrl } from '../../utils/urls';
import { ProfileData } from '../../utils/reducers/profile';
import { ApplicationState } from '../../utils/reduxStore';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';

interface CharactersProps {
  from: string
  manifest?: DestinyManifestJsonContent
  profileData?: ProfileData
  theme: any
  characterClick: (characterId: string) => any
}

const sortCharactersByPlaytime = (a: DestinyCharacterComponent, b: DestinyCharacterComponent) => {
  return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
};

const Characters = ({ t, from, manifest, profileData, theme, characterClick }: CharactersProps & WithNamespaces) => {

  const characters = profileData && objectValues(profileData.profile.characters.data).sort(sortCharactersByPlaytime);
  const characterProgressions = profileData && profileData.profile.characterProgressions.data;

  const charactersRender: JSX.Element[] = [];

  console.log(profileData);

  // Null checking allows typescript to assume these values are not undefined inside this block
  if (profileData && characters && characterProgressions) {

    characters.forEach(character => {
      const capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

      const progress = capped
        ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt
        : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

      charactersRender.push(
        <li key={character.characterId} className='linked'>
          <ObservedImage
            className={cx('image', 'emblem', {
              missing: !character.emblemBackgroundPath
            })}
            src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
          />
          <div className='class'>{utils.classHashToString(character.classHash, manifest, character.genderType)}</div>
          <div className='species'>{utils.raceHashToString(character.raceHash, manifest, character.genderType)}</div>
          <div className='light'>{character.light}</div>
          <div className='level'>
            {t('Level')} {character.baseCharacterLevel}
          </div>
          <div className='progress'>
            <div
              className={cx('bar', {
                capped: capped
              })}
              style={{
                width: `${progress * 100}%`
              }}
            />
          </div>
          <Link
            to={getAccountUrl(profileData.profile.profile.data.userInfo, character.characterId)}
            onClick={() => characterClick(character.characterId)}
          />
        </li>
      );
    });

  }

  return (
    <div className={cx('characters-list', theme.selected)}>
      <ul className='list'>{charactersRender}</ul>
    </div>
  );
}


function mapStateToProps(state: ApplicationState) {
  return {
    theme: state.theme,
    manifest: state.manifest.manifestContent,
    profileData: state.profile.data
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps
  )(Characters)
);
