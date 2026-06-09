import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const reactAppEnv = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_'))
  );

  const compatibleEnv = {
    ...reactAppEnv,
    NODE_ENV: mode,
    npm_package_version: packageJson.version,
  };

  return {
    plugins: [
      react({
        babel: {
          presets: ['@babel/preset-react'],
        },
      }),
    ],
    define: {
      'process.env': JSON.stringify(compatibleEnv),
    },
    build: {
      outDir: 'build',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');

            if (
              normalizedId.endsWith('/drugReferenceData.js')
            ) {
              return 'drug-data-core';
            }

            if (
              normalizedId.endsWith('/extraDrugReferenceData.js')
            ) {
              return 'drug-data-extra';
            }

            if (
              normalizedId.endsWith('/v15DrugExpansionData.js')
            ) {
              return 'drug-data-v15';
            }

            if (
              normalizedId.includes('/src/data/')
              && /Data\.js$/.test(normalizedId)
              && !normalizedId.endsWith('/sectionData.js')
              && !normalizedId.endsWith('/clinicalAtlasData.js')
            ) {
              const filename = normalizedId.split('/').pop() || '';
              const prefix = filename
                .slice(0, 5)
                .toLowerCase()
                .replace(/[^a-z0-9]/g, 'x');

              return `disease-data-${prefix}`;
            }

            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }

            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }

            if (
              id.includes('bootstrap')
              || id.includes('react-bootstrap')
            ) {
              return 'vendor-ui';
            }

            if (id.includes('@sentry/browser')) {
              return 'vendor-sentry';
            }

            return undefined;
          },
        },
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 4173,
    },
  };
});
