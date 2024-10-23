import { BadRequestException, Logger } from "@nestjs/common";

export const handleErrors = (error: any, logger: Logger) => {
    if (error.code === 11000) {
        throw new BadRequestException(`Register with ${JSON.stringify(error.keyValue)} exists`);
    }
    logger.error(error);
    /* throw new BadRequestException('Error - Verify on log console'); */
    throw new BadRequestException(error.message);
}