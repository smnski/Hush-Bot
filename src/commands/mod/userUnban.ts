import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const modUserUnbanCommand: IHushCommand = {
    data: {
        type: 1,
        name: "mod_unban_user",
        description: "Lifts the ban on given user.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 6,
                name: "user",
                description: "User to unban.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const user_option = interaction.data.options.getUser("user")!;
        const user_id = user_option.id;
        const guild_id = interaction.guildID!;
        const field = ['anon_banned'];
        const value = [false];

        try {
            const changed_user = await Users.changeUser(user_id, guild_id, field, value);
            if(!changed_user) {
                await interaction.createMessage({ content: "User isn't banned and didn't use the bot yet.", flags: 64});
                return;
            }

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `${user_option.username} was successfully unbanned.`, flags: 64});
    }
}

export default modUserUnbanCommand;