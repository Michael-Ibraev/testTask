import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk"; 
import EasyYandexS3 from "easy-yandex-s3";
import path, { resolve } from "path";
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
    Bucket: 'test-task-bucket',
    debug: false,

  });
  this.s3 = s3;
}

  async uploadFile(fileBuffer: Buffer, fileName: string, bucketPath: string){
    const upload = await this.s3.Upload({
        buffer: fileBuffer,
        name: fileName
    }, bucketPath);
    console.log(upload); 
  }
}