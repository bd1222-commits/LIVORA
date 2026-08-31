import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemas } from './src/sanity/schemas';

export default defineConfig({
  name: 'livora-store',
  title: 'LIVORA Content Management',

  projectId: 'c8y4z2g1',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemas,
  },
});
