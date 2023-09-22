import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const modResetRerollCdCommand: IHushCommand = {
    data: {
        type: 1,
        name: "mod_reset_cd",
        description: "Resets the cooldown of rerolling own tag for given user.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 6,
                name: "user",
                description: "User, who will get their cooldown reset.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const guild_id = interaction.guildID!;
        const user_option = interaction.data.options.getUser("user")!;

        const field = ["reroll_timestamp"];
        const value = [0];

        try {
            const found_user = await Users.getUser(user_option.id);
            if(!found_user) {
                await interaction.createMessage({ content: "User didn't use the bot yet.", flags: 64});
                return;
            }

            await found_user.changeGuild(guild_id, field, value);

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: "User's cooldown was successfully reset.", flags: 64});
    }
}

export default modResetRerollCdCommand;