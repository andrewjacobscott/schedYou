// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create the DynamoDB service object
ddb = new AWS.DynamoDB({});

var  arr1= ["1", "2", "3", "4"];

var user={"Name": "Dave", "Age": 16}


var params = {
    TableName: 'Music',
    Item: {
        'Artist' : {S: 'Davi Butler'},
        'SongTitle' : {S: 'Nothing but Rain!'},
        'Year' : {N: '1989'},
        'Array' : {SS : arr1},
        'Object' : {S: JSON.stringify(user)},
    }
};

// ddb.putItem(params, function(err, data){
//     if(err){
//         console.log("Error", err);
//     }else{
//         console.log("Success", data);
//     }
// });



var param = {
    TableName: 'Music',
    Key: {
      'Artist' : {S: 'Events'},
      'SongTitle' : {S: 'Nothing but Rain!'},
    },
    ProjectionExpression: 'qbject'
  };

  g();
  async function g(){
    await f();
    arr1.forEach(element => {
        console.log(element);
    });
  }
  
  async function f(){
    let promise = new Promise((resolve, reject) =>{
        ddb.getItem(param, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                arr1 = JSON.parse(data.Item.qbject.S);
                resolve(1);
            }    
        });
    });
    let result = await promise;
    return result;
  }



 

  




