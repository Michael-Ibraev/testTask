import { Injectable } from "@nestjs/common";
import * as Jimp from "jimp";
import * as _ from "lodash";
import * as path from "path";
import { ConvertFilesDto } from "./dto/convertFilesDto";
import { AwsService } from "src/aws/aws.service";


@Injectable()
export class ImageProcessService {
    constructor(private awsService: AwsService){
    }

    async downScaleByFactor(filePath: string):Promise<void>{
        const fileName = filePath.split('/').pop();
        const factors: number[] = [0.8, 0.6, 0.4, 0.2];
        let img;
        try {
            img = await Jimp.read(`./uploads/${fileName}`);
        } catch (error) {
            img = await Jimp.read(`./uploads/${fileName}`);
        }
        img.getBuffer(img.getMIME(), (err, buffer) => {
            this.awsService.uploadFile(buffer, fileName, '/processed_by_size/');
        });
        for(let factor of factors){
            const clone = _.cloneDeep(img);
            clone.scale(factor).getBuffer(clone.getMIME(), (err, buffer) => {
                this.awsService.uploadFile(buffer, `${path.parse(fileName).name}_${factor*100}${path.parse(fileName).ext}`, '/processed_by_size/');    
            })
        }
    }

    async downScaleByAspect(filePath: string):Promise<void>{
        const fileName = filePath.split('/').pop();
        const sizes: number[] = [512, 256, 128, 64];
        let img;
        try {
            img = await Jimp.read(`./uploads/${fileName}`);
        } catch (error) {
            img = await Jimp.read(`./uploads/${fileName}`);
        }
        img.getBuffer(img.getMIME(), (err, buffer) => {
            this.awsService.uploadFile(buffer, fileName, '/processed_by_aspect/')
        })
        const aspect = img.bitmap.width/img.bitmap.height;
        for(let size of sizes){
            const clone = _.cloneDeep(img);
            clone.scaleToFit(size*aspect, size).getBuffer(clone.getMIME(), (err, buffer) => {
                this.awsService.uploadFile(buffer, `${path.parse(fileName).name}_${size}${path.parse(fileName).ext}`, '/processed_by_aspect/')
            })
        }
    }

    async convert(pathes: string[], convertFilesDto: ConvertFilesDto):Promise<void>{    
        for(const path of pathes){
        //     let img = await Jimp.read(`./uploads/${file.filename}`);

        //     //выгрузка оригинала
        //     img.getBuffer(img.getMIME(), async (err, buffer) => {
        //         await this.awsService.uploadFile(buffer, file.filename, '/converted/');
        //     })
            
        //     //изменение качества
        //     if(convertFilesDto.quality != undefined){
        //         img.quality(+convertFilesDto.quality).write(`./uploads/${file.filename}`);
        //     }
        //     //изменение размера
        //     if(convertFilesDto.size != undefined){
        //         img.scale(+convertFilesDto.size).write(`./uploads/${file.filename}`);
        //     }
        //     //изменение размера по аспекту
        //     if(convertFilesDto.pct_size != undefined){
        //         const aspect = img.bitmap.width/img.bitmap.height;
        //         img.scaleToFit(+convertFilesDto.pct_size * aspect, +convertFilesDto.pct_size).write(`./uploads/${file.filename}`);
        //     }
        //     //изменение расширениея
        //     if(convertFilesDto.format != undefined){
        //         if(convertFilesDto.format == 'jpg' || convertFilesDto.format == '.jpg'){
        //             //img = img.write(`./uploads/${path.parse(file.filename).name}.jpg`)
        //             img._originalMime = Jimp.MIME_JPEG
        //         }else if(convertFilesDto.format == 'png' || convertFilesDto.format == '.png'){
        //             //img = img.write(`./uploads/${path.parse(file.filename).name}.png`)
        //             img._originalMime = Jimp.MIME_PNG;
        //         }else if(convertFilesDto.format == 'bmp' || convertFilesDto.format == '.bmp'){
        //             //img = img.write(`./uploads/${path.parse(file.filename).name}.bmp`)
        //             img._originalMime = 'image/bmp';
        //         }
        //     }
        //     //выгрузка обработанных файлов
        //         img.getBuffer(img.getMIME(), async (err, buffer) => {
        //         await this.awsService.uploadFile(buffer, `${path.parse(file.originalname).name}_converted.${img.getExtension()}`, '/converted/');
        //     })
         }
    }
}