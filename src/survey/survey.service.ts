import { Injectable, Logger } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Survey } from './entities/survey.entity';
import { Model } from 'mongoose';
import { handleErrors } from '../common/methods/handle-error.method';
import { PeriodService } from 'src/period/period.service';
import { Societies } from 'src/user/enums';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { ConfirmResultsDto } from 'src/competencies/dto/confirm-results.dto';
import { MailerService } from '@nestjs-modules/mailer';
import path from 'path';
import { PdfService } from 'src/common/services/pdf/pdf.service';

@Injectable()
export class SurveyService {

  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectModel(Survey.name)
    private readonly surveySchema: Model<Survey>,

    private periodService: PeriodService,

    private readonly mailerService: MailerService,

    private readonly pdfService: PdfService
  ) { }

  async create(createSurveyDto: CreateSurveyDto) {
    try {
      const surveyCreated = await this.surveySchema.create(createSurveyDto);
      return surveyCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findByPeriodAndSociety(year: string, society: Societies) {
    const period = await this.periodService.findByPeriodAndSociety(year, society);
    try {
      const surveysFounded = await this.surveySchema.find({ period: period._id })
        .populate({
          path: 'userEvaluator',
          select: 'firstname lastname numDoc'
        }).populate({
          path: 'userEvaluated',
          select: 'firstname lastname numDoc'
        }).populate({
          path: 'period',
          select: 'year society'
        });
      return surveysFounded;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async downloadExcelReport(year: string, society: Societies, res: Response) {
    const period = await this.periodService.findByPeriodAndSociety(year, society);

    try {
      const surveysFounded = await this.surveySchema.find({ period: period._id })
        .populate({
          path: 'userEvaluator',
          select: 'firstname lastname numDoc'
        }).populate({
          path: 'userEvaluated',
          select: 'firstname lastname numDoc'
        }).populate({
          path: 'period',
          select: 'year society'
        });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Reporte ${society} ${year}`);

      worksheet.columns = [
        { header: 'Evaluador', key: 'evaluator', width: 30 },
        { header: 'Evaluado', key: 'evaluated', width: 30 },
        { header: 'Año', key: 'year', width: 10 },
        { header: 'Sociedad', key: 'society', width: 10 },
        { header: 'Objetivos', key: 'goals', width: 40 },
        { header: 'Competencias', key: 'competencies', width: 40 },
        { header: 'Comentarios', key: 'comentaries', width: 40 },
        { header: 'Fecha de registro', key: 'fecReg', width: 30 },
      ];

      surveysFounded.forEach((survey) => {
        const row = worksheet.addRow({
          evaluator: `${survey.userEvaluator.firstname} ${survey.userEvaluator.lastname}`,
          evaluated: `${survey.userEvaluated.firstname} ${survey.userEvaluated.lastname}`,
          year: survey.period.year,
          society: survey.period.society,
          goals: survey.goals.map(goal => `${goal.description} (${goal.value})`).join(', '),
          competencies: survey.competencies.map(goal => `${goal.description} (${goal.value})`).join(', '),
          comentaries: survey.comentaries,
          fecReg: survey.regDate
        })

        row.eachCell({ includeEmpty: true }, (cell) => {
          // Añadir bordes
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Centrar el texto horizontalmente y verticalmente
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      });

      // Aplicar estilo de borde y centrado también a los encabezados
      worksheet.getRow(1).eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        //Aplicar gradiente al fondo
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 90,
          stops: [
            { position: 0, color: { argb: 'ff008598' } },
            { position: 1, color: { argb: 'ff002343' } }
          ]
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };  // Alineado y con salto de línea
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };  // Poner en negrita los encabezados y color blanco
      });


      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=reporte-${society}-${year}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      handleErrors(error, this.logger);
    }

  }

  findAll() {
    return `This action returns all survey`;
  }

  async findOneByUserEvaluatedAndPeriod(userEvaluatedId: string, period: string) {
    try {
      const surveyFinded = (await this.surveySchema.findOne({ userEvaluated: userEvaluatedId, period })).populate({
        path: 'userEvaluator',
        select: 'firstname lastname'
      });
      return surveyFinded;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  getGrade(value: number) {
    switch (value) {
      case 1:
        return 11;
      case 2:
        return 13;
      case 3:
        return 15;
      case 4:
        return 17;
      case 5:
        return 19;
      default:
        return 0;
    }
  }

  async confirmResults(confirmResultsDto: ConfirmResultsDto) {
    try {

      const survey = await this.surveySchema.findById(confirmResultsDto.surveyId)
        .populate({
          path: 'userEvaluator',
          select: 'firstname lastname'
        }).populate({
          path: 'userEvaluated',
          select: 'firstname lastname area position',
          populate: 'area'
        }).populate({
          path: 'period',
          select: 'year society'
        });

      const pdfPath: any = await this.pdfService.generatePdf(survey);

      await this.mailerService.sendMail({
        to: confirmResultsDto.mailTo,
        from: 'gestionhumana@marco.com.pe',
        subject: `Resultados - Evaluación de desempeño ${survey.period.year}`,
        attachments: [
          {
            filename: 'logo completo.png',
            path: 'src/public/images/logo completo.png',
            cid: 'logo',
          },
          {
            filename: pdfPath.fileName,
            path: pdfPath.publicFilePath
          }
        ],
        html: `
      <p>Estimad@ ${survey.userEvaluated.firstname} ${survey.userEvaluated.lastname},</p>
      <p>Adjunto a este correo podrá encontrar su calificación de la evaluación de desempeño.</p>
      <p>Cualquier duda o consulta no dude en comunicarse con el área de Gestión Huamana.</p>
      
      <br>
      <p>Saludos,</p>
      <img src="cid:logo" width="250" />
      `
      });

      const surveyUpdated = await this.surveySchema.findByIdAndUpdate(confirmResultsDto.surveyId, { isResultsDownloaded: true });

      return surveyUpdated;

    } catch (error) {
      console.log(error);
      handleErrors(error, this.logger);
    }
  }

  update(id: number, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
