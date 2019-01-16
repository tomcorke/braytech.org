import Dexie from 'dexie';
import { DestinyManifestJsonContent } from './actions/manifest';

class BraytechDatabase extends Dexie {

  // @ts-ignore: Property not initialised
  versionString: Dexie.Table<string, number>
  // @ts-ignore: Property not initialised
  manifestContent: Dexie.Table<DestinyManifestJsonContent, string>

  constructor() {
    super('braytech')

    this.version(1).stores({
      versionString: '++id',
      manifestContent: ''
    })
  }

  private async clearAll() {
    return Promise.all([
      this.versionString.clear(),
      this.manifestContent.clear()
    ]);
  }

  async addAllData(version: string, newManifestContent: DestinyManifestJsonContent) {

    return this.transaction(
      'rw',
      [
        this.versionString,
        this.manifestContent
      ],
      async () => {
        await this.clearAll();
        this.versionString.add(version);
        this.manifestContent.add(newManifestContent, version);
      }
    );
  }

}

const db = new BraytechDatabase();

export default db;