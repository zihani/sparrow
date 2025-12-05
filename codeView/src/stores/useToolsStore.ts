import { defineStore } from "pinia";
import { reactive, ref ,computed} from "vue";
import { getStorage ,setStorage} from "@/utils/IndexedDB.ts"
interface itableRow {
  field: string;
  fieldName: string;
  rowShow: Boolean;
}
interface iform {
  vueType: string;
  vueApiType: string;
  vueComponents: string;
  codeType: string;
}
// 定义用户状态仓库
export const useToolsStore = defineStore(
  "tools",{
    state: () => ({
      tableRow : ref<itableRow[]>([{field:"",fieldName:"",rowShow:true}]),
      form : reactive<iform>({
        vueType: 'vue3',
        vueApiType: 'Options',
        vueComponents: 'element',
        codeType: 'ts'
      })
    }),
    getters: {
    },
    actions: {
      addTableRow(value:Array<itableRow>){
        this.tableRow.push(value)
        // setStorage('tableRow',this.tableRow).then((res:Array<any>) =>{
        //   console.log('setRes')
        //   console.log(res)
        //   console.log('setRes')
        // })
      },
      getTableRow(){
         getStorage('tableRow').then((res:Array<any>) => {
            this.tableRow = res??[{field:"",fieldName:""}]
            console.log('getres')
            console.log(res)
            console.log('getres')
         })
      }
    }
  }
);

// 在 Setup Store 中：
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions
// export const useBannerSetopStore = defineStore(
//   'setupBanner', () => {
//     const count = ref(0);
//     const getters1 = computed(() => {
//       return count.value + 100;
//     })
//     function increment() {
//     }
//     return { count, increment, getters1 };
//   });
