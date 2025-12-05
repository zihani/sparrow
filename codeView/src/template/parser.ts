import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

export const formatCode = function (code:string):string {
   prettier.format(code, {
    parser: "vue",
    plugins: [parserHtml],
    semi: false,
    singleQuote: true,
    printWidth: 80
  }).then(res =>{
    console.log(res)
  });
  return ""
}
