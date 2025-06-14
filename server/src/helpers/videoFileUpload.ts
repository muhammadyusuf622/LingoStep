import { Injectable } from "@nestjs/common";
import * as path from "path"
import * as fs from 'fs'
import * as fsPromis from "fs/promises"



@Injectable()
export class VideoFileUpload{

  async fileUpload(file: Express.Multer.File | undefined, deleteFile:any = undefined){


    if(deleteFile){
      try {
        const imgAbsalutPath = path.join(process.cwd())
        await fsPromis.unlink(imgAbsalutPath + deleteFile);
      } catch (error) {
        console.log("File uchirishda Xatolik");
      }
    }

    if(file){
      const fileFolder = path.join(process.cwd(), 'uploads');

      if(!fs.existsSync(fileFolder)){
        fs.mkdirSync(fileFolder, {recursive: true});
      }

      const fileImage = path.join(process.cwd(), 'uploads', 'videos');

      if(!fs.existsSync(fileImage)){
        fs.mkdirSync(fileImage, {recursive: true});
      }

      let fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-image${path.extname(file.originalname)}`;

      await fsPromis.writeFile(path.join(fileImage, fileName), file.buffer);

      return path.join('/' + fileImage.split('/').splice(7).join().replace(",", "/"), fileName);

    }

  }
}