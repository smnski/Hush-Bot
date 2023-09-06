import * as mongoose from "mongoose";
import { IColorCategory, color_data } from "../../data/colors";
import { RNG } from "../../functions/rng";
import { IUser, IUserMethods, IUserModel, IGuild } from "./models";

export const UserMethods = {
    // Creates a new guild object. Saves the user's document.
    async createNewGuild(this: mongoose.HydratedDocument<IUser, IUserMethods>, guild_data: IGuild): Promise<void> {
        this.guilds.push(guild_data);
        await this.save();
    },
    // Finds a guild object and returns it.
    getGuild(this: mongoose.HydratedDocument<IUser, IUserMethods>, guild_id: string): IGuild | null {
        const found_guild = this.guilds.find(x => x.guild_id === guild_id);
        return found_guild ? found_guild : null;
    },
    // Finds a guild object. Returns true if it exists, false otherwise.
    doesGuildExist(this: mongoose.HydratedDocument<IUser, IUserMethods>, guild_id: string): boolean {
        const found_guild = this.guilds.find(x => x.guild_id === guild_id);
        return found_guild !== undefined;
    },
    // Finds and updates a guild object. Returns true if found, false otherwise.
    async changeGuild(this: mongoose.HydratedDocument<IUser, IUserMethods>, guild_id: string, fields: string[], new_values: any[]): Promise<boolean> {

        const guild_index = this.guilds.findIndex(x => x.guild_id === guild_id);
        if(guild_index === -1) return false;

        const update_obj: Record<string, any> = {};
        fields.forEach((field, index) => {
            update_obj[`guilds.${guild_index}.${field}`] = new_values[index];
        });

        await this.updateOne({ $set: update_obj });
        return true;
    }
}

export const UserStatics = {
    // Creates a new user document.
    async createNewUser(this: IUserModel, user_id: string, guild_data: IGuild): Promise<void> {
        await this.create({
            user_id: user_id,
            guilds: [guild_data]
        });
    },
    // Creates a new user document and returns it.
    async createAndFetchNewUser(this: IUserModel, user_id: string, guild_data: IGuild): Promise<mongoose.HydratedDocument<IUser, IUserMethods>> {
        const new_user = await this.create({
            user_id: user_id,
            guilds: [guild_data]
        });
        return new_user;
    },
    // Finds a user document and returns it.
    async getUser(this: IUserModel, user_id: string): Promise<mongoose.HydratedDocument<IUser, IUserMethods> | null> {
        const found_user = await this.findOne({ user_id: user_id });
        return found_user;
    },
    // Finds and updates user document. Returns true if found, false otherwise.
    async changeUser(this: IUserModel, user_id: string, guild_id: string, fields: string[], new_values: any[]) {
        const update_obj: Record<string, any> = {};
        fields.forEach((field, index) => {
            update_obj[`guilds.$.${field}`] = new_values[index];
        });

        const result = await this.findOneAndUpdate(
            { "user_id": user_id, "guilds.guild_id": guild_id },
            { $set: update_obj });

        return result !== null;
    },
    // Finds a user document. Returns true if it exists, false otherwise.
    async doesUserExist(this: IUserModel, user_id: string): Promise<boolean> {
        const found_user = await this.findOne({ user_id: user_id });
        return found_user !== null;
    },
    // Generates a unique anon_id for the given guild. Returns [anon_id, anon_color].
    // Rerolling into the same attribute possible.
    async generateAnonID(this: IUserModel, guild_id: string, forced_category?: IColorCategory): Promise<[string, number]> {
        let anon_id: string, anon_color: number, color_category: IColorCategory;

        do {
            color_category = forced_category ? forced_category : color_data[RNG(0, color_data.length - 1)];

            anon_color = color_category.color_code;
            const tag = RNG(0, 9999).toString();
            const color_attributes = color_category.attributes;
            const color_attribute = color_attributes[RNG(0, color_attributes.length - 1)];

            anon_id = color_attribute + " " + tag;
        } while(await this.findOne({ guilds: { $elemMatch: { guild_id: guild_id, anon_id: anon_id }}}))
        
        return [anon_id, anon_color];
    },
    // Generates a unique anon_id for the given guild. Returns [anon_id, anon_color].
    // Rerolling into the same attribute impossible.
    async generateAnonIDStrict(this: IUserModel, guild_id: string, old_color_attr: string): Promise<[string, number]> {
        let anon_id: string, anon_color: number, color_category: IColorCategory, new_color_attr: string;

        do {
            color_category = color_data[RNG(0, color_data.length - 1)];

            anon_color = color_category.color_code;
            const tag = RNG(0, 9999).toString();
            const color_attributes = color_category.attributes;
            new_color_attr = color_attributes[RNG(0, color_attributes.length - 1)];

            anon_id = new_color_attr + " " + tag;
        } while(
            await this.findOne({ guilds: { $elemMatch: { guild_id: guild_id, anon_id: anon_id }}})
            && new_color_attr !== old_color_attr)

        return [anon_id, anon_color];
    },
    // Finds user document and returns it.
    async getAnon(this: IUserModel, guild_id: string, anon_id: string): Promise<mongoose.HydratedDocument<IUser, IUserMethods> | null> {
        const found_user = await this.findOne({ guilds: { $elemMatch: { guild_id: guild_id, anon_id: anon_id }}});
        return found_user;
    },
    // Finds user document. Returns true if exists, false otherwise.
    async doesAnonExist(this: IUserModel, guild_id: string, anon_id: string): Promise<boolean> {
        const found_info = await this.findOne({ guilds: { $elemMatch: { guild_id: guild_id, anon_id: anon_id }}});
        return found_info !== null;
    },
    // Finds and updates user document. Returns true if found, false otherwise.
    async changeAnon(this: IUserModel, guild_id: string, anon_id: string, fields: string[], new_values: any[]): Promise<boolean> {
        const update_obj: Record<string, any> = {};
        fields.forEach((field, index) => {
            update_obj[`guilds.$.${field}`] = new_values[index];
        });

        const updated_user = await this.findOneAndUpdate(
            { guilds: { $elemMatch: { guild_id: guild_id, anon_id: anon_id }}}, 
            { $set: update_obj }
            );

        return updated_user !== null;
    },
    // Updates user documents based on matching criteria. Returns the number of documents changed.
    async changeMatchingAnons(this: IUserModel, guild_id: string, fields: string[], criteria: any[], new_values: any[]): Promise<number> {
        const conditions = fields.map((field, index) => ({
            [field]: criteria[index],
        }));

        const filter = { guilds: {
            $elemMatch: {
                guild_id: guild_id,
                $and: conditions
            }
        }};

        const update_obj: Record<string, any> = {};
        fields.forEach((field, index) => {
            update_obj[`guilds.$.${field}`] = new_values[index];
        });

        const result = await this.updateMany(filter, update_obj);
        return result.modifiedCount;
    }
}