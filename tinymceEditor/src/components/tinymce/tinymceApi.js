
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
          console.log('this.elements')
          // console.log(this.elements)
          // console.log('this.elements')
          let tree = this.elements
          console.log(tree)
          return tree
     }
}
