import fs from "fs";
import path from "path";
import GcpUploadService from "./GcpUploadService";


class attachmentService {
    async upload(payload: any) {
        let extensions: any = {
            "application/pdf": "pdf",
            "application/msword": "doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "image/png": "png",
            "image/jpeg": "jpeg",
            "image/jpg": "jpg",
            "image/svg+xml": "svg",
        };
        const now = new Date();
        const formattedDateTime = now.getFullYear().toString() + 
            (now.getMonth() + 1).toString().padStart(2, '0') +
            now.getDate().toString().padStart(2, '0') +
            now.getHours().toString().padStart(2, '0') +
            now.getMinutes().toString().padStart(2, '0') +
            now.getSeconds().toString().padStart(2, '0');


        let matches1 = payload.data.split(",");
        let extens = extensions[payload.mime];
        let buff = Buffer.from(matches1[1], "base64");
        // const fileName = `${payload.customer_code + "_" + payload.key_code}_${formattedDateTime}.${extens}`;
        const fileName = `${payload.customer_code + "_" + payload.key_code}_${formattedDateTime}.${extens}`;

        await fs.promises.writeFile(
            `src/uploads/${fileName}`,
            buff
        );

        const newFileName = `${fileName}`;
        const currentPath = path.join(process.cwd(), "src/uploads", fileName);
        // const destination: any = `${process.env.REPOSITORY_PATH}/${process.env.FOLDER_NAME}/${payload.fileCategory}/${newFileName}`
        const destination: any = `/611/${process.env.FOLDER_NAME}/${newFileName}` //${payload.fileCategory}/

        let config: any = {
            sourceFile: currentPath,
            fileName: newFileName,
            destination: destination,
        }
        const gcpUplaod: any = await GcpUploadService.uploadFile(config);
        fs.unlinkSync(currentPath);
        // const singedUrl: any = await GcpUploadService.getSignedUrl({ fileName: destination })
        return destination;
    }

}
const AttachmentService = new attachmentService();
export default AttachmentService;