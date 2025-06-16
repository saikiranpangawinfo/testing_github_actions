const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

 
app.http('TestingGithubActions', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for URL "${request.url}"`);
 
       
        // Only do blob storage if POST and body contains data
        if (request.method === 'POST') {
            try {
                const body = await request.json(); // Parse JSON from body
                const content = body?.data || 'No content received';
                const filename = body?.filename || 'default.txt';
 
                const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
                const containerName = process.env.CONTAINER_NAME||'export';  // Ensure this exists
 
                const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
                const containerClient = blobServiceClient.getContainerClient(containerName);
 
                const blockBlobClient = containerClient.getBlockBlobClient(filename);
                await blockBlobClient.upload(content, Buffer.byteLength(content));
 
                responseMessage = `File '${filename}' saved to Azure Blob Storage.`;
            } catch (error) {
                context.log.error('Error uploading to Blob:', error);
                return {
                    status: 500,
                    body: `Error: ${error.message}`
                };
            }
        }
 
        return {
            status: 200,
            body: responseMessage
        };
    }
});