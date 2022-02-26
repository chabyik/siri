module.exports = {
    '핑': function (message, args) {
        message.reply('측정 중...')
            .then(msg => {
                msg.edit(`지연 시간: ${msg.createdTimestamp - message.createdTimestamp}ms`);
            });
    }
};