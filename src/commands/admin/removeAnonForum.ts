import { CommandInteraction, AutocompleteInteraction, Channel } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Configs } from "../../databases/config/models";

interface IChannelData {
    name: string,
    id: string
}

const adminRemoveAnonForumCommand: IHushCommand = {
    data: {
        type: 1,
        name: "admin_remove_anon_forum",
        description: "Disables creating anonymous posts in chosen forum.",
        defaultMemberPermissions: "8",
        options: [
            {
                type: 3,
                name: "forum",
                description: "Forum, where anonymous posts will be disabled.",
                required: true,
                autocomplete: true,
                focused: true
            }
        ]
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const guild_id = interaction.guildID!;
        const focused_option = interaction.data.options.getFocused()!;
        let filtered_forums: IChannelData[] = [];
        
        try {
            const config = await Configs.getConfig(guild_id);
            if(!config) {
                interaction.result([]);
                return;
            }
            // Allowed forums are those in config and discord cache at once.
            const allowed_forums = config!.anon_forums!.map(config_channel_id => {
                const channel = interaction.guild!.channels.get(config_channel_id);
                if(channel) { 
                    return { name: channel.name, id: channel.id };
                } else {
                    return null;
                }
            }).filter(found_channel => found_channel !== null) as IChannelData[];
            
            // Show channels with names matching to current user input.
            filtered_forums = allowed_forums.filter(channel => channel.name.startsWith(focused_option.value.toString()));

        } catch(error) {
            console.log(error);
            return;
        }
        interaction.result(filtered_forums.map(choice => ({ name: choice.name, value: choice.id })));
    },

    async execute(interaction: CommandInteraction) {
        const guild_id = interaction.guildID!;
        const channel_id = interaction.data.options.getString("forum")!;

        try {
            let guild_config = await Configs.getConfig(guild_id);
            if(!guild_config) {
                guild_config = await Configs.createAndFetchNewConfig(guild_id);
            }
            const result = await guild_config.removeForum(channel_id);
            if(!result) {
                await interaction.createMessage({ content: "Forum doesn't have anonymous posts enabled already or doesn't exist.", flags: 64 });
                return;
            }
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: "Anonymous threads successfully disabled in chosen forum.", flags: 64 });
    }
}

export default adminRemoveAnonForumCommand;