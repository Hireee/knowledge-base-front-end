const { Storage } = require('@google-cloud/storage')
import defaultConfig from '../config/account.json'
 
const BUCKETNAME = process.env.GCP_BUCKET_NAME
const FOLDER = process.env.FOLDER_NAME
 
class GcpUpload {
    
    public isFileExists = async(config: any) => {
        const storage = await this.getStorageAccount(config)
        const myBucket = storage.bucket(BUCKETNAME)
        const file = myBucket.file(`${FOLDER}/${config.fileName}`)
        const [found] = await file.exists()
        
        console.log(found,'file exits')
        return found
    }
    public uploadFile = async (config: any) => {
        const storage = await this.getStorageAccount(config)
        // console.log({ storage })
        const options = {
            destination: config.destination
        }
        // console.log({ config, options, BUCKETNAME })
        return await storage.bucket(BUCKETNAME).upload(config.sourceFile, options)
    }


    public getDefaultSignedUrlOptions = async (milliSeconds: number) => {
        const data: any= {
            version: 'v2',
            action: 'read',
            expires: milliSeconds || Date.now() + 1000 * 60 * 60,
        }
        // console.log({ data })
        return data
    }
    public getSignedUrl = async (config: any) => {
        // console.log({ config })
        const storage = await this.getStorageAccount(config)
        const signedUrlOptions = await this.getDefaultSignedUrlOptions(config?.milliSeconds)
        const [ url ] = await storage
            .bucket(BUCKETNAME)
            .file(config.fileName)
            .getSignedUrl(signedUrlOptions)
 
        return url
    }
 
    public deleteFile = async (config: any) => {
        try {
          const storage = await this.getStorageAccount(config);
          await storage.bucket(BUCKETNAME).file(config).delete();
        //   console.log(`File ${config} deleted successfully.`);
        } catch (error:any) {
        //   console.error(`Failed to delete file ${config}:`, error);
          throw new Error(`Failed to delete file: ${error.message}`);
        }
      };

      public downloadFile = async (config: any) => {
        const storage = await this.getStorageAccount(config)
        const file = await storage.bucket(BUCKETNAME).file(`${FOLDER}/${config.fileName}`)

        // Download the file to a buffer
        const [contents] = await file.download()
        return contents
    }

      public async uploadImageToGoogleCloud(sourceFile: Buffer | string, config: any) {
        const storage = await this.getStorageAccount(config);
      
        // Handle Buffer uploads using createWriteStream if sourceFile is a Buffer
        if (Buffer.isBuffer(sourceFile)) {
          const bucket = storage.bucket(BUCKETNAME);
          const file = bucket.file(`${FOLDER}/${config.fileName}`);
      
          return new Promise((resolve, reject) => {
            const stream = file.createWriteStream();
            stream.on('error', reject);
            stream.on('finish', resolve);
            stream.end(sourceFile);
          });
        } else {
          // Fallback if it's a file path
          const options = {
            destination: config.destination,
          };
          return await storage.bucket(BUCKETNAME).upload(sourceFile, options);
        }
      }
      
      
      
}
 
const GcpUploadService = new GcpUpload();
export default GcpUploadService;