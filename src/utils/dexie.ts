import Dexie from 'dexie';
import { DestinyManifestJsonContent } from './reducers/manifest';

type DestinyManifestJsonContentWithVersion = DestinyManifestJsonContent & { manifestVersion: string }

class BraytechDatabase extends Dexie {

  // @ts-ignore: Property not initialised
  versionString: Dexie.Table<{ version: string }, number>
  // @ts-ignore: Property not initialised
  manifestContent: Dexie.Table<DestinyManifestJsonContentWithVersion, string>

  constructor() {
    super('braytech')

    this.version(1).stores({
      versionString: '++id,version',
      manifestContent: 'manifestVersion'
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
        this.versionString.add({ version });
        this.manifestContent.add({
          ...newManifestContent,
          manifestVersion: version
        }, version);
      }
    );
  }

}

const db = new BraytechDatabase();

export default db;