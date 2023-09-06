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
                color_code: 0
            }
        ]
    },
    {
        category_name: "blue",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "green",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "pink",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "purple",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "x",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "orange",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "yellow",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "light",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    },
    {
        category_name: "dark",
        colors: [
            {
                color_name: "x",
                color_code: 0
            }
        ]
    }
]