import { ApiProperty } from "@nestjs/swagger";

export class ConvertFilesDto{
    @ApiProperty({example: "http://some/link.jpg", description: "Ссылки на исходные файлы"})
    links: string[];
    @ApiProperty({example: "png", description: "Расширение результирующих файлов"})
    readonly format: string;
    @ApiProperty({example: "50", description: "Качество сжатия файлов"})
    readonly quality: number;
    @ApiProperty({example: "0.5", description: "Процент от текущего размера файлов"})
    readonly size: number;
    @ApiProperty({example: "512", description: "Размер с учетом аспекта"})
    readonly pct_size: number
}