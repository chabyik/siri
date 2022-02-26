module.exports = {
    '도움말': function (message, args) {
        const embed = {
            title: '도움말',
            color: 0x00A3D2,
            fields: [
                { name: '시리야 도움말', value: '사용 가능한 명령어들을 확인합니다.' },
                { name: '시리야 핑', value: '지연 시간을 확인합니다.' },
            ],
        };

        message.author.send({ embeds: [embed] });
        message.reply('개인 메시지로 도움말을 전송했습니다.');
    }
};