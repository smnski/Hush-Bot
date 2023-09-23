export interface IColorCategory {
    category_name: string,
    colors: IColor[]
}

export interface IColor {
    name: string,
    code: number,
}

export const color_data: IColorCategory[] = [
    {
        category_name: "red",
        colors: [
            {
                name: "Red",
                code: 0xD0312D
            },
            {
                name: "Maroon",
                code: 0x800000
            },
            {
                name: "Crimson",
                code: 0xB90E0A
            },
            {
                name: "Scarlet",
                code: 0x900D09
            },
            {
                name: "Burgundy",
                code: 0x800020
            }
        ]
    },
    {
        category_name: "blue",
        colors: [
            {
                name: "Blue",
                code: 0x3944BC
            },
            {
                name: "Sky",
                code: 0x63C5DA
            },
            {
                name: "Navy",
                code: 0x0A1172
            },
            {
                name: "Teal",
                code: 0x48AAAD
            },
            {
                name: "Cyan",
                code: 0x0096AA
            }
        ]
    },
    {
        category_name: "green",
        colors: [
            {
                name: "Green",
                code: 0x3CB043
            },
            {
                name: "Pine",
                code: 0x234F1E
            },
            {
                name: "Lime",
                code: 0x32CD32
            },
            {
                name: "Mint",
                code: 0x99EDC3
            },
            {
                name: "Chartreuse",
                code: 0x80FF00
            }
        ]
    },
    {
        category_name: "pink",
        colors: [
            {
                name: "Pink",
                code: 0xF699CD
            },
            {
                name: "Fuchsia",
                code: 0xFC46AA
            },
            {
                name: "Magenta",
                code: 0xE11584
            },
            {
                name: "Rose",
                code: 0xFC94AF
            },
            {
                name: "Taffy",
                code: 0xFA86C4
            }
        ]
    },
    {
        category_name: "purple",
        colors: [
            {
                name: "Purple",
                code: 0xA32CC4
            },
            {
                name: "Indigo",
                code: 0x281E5D
            },
            {
                name: "Violet",
                code: 0x710193
            },
            {
                name: "Lavender",
                code: 0xE39FF6
            },
            {
                name: "Mauve",
                code: 0x7A4988
            }
        ]
    },
    {
        category_name: "orange",
        colors: [
            {
                name: "Orange",
                code: 0xED7014
            },
            {
                name: "Tangerine",
                code: 0xFA8128
            },
            {
                name: "Fire",
                code: 0xDD571C
            },
            {
                name: "Amber",
                code: 0xD79334
            },
            {
                name: "Apricot",
                code: 0xED820E
            }
        ]
    },
    {
        category_name: "yellow",
        colors: [
            {
                name: "Yellow",
                code: 0xFFEF00
            },
            {
                name: "Beige",
                code: 0xF5F5DC
            },
            {
                name: "Gold",
                code: 0xFCC201
            },
            {
                name: "Sunglow",
                code: 0xFFD400
            },
            {
                name: "Marigold",
                code: 0xEBA832
            }
        ]
    },
    {
        category_name: "light",
        colors: [
            {
                name: "Snow",
                code: 0xCBCBCB
            },
            {
                name: "Alabaster",
                code: 0xFEF9F3
            },
            {
                name: "Ivory",
                code: 0xFDF6E4
            },
            {
                name: "Pearl",
                code: 0xFBFCD8
            },
            {
                name: "Frost",
                code: 0xFCFBFC
            }
        ]
    },
    {
        category_name: "dark",
        colors: [
            {
                name: "Night",
                code: 0x1B1B1B
            },
            {
                name: "Gray",
                code: 0x808080
            },
            {
                name: "Midnight",
                code: 0x06032F
            },
            {
                name: "Shadow",
                code: 0x373737
            },
            {
                name: "Onyx",
                code: 0x030104
            }
        ]
    }
]