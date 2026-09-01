import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemas } from './src/sanity/schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'a8ha3p9y';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'livora-store',
  title: 'LIVORA Content Management',

  projectId,
  dataset,

  plugins: [structureTool()],

  schema: {
    types: schemas,
  },
});
