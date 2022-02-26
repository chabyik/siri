const { MessageActionRow, MessageButton } = require('discord.js');
const logger = require('../logger');
const moment = require('moment');
const net = require('net');

const SOCKET_DATA = Buffer.from([0x16, 0x00, 0xf5, 0x05, 0x0f, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x68, 0x6f, 0x73, 0x74, 0x00, 0x46, 0x4d, 0x4c, 0x32, 0x00, 0x63, 0xdd, 0x01, 0x01, 0x00], 'utf8')
const STATUS_CHANNEL = '918832049689862164';
const STATUS_MESSAGE = '932816306846199918';

module.exports = {
    'interactionCreate': function (interaction) {
        if (interaction.customId == 'siri.refresh.status') {
            logger.info(`${interaction.member.user.tag} interacted siri.refresh.status`);

            this.channels.cache.get(STATUS_CHANNEL).messages.fetch(STATUS_MESSAGE)
                .then(msg => {
                    let embed = {
                        title: '서버 상태',
                        color: 0xFFFF00,
                        fields: [
                            { name: '상태', value: '확인 중...', inline: true },
                            { name: '버전', value: '확인 중...', inline: true },
                            { name: '인원', value: '확인 중...', inline: true },
                        ],
                        footer: {
                            text: '갱신 중...\n주소: chabyik.xyz',
                        },
                    };

                    let row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('siri.refresh.status')
                                .setLabel('새로 고침')
                                .setStyle('SECONDARY')
                        );
                    
                    let isTimeout = false;
                    let isEdited = false;
                    
                    row.components[0].setDisabled(true);
                    msg.edit({ embeds: [embed], components: [row] });
                    row.components[0].setDisabled(false);

                    setTimeout(() => {
                        if (!isEdited) {
                            isTimeout = true;
                            embed.fields.forEach(field => { field.value = '시간 초과' });
                            embed.footer.text = `${moment().format('YYYY-MM-DD HH:mm:ss')} 에 갱신됨\n주소: chabyik.xyz`;
                            msg.edit({ embeds: [embed], components: [row] });
                        }
                    }, 5000);

                    
                    const client = net.connect({
                        host: 'chabyik.xyz',
                        port: 25565,
                    });

                    client.on('connect', () => {
                        client.write(SOCKET_DATA);
                    });

                    client.on('data', data => {
                        if (!isTimeout) {
                            const dataArray = data.toJSON().data;
                            let processedData = data.toString();

                            for (let i = 0; i < dataArray.length; i++) {
                                if (dataArray[i] == 123) break;
                                else processedData = processedData.slice(1);
                            }

                            const jsonData = JSON.parse(processedData);

                            embed.fields = [
                                { name: '상태', value: '열려있음', inline: true },
                                { name: '버전', value: jsonData.version.name, inline: true },
                                { name: '인원', value: `${jsonData.players.online}`, inline: true },
                            ];
                            embed.footer = { text: `${moment().format('YYYY-MM-DD HH:mm:ss')} 에 갱신됨\n주소: chabyik.xyz` };
                            embed.color = 0x00FF00;

                            msg.edit({ embeds: [embed], components: [row] })
                                .then(msg => { isEdited = true });
                            client.destroy();
                        }
                    });

                    client.on('error', err => {
                        if (!isTimeout) {
                            embed.fields = [
                                { name: '상태', value: '닫혀있음', inline: true },
                                { name: '버전', value: '확인 불가', inline: true },
                                { name: '인원', value: '확인 불가', inline: true },
                            ];
                            embed.footer = { text: `${moment().format('YYYY-MM-DD HH:mm:ss')} 에 갱신됨\n주소: chabyik.xyz` };
                            embed.color = 0xFF0000;

                            msg.edit({ embeds: [embed], components: [row] })
                                .then(msg => { isEdited = true });
                            client.destroy();
                        }
                    })
                });
            
            interaction.reply({ content: '갱신되었습니다.', ephmeral: true });
        }
    }
};