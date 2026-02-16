/**
 * Commitlint — format des messages de commit (Conventional Commits).
 * @see https://commitlint.js.org/
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore'],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-case': [0],
  },
}
