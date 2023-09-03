import { Embed, EmbedAuthor, EmbedField } from "oceanic.js";

interface embedComponents {
    description?: string,
    title?: string,
    author?: EmbedAuthor,
    color?: number,
    fields?: EmbedField[]
}

export function createEmbed({ description, title, author, color, fields }: embedComponents): Embed {
    
    const embed: Embed = {
        description: description,
        title: title,
        author: author,
        color: color,
        fields: fields
    }

return embed;
}