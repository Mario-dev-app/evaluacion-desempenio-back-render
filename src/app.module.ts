import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GoalModule } from './goal/goal.module';
import { PeriodModule } from './period/period.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SurveyModule } from './survey/survey.module';
import { CompetenciesModule } from './competencies/competencies.module';
import { AreaModule } from './area/area.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PdfService } from './common/services/pdf/pdf.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OnesignalModule } from './onesignal/onesignal.module';
import { FilesController } from './common/controllers/files/files.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'gestionhumana@marco.com.pe',
          pass: 'MI_PASSWORD'
        },
        tls: {
          ciphers: 'SSLv3'
        }
      },
      defaults: {
        from: '"Gestión Humana" <gestionhumana@marco.com.pe>'
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        }, 
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      /* serveRoot: '/files' */
    }),
    AuthModule,
    GoalModule,
    PeriodModule,
    ApprovalsModule,
    SurveyModule,
    CompetenciesModule,
    AreaModule,
    OnesignalModule
  ],
  providers: [PdfService],
  controllers: [FilesController]
})
export class AppModule {}
