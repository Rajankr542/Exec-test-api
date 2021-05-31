var express    =require("express"),
router         =express.Router();
const mongoose = require('mongoose');
const Cantidate = require("../../models/candidateSchema");

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

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
  var results = await getCantdateSchema(searchObj , limit, skip , sortField, parseInt(sortOrder) );
  var count = await getCantdateSchemaCount(searchObj );

res.status(201).send({
  status: 1,
  message: 'list of Canditate sucessfully processed',
  response: {
      data:results,
      count:count
  }
});
});

router.post("/",async (req,res) => {
  const { email, name, address} = req.body;
  var documnet = {
    email:email.trim(),
  name:name.trim(),
  address:address.trim()
  }
  var candidate = await Cantidate.create(documnet).catch(err => {
    res.send(
        {
            status: 0,
            message:`error while creating candidate ${err.message}`
        }
    );
  });

if(candidate){
  res.status(201).send({
      status: 1,
      message: `candidate created successfully ${name}`
    });
}
else{
  res.status(201).send({
      status: 0,
      message: 'Error creating candidate',
    });
}
});

router.get("/highestscore", async (req,res) => {
  total = await Cantidate.find({}).distinct("totalscore");
  max = Math.max.apply(null, total);
  results = await Cantidate.find({totalscore:max});
  res.status(201).send({
    status: 1,
    message: 'Candidates with highest score',
    response: {
        data:results
    }
  });
});

async function getCantdateSchema(filter, l , s,sort, order) {
  var results = await Cantidate.find(filter)
  .sort({[sort]:order})
  .populate('test')
   .skip(parseInt(s)).limit(parseInt(l))
   .catch(error => console.log(error))
   return results;     
}

async function getCantdateSchemaCount(filter) {
var results = await Cantidate.count(filter)
.catch(error => console.log(error))
return results;     
}

module.exports=router;