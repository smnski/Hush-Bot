import * as mongoose from "mongoose";
import { IGuildConfig, IGuildConfigMethods, IGuildConfigModel } from "./models";

export const GuildConfigMethods = {
    // Adds a string to anon_forums and saves the config document. Returns true if successful, false otherwise.
    async addForum(this: mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods>, channel_id: string): Promise<boolean> {
        if(this.anon_forums!.includes(channel_id)) return false;
        
        this.anon_forums!.push(channel_id);
        await this.save();
        return true;
    },
    // Removes a string from anon_forums and saves the config's document. Returns true if successful, false otherwise.
    async removeForum(this: mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods>, channel_id: string): Promise<boolean> {
        const channel_index = this.anon_forums!.indexOf(channel_id);
        if(channel_index === -1) return false;

        await this.updateOne({ $pull: { anon_forums: channel_id }});
        return true;
    },
    async setLogChannel(this: mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods>, channel_id: string): Promise<void> {
        this.log_channel = channel_id;
        await this.save();
    }
}

export const GuildConfigStatics = {
    // Creates a new config document.
    async createNewConfig(this: IGuildConfigModel, guild_id: string): Promise<void> {
        await this.create({
            guild_id: guild_id
        });
    },
    // Creates a new config document and returns it.
    async createAndFetchNewConfig(this: IGuildConfigModel, guild_id: string): Promise<mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods>> {
        const new_config = await this.create({
            guild_id: guild_id
        });
        return new_config;
    },
    // Finds a config document and returns it.
    async getConfig(this: IGuildConfigModel, guild_id: string): Promise<mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods> | null> {
        const found_config = await this.findOne({ guild_id: guild_id });
        return found_config;
    },
    // Finds and updates a config document. Returns true if found, false otherwise.
    async changeConfig(this: IGuildConfigModel, guild_id: string, fields: string[], new_values: any[]): Promise<boolean> {
        const update_obj: Record<string, any> = {};
        fields.forEach((field, index) => {
            update_obj[field] = new_values[index];
        });

        const result = await this.findOneAndUpdate({ guild_id: guild_id }, { $set: update_obj });
        return result !== null;
    },
    // Checks if a channel is allowed for posts in the config document. Returns true if allowed, false otherwise.
    async arePostsAllowed(this: IGuildConfigModel, guild_id: string, channel_id: string): Promise<boolean> {
        const result = await this.findOne({ guild_id: guild_id, anon_forums: channel_id });
        return result !== null;
    },
    // Retrieves the log channel ID from the config document. Returns the ID or null if not set.
    async getLogChannel(this: IGuildConfigModel, guild_id: string): Promise<string | null> {
        const found_config = await this.getConfig(guild_id);
        if(!found_config) return null;

        const found_channel = found_config.log_channel!;
        return found_channel !== "" ? found_channel : null;
    }
}