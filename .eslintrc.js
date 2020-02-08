module.exports = {
    root: false,
    lintOnSave: false,
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/recommended'
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
        'indent': 'off',
        'vue/script-indent': 'off'
    }
};