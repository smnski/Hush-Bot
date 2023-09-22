import { CommandInteraction } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const modRevealCommand: IHushCommand = {
    data: {
        type: 1,
        name: "mod_reveal_anon",
        description: "Reveals *only to you* the real user behind anonymous username.",
        defaultMemberPermissions: "4",
        options: [
            {
                type: 3,
                name: "name",
                description: "Name of anonymous user to reveal.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction) {
        
        const guild_id = interaction.guildID!;
        const name_option = interaction.data.options.getString("name")!;

        let username: string, globalName: string | null;

        try {
            const found_user = await Users.getAnon(guild_id, name_option);
            if(!found_user) {
                await interaction.createMessage({ content: "User wasn't found.", flags: 64 });
                return;
            }
            const user_id = found_user.user_id;
            const user = await interaction.client.rest.users.get(user_id);
            username = user.username;
            globalName = user.globalName; // display name in discord

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `${name_option}'s real info:\n` + 
        `Username: ${username}\nDisplay name: ${(globalName !== null ? globalName : "Doesn't have. Uses only username.")}`, flags: 64});
    }
}

export default modRevealCommand;