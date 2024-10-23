import { Module } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Approval, ApprovalSchema } from './entities/approval.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  imports: [
    MongooseModule.forFeature([
      { name: Approval.name, schema: ApprovalSchema }
    ]),
    UserModule
  ]
})
export class ApprovalsModule {}
