let date_time = new Date();
const result = date_time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
   });

let date = ("0" + date_time.getDate()).slice(-2);
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
let year = date_time.getFullYear();
let days = date_time.getDay()
let day = ''
switch (days) {
    case 1:
        day ='Monday'
        break;
    case 2:
        day ='Tuesday'
        break;
    case 3:
        day ='Wednesday'
        break;  
    case 4:
        day ='Thursday'
        break;    
    case 5:
        day ='Friday'
         break;    
    case 6:
        day ='Saturday'
        break;    
    case 7:
        day ='Sunday'
        break;
    default:
        break;
}

date = `${date}-${month}-${year} (${day}) ${result}`


export default date