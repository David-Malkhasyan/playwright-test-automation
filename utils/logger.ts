import winston from "winston";

const logger = winston.createLogger({
    level: 'info', // default level
    format: winston.format.combine(
        winston.format.colorize(), // colors in console
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),           // logs to console
        new winston.transports.File({filename: 'logs/playwright.log'})  // logs to file
    ],
});

export default logger;
