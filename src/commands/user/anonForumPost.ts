import { CommandInteraction, AutocompleteInteraction, TextChannel } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Configs } from "../../databases/config/models";
import { initalizeUser } from "../../functions/initializeUser";
import { createEmbed } from "../../functions/embedCreator";
import { Users } from "../../databases/user/models";

interface IChannelData {
    name: string,
    id: string
}

const anonForumPostCommand: IHushCommand = {
    data: {
        type: 1,
        name: "anon_post",
        description: "Adds an anonymous post in chosen forum, if allowed.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 3,
                name: "forum",
                description: "Forum, where your post will be anonymously posted.",
                required: true,
                autocomplete: true,
                focused: true
            },
            {
                type: 3,
                name: "title",
                description: "Title of your post.",
                required: true
            },
            {
                type: 3,
                name: "content",
                description: "Contents of your post.",
                required: true
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
        const user_id = interaction.user.id!;
        const forum_id = interaction.data.options.getString("forum")!;
        const title_option = interaction.data.options.getString("title")!;
        const content_option = interaction.data.options.getString("content")!;
        let anon_id: string, anon_color: number, anon_banned: boolean = false;

        if(content_option.length > 4096) {
            await interaction.createMessage({ content: 
                "Maximum message length is 4096 characters.\n" + 
                "Please split it into more messages and send them separately.", 
            flags: 64 });
        }

        try {
            if(!await Configs.arePostsAllowed(guild_id, forum_id)) {
                await interaction.createMessage({ content: "Anonymous posts aren't allowed in this forum.\n" + 
                "Choose one from the suggestions. If there are none, they aren't allowed on this server.", flags: 64 });
                return;
            }

            const guild_data = await initalizeUser(user_id, guild_id);
            anon_id = guild_data.anon_id;
            anon_color = guild_data.anon_color;
            anon_banned = guild_data.anon_banned!;
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }

        if(anon_banned) {
            await interaction.createMessage({ content: "You are banned from using this bot.", flags: 64 });
            return;
        }

        const forum_channel = interaction.client.getChannel(forum_id)! as TextChannel;
        if(!forum_channel.permissionsOf(interaction.client.user.id).has("VIEW_CHANNEL", "SEND_MESSAGES")) {
            await interaction.createMessage({ content: "The bot cannot access chosen forum.", flags: 64 });
            return;
        }

        const embed = createEmbed({
            description: content_option,
            author: { name: anon_id },
            color: anon_color
        });
        
        await interaction.createMessage({ content: "Your post was created anonymously.", flags: 64 });
        const thread = await interaction.client.rest.channels.startThreadInThreadOnlyChannl(forum_id, 
            { name: title_option, message: {embeds: [embed]} });

        const message_id = thread.lastMessageID;
        const field = ["last_message_and_channel"];
        const new_value = [ [message_id, thread.id] ];
        await Users.changeAnon(guild_id, anon_id, field, new_value);
    }
}

export default anonForumPostCommand;