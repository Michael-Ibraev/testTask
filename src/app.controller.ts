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
            let imgBufferByUrl: Buffer = null;
            const urlSplitted = body.image.split('/');
            const imgPath = `./uploads/${urlSplitted[urlSplitted.length - 1]}`
            await fetch(body.image)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    imgBufferByUrl = arrayBufferToBuffer(buffer);
                    fs.writeFile(imgPath, imgBufferByUrl, "binary", (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                })
                // console.log(imgBufferByUrl)
                // console.log(imgPath)
            return this.appService.downScaleByFactor(imgBufferByUrl, imgPath);
        }else{
            // console.log(file.buffer)
            // console.log(file.path)
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