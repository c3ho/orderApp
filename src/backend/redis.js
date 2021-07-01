const Redis = require("ioredis");

const redis = new Redis("redis://localhost:6379")

async function ping() {
  try {
    const msg = await redis.ping("Successfully connected to Redis!");
    console.log(msg);
  } catch (err) {
    console.log("Error connecting to Redis");
  }
}

ping()

module.exports = {
    set: async (id, refreshToken) => {
        try {
            // sets key and expire time, currently expire time is half-day
            await redis.set(id, refreshToken, "EX", 86400);
        } catch (err) {
            console.log("Error setting key + expire in Redis");
        }
    },

    get: async (id) => {
        try {
            return await redis.get(id)
        } catch (err) {
            console.log("Error retrieving key in Redis");
        }
    },

    exists: async (id) => {
        try {
            return redis.exists(id);
        } catch (err) {
            console.log("Error checking if id exists in Redis");
        }
    },

    delete: async (id) => {
        try {
            return redis.delete(id);
        } catch (err) {
            console.log("Error removing key in Redis");
        }
    }

}