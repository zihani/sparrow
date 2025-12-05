import localforage from 'localforage'
const myIndexedDB = localforage.createInstance({
  name: 'myIndexedDB',
});
export async function getStorage(key:string) {
  try {
    const value = await myIndexedDB.getItem(key);
    return value;
  } catch (error) {
    console.log(error);
  }
}
export async function setStorage(key:string,value:Array<any>) {
  try {
    return await myIndexedDB.setItem(key, value);
  } catch (error) {
    console.log(error)
  }
};
// await getStorage(name).then((res) => {
//    console.log(res)
// });