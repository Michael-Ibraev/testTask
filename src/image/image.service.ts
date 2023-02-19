import { Inject, Injectable, Res, UploadedFile } from "@nestjs/common";
import * as Jimp from "jimp";
import * as _ from "lodash";
import * as path from "path";
import { ConvertFilesDto } from "./dto/convertFilesDto";
import { AwsService } from "src/aws/aws.service";
import { buffer } from "stream/consumers";

@Injectable()
export class ImageProcessService {
    constructor(private awsService: AwsService){
    }

    async downScaleByFactor(file: Express.Multer.File):Promise<void>{
        const factors: number[] = [0.8, 0.6, 0.4, 0.2];
        const img = await (await Jimp.read(`./uploads/${file.filename}`))
        img.getBuffer(img.getMIME(), (err, buffer) => {
            this.awsService.uploadFile(buffer, file.filename, '/processed_by_size/');
        });
        for(let factor of factors){
            const clone = _.cloneDeep(img);
            clone.scale(factor).getBuffer(clone.getMIME(), (err, buffer) => {
                this.awsService.uploadFile(buffer, `${path.parse(file.originalname).name}_${factor*100}${path.parse(file.originalname).ext}`, '/processed_by_size/');    
            })
        }
    }

    async downScaleByAspect(file: Express.Multer.File):Promise<void>{
        const sizes: number[] = [512, 256, 128, 64];
        const img = await Jimp.read(`./uploads/${file.filename}`);
        img.getBuffer(img.getMIME(), (err, buffer) => {
            this.awsService.uploadFile(buffer, file.filename, '/processed_by_aspect/')
        })
        const aspect = img.bitmap.width/img.bitmap.height;
        console.log(aspect);
        for(let size of sizes){
            const clone = _.cloneDeep(img);
            clone.scaleToFit(size*aspect, size).getBuffer(clone.getMIME(), (err, buffer) => {
                this.awsService.uploadFile(buffer, `${path.parse(file.originalname).name}_${size}${path.parse(file.originalname).ext}`, '/processed_by_aspect/')
            })
        }
    }

    async convert(files: Express.Multer.File[], converFilesDto: ConvertFilesDto):Promise<void>{       
        for(const file of files){
            const img = await Jimp.read(`./uploads/${file.filename}`);
            img.getBuffer(img.getMIME(), (err, buffer) => {
                this.awsService.uploadFile(buffer, file.filename, '/converted/')
            })
            if(converFilesDto.quality != undefined){
                img.scaleToFit(converFilesDto.quality, Jimp.AUTO);
            }
            if(converFilesDto.size){
                
            }
        }
    }
}
