const logger = require('../logger');

module.exports = {
    'ready': function () {
        this.user.setActivity('시리야 도움말');
        logger.info(`logged in as ${this.user.tag}`);
    }
};