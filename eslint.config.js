import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'node_modules',
      '/.idea',
      '/.vscode',
      '/.git',
      '*.md',
      'dist',
      'public',
    ],
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    typescript: true,
    vue: true,
    jsonc: false,
    yaml: false,
  },
  {
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 2,
          multiline: 1,
        },
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below',
        },
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: false,
        },
      ],
      'node/prefer-global/process': 'off',
      'no-console': 'warn',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/order': 'off',
      'style/indent-binary-ops': 'off',
      'ts/no-unsafe-function-type': 'off',
    },
  },
)
