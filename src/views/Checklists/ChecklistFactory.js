import sortBy from 'lodash/sortBy';
import React from 'react';

import Checklist from './Checklist';
import ChecklistItem from './ChecklistItem';
import ChecklistFactoryHelpers from './ChecklistFactoryHelpers';

import ReactMarkdown from 'react-markdown';

const CAYDES_JOURNAL_IDS = [78905203, 1394016600, 1399126202, 4195138678];

class ChecklistFactory {
  constructor(t, profile, manifest, characterId) {
    this.t = t;
    this.m = new ChecklistFactoryHelpers(t, profile, manifest, characterId);
  }

  adventures() {
    return this.m.makeChecklist({
      name: this.t('Adventures'),
      icon: 'destiny-adventure',
      progressDescription: this.t('Adventures undertaken'),
      items: this.m.checklistItems(4178338182, true),
      binding: this.t('Character bound'),
      sortBy: ['completed', 'place', 'bubble', 'activity'],
      itemTitle: i => i.activity,
      itemSubtitle: i => `${i.bubble}, ${i.place}`
    });
  }

  regionChests() {
    return this.m.makeChecklist({
      name: this.t('Region Chests'),
      icon: 'destiny-region_chests',
      progressDescription: this.t('Region chests opened'),
      items: this.m.checklistItems(1697465175, true),
      binding: (
        <>
          Profile bound with the exception of <em>Curse of Osiris</em> and <em>Warmind</em> chests
        </>
      )
    });
  }

  lostSectors() {
    return this.m.makeChecklist({
      name: this.t('Lost Sectors'),
      icon: 'destiny-lost_sectors',
      progressDescription: this.t('Lost Sectors discovered'),
      binding: this.t('Character bound'),
      items: this.m.checklistItems(3142056444, true)
    });
  }

  amkaharaBones() {
    return this.m.makeDreamingCityChecklist('Bones', {
      name: this.t('Ahamkara Bones'),
      icon: 'destiny-ahamkara_bones',
      progressDescription: this.t('Bones found'),
      items: this.m.checklistItems(1297424116)
    });
  }

  corruptedEggs() {
    return this.m.makeDreamingCityChecklist('Egg', {
      name: this.t('Corrupted Eggs'),
      icon: 'destiny-corrupted_eggs',
      progressDescription: this.t('Eggs destroyed'),
      items: this.m.checklistItems(2609997025)
    });
  }

  catStatues() {
    return this.m.makeDreamingCityChecklist('Feline friend', {
      name: this.t('Cat Statues'),
      icon: 'destiny-cat_statues',
      progressDescription: this.t('Feline friends satisfied'),
      items: this.m.checklistItems(2726513366)
    });
  }

  sleeperNodes() {
    return this.m.makeChecklist({
      name: this.t('Sleeper Nodes'),
      icon: 'destiny-sleeper_nodes',
      items: this.m.checklistItems(365218222),
      progressDescription: this.t('Sleeper nodes hacked'),
      itemTitle: i => i.inventoryItem.replace('CB.NAV/RUN.()', ''),
      itemMapPath: i => `destiny/maps/mars/${i.item.hash}`,
      sortBy: ['inventoryItem']
    });
  }

  ghostScans() {
    return this.m.makeNumberedChecklist('Scan', {
      name: this.t('Ghost Scans'),
      icon: 'destiny-ghost',
      items: this.m.checklistItems(2360931290),
      progressDescription: this.t('Ghost scans performed'),
      itemSubtitle: i => `${i.bubble || 'The Farm'}, ${i.place}`
    });
  }

  latentMemories() {
    return this.m.makeChecklist({
      name: this.t('Lost Memory Fragments'),
      icon: 'destiny-lost_memory_fragments',
      items: this.m.checklistItems(2955980198),
      progressDescription: this.t('Memories destroyed'),
      itemTitle: i => `${this.t('Memory')} ${i.itemNumber}`,
      itemMapPath: i => `destiny/maps/mars/${i.item.hash}`,
      sortBy: ['itemNumber']
    });
  }

  caydesJournals() {
    let items = this.m.checklistItems(2448912219).filter(i => CAYDES_JOURNAL_IDS.includes(i.item.hash));
    items = sortBy(items, i => [i.item.hash]);

    const checklist = (
      <Checklist
        name={this.t("Cayde's Journals")}
        binding={this.t('Profile bound')}
        progressDescription={this.t('Journals recovered')}
        totalItems={items.length}
        completedItems={items.filter(i => i.completed).length}
      >
        {items.map(i => (
          <ChecklistItem key={i.item.hash} completed={i.completed}>
            <ReactMarkdown className='text' source={i.item.displayProperties.description} />
          </ChecklistItem>
        ))}
      </Checklist>
    );

    return {
      name: this.t("Cayde's Journals"),
      icon: 'destiny-ace_of_spades',
      checklist: checklist
    };
  }
}

export default ChecklistFactory;
