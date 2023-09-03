import { CommandInteraction } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { Users } from "../../databases/user/models";
import { color_data } from "../../data/colors";

const modUserRerollCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "mod_reroll_user",
        description: "Rerolls the anonymous username of specified user.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 6,
                name: "user",
                description: "User to reroll.",
                required: true
            },
            {
                type: 3,
                name: "color",
                description: "Name of color to force when rerolling. Leave empty for random.",
                required: false
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const guild_id = interaction.guildID!;
        const user_option = interaction.data.options.getUser("user")!;
        const color_option = interaction.data.options.getString("color");

        const fields = ["anon_id", "anon_color"];
        let anon_info: [string, number];

        try {
            if(color_option) {
                const color_category = color_data.find(x => x.color_name === color_option)
                if(!color_category) {
                    await interaction.createMessage({ content: "Color wasn't found.", flags: 64 });
                    return;
                }
                anon_info = await Users.generateAnonID(guild_id, color_category);
            } else {
                anon_info = await Users.generateAnonID(guild_id);
            }
            const values = [anon_info[0], anon_info[1]];

            const found_user = await Users.getUser(user_option.id);
            if(!found_user) {
                await interaction.createMessage({ content: "User didn't use the bot yet and doesn't have a tag assigned.", flags: 64});
                return;
            }

            const was_updated = await found_user.changeGuild(guild_id, fields, values);
            if(!was_updated) {
                await interaction.createMessage({ content: "User didn't use the bot yet and doesn't have a tag assigned.", flags: 64});
                return;
            }

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `User's tag was successfully rerolled to: ${anon_info[0]}`, flags: 64});
    }
}

export default modUserRerollCommand;