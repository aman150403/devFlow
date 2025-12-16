import redisClient from "./redis";

const invalidateByCache = async(prefix) => {
    try{
        const keys = await redisClient.keys(prefix + "*")
        if(keys.length > 0){
            await redisClient.del(keys)
        } else{
            console.log('NO CACHE KEYS FOUND FOR PREFIX:', prefix)
        }
    }   catch(err){
            console.error("ERROR IN CACHE INVALIDATION:", err);
    }
}