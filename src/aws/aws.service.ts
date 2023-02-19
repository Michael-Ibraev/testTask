import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import EasyYandexS3 from "easy-yandex-s3";
import path, { resolve } from "path";


@Injectable()
export class AwsService{
  s3: EasyYandexS3;
  constructor(){
    const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: 'YCAJEUOHxDuE4UnxpCojB9joU',
      secretAccessKey: 'YCNLF1DDSOqDY_aJdNd7PXmxsCdW2UitkLj8yADz',
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