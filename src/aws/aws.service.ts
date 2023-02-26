import { Injectable } from "@nestjs/common";
import EasyYandexS3 from "easy-yandex-s3";
require('dotenv').config()

@Injectable()
export class AwsService{
  s3: EasyYandexS3;
  constructor(){
    const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    Bucket: process.env.BUCKET,
    debug: false,

  });
  this.s3 = s3;
}

  async uploadFile(fileBuffer: Buffer, fileName: string, bucketPath: string){
    const upload: any = await this.s3.Upload({
        buffer: fileBuffer,
        name: fileName
    }, bucketPath);
    const location = upload.Location;
    return location;
  }
}