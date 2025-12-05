import moment from "moment"
export const createDate = (() => {
    const date:Date = new Date()
    const year:number = date.getFullYear();
    const month:number = date.getMonth()+1;
    const day:number = date.getDate();
    const hour:number = date.getHours();
    const minute:number = date.getMinutes();
    const second:number = date.getSeconds();
    const datetime:string =  `${year}年${month}月${day}日 ${hour}:${minute}:${second}` //获取当前时间
    return { datetime,year,month,day,hour,minute,second,moment}
})