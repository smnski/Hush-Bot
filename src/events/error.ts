import { Hush, IHushEvent } from "../bot";

const errorEvent: IHushEvent = {
    data: {
        name: "error",
        once: false
    },
    execute(botInstance: Hush, err: any) {
        console.log("An error was emitted:", err);
    }
}

export default errorEvent;