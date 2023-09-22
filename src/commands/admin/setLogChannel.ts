import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Configs } from "../../databases/config/models";

const adminSetLogChannelCommand: IHushCommand = {
    data: {
        type: 1,
        name: "admin_set_log_channel",
        description: "Sets a log channel for the bot.",
        defaultMemberPermissions: "8",
        options: [
            {
                type: 7,
                name: "channel",
                description: "Channel, where the bots will post different logs.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        const guild_id = interaction.guildID!;
        const channel_option = interaction.data.options.getChannel("channel")!;
        const channel_name = channel_option.name;

        if(channel_option.type !== 0) {
            await interaction.createMessage({ content: "Chosen channel must be a standard text channel.", flags: 64 });
            return;
        }

        if(!channel_option.appPermissions.has("SEND_MESSAGES")) {
            await interaction.createMessage({ content: "The bot cannot send messages in this channel. Update it's permissions.", flags: 64 });
            return;
        }

        try {
            let guild_config = await Configs.getConfig(guild_id);
            if(!guild_config) {
                guild_config = await Configs.createAndFetchNewConfig(guild_id);
            }
            await guild_config.setLogChannel(channel_option.id);
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `${channel_name} successfully set as bot's log channel.`, flags: 64});
    }
}

export default adminSetLogChannelCommand;