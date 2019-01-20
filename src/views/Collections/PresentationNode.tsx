import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { connect } from 'react-redux';

import ObservedImage from '../../components/ObservedImage';

import Collectibles from '../../components/Collectibles';
import { ApplicationState } from '../../utils/reduxStore';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';

interface PresentationNodeProps {
  manifest?: DestinyManifestJsonContent
  primaryHash: number
  hideCompletedRecords: boolean

  hashes: number[]
  match: {
    params: {
      secondary?: number
      tertiary?: number
      quaternary?: number
    }
  }
}

const PresentationNode = ({ manifest, primaryHash, hashes, match }: PresentationNodeProps) => {

  if (!manifest) return null

  let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];

  let secondaryHash = match.params.secondary ? match.params.secondary : primaryDefinition.children.presentationNodes[0].presentationNodeHash;
  let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];

  let tertiaryHash = match.params.tertiary ? match.params.tertiary : secondaryDefinition.children.presentationNodes[0].presentationNodeHash;
  let quaternaryHash = match.params.quaternary ? match.params.quaternary : undefined;

  let primaryChildren: JSX.Element[] = [];
  primaryDefinition.children.presentationNodes.forEach(child => {
    let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

    let isActive = (linkMatch: any) => {
      if (match.params.secondary === undefined && primaryDefinition.children.presentationNodes.indexOf(child) === 0) {
        return true;
      } else if (linkMatch) {
        return true;
      } else {
        return false;
      }
    };

    primaryChildren.push(
      <li key={node.hash} className='linked'>
        <NavLink isActive={isActive} to={`/collections/${primaryHash}/${node.hash}`}>
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.displayProperties.icon}`} />
        </NavLink>
      </li>
    );
  });

  let secondaryChildren: JSX.Element[] = [];
  secondaryDefinition.children.presentationNodes.forEach(child => {
    let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

    let isActive = (linkMatch: any) => {
      if (match.params.tertiary === undefined && secondaryDefinition.children.presentationNodes.indexOf(child) === 0) {
        return true;
      } else if (linkMatch) {
        return true;
      } else {
        return false;
      }
    };

    secondaryChildren.push(
      <li key={node.hash} className='linked'>
        <NavLink isActive={isActive} to={`/collections/${primaryHash}/${secondaryHash}/${node.hash}`}>
          {node.displayProperties.name}
        </NavLink>
      </li>
    );
  });

  return (
    <div className="node">
      <div className="header">
        <div className="name">
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
          {primaryDefinition.displayProperties.name} <span>{primaryDefinition.children.presentationNodes.length !== 1 ? <>// {secondaryDefinition.displayProperties.name}</> : null}</span>
        </div>
      </div>
      <div className="children">
        <ul
          className={cx('list', 'primary', {
            'single-primary': primaryDefinition.children.presentationNodes.length === 1
          })}
        >
          {primaryChildren}
        </ul>
        <ul className="list secondary">{secondaryChildren}</ul>
      </div>
      <div className="collectibles">
        <ul className="list tertiary collection-items">
          <Collectibles hashes={hashes} node={tertiaryHash} highlight={quaternaryHash} />
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  manifest: state.manifest.manifestContent,
})

export default connect(
  mapStateToProps
)(PresentationNode);
