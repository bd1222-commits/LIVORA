import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'c8y4z2g1',
    dataset: 'production',
  },
  deployment: {
    appId: 'z0dac6uk4ifzhor9o4ksfo6g',
    autoUpdates: true,
  },
});
