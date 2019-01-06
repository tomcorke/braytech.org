import sortBy from 'lodash/sortBy';
import React from 'react';

import Checklist from './Checklist';
import ChecklistItem from './ChecklistItem';

function findByHash(haystack, needle) {
  return Object.values(haystack).find(v => v.hash === needle);
}

class ChecklistFactoryHelpers {
  constructor(t, profile, manifest, characterId, hideCompletedItems) {
    this.t = t;
    this.profile = profile;
    this.manifest = manifest;
    this.characterId = characterId;
    this.hideCompletedItems = hideCompletedItems;
  }

  items(checklistId, isCharacterBound) {
    const manifest = this.manifest;
    const profile = this.profile;

    const progressionSource = isCharacterBound
      ? profile.characterProgressions.data[this.characterId]
      : profile.profileProgression.data;
    const progression = progressionSource.checklists[checklistId];
    const checklist = manifest.DestinyChecklistDefinition[checklistId];

    return Object.entries(progression).map(([id, completed]) => {
      const item = findByHash(checklist.entries, parseInt(id));

      const destination =
        item.destinationHash && findByHash(manifest.DestinyDestinationDefinition, item.destinationHash);
      const place = destination && findByHash(manifest.DestinyPlaceDefinition, destination.placeHash);
      const bubble = item.bubbleHash && findByHash(destination.bubbles, item.bubbleHash);
      const activity = item.activityHash && manifest.DestinyActivityDefinition[item.activityHash];
      const numberMatch = item.displayProperties.name.match(/([0-9]+)/);
      const itemNumber = numberMatch && numberMatch[0];
      const inventoryItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      return {
        destination: destination && destination.displayProperties.name,
        place: place && place.displayProperties.name,
        bubble: bubble && bubble.displayProperties.name,
        activity: activity && activity.displayProperties.name,
        itemNumber: itemNumber && parseInt(itemNumber, 10),
        inventoryItem: inventoryItem && inventoryItem.displayProperties.description,
        item,
        completed
      };
    });
  }

  dreamingCityChecklist(name, options = {}) {
    return this.numberedChecklist(name, {
      itemMapPath: i => `destiny/maps/2779202173/${i.item.hash}`,
      ...options
    });
  }

  numberedChecklist(name, options = {}) {
    return this.checklist({
      sortBy: ['itemNumber'],
      itemTitle: i => `${this.t(name)} ${i.itemNumber}`,
      ...options
    });
  }

  checklist(options = {}) {
    const defaultOptions = {
      sortBy: ['completed', 'place', 'bubble'],
      binding: this.t('Profile bound'),
      itemTitle: i => i.bubble || '???',
      itemSubtitle: i => i.place,
      itemMapPath: i => i.item.destinationHash && `destiny/maps/${i.item.destinationHash}/${i.item.hash}`
    };

    options = { ...defaultOptions, ...options };

    const items = sortBy(options.items, options.sortBy);

    const visible = this.hideCompletedItems ? items.filter(i => !i.completed) : items;

    const checklist = (
      <Checklist
        name={options.name}
        binding={options.binding}
        progressDescription={options.progressDescription}
        totalItems={items.length}
        completedItems={items.filter(i => i.completed).length}
      >
        {visible.map(i => (
          <ChecklistItem key={i.item.hash} completed={i.completed} mapPath={options.itemMapPath(i)}>
            <div className='text'>
              <p>{options.itemTitle(i)}</p>
              {options.itemSubtitle(i) && <p>{options.itemSubtitle(i)}</p>}
            </div>
          </ChecklistItem>
        ))}
      </Checklist>
    );

    return {
      name: options.name,
      icon: options.icon,
      checklist: checklist
    };
  }
}

export default ChecklistFactoryHelpers;
