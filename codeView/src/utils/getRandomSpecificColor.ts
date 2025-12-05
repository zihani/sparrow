export function getRandomSpecificColor(colors: [string]) {
    if (!colors) {
      colors = ['#5c2223',
        '#eea2a4', 
        "#5a191b",
        "#f07c82",
        "#5a1216",
        "#ed5a65",
        "#c04851",
        "#ee3f4d",
        "#c02c38",
        "#a7535a",
        "#e3b4b8",
        "#f0a1a8",
        "#f1939c",
        "#a61b29",
        "#894e54",
        "#c45a65",
        "#d11a2d",
        "#7c1823",
        "#541e24",
        "#4c1f24",
        "#82202b",
        "#82111f",
        "#ef475d",
        "#4d1018",
        "#ed556a",
        "#7a7374",
        "#f03752",
        "#e6d2d5",
        "#f0c9cf",
        "#ee2746",
        "#2b1216",
        "#ee4863",
        "#e77c8e",
        "#500a16",
        "#c27c88",
        "#73575c",
        "#ee4866",
        "#621624",
        "#ce5777",
        "#cc163a",
        "#f1c4cd",
        "#eeb8c3",
        "#856d72",
        "#2d0c13",
        "#36282b",
        "#bf3553",
        "#ec9bad",
        "#63071c",
        "#30161c",
        "#eea6b7",
        "#e9ccd3",
        "#eba0b3",
        "#4f383e"
      ]
      console.log(colors);
    }
    let color:string = ""
    if (colors && colors.length > 0) {
      color =  colors[Math.floor(Math.random() * colors.length)]
    }
   return color
}