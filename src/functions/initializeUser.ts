import { Users, IGuild } from "../databases/user/models";

// Generates user's anonymous information and assigns it to a guild object. Returns the object.
async function assignGuildData(guild_id: string): Promise<IGuild> {

    const anon_info = await Users.generateAnonID(guild_id);
    const guild_object: IGuild = {
        guild_id: guild_id,
        anon_id: anon_info[0],
        anon_color: anon_info[1]
    }
    return guild_object;
}

// Checks if command user and guild, where command was used are in database. If not, initializes them.
// Returns user's guild object in initialized or existing guild.
export async function initalizeUser(user_id: string, guild_id: string): Promise<IGuild> {
    let guild_data: IGuild;
    try {
        const found_user = await Users.getUser(user_id);
        // User not in database.
        if(!found_user) {
            guild_data = await assignGuildData(guild_id);
            await Users.createNewUser(user_id, guild_data);
        } else {
            const found_guild = found_user.getGuild(guild_id);
            // User in database, guild not.
            if(!found_guild) {
                guild_data = await assignGuildData(guild_id);
                await found_user.createNewGuild(guild_data);
            // User and guild in database.
            } else {
                guild_data = found_guild;
            }
        }
    } catch(error) {
        console.log(error);
        throw new Error("initializeUser throw");
    }
    return guild_data;
}