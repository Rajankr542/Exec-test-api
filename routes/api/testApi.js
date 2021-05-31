var express    =require("express"),
router         =express.Router();
const mongoose = require('mongoose');
const Cantidate = require("../../models/candidateSchema");
const Test = require("../../models/testSchema");

router.post("/:id",async (req,res) => {
const { score, name} = req.body;
try{
var documnet = {
score:score,
name:name.trim()
}
var results = await Cantidate.findById(req.params.id).populate("test");
if(!results) return res.send({status: 0,message: `candidate does not exist`});
var arrayofexams = results.test.map((one) => one.name);
if(results.test.length<3 && !arrayofexams.includes(name)){
Cantidate.findById(req.params.id,function(err,OneCandiate){
if(err){
res.status(201).send({
status: 0,
message: `${err.message}`,
});
}else{
Test.create(documnet,function(err,oneTest){
if(err){
res.status(201).send({
status: 0,
message: `${err.message}`,
});
}else{
OneCandiate.test.push(oneTest);
OneCandiate.totalscore = OneCandiate.totalscore + score;
OneCandiate.save();
res.status(201).send({
status: 1,
message: `Scussesfully added the score`,
});
}
});
}
});
}
else{
res.status(201).send({
status: 0,
message: `candidate does not exist or already scored for ${documnet.name}`,
});
}
}
catch (err){
    res.status(400).send({
        status:0,
        message:`Error while creating score ${err.message}`
    });
        }

});

router.get("/",async (req,res) => {
var searchObj = req.query;
limit = searchObj.limit || 10000;
skip = searchObj.skip || 0;
sortField = searchObj.sortField || 'createdAt';
sortOrder = searchObj.sortOrder || -1;

if(searchObj.limit !== undefined){
delete searchObj.limit;
}

if(searchObj.skip !== undefined){
delete searchObj.skip;
}

if(searchObj.sortField !== undefined){
delete searchObj.sortField;
}

if(searchObj.sortOrder !== undefined){
delete searchObj.sortOrder;
}
var results = await getTest(searchObj , limit, skip , sortField, parseInt(sortOrder) );
var count = await getTestCount(searchObj);

res.status(201).send({
status: 1,
message: 'list of test results sucessfully processed',
response: {
data:results,
count:count
}
});
});
  
router.get("/averagescore", async (req,res) => {
    var first_round = await getTestOneType({name:"first_round"});
    var first_round_count = await getTestCount({name:"first_round"});
    var second_round = await getTestOneType({name:"second_round"});
    var second_round_count = await getTestCount({name:"second_round"});
    var third_round = await getTestOneType({name:"third_round"});
    var third_round_count = await getTestCount({name:"third_round"});
    var results = {
        first_round_avg : first_round/first_round_count,
        second_round_avg : second_round/second_round_count,
        third_round_avg : third_round/third_round_count
    }
    res.status(201).send({
        status: 1,
        message: 'Average of all candidate per rounds',
        response: {
        data:results
        }
        });
});

async function getTest(filter, l , s,sort, order) {
var results = await Test.find(filter)
.sort({[sort]:order})
.skip(parseInt(s)).limit(parseInt(l))
.catch(error => console.log(error))
return results;     
}

async function getTestCount(filter) {
var results = await Test.count(filter)
.catch(error => console.log(error))
return results;     
}

async function getTestOneType(filter) {
var results = await Test.aggregate([ 
    { $match: filter },
    {
    $group: {
    _id: null,
     "TotalScore": {
    $sum: "$score"
    }
    }
  } ] );
  if(results.length == 0) return 0;
return results[0].TotalScore;     
}

module.exports=router;