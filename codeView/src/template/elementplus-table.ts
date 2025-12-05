export const template = function (config) {
   console.log('config')
   let tableColumn = ''
   let tableData = ''
 
   for (const item of config.tableColumn) {
    tableData += `${item['prop']}: ""`
    //    console.log(Object.values(item))
    tableColumn += `<el-table-column prop="${item['prop']}" label="${item['label']}" />\n` 
   }
   console.log(tableColumn)
   console.log('config')  
    return `
        <script setup lang="ts">
          const tableData = [
                {
                    ${tableData}
                    date: '2016-05-03',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                }
            ]
            ${tableDataTest}
        </script>
        <template>
            <div>
                <el-table :data="tableData" border style="width: 100%">
                   ${tableColumn}
                </el-table>
            </div>
        </template>
        <style>
        </style>
    
    `
}