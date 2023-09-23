import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const modAnonBanCommand: IHushCommand = {
    data: {
        type: 1,
        name: "mod_ban_anon",
        description: "Bans anonymous user from sending anonymous messages.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 3,
                name: "name",
                description: "Name of anonymous user to ban.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const guild_id = interaction.guildID!;
        const name_option = interaction.data.options.getString("name")!;
        const field = ['anon_banned'];
        const value = [true];

        try {
            const changed_anon = await Users.changeAnon(guild_id, name_option, field, value);
            if(!changed_anon) {
                await interaction.createMessage({ content: "User wasn't found.", flags: 64});
                return;
            }
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `${name_option} was successfully banned.`, flags: 64});
    }
}

export default modAnonBanCommand;