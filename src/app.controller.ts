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

    constructor(private appService: ImageProcessService, private awsService: AwsService){}

    @ApiOperation({summary: "Генерация набора файлов по процентам от текущего размера"})
    @Post('/downscale')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: "image", required: true})
    async downScaleByFactor(@Body() body, @UploadedFile() file: Express.Multer.File): Promise<void>{
        if(body.image != undefined){
            const url: string = body.image;
            const urlSplitted = body.image.split('/');
            const imgPath = `./uploads/${urlSplitted[urlSplitted.length - 1]}`
            await fetch(url)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    fs.writeFileSync(imgPath, arrayBufferToBuffer(buffer));
                })
            return this.appService.downScaleByFactor(imgPath);
        }else{
            return this.appService.downScaleByFactor(file.path);
        } 
    }
    @ApiOperation({summary: "Генерация набора файлов с учетом аспекта"})
    @Post('/downscale/aspect')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: "image", required: true})
    async downScaleByAspect(@Body() body, @UploadedFile() file: Express.Multer.File): Promise<void>{
        if(body.image != undefined){
            const url: string = body.image;
            const urlSplitted = body.image.split('/');
            const imgPath = `./uploads/${urlSplitted[urlSplitted.length - 1]}`
            await fetch(url)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    fs.writeFileSync(imgPath, arrayBufferToBuffer(buffer));
                })
            return this.appService.downScaleByAspect(imgPath);
        }else{
            return this.appService.downScaleByAspect(file.path);
        } 
    }

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
                pathes.push(file.path);
            }
            return this.appService.convert(pathes, convertFilesDto);
        } 
    }
}