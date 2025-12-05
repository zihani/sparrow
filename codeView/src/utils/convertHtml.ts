import {marked}  from 'marked'; 
import hljs from 'highlight.js';
import axios from "axios" 
export async function getHtml (articleType:any){
   return await axios.get(`/md/${articleType.fileName}`).then(res =>{

      if(res.data){
             // 使用highlight.js的行内高亮方法
         const renderer = new marked.Renderer();
            renderer.code = (code, language:string) => {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            const highlighted = hljs.highlight(code, { language: validLanguage }).value;
            return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
         };
         marked.setOptions({
            renderer: renderer,
            highlight: (code:any, language:any) => {
              const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
              return hljs.highlight(code, { language: validLanguage }).value;
            },
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
          });
         return marked(res.data);
      }
   })
};
