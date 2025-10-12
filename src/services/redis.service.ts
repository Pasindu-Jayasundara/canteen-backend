import { createClient } from 'redis';
import 'dotenv/config';

export const RedisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!)
    }
});

console.log("Redis Host:", process.env.REDIS_HOST);
console.log("Redis Port:", process.env.REDIS_PORT);
console.log("Redis Username:", process.env.REDIS_USERNAME ? "Provided" : "Not Provided");
console.log("Redis Password:", process.env.REDIS_PASSWORD ? "Provided" : "Not Provided");

RedisClient.on('error', err => console.log('Redis Client Error', err));

export const Redis_addValue = async(key:string, value:string, expirationInSeconds: number) : Promise<void> => {
    await RedisClient.sAdd(key, value);
};

export const Redis_addExpireValue = async(key:string, value:string, expirationInSeconds: number) : Promise<void> => {
    await RedisClient.SETEX(key, expirationInSeconds, value);
};

export const Redis_getAllValues = async(key:string) :Promise<string[]> =>{
    return await RedisClient.SMEMBERS(key) as string[];
};

export const Redis_getValue = async(key:string) :Promise<string> =>{
    return await RedisClient.GET(key) as string;
};

export const Redis_removeValue = async(key:string, value:string) : Promise<void> => {
    await RedisClient.SREM(key, value);
};