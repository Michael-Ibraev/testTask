import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors, Req, Param } from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AwsService } from "./aws/aws.service";
import { diskStorage } from "multer";
import { ImageProcessService } from "./image/image.service";
import { ConvertFilesDto } from "./image/dto/convertFilesDto";
import { request } from "http";
import * as fs from "fs";
import path from "path";
import * as axios from "axios";
import { writer } from "repl";
import Jimp from "jimp/*";
import * as https from "https"
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { arrayBuffer, buffer } from "stream/consumers";
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
            const urlSplitted = body.image.split('/');
            fs.createWriteStream(`./uploads/${urlSplitted[urlSplitted.length - 1]}`);
            fetch(body.image)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    this.appService.downScaleByFactor(arrayBufferToBuffer(buffer), `./uploads/${urlSplitted[urlSplitted.length - 1]}`)
                })
            // https.get(body.image, (res) => {
            //     const buffer = fs.readFileSync(`./uploads/${urlSplitted[urlSplitted.length - 1]}`);
            //     return this.appService.downScaleByFactor(buffer, `./uploads/${urlSplitted[urlSplitted.length - 1]}`);
            // })          
        }else{
            return this.appService.downScaleByFactor(file.buffer, file.path);
        } 
    }
    @ApiOperation({summary: "Генерация набора файлов с учетом аспекта"})
    @Post('/downscale/aspect')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: "image", required: true})
    downScaleByAspect(@UploadedFile() file: Express.Multer.File){
        return this.appService.downScaleByAspect(file)
    }

    @ApiOperation({summary: "Пакетное конвертирование"})
    @Post('/convert')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiImplicitFile({name: "image", required: true})
    convert(@UploadedFiles() files: Express.Multer.File[], @Body() convertFilesDto: ConvertFilesDto){
        return this.appService.convert(files, convertFilesDto);
    }
}