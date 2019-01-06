import React from 'react';

import Checklists from './';
import TestRenderer from 'react-test-renderer';

const response = require(`./__fixtures__/response.json`);

let manifest;
try {
  manifest = require(`./__fixtures__/manifest.json`);
} catch {}

const props = {
  characterId: 'CHARACTER_ID',
  viewport: {
    width: 1280,
    height: 720
  },
  manifest: manifest,
  response: require(`./__fixtures__/response.json`),
  showAllItems: true
};

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withNamespaces: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: a => a };
    return Component;
  }
}));

test(`Checklists matches snapshot`, done => {
  if (props.manifest) {
    const component = TestRenderer.create(<Checklists {...props} />).toJSON();

    expect(component).toMatchSnapshot();
    done();
  } else {
    console.log(`
Could not load manifest file for tests. It is ignored by git as it 
is 62mb uncompressed.

Download it from Bungie by running:

curl -L https://www.bungie.net/common/destiny2_content/json/en/aggregate-4ba29e22-81f5-435e-b09c-2e0ea0f3dd41.json > views/Checklists/__fixtures__/manifest.json'

Or visit https://www.bungie.net/Platform/Destiny2/Manifest/ and save the
JSON to ./src/views/Checklists/__fixtures__/manifest.json
        `);
    done.fail('Manifest Missing!');
    // done.fail()
  }
});
