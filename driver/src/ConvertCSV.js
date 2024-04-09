//references:
//https://www.npmjs.com/package/json-2-csv
//https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

export function csv(data) {
    //console.log(data)
    let converter = require('json-2-csv');
    const csvStr = converter.json2csv(data)
    //console.log(csvStr)
    
    var blob = new Blob([csvStr], {type: 'text/csv;charset=utf-8;'})
    var url = URL.createObjectURL(blob)
    var doc = document.createElement("a")
    doc.href = url
    doc.setAttribute("download", "data.csv")
    doc.click()
}
