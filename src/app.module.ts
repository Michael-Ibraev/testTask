import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import { AppController } from "./app.controller";
import { ImageProcessService } from "./image/image.service";
import { AwsModule } from "./aws/aws.module";
import { ImageProcessModule } from "./image/image.module";

const fileSorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

@Module({
    imports: [MulterModule.register({
        storage: fileSorage
    }), 
        AwsModule,
        ImageProcessModule,],
    controllers: [AppController],
    providers: [ImageProcessService]
})
export class AppModule {

}