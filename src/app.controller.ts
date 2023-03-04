import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AwsService } from "./aws/aws.service";
import { ImageProcessService } from "./image/image.service";
import { ConvertFilesDto } from "./image/dto/convertFilesDto";
import * as fs from "fs";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import * as arrayBufferToBuffer from 'arraybuffer-to-buffer'

@Controller('/api')
export class AppController{

    constructor(private appService: ImageProcessService){}

    @ApiOperation({summary: "Пакетное конвертирование"})
    @Post('/convert')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiImplicitFile({name: "image", required: true})
    async convert(@UploadedFiles() files: Express.Multer.File[], @Body() convertFilesDto: ConvertFilesDto){
        let pathes: string[] = [];
        if(convertFilesDto.links != undefined){
            let enterPathes: string[] = Array.from(convertFilesDto.links);
            for (const elem in enterPathes){
                const url: string = enterPathes[elem];
                const urlSplitted = enterPathes[elem].split('/');
                const imgPath = `./uploads/${urlSplitted[urlSplitted.length - 1]}`;
                console.log(`"${urlSplitted[urlSplitted.length - 1]}" downloading...`)
                pathes.push(imgPath);
                await fetch(url)
                    .then(res => res.arrayBuffer())
                    .then(buffer => {
                        fs.writeFileSync(imgPath, arrayBufferToBuffer(buffer));
                    })
                }
            return this.appService.convert(pathes, convertFilesDto);
        }else{
            for(const file of files){
                console.log(`"${file.filename}" downloading...`);
                pathes.push(file.path);
            }
            return this.appService.convert(pathes, convertFilesDto);
        } 
    }
}