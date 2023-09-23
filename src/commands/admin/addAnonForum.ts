import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Configs } from "../../databases/config/models";

const adminRemoveAnonForumCommand: IHushCommand = {
    data: {
        type: 1,
        name: "admin_add_anon_forum",
        description: "Enable creating anonymous posts in a forum.",
        defaultMemberPermissions: "8",
        options: [
            {
                type: 7,
                name: "forum",
                description: "Forum, where anonymous posts will be enabled.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        const guild_id = interaction.guildID!;
        const forum_option = interaction.data.options.getChannel("forum")!;

        if(forum_option.type !== 15) {
            await interaction.createMessage({ content: "Chosen channel must be a forum.", flags: 64 });
            return;
        }
        
        const forum_id = forum_option.id;
        const forum_name = forum_option.name;

        try {
            let guild_config = await Configs.getConfig(guild_id);
            if(!guild_config) {
                guild_config = await Configs.createAndFetchNewConfig(guild_id);
            }
            const result = await guild_config.addForum(forum_id);
            if(!result) {
                await interaction.createMessage({ content: "This forum is already marked as anonymous.", flags: 64 });
                return;
            }

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `Anonymous threads can now be created in ${forum_name}.`, flags: 64});
    }
}

export default adminRemoveAnonForumCommand;