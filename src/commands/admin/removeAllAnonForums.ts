import { CommandInteraction } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { Configs } from "../../databases/config/models";

const adminRemoveAllAnonForumsCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "admin_remove_all_anon_forums",
        description: "Disables creating anonymous posts in all forums.",
        defaultMemberPermissions: "8",
        options: []
    },
    async execute(interaction: CommandInteraction) {
        
        const guild_id = interaction.guildID!;
        const field = ["anon_forums"];
        const value = [ [] ];
    
        try {
            await Configs.changeConfig(guild_id, field, value);
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: "Anonymous posts successfully disabled in every forum.", flags: 64 });
    }
}

export default adminRemoveAllAnonForumsCommand;