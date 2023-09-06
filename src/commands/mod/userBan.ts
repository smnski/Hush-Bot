import { CommandInteraction } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { Users } from "../../databases/user/models";
import { initalizeUser } from "../../functions/initializeUser";

const modUserBanCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "mod_ban_user",
        description: "Bans user from sending anonymous messages.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 6,
                name: "user",
                description: "User to ban.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const user_option = interaction.data.options.getUser("user")!;
        const user_id = user_option.id;
        const guild_id = interaction.guildID!;
        const field = ['anon_banned'];
        const value = [true];

        try {
            await initalizeUser(user_id, guild_id);
            await Users.changeUser(user_id, guild_id, field, value);
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `${user_option.username} was successfully banned.`, flags: 64});
    }
}

export default modUserBanCommand;