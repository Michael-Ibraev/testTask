import { Injectable, Res, UploadedFile } from "@nestjs/common";
import * as Jimp from "jimp";
import * as _ from "lodash";
import path from "path";

@Injectable()
export class ImageProcessService {
    async downScaleByFactor(file: Express.Multer.File):Promise<void>{
        console.log(file.filename);
        const scales: number[] = [0.8, 0.6, 0.4, 0.2];
        const img = await Jimp.read(`./uploads/${file.filename}`);
        for(let scale of scales){
            const clone = _.cloneDeep(img);
            console.log(scale);
            clone.scale(scale).write(`scaled_${scale * 100}.jpg`);
        }
    }
}
