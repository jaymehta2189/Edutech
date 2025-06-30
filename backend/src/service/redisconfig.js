import Redis from "ioredis";

const RedisClient = new Redis({
    host: "localhost",
    port: 6380,
});
RedisClient.ClearRedisSync = async ()=>{
    try {
        const result = await RedisClient.call('FLUSHALL', 'SYNC');
        console.log('Flush Result:', result); // Should print "OK"
    } catch (error) {
        console.error('Error flushing Redis:', error);
    }
};

RedisClient.ClearRedisAsync = async ()=>{
    try {
        const result = await RedisClient.call('FLUSHALL', 'ASYNC');
        console.log('Flush Result:', result); // Should print "OK"
    } catch (error) {
        console.error('Error flushing Redis:', error);
    }
};

export default RedisClient;
