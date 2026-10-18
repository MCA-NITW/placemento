import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || (isProduction ? 'warn' : 'info'),
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		winston.format.printf(({ timestamp, level, message, stack }) => `${timestamp} [${level.toUpperCase()}] ${stack || message}`)
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ timestamp, level, message, stack }) => `${timestamp} [${level}] ${stack || message}`)
			)
		}),
		new DailyRotateFile({
			filename: 'logs/%DATE%-combined.log',
			datePattern: 'YYYY-MM-DD',
			maxSize: '20m',
			maxFiles: '14d',
			level: 'info'
		})
	]
});

// Strip CR/LF from user-supplied values before logging them, so a crafted
// email or name cannot forge extra log lines (log injection)
export const sanitizeForLog = (value: unknown): string => String(value).replace(/[\r\n]+/g, ' ');

export default logger;
