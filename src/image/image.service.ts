import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as Jimp from "jimp";
import * as _ from "lodash";
import * as path from "path";
import { ConvertFilesDto } from "./dto/convertFilesDto";
import { AwsService } from "src/aws/aws.service";
import { error } from "console";


@Injectable()
export class ImageProcessService {
    constructor(private awsService: AwsService){
    }


    async convert(pathes: string[], convertFilesDto: ConvertFilesDto):Promise<any>{  
        const urls: string[] = [];  
        for(const imgPath of pathes){
            const fileName = imgPath.split('/').pop();
            console.log(`"${fileName}" uploading...`);
            let img = null;

            try{
                const extension: string[] = ['.jpeg', '.jpg', '.png', '.bmp'];
                console.log(path.parse(imgPath).ext)
                if(!extension.includes(path.parse(imgPath).ext)){
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Unsupported file format"
                }, HttpStatus.BAD_REQUEST);
            }
            img = await Jimp.read(imgPath);
            } catch(error){
                console.log(error);
                throw error
            }

            //выгрузка оригинала
            urls.push(await this.awsService.uploadFile(await img.getBufferAsync(img.getMIME()), fileName, '/converted/'))
            console.log(`"${fileName}" processing...`);
            //изменение качества
            if(convertFilesDto.quality != undefined){
                img.quality(+convertFilesDto.quality).write(imgPath);
            }
            //изменение размера
            if(convertFilesDto.size != undefined){
                img.scale(+convertFilesDto.size).write(imgPath);
            }
            //изменение размера по аспекту
            if(convertFilesDto.pct_size != undefined){
                const aspect = img.bitmap.width/img.bitmap.height;
                img.scaleToFit(+convertFilesDto.pct_size * aspect, +convertFilesDto.pct_size).write(imgPath);
            }
            //изменение расширениея
            if(convertFilesDto.format != undefined){
                if(convertFilesDto.format == 'jpg' || convertFilesDto.format == '.jpg'){
                    img._originalMime = Jimp.MIME_JPEG
                }else if(convertFilesDto.format == 'png' || convertFilesDto.format == '.png'){
                    img._originalMime = Jimp.MIME_PNG;
                }else if(convertFilesDto.format == 'bmp' || convertFilesDto.format == '.bmp'){
                    img._originalMime = 'image/bmp';
                }
            }
            //выгрузка обработанных файлов
            console.log(`"${fileName}_converted" uploading...`);
            urls.push(await this.awsService.uploadFile(await img.getBufferAsync(img.getMIME()),
                `${path.parse(fileName).name}_converted.${img.getExtension()}`,
                '/converted/'))
        }

        return urls;
    }
}