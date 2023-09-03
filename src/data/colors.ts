export interface IColorData {
    color_name: string,
    color_code: number,
    attributes: string[]
}

export const color_data: IColorData[] = [
    {
        color_name: "red",
        color_code: 0x800000,
        attributes: ["Ruby", "Garnet", "Raspberry", "Strawberry", "Rose", "Maple", "Begonia", "Crimson", "Blood", "Mars"]
    },
    {
        color_name: "blue",
        color_code: 0x383EEC,
        attributes: ["Sapphire", "Diamond", "Bluebell", "Hyacinth", "Galaxy", "Sky", "Ocean", "Rain", "Neptune", "Nebula"]
    },
    {
        color_name: "pink",
        color_code: 0xFDB7C3,
        attributes: ["Rose Quartz", "Chrysanthemum", "Azalea", "Fuchsia", "Dragonfruit", "Lotus", "Peony", "Cherry Blossom", "Lilac", "Blush"]
    },
    {
        color_name: "green",
        color_code: 0x008000,
        attributes: ["Emerald", "Jade", "Lime", "Mint", "Aloe", "Clover", "Mantis", "Nature", "Flora", "Leaf"]
    },
    {
        color_name: "black",
        color_code: 0x1B1B1B,
        attributes: ["Onyx", "Obsidian", "Elderberry", "Blackberry", "Void", "Black Hole", "Darkness", "Midnight", "Eclipse", "Shadow"]
    },
    {
        color_name: "white",
        color_code: 0xCBCBCB,
        attributes: ["Marble", "Alabaster", "Howlite", "Jasmine", "Moonflower", "Pearl", "Lightning", "Cloud", "Snow", "Summit"]
    },
    {
        color_name: "purple",
        color_code: 0x522D72,
        attributes: ["Amethyst", "Hibiscus", "Iris", "Fig", "Plum", "Grape", "Violet", "Lavender", "Aster", "Coral"]
    },
    {
        color_name: "orange",
        color_code: 0xF28526,
        attributes: ["Pumpkin", "Orange", "Tangerine", "Mango", "Apricot", "Sunrise", "Sunset", "Flame", "Lava", "Magma"]
    },
    {
        color_name: "gray",
        color_code: 0x808080,
        attributes: ["Titanium", "Silver", "Granite", "Steel", "Thunder", "Ash", "Storm", "Fog", "Meteor", "Blade"]
    },
    {
        color_name: "yellow",
        color_code: 0xFFC041,
        attributes: ["Gold", "Topaz", "Citrine", "Amber", "Sunflower", "Star", "Sun", "Saturn", "Honey", "Pollen"]
    }
]