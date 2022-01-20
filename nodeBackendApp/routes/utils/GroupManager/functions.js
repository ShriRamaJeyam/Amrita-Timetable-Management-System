/* var args ={
    GroupTable: require("sequelize").Model,
    MemberTable:require("sequelize").Model,
    MemberName:"",
    GroupName:"",
    NameItem:""
} */
const utils = require("../../../modules/utils");
const { sequelize } = require("../../../modules/database");
function create(args) {
    return async function(req,res){
        var transaction = await sequelize.transaction();
        try
        {
            const { name, data } = req.body;
            const creator = utils.deepClone(req.body);
            delete creator.name;
            delete creator.data;
            creator[args.NameItem] = name;
            if(req.body.data.length === 0)
            {
                throw "The group members list can't be empty.";
            }
            var group = await args.GroupTable.create(creator,{ transaction });
            var members = await args.MemberTable.bulkCreate(data.map( (member) => {
                const memberData = {};
                memberData[args.MemberName] = member;
                memberData[args.GroupName] = group.id;
                return memberData;
            }), { transaction } );
            await transaction.commit();
            res.json({group,members});
        }   
        catch(ex)
        {
            res.status(400).json({error : ex.toString()});
            if (transaction) 
            {
                await transaction.rollback();
            }
        }
    };
};

function edit(args) {
    return async function(req,res){
        var transaction = await sequelize.transaction();
        try
        {
            const { name, data, id } = req.body;
            if(req.body.data.length === 0)
            {
                throw "The group members list can't be empty.";
            }
            var record = await args.GroupTable.findOne({ where: { id } }, { transaction } );
            var newValue = utils.deepClone(req.body);
            delete newValue["name"] ;
            delete newValue["data"] ;
            newValue[args.NameItem] = name;
            await record.update(newValue,{transaction});
            var condition = {};
            condition[args.GroupName] = id ;
            await args.MemberTable.destroy({ where : condition },{transaction});
            await args.MemberTable.bulkCreate(data.map( (member) => {
                const memberData = {};
                memberData[args.MemberName] = member;
                memberData[args.GroupName] = id;
                return memberData;
            }), { transaction } );
            await transaction.commit();
            res.json({status:"ok"});
        }
        catch(ex)
        {
            res.status(400).json({error : ex.toString()});
            if (transaction) 
            {
                await transaction.rollback();
            }
        }
    };
};

function get(args) {
    return async function(req,res){
        try
        {
            const { id } = req.body;
            var group = await args.GroupTable.findOne({where:{id}});
            group = utils.deepClone(group);
            var query = {};
            query[args.GroupName] = id ;
            var array = await args.MemberTable.findAll({where:query});
            group["name"] = group[args.NameItem];
            group["data"] = array.map(ele => {return ele[args.MemberName];});
            res.json(group);
        }
        catch(ex)
        {
            res.status(400).json({error : ex.toString()});
        }
    };
};
function list(args) {
    return async function(req,res){
        try
        {
            var list = await args.GroupTable.findAll();
            res.json(list);
        }
        catch(ex)
        {
            res.status(400).json({error : ex.toString()});
        }
    };
}
module.exports = {create,list,get,edit};