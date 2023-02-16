import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import path from "path";
import { AppController } from "./app.controller";
import { ImageProcessService } from "./app.service";

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
    })],
    controllers: [AppController],
    providers: [ImageProcessService]
})
export class AppModule {

}