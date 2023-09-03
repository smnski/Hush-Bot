import { CommandInteraction, TextChannel } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { initalizeUser } from "../../functions/initializeUser";
import { createEmbed } from "../../functions/embedCreator";
import { Users, IGuild } from "../../databases/user/models";

const anonSendCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "anon_send",
        description: "Sends an anonymous message in current channel.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 3,
                name: "content",
                description: "Contents of your message.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {

        const content_option = interaction.data.options.getString("content")!;
        const user_id = interaction.user.id!;
        const guild_id = interaction.guildID!;

        let guild_data: IGuild;

        if(content_option.length > 4096) {
            await interaction.createMessage({ content: 
                "Maximum message length is 4096 characters.\n" + 
                "Please split it into more messages and send them separately.", 
            flags: 64 });
            return;
        }

        try {
            guild_data = await initalizeUser(user_id, guild_id);
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }

        if(guild_data.anon_banned) {
            await interaction.createMessage({ content: "You are banned from using this bot.", flags: 64 });
            return;
        }

        const command_channel = interaction.client.getChannel(interaction.channelID)! as TextChannel;
        if(!command_channel.permissionsOf(interaction.client.user.id).has("VIEW_CHANNEL", "SEND_MESSAGES")) {
            await interaction.createMessage({ content: "The bot cannot send messages here.", flags: 64 });
            return;
        }

        const embed = createEmbed({
            description: content_option,
            author: { name: guild_data.anon_id },
            color: guild_data.anon_color
        });
        
        await interaction.createMessage({ content: "Your message was sent anonymously.", flags: 64 });
        const message = await interaction.client.rest.channels.createMessage(interaction.channelID, { embeds: [embed] });
        
        const field = ["last_message_id"];
        const new_value = [message.id];
        await Users.changeAnon(guild_data.guild_id, guild_data.anon_id, field, new_value);
    }
}

export default anonSendCommand;