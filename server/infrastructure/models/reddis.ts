import {redis} from '../index'

// Function to add one member to a set

export const revokeUserId=async(userId:string)=>{
    try {
        const expirationTime= 3 * 60
        await redis.set(`blacklist:${userId}`, 'true', 'EX', expirationTime)
    } catch (error) {
        throw error
    }
}

export const unRevokeUserId=async(userId:string)=>{
    try {
        await redis.del(`blacklist:${userId}`);
    } catch (error) {
        throw error
    }
}

export const checkBlockedUserId=async(userId:string)=>{
    try {
        const isBlacklisted = await redis.get(`blacklist:${userId}`);
        return !isBlacklisted?false:true
    } catch (error) {
        throw new Error(String(error))
    }
}
