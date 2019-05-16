const moment = require('moment');
var fs = require('fs');
const Task = require('../models/task');

class taskController{
    
    async add(request){
        
        let task = new Task({
            userId        : userSession._id,
            name          : request.name,
            startDate     : moment(request.startDate, 'MM/DD/YYYY').format(),
            endDate       : moment(request.endDate, 'MM/DD/YYYY').format(),
            estimatedHours: request.estimatedHours,
            actualHours   : request.actualHours,
            attachments   : request.attachments,
            status        : 'open',
        });

        await task.save();

        return {'status': 'success', 'msg': 'task added successfully.'};
    }

    async update(request){

        await this.isClosedTask(request.taskId);

        let updateParams = {};

        if(request.name){
            updateParams.name = request.name;
        }

        if(request.startDate){
            updateParams.startDate = moment(request.startDate, 'MM/DD/YYYY').format();
        }

        if(request.endDate){
            updateParams.endDate =  moment(request.endDate, 'MM/DD/YYYY').format();
        }

        if(request.estimatedHours){
            updateParams.estimatedHours = request.estimatedHours;
        }

        if(request.actualHours){
            updateParams.actualHours = request.actualHours;
        }
        
        if(request.attachments){
            updateParams.attachments = request.attachments;
        }
        
        if(request.status){
            if(!['open', 'close'].includes(request.status)){
                throw Error('not a valid status!');
            }
            updateParams.status = request.status;
        }
        
        let isUpdated = await Task.findOneAndUpdate({userId: userSession._id, _id: request.taskId}, updateParams);

        if(!isUpdated) throw Error('update Failed. try again');
        
        return { status:'success', msg: 'task updated successfully!' };
    }

    async isClosedTask(taskId){
        let task = await Task.findOne({ userId: userSession._id, _id: taskId });
        
        if(!task) throw Error('task not found');

        if(task.status === 'close') throw Error('cannot modify closed tasks!.');

        return ;
    }

    async list(request){

        let searchParam = {userId: userSession._id};

        if(request.status){
            searchParam.status = request.status;
        }

        if(request.name){
            searchParam.name = request.name;
        }
        
        if(request.startDate){
            searchParam.startDate = moment(request.startDate, 'MM/DD/YYYY').format();
        }
        
        if(request.endDate){
            searchParam.endDate = moment(request.endDate, 'MM/DD/YYYY').format();
        }

        return await Task.find(searchParam);
    }

    async delete(request){

        await this.isClosedTask(request.taskId);

        let isDeleted = await Task.findOneAndDelete({userId: userSession._id, _id: request.taskId});

        if(!isDeleted) throw Error('task deletion failed. try again');
        
        return {status:'success', msg: 'task deleted successfuly!'};
    }

    async import(fileMeta, res){

        let currentDir = require('path').join(__dirname, "..", "/");
        var tmp_path = currentDir + fileMeta.path;
        var target_path = currentDir + 'uploads/tmp/' + fileMeta.originalname;

        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        let importData = [];

        src.on('end', async () => {
            fs.createReadStream(target_path)
            .pipe(require('csv-parser')(['name', 'startDate', 'endDate', 'estimatedHours', 'actualHours', 'attachments', 'status', 'createdAt', 'updatedAt']))
            .on('data', row => {
                this.pushBulkData(row, importData);
            })
            .on('end', async () => {
                this.insertBulkData(importData, res);
            })
        });

        src.on('error', (err) => {
            throw err;
        });
    }

    insertBulkData(importData, res){
        Task.insertMany(importData)
        .then(function(docs) {
            res.send({status: 'success', data: docs.length});
        })
        .catch(function(err) {
            throw err;
        });
    }

    pushBulkData(row, importData){
        if(!row.startDate || row.startDate == 'startDate'){
            return ;
        }
        
        importData.push(
            {
                userId        : userSession._id,
                name          : row.name,
                startDate     : moment(row.startDate, 'MM/DD/YYYY').format(),
                endDate       : moment(row.endDate, 'MM/DD/YYYY').format(),
                estimatedHours: row.estimatedHours,
                actualHours   : row.actualHours,
                attachments   : row.attachments,
                status        : row.status,}
        );
    }
}

module.exports = new taskController();