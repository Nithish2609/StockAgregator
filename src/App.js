import { useEffect, useState } from "react";
import Papa from "papaparse";

const StockAgregation = () => {
    const [nameBatchMap, setNametoBatchMap] = useState({});

    const [tableRows, setTableRows] = useState([]);
  
    const [values, setValues] = useState([]);

    const onFileChange = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              const rowsArray = [];
              const valuesArray = [];
      
              results.data.map((d) => {
                rowsArray.push(Object.keys(d));
                valuesArray.push(Object.values(d));
              });
      
      
              setTableRows(rowsArray[0]);
      
              const newData={};
              const nametoBatchMap ={}

            results.data.map(item => {
                if(newData[item.name]!==undefined){
                    if(newData[item.name][item.batch]!==undefined){
                        newData[item.name][item.batch].push(item);
                    }else{
                        newData[item.name][item.batch]=[item];
                    }
                    newData[item.name]["All"].push(item)
                }
                else{
                    newData[item.name]={};
                    newData[item.name][item.batch]=[item]
                    newData[item.name]["All"]=[item]
                }
                nametoBatchMap[item.name]="All";
        });

              setValues(newData);
              setNametoBatchMap(nametoBatchMap);
            },
          });
    };
    const handleChange = (e,name) => {
      const newObj = Object.assign({}, nameBatchMap);
      newObj[name]=e.target.value
      setNametoBatchMap(newObj);
    }
    return (
        <div>
          <input
            type="file"
            name="file"
            onChange={onFileChange}
            accept=".csv"
            style={{ display: "block", margin: "10px auto" }}
          />
          <br />
          <br />
          <table>
            <thead>
              <tr>
                {tableRows.map((rows, index) => {
                  return <th key={index}>{rows}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(values).map((name, i) => {
                  const nameArr = Object.values(values[name]);
                  const batchArr = Object.values(nameArr);
                  let totstock = 0;
                  let mindeal =0,minfree =0;
                  let minExp = [];
                  nameBatchMap[name] && values[name][nameBatchMap[name]].map(item => {
                      totstock+= parseInt(item["stock"])
                      mindeal=Math.min(mindeal,item["deal"])
                      minfree=Math.min(minfree,item["free"])
                      minExp.push(new Date(item.exp))
                  });
                  return (<tr key={i+"row"}>
                          {tableRows.map(column => {
                              return (
                              <td key={column + i}>
                                  {column === "stock"? totstock : column === "deal"? mindeal : column === "free"? minfree : column === "exp" ? new Date(Math.min.apply(null,minExp)).toLocaleDateString(): column === "batch" ? <select onChange={(e) => handleChange(e,name)}>{Object.keys(values[name]).sort().reverse().map(item => <option key={item} value={item}>{item}</option>)}</select>
                                  : batchArr[0][0][column]}
                              </td>)}
                          )}
                      </tr>
                  )}
              )
              }
            </tbody>
          </table>
      </div>
    );
}
export default StockAgregation;
