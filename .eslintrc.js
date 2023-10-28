/**
 * @file Eslint configuration.
 * @author Martiens Kropff
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['jsdoc'],
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  rules: {
    //#region JS/TS
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'for-direction': 'error',
    'getter-return': 'error',
    'no-await-in-loop': 'error',
    'no-empty': [
      'error',
      { allowEmptyCatch: true }
    ],
    'no-empty-function': [
      'error',
      { allow: ['constructors'] }
    ],
    'no-prototype-builtins': 'error',
    'accessor-pairs': [
      'error',
      {
        getWithoutSet: false
      }
    ],
    'block-scoped-var': 'error',
    curly: ['error', 'all'],
    'class-methods-use-this': 'error',
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-extra-label': 'error',
    'no-implicit-coercion': 'error',
    'no-invalid-this': 'error',
    'no-loop-func': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-useless-concat': 'error',
    quotes: ['error', 'single', 'avoid-escape'],
    'require-await': 'error',
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': 'error',
    'block-spacing': 'error',
    'computed-property-spacing': 'error',
    'consistent-this': 'error',
    'linebreak-style': 'off',
    'func-style': [
      'error',
      'expression',
      { allowArrowFunctions: true }
    ],
    'function-paren-newline': ['error', 'never'],
    'implicit-arrow-linebreak': ['error'],
    indent: ['error', 2],
    'lines-between-class-members': ['error', 'always'],
    'no-lonely-if': 'error',
    'no-underscore-dangle': 'error',
    'object-curly-newline': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'off',
    'operator-linebreak': ['error', 'none'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'semi-style': ['error', 'last'],
    'switch-colon-spacing': ['error'],
    'arrow-body-style': ['warn', 'as-needed'],
    'arrow-parens': ['warn', 'always'],
    'no-duplicate-imports': 'error',
    'no-obj-calls': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
        allowUnboundThis: true
      }
    ],
    'prefer-const': 'error',
    'prefer-spread': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'template-curly-spacing': ['error', 'never'],
    'max-nested-callbacks': ['error', 4],
    'max-params': ['error', 6],
    'max-depth': ['error', 8],
    complexity: ['error', 10],
    'new-cap': ['error', { 
      newIsCap: true, 
      capIsNew: false,
      newIsCapExceptions: ['timeline'] 
    }],
    'default-case': 'warn',
    'no-console': [
      'warn',
      { allow: ['warn', 'error'] }
    ],
    'no-func-assign': 'warn',
    'no-inner-declarations': ['warn', 'both'],
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'dot-notation': 'warn',
    'no-magic-numbers': 'off',
    'no-warning-comments': 'off',
    'vars-on-top': 'warn',
    'multiline-comment-style': 'off',
    'no-var': 'warn',
    'prefer-rest-params': 'warn',
    'space-before-function-paren': ['warn', 'never'],
    'spaced-comment': ['warn', 'always', {
      markers: ['#region', '#endregion']
    }],
    //#endregion
    //#region Vue
    'vue/multi-word-component-names': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      allowEmptyLines: true
    }],
    //#endregion
    //#region JSDOC
    'jsdoc/check-access': 1, // Recommended
    'jsdoc/check-alignment': 1, // Recommended
    'jsdoc/check-indentation': 1,
    'jsdoc/check-line-alignment': 1,
    'jsdoc/check-param-names': 1, // Recommended
    'jsdoc/check-property-names': 1, // Recommended
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': 1, // Recommended
    'jsdoc/check-types': 1, // Recommended
    'jsdoc/check-values': 1, // Recommended
    'jsdoc/empty-tags': 1, // Recommended
    'jsdoc/implements-on-classes': 1, // Recommended
    'jsdoc/match-description': 1,
    'jsdoc/multiline-blocks': 1, // Recommended
    'jsdoc/no-bad-blocks': 1,
    'jsdoc/no-multi-asterisks': 1, // Recommended
    'jsdoc/no-undefined-types': 1, // Recommended
    'jsdoc/require-asterisk-prefix': 1,
    'jsdoc/require-description': 1,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-file-overview': 1,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-jsdoc': 1, // Recommended
    'jsdoc/require-param': 1, // Recommended
    'jsdoc/require-param-description': 1, // Recommended
    'jsdoc/require-param-name': 1, // Recommended
    'jsdoc/require-param-type': 1, // Recommended
    'jsdoc/require-property': 1, // Recommended
    'jsdoc/require-property-description': 1, // Recommended
    'jsdoc/require-property-name': 1, // Recommended
    'jsdoc/require-property-type': 1, // Recommended
    'jsdoc/require-returns': 1, // Recommended
    'jsdoc/require-returns-check': 1, // Recommended
    'jsdoc/require-returns-description': 1, // Recommended
    'jsdoc/require-returns-type': 1, // Recommended
    'jsdoc/require-throws': 1,
    'jsdoc/require-yields': 1, // Recommended
    'jsdoc/require-yields-check': 1, // Recommended
    'jsdoc/sort-tags': 1,
    'jsdoc/tag-lines': 1, // Recommended
    'jsdoc/valid-types': 1,
    //#endregion
  },
};
