import { Injectable, Res, UploadedFile } from "@nestjs/common";
import * as Jimp from "jimp";
import * as _ from "lodash";
import * as path from "path";

@Injectable()
export class ImageProcessService {
    async downScaleByFactor(file: Express.Multer.File):Promise<void>{
        const scales: number[] = [0.8, 0.6, 0.4, 0.2];
        const img = await Jimp.read(`./uploads/${file.filename}`);
        for(let scale of scales){
            const clone = _.cloneDeep(img);
            clone.scale(scale).write(`./processed/${path.parse(file.originalname).name}_${scale * 100}${path.parse(file.originalname).ext}`);
        }
    }

    async downScaleByAspect(file: Express.Multer.File):Promise<void>{
        const scales: number[] = [512, 256, 128, 64];
        const img = await Jimp.read(`./uploads/${file.filename}`);
        for(let scale of scales){
            const clone = _.cloneDeep(img);
            clone.scaleToFit(scale, Jimp.AUTO).write(`./processed/${path.parse(file.originalname).name}_${scale}${path.parse(file.originalname).ext}`)
        }
    }
}
