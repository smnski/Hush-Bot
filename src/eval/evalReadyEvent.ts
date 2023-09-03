import { Client } from "oceanic.js";
import { ISlvtEvent } from "../bot";
import { startTerminalInput } from "./evalTerminal";

const evalReadyEvent: ISlvtEvent = {
    data: {
        name: "ready",
        once: true
    },
    async execute(client: Client): Promise<void> {
        console.log(`Ready! Logged in as: ${client.user.tag}`);
        startTerminalInput(client);
    }
}

export default evalReadyEvent;