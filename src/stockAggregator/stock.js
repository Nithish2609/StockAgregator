import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const StockAgregation = () => {
    const allowedExtensions = ["csv", "xlsx"];
    const header = ["name","batch","stock","deal","free","mrp","rate","exp"];
    const batchtypes = ["all"]
    const [file, setFile] = useState("");
    const [data, setData] = useState([])
    const [rawData, setRawData] = useState([]);
    const [parsedData, setParsedData] = useState([]);

    //State to store table Column name
    const [tableRows, setTableRows] = useState([]);
  
    //State to store the values
    const [values, setValues] = useState([]);

    const onFileChange = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              const rowsArray = [];
              const valuesArray = [];
      
              // Iterating data to get column name and their values
              results.data.map((d) => {
                rowsArray.push(Object.keys(d));
                valuesArray.push(Object.values(d));
              });
      
              // Parsed Data Response in array format
              setParsedData(results.data);
      
              // Filtered Column Names
              setTableRows(rowsArray[0]);
      
              // Filtered Values
              const newData={};

            //   if(rawData.length > 0 )
            results.data.map(item => {
                if(item.name in Object.keys(newData)){
                    if(item.batch in Object.keys(rawData[item.name])){
                        newData[item.name][item.batch].push(item);
                    }else{
                        newData[item.name][item.batch]=[item];
                    }
                }
                else{
                    newData[item.name]={};
                    newData[item.name][item.batch]=[item]
                }
                // console.log(newData)

            // newData[item.name] = (item.name in Object.keys(newData)) && {};
            
            // if(item.batch in Object.keys(rawData[item.name])){
            //     newData[item.name][item.batch].push(item);
            // }else{
            //     newData[item.name]={};
            //     newData[item.name][item.batch]=[item];
            // }

        });
        // console.log(newData)
        // setData(newData);
              setValues(newData);
            },
          });
    };
    // useEffect(() => {
    //     const newData = {};
    //     // console.log(data)
    //     if(rawData.length > 0 )
    //     rawData.length >0 && rawData.map(item => {
    //         newData[item.name] = (item.name in Object.keys(newData)) && {};
            
    //         if(item.batch in Object.keys(rawData[item.name])){
    //             newData[item.name][item.batch].push(item);
    //         }else{
    //             newData[item.name]={};
    //             newData[item.name][item.batch]=[item];
    //         }
    //     });
    //     console.log(newData)
    //     setData(newData);
    // },[rawData])
    // console.log("rendered",data, rawData)
    return (
        <div>
        {/* File Uploader */}
        <input
          type="file"
          name="file"
          onChange={onFileChange}
          accept=".csv"
          style={{ display: "block", margin: "10px auto" }}
        />
        <br />
        <br />
        {/* Table */}
        <table>
          <thead>
            <tr>
              {tableRows.map((rows, index) => {
                return <th key={index}>{rows}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {Object.values(values).map((name, i) => {
                const nameArr = Object.values(name);
                const batchArr = Object.values(nameArr);
                // console.log(batchArr[0][0].stock)
                let totstock = 0;
                let mindeal =0,minfree =0;
                let batches=[];
                batchArr.map(item => {
                    totstock+= parseInt(item[0]["stock"])
                    mindeal=Math.min(mindeal,item[0]["deal"])
                    minfree=Math.min(minfree,item[0]["free"])
                    batches.push(item[0]["batch"])
                });
                // console.log(batches)
                return (<tr key={i+"row"}>
                        {tableRows.map(column => {
                            // console.log(column,batchArr[0][0][column])
                            return (
                            <td key={column + i}>
                                {column === "stock"? totstock : column === "deal"? mindeal : column === "free"? minfree : column === "batch" ? <select>{batches.map(item => <option value={item}>{item}</option>)}</select>
                                 : batchArr[0][0][column]}
                            </td>)}
                        )}
                    </tr>
                )}
            )
            //   return (
            //     <tr key={index}>
            //       {value.map((val, i) => {
            //         return <td key={i}>{val}</td>;
            //       })}
            //     </tr>
            //   );
            }
          </tbody>
        </table>
      </div>
    );
}
export default StockAgregation;