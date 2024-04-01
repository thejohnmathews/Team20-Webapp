//references:
//https://www.npmjs.com/package/json-2-csv
//https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

export function csv(data) {
    let converter = require('json-2-csv');
    const csv = converter.json2csv(data)
    console.log(csv)
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
}
