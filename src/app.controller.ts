import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ImageProcessService } from "./app.service";


@Controller('/api')
export class AppController{

    constructor(private appService: ImageProcessService){}

    @Post('/down_scale')
    @UseInterceptors(FileInterceptor('image'))
    downScaleByFactor(@UploadedFile() file: Express.Multer.File){
        return this.appService.downScaleByFactor(file);
    }
}