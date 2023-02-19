import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AwsService } from "./aws/aws.service";
import { diskStorage } from "multer";
import { ImageProcessService } from "./image/image.service";
import { ConvertFilesDto } from "./image/dto/convertFilesDto";


@Controller('/api')
export class AppController{

    constructor(private appService: ImageProcessService){}


    @Post('/downscale')
    @UseInterceptors(FileInterceptor('image'))
    downScaleByFactor(@UploadedFile() file: Express.Multer.File){
        return this.appService.downScaleByFactor(file);
    }

    @Post('/downscale/aspect')
    @UseInterceptors(FileInterceptor('image'))
    downScaleByAspect(@UploadedFile() file: Express.Multer.File){
        return this.appService.downScaleByAspect(file)
    }

    @Post('/convert')
    @UseInterceptors(AnyFilesInterceptor())
    convert(@UploadedFiles() files: Express.Multer.File[], @Body() convertFilesDto: ConvertFilesDto){
        return this.appService.convert(files, convertFilesDto);
    }
}