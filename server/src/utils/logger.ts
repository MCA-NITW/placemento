import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
	filename: 'logs/%DATE%-combined.log',
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m',
	maxFiles: '14d'
});

const logger = winston.createLogger({
	transports: [new winston.transports.Console(), transport]
});

export default logger;
