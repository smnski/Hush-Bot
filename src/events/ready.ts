import { ActivityTypes } from "oceanic.js";
import { Hush, IHushEvent } from "../bot";
import { setupGuildTimestampsCleanup } from "../functions/cleanupGuildTimestamps";

const readyEvent: IHushEvent = {
    data: {
        name: "ready",
        once: true
    },
    async execute(botInstance: Hush): Promise<void> {
        console.log(`Ready! Logged in as: ${botInstance.user.tag}`);
        await botInstance.deployCommandsLocally();
        setupGuildTimestampsCleanup(botInstance);
        botInstance.editStatus("online", [{ name: "silence", type: ActivityTypes.LISTENING }]);
    }
}

export default readyEvent;