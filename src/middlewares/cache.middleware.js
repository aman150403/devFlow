import redisClient from "../utils/redis.js";

const cache = (keyPrefix, ttl = 60) => {
    return async(req, res, next) => {
        const key = keyPrefix + JSON.stringify(req.params) + JSON.stringify(req.query);

        const cachedData = await redisClient.get(key)

        if(cachedData){
            return res.statue(200).json({
                fromCache: true,
                data: JSON.parse(cachedData)
            })
        }

        const originalJson = res.json.bind(res);
        res.json = (data) => {
            redisClient.setEx(key, ttl, JSON.stringify(data))
            return originalJson(data);
        }
        next()
    }
}

export default cache; 