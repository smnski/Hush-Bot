import { InteractionTypes, CommandInteraction, AutocompleteInteraction } from "oceanic.js";
import { Hush, IHushEvent, IHushCommand } from "../bot";

function handleGuildCooldown(botInstance: Hush, interaction: CommandInteraction, command: IHushCommand): number {
    const guild_id = interaction.guildID!;
    const command_name = command.data.name;
    const command_cd = command.guild_cooldown_short! * 1000;
    const now = Date.now();

    if(!botInstance.guild_cooldowns.has(command_name)) {
        botInstance.guild_cooldowns.set(command_name, new Map<string, number>());
    }
    const timestamps = botInstance.guild_cooldowns.get(command_name)!;

    const timestamp = timestamps.get(guild_id);

    if(!timestamp || timestamp <= now) {
        timestamps.set(guild_id, now + command_cd);
        return 0;
    }

    return Math.ceil((timestamp - now) / 1000);
}

const interactionCreateEvent: IHushEvent = {
    data: {
        name: "interactionCreate",
        once: false
    },
    async execute(botInstance: Hush, interaction: CommandInteraction | AutocompleteInteraction): Promise<void> {

        switch(interaction.type) {
            case InteractionTypes.APPLICATION_COMMAND: {
                
                if(!interaction.guild) {
                    interaction.createMessage({ content: "Bot can only be used in servers.", flags: 64 });
                    return;
                }

                const command = botInstance.commands.get(interaction.data.name);
                if(!command) {
                    console.log(`ERROR: No command matching: ${interaction.data.name}`);
                    return;
                }

                if(command.guild_cooldown_short) {
                    const remaining_cd = handleGuildCooldown(botInstance, interaction, command);
                    if(remaining_cd > 0) {
                        await interaction.createMessage({ content: `This command has a server cooldown. You can use it again in: ${remaining_cd} seconds.`, flags: 64 });
                        return;
                    }
                }

                try {
                    await command.execute(interaction);
                } catch(error) {
                    console.log(error);
                    await interaction.createMessage({ content: "There was an error while executing the command.", flags: 64 });
                    return;
                }
                break;
            }

            case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
                const command = botInstance.commands.get(interaction.data.name);
                if(!command || !command.autocomplete) {
                    console.log(`ERROR: No command or autocomplete function matching: ${interaction.data.name}`);
                    return;
                }
                try {
                    await command.autocomplete(interaction);
                } catch(error) {
                    console.log(error);
                }
                break;
            }
        } 
    }
}

export default interactionCreateEvent;