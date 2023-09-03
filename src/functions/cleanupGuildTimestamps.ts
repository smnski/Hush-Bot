import { slvtAlpha } from "../bot";

export function setupGuildTimestampsCleanup(botInstance: slvtAlpha) {

    const thirty_mins = 30 * 60 * 1000;

    setInterval(() => {
        botInstance.guild_cooldowns.forEach((timestamps, command_name) => {
            timestamps.forEach((timestamp, guild_id) => {
                if (timestamp - Date.now() < 0) {
                    timestamps.delete(guild_id);
                }
            });
        });
    }, thirty_mins);

    console.log("Finished setting up cleanup of guild command timers.");
}