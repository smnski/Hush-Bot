import { CommandInteraction, TextChannel } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { initalizeUser } from "../../functions/initializeUser";
import { createEmbed } from "../../functions/embedCreator";
import { Users, IGuild } from "../../databases/user/models";

const anonDeleteLastMessageCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "anon_delete_last",
        description: "Deletes the last message / forum post you created with the bot.",
        defaultMemberPermissions: "1024",
    },
    async execute(interaction: CommandInteraction) {

        const user_id = interaction.user.id!;
        const guild_id = interaction.guildID!;
        let message_id: string;

        try {
            const found_user = await Users.getUser(user_id);
            if(!found_user) {
                await interaction.createMessage({ content: "You didn't use the bot yet.", flags: 64 });
                return;
            }

            const found_guild = found_user.getGuild(guild_id);
            if(!found_guild) {
                await interaction.createMessage({ content: "You didn't use the bot in this server yet.", flags: 64 });
                return;
            }

            

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        
    }
}

export default anonDeleteLastMessageCommand;