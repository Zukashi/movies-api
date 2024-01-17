import pino, { TransportTargetOptions } from 'pino';

const transports: TransportTargetOptions[] = [
    { level: 'error', target: 'pino/file', options: { destination: 'logs/error.log' } },
    { level: 'info', target: 'pino/file', options: { destination: 'logs/info.log' } }
];

if (process.env.NODE_ENV === 'development') {
    transports.push({ level: 'info', target: 'pino-pretty', options: { singleLine: true } });
}

const logger = pino({
    level: 'info',
    transport: {
        targets: transports
    }
});

export { logger };
