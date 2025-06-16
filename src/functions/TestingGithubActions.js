const { app } = require('@azure/functions');

app.http('TestingGithubActions', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const {name,age}=request.body;
        if(!name||!age){
            return{
                status:500,
                body:"Please provide sufficient details"
            }
        }


        return { body: `Hey {name} your age is:${age}` };
    }
});
