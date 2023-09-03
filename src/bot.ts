import fs from "fs";
import path from "path";
import { Client, ClientEvents } from "oceanic.js";
import dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();
const TOKEN = process.env.TOKEN as string;
const DEBUG_GUILD_ID = process.env.DEBUG_GUILD_ID as string;

process.on("unhandledRejection", (reason: any) => {
    console.log("Unhandled Rejection at:", reason.stack || reason)
});

export interface ISlvtEvent {
    data: {
        name: keyof ClientEvents,
        once: boolean
    },
    execute: Function
}

// Short cooldowns kept on client and validated inside interactionCreate.
// Long cooldowns kept in database and validated inside command code.
export interface ISlvtCommand {
    data: {
        type: number,
        name: string,
        description: string,
        defaultMemberPermissions: string,
        options?: any[]
    },
    guild_cooldown_short?: number,
    user_cooldown_long?: number,
    autocomplete?: Function,
    execute: Function
}

export class slvtAlpha extends Client {

    static LogToken: string = `Bot ${TOKEN}`;

    events: Map<string, ISlvtEvent>;
    commands: Map<string, ISlvtCommand>;
    guild_cooldowns: Map<string, Map<string, number>>;

    constructor() {
        super({
            auth: slvtAlpha.LogToken,
            gateway: {
                intents: ["GUILDS", "GUILD_MESSAGES"]
            }
        })
        this.events = new Map<string, ISlvtEvent>();
        this.commands = new Map<string, ISlvtCommand>();
        this.guild_cooldowns = new Map<string, Map<string, number>>();
    }

    public loadEvents(): void {
        const eventsPath: string = path.join(__dirname, "events");
        const eventFiles: string[] = fs.readdirSync(eventsPath).filter(x => x.endsWith(".ts"));

        for(const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const eventData: ISlvtEvent = require(filePath).default;

            if(eventData.data.once) {
                this.once(eventData.data.name, (...args: any[]) => eventData.execute(this, ...args));
                console.log(`Loaded one-time event: ${eventData.data.name}`);
            } else {
                this.on(eventData.data.name, (...args: any[]) => eventData.execute(this, ...args));
                console.log(`Loaded event: ${eventData.data.name}`);
            }
        }
    }

    public loadCommands(): void {
        const commandSubdirsPath: string = path.join(__dirname, "commands");
        const subdirs: string[] = fs.readdirSync(commandSubdirsPath, { withFileTypes: true })
            .filter(x => x.isDirectory)
            .map(x => x.name);

        for(const dir of subdirs) {
            const dirPath = path.join(commandSubdirsPath, dir);
            const commandFiles = fs.readdirSync(dirPath).filter(x => x.endsWith(".ts"));

            for(const file of commandFiles) {
                const filePath = path.join(dirPath, file);
                const commandData: ISlvtCommand = require(filePath).default;

                this.commands.set(commandData.data.name, commandData);
                console.log(`Loaded command: ${commandData.data.name}`);
            }
        }
    }

    public async deployCommandsLocally(): Promise<void> {
        await this.application.bulkEditGuildCommands(DEBUG_GUILD_ID, [...this.commands.values()].map(x => x.data));
        console.log("Commands deployed locally.");
    }

    public async removeCommandsLocally(): Promise<void> {
        await this.application.bulkEditGuildCommands(DEBUG_GUILD_ID, []);
        console.log("Commands deleted locally.");
    }

    public async deployCommandsGlobally(): Promise<void> {
        await this.application.bulkEditGlobalCommands([...this.commands.values()].map(x => x.data));
        console.log("Commands deployed globally.");
    }

    public async removeCommandsGlobally(): Promise<void> {
        await this.application.bulkEditGlobalCommands([]);
        console.log("Commands deleted globally.");
    }

    public async connectToMongoose() {
        const uri: string = "mongodb://127.0.0.1:27017/HushDebugDB";
        await mongoose.connect(uri)
        .then( () => {
            console.log('Connected to mongoose.')
        })
        .catch( (error) => {
            console.error("Error connecting to mongoose:", error);
        })
    }
}

const botInstance = new slvtAlpha();
botInstance.loadEvents();
botInstance.loadCommands();
botInstance.connect();
botInstance.connectToMongoose();