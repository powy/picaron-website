import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // The site copy is French: apostrophes are everywhere and React renders
    // them fine, escaping them all as &apos; only hurts readability.
    rules: { 'react/no-unescaped-entities': 'off' },
  },
  {
    // One-off CommonJS image conversion scripts, run by hand with node.
    files: ['scripts/**/*.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    ignores: [
      '.next/**',
      'functions/dist/**',
      'infra/terraform/.build/**',
      'test-results/**',
      'playwright-report/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
