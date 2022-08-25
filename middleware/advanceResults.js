const advanceResults = (model,populate) => async (req,res,next) =>{
        let query;
        // let reqQuery = {...req.query};

        // let removeFields = ['select','sort','page','limit'];
        // removeFields.forEach(param => delete reqQuery[param]);
       
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g ,match => `$${match}`);
        
        query = model.find(JSON.parse(queryStr));
        if (req.query.select){
                const fields = req.query.select.split(',').join(' ');
                query = query.select(fields);
        }
        if (req.query.sort){
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
        }else{
                query = query.sort('-createdAt');   
        }
        const page = parseInt(req.query.page,10)|| 1;
        const limit = parseInt(req.query.limit,10)|| 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await model.countDocuments();
        query = query.skip(startIndex).limit(limit);
        console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
        if(populate){
            query = query.populate(populate);
        }
        const result = await query;
        const pagination = {};
        if(endIndex<total){
                req.originalUrl = req.originalUrl.replace(/page=\d{1}/g,'');
                next_page = page+1
                pagination.next = {
                        page:page+1,
                        limit,
                        link:`${req.protocol}://${req.get('host')}${req.originalUrl}&page=${next_page}`
                }
        }
        if(startIndex>0){
                req.originalUrl = req.originalUrl.replace(/page=\d{1}/g,'');
                next_page = page-1
                pagination.prev = {
                        page:page-1,
                        limit,
                        link:`${req.protocol}://${req.get('host')}${req.originalUrl}&page=${next_page}`
                }
        }
        res.advancedResults = {
            success : true,
            count : result.length,
            pagination,
            data : result
        }
        next();
}
module.exports = advanceResults;