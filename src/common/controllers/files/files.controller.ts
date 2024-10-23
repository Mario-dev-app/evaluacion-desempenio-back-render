import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';


@Controller('files')
export class FilesController {

    @Get()
    async downloadFile(
        @Query('filename') filename: string,
        @Query('year') year: string,
        @Res() res: Response
    ) {
        const filePath = `src/public/docs/${year}/${filename}`;
        return res.download(filePath);
    }

    @Get('dir-names')
    getDirNames(
        @Query('baseDir') baseDir: string
    ) {
        return fs.readdirSync(`src/public/${baseDir}`);
    }

}
