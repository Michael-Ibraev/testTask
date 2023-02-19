import { Module } from "@nestjs/common";
import { AwsModule } from "src/aws/aws.module";
import { AwsService } from "src/aws/aws.service";
import { ImageProcessService } from "./image.service"


@Module({
    imports: [AwsModule],
    providers: [ImageProcessService],
    exports: [ImageProcessService]
})
export class ImageProcessModule{}