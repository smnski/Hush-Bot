import * as mongoose from "mongoose";
import { Model } from 'mongoose';
import { GuildConfigMethods, GuildConfigStatics } from "./methods";

// Guild config interface.
export interface IGuildConfig {
    guild_id: string,
    log_channel?: string, // Set to "" by schema if not provided.
    anon_forums?: string[] // Set to [] by schema if not provided.
}

// Guild config methods declarations.
export interface IGuildConfigMethods {
    
    addForum(channel_id: string): Promise<boolean>;
    removeForum(channel_id: string): Promise<boolean>;
    setLogChannel(channel_id: string): Promise<void>;
}

// Guild config statics declarations.
export interface IGuildConfigModel extends Model<IGuildConfig, {}, IGuildConfigMethods> {

    createNewConfig(guild_id: string): Promise<void>;
    createAndFetchNewConfig(guild_id: string): Promise<mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods>>;
    getConfig(guild_id: string): Promise<mongoose.HydratedDocument<IGuildConfig, IGuildConfigMethods> | null>;
    changeConfig(guild_id: string, fields: string[], new_values: any[]): Promise<boolean>;
    arePostsAllowed(guild_id: string, channel_id: string): Promise<boolean>;
    getLogChannel(guild_id: string): Promise<string | null>;
}

const ConfigSchema = new mongoose.Schema<IGuildConfig, IGuildConfigModel, IGuildConfigMethods>({
    guild_id: { type: String, required: true },
    log_channel: { type: String, default: "" },
    anon_forums: { type: [String], default: [] }
})
ConfigSchema.methods = GuildConfigMethods;
ConfigSchema.statics = GuildConfigStatics;

export const Configs = mongoose.model<IGuildConfig, IGuildConfigModel>("configs", ConfigSchema);