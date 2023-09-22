import { CommandInteraction, TextChannel } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const anonDeleteLastMessageCommand: IHushCommand = {
    data: {
        type: 1,
        name: "anon_delete_last",
        description: "Deletes the last message / forum post you created with the bot.",
        defaultMemberPermissions: "1024",
    },
    async execute(interaction: CommandInteraction) {

        const user_id = interaction.user.id!;
        const guild_id = interaction.guildID!;
        let message_id: string, channel_id: string;

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

            message_id = found_guild.last_message_and_channel![0];
            channel_id = found_guild.last_message_and_channel![1];

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }

        const channel = interaction.client.getChannel(channel_id) as TextChannel;
        if(!channel) {
            await interaction.createMessage({ content: "Channel, where the message was posted, was deleted.", flags: 64 });
            return;
        }

        try {
            await channel.deleteMessage(message_id);
        } catch(e) {
            await interaction.createMessage({ content: "Message is already deleted.", flags: 64 });
            return;
        }

        await interaction.createMessage({ content: "Message deleted successfully.", flags: 64 });
    }
}

export default anonDeleteLastMessageCommand;