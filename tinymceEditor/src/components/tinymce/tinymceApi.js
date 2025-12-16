
export class tinymceApi {
     constructor(id) {
          this.id = id;
     }
     tinymce() {
          return window.tinymce.get(this.id);
     }
}
export class tinymceTree {
     constructor(elements) {
          this.elements = elements;
     }
     treeJSON() {
          let container
          if (typeof this.elements === 'string') {
               container = document.createElement('div')
               container.innerHTML = this.elements
          } else {
               container = this.elements
          }
          const headings = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6'))
          const root = []
          const stack = []
          headings.forEach(h => {
               const level = Number(h.tagName.replace('H', ''))
               const node = { label: (h.textContent || '').trim(), children: [] }
               while (stack.length && stack[stack.length - 1].level >= level) {
                    stack.pop()
               }
               if (stack.length === 0) {
                    root.push(node)
               } else {
                    stack[stack.length - 1].node.children.push(node)
               }
               stack.push({ level, node })
          })
          return root
     }
}
