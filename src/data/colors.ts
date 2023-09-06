export interface IColorCategory {
    category_name: string,
    colors: IColor[]
}

export interface IColor {
    color_name: string,
    color_code: number,
}

export const color_data: IColorCategory[] = [
    {
        category_name: "red",
        colors: [
            {
                color_name: "red",
                color_code: 0xD0312D
            },
            {
                color_name: "maroon",
                color_code: 0x800000
            },
            {
                color_name: "crimson",
                color_code: 0xB90E0A
            },
            {
                color_name: "scarlet",
                color_code: 0x900D09
            },
            {
                color_name: "burgundy",
                color_code: 0x800020
            }
        ]
    },
    {
        category_name: "blue",
        colors: [
            {
                color_name: "blue",
                color_code: 0x3944BC
            },
            {
                color_name: "sky",
                color_code: 0x63C5DA
            },
            {
                color_name: "navy",
                color_code: 0x0A1172
            },
            {
                color_name: "teal",
                color_code: 0x48AAAD
            },
            {
                color_name: "cyan",
                color_code: 0x0096AA
            }
        ]
    },
    {
        category_name: "green",
        colors: [
            {
                color_name: "green",
                color_code: 0x3CB043
            },
            {
                color_name: "pine",
                color_code: 0x234F1E
            },
            {
                color_name: "lime",
                color_code: 0x32CD32
            },
            {
                color_name: "mint",
                color_code: 0x99EDC3
            },
            {
                color_name: "chartreuse",
                color_code: 0x80FF00
            }
        ]
    },
    {
        category_name: "pink",
        colors: [
            {
                color_name: "pink",
                color_code: 0xF699CD
            },
            {
                color_name: "fuchsia",
                color_code: 0xFC46AA
            },
            {
                color_name: "magenta",
                color_code: 0xE11584
            },
            {
                color_name: "rose",
                color_code: 0xFC94AF
            },
            {
                color_name: "taffy",
                color_code: 0xFA86C4
            }
        ]
    },
    {
        category_name: "purple",
        colors: [
            {
                color_name: "purple",
                color_code: 0xA32CC4
            },
            {
                color_name: "indigo",
                color_code: 0x281E5D
            },
            {
                color_name: "violet",
                color_code: 0x710193
            },
            {
                color_name: "lavender",
                color_code: 0xE39FF6
            },
            {
                color_name: "mauve",
                color_code: 0x7A4988
            }
        ]
    },
    {
        category_name: "orange",
        colors: [
            {
                color_name: "orange",
                color_code: 0xED7014
            },
            {
                color_name: "tangerine",
                color_code: 0xFA8128
            },
            {
                color_name: "fire",
                color_code: 0xDD571C
            },
            {
                color_name: "amber",
                color_code: 0xD79334
            },
            {
                color_name: "apricot",
                color_code: 0xED820E
            }
        ]
    },
    {
        category_name: "yellow",
        colors: [
            {
                color_name: "yellow",
                color_code: 0xFFEF00
            },
            {
                color_name: "beige",
                color_code: 0xF5F5DC
            },
            {
                color_name: "gold",
                color_code: 0xFCC201
            },
            {
                color_name: "sunglow",
                color_code: 0xFFD400
            },
            {
                color_name: "marigold",
                color_code: 0xEBA832
            }
        ]
    },
    {
        category_name: "light",
        colors: [
            {
                color_name: "white",
                color_code: 0xCBCBCB
            },
            {
                color_name: "alabaster",
                color_code: 0xFEF9F3
            },
            {
                color_name: "ivory",
                color_code: 0xFDF6E4
            },
            {
                color_name: "pearl",
                color_code: 0xFBFCD8
            },
            {
                color_name: "frost",
                color_code: 0xFCFBFC
            }
        ]
    },
    {
        category_name: "dark",
        colors: [
            {
                color_name: "black",
                color_code: 0x1B1B1B
            },
            {
                color_name: "gray",
                color_code: 0x808080
            },
            {
                color_name: "midnight",
                color_code: 0x06032F
            },
            {
                color_name: "shadow",
                color_code: 0x373737
            },
            {
                color_name: "onyx",
                color_code: 0x030104
            }
        ]
    }
]