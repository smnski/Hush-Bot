import { slvtAlpha, ISlvtEvent } from "../bot";
import { setupGuildTimestampsCleanup } from "../functions/cleanupGuildTimestamps";

const readyEvent: ISlvtEvent = {
    data: {
        name: "ready",
        once: true
    },
    async execute(botInstance: slvtAlpha): Promise<void> {
        console.log(`Ready! Logged in as: ${botInstance.user.tag}`);
        await botInstance.deployCommandsGlobally();
        setupGuildTimestampsCleanup(botInstance);
    }
}

export default readyEvent;