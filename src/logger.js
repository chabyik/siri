const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

module.exports = winston.createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(info => `[${info.timestamp}] ${info.level} | ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            level: 'http',
        }),
    ],
});