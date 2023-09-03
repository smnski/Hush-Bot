import * as mongoose from "mongoose";
import { Model } from 'mongoose';
import { UserStatics, UserMethods } from "./methods";
import { IColorData } from "src/data/colors";

// User interface.
export interface IUser extends mongoose.Document {
    user_id: string,
    guilds: IGuild[]
}

// User's attributes in given guild interface.
export interface IGuild {
    guild_id: string,
    anon_id: string,
    anon_color: number,
    anon_banned?: boolean // Set to false by schema if not provided.
    reroll_timestamp?: number // Set to 0 by schema if not provided.
    last_message_id?: string // Set to "" by schema if not provided.
}

// User methods declarations.
export interface IUserMethods {

    createNewGuild(guild_data: IGuild): Promise<void>;
    getGuild(guild_id: string): IGuild | null;
    doesGuildExist(guild_id: string): boolean;
    changeGuild(guild_id: string, fields: string[], new_values: any[]): Promise<boolean>;
}

// User statics declarations.
export interface IUserModel extends Model<IUser, {}, IUserMethods> {

    createNewUser(user_id: string, guild_data: IGuild): Promise<void>;
    createAndFetchNewUser(user_id: string, guild_data: IGuild): Promise<mongoose.HydratedDocument<IUser, IUserMethods>>;
    changeUser(user_id: string, guild_id: string, fields: string[], new_values: any[]): Promise<boolean>;
    getUser(user_id: string): Promise<mongoose.HydratedDocument<IUser, IUserMethods> | null>;
    doesUserExist(user_id: string): Promise<boolean>;
    
    generateAnonID(guild_id: string, forced_category?: IColorData): Promise<[string, number]>;
    generateAnonIDStrict(guild_id: string, old_color_attr: string): Promise<[string, number]>;
    getAnon(guild_id: string, anon_id: string): Promise<mongoose.HydratedDocument<IUser, IUserMethods> | null>;
    doesAnonExist(guild_id: string, anon_id: string): Promise<boolean>;
    changeAnon(guild_id: string, anon_id: string, fields: string[], values: any[]): Promise<boolean>;
    changeMatchingAnons(guild_id: string, fields: string[], criteria: any[], values: any[]): Promise<number>;
}

// Guild schema.
const GuildSchema = new mongoose.Schema<IGuild>({
    guild_id: { type: String, required: true },
    anon_id: { type: String, required: true },
    anon_color: { type: Number, required: true },
    anon_banned: { type: Boolean, default: false },
    reroll_timestamp: { type: Number, default: 0 },
    last_message_id: { type: String, default: "" }
});

// User schema.
const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
    user_id: { type: String, required: true },
    guilds: [GuildSchema]
});
UserSchema.methods = UserMethods;
UserSchema.statics = UserStatics;

// Documents will be of type IUser. They will have access to methods and statics defined in IUserModel.
export const Users = mongoose.model<IUser, IUserModel>("users", UserSchema);