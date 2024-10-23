import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { handleErrors } from 'src/common/methods/handle-error.method';
import { Goal } from 'src/goal/entities/goal.entity';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
    @InjectModel(Goal.name)
    private goalModel: Model<Goal>
  ) { }

  generateCode(length: number): string {
    return crypto.randomBytes(length)
      .toString('base64')
      .slice(0, length)
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(createUserDto.password, salt);
      const userCreated = await this.userModel.create({ ...createUserDto, password });
      return userCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findAll(limit: number, skip: number) {
    try {
      const count = await this.userModel.countDocuments({ role: { $nin: ['ADMIN'] } });
      const users = await this.userModel.find({ role: { $nin: ['ADMIN'] } })
        .limit(limit)
        .skip(skip)
        .select('firstname lastname numDoc role society username active approver area position competencyLevel email');

      return { users, count };
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findOne(term: string) {
    let user: User | User[];
    console.log(mongoose.isValidObjectId(term));
    if (mongoose.isValidObjectId(term)) {
      user = await this.userModel.findOne({ _id: term, active: true });
    } else {
      user = await this.userModel.find({
        $or: [
          { firstname: { $regex: term, $options: 'i' } },
          { lastname: { $regex: term, $options: 'i' } },
        ]
      });
    }
    if (!user) {
      throw new NotFoundException(`User with id ${term} not found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async findAllApproversOfUsers() {
    const approversOfUsers = await this.userModel.find({ active: true })
      .select('firstname lastname approver')
      .populate({
        path: 'approver',
        select: 'firstname lastname'
      });
    const newResp = approversOfUsers.filter((reg) => {
      return reg.approver;
    })
    return newResp;
  }

  async findAllMaybeApprovers() {
    try {
      const maybeApproversFinded = await this.userModel.find({
        active: true,
        role: {
          $in: ['BOSS', 'GER']
        }
      })
        .sort({ lastname: 1 })
        .select('firstname lastname');
      return maybeApproversFinded;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findUsersWithoutObjectives(periodId: string, society: string) {
    try {
      const usersWithoutGoals = await this.userModel.aggregate([
        { $match: { active: true, role: { $nin: ['GER', 'ADMIN'] }, society } },
        {
          $lookup: {
            from: 'goals',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$user', '$$userId'] }, // Coincidir el usuario
                      { $eq: ['$period', new mongoose.Types.ObjectId(periodId)] } // Coincidir el periodo
                    ]
                  }
                }
              }
            ],
            as: 'userObjectives'
          }
        },
        // Filtrar usuarios que no tienen objetivos en el periodo
        { $match: { userObjectives: { $size: 1 } } },
        // Proyectar solo los campos necesarios
        {
          $project: {
            _id: 1,
            firstname: 1,
            lastname: 1,
            email: 1
          }
        }
      ]);

      return usersWithoutGoals;
    } catch (error) {
      console.error('Error al obtener usuarios sin objetivos:', error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    try {
      const salt = bcrypt.genSaltSync(10);
      await this.userModel.findByIdAndUpdate(id,
        {
          ...updateUserDto,
          password: updateUserDto.password ? bcrypt.hashSync(updateUserDto.password, salt) : updateUserDto.password
        }
      );
      return {
        ok: true,
        message: `User with id ${id} updated`
      };
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async updatePasswordByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).select('email password firstname lastname');
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    try {

      const salt = bcrypt.genSaltSync(10);
      const newPassword = this.generateCode(10);
      user.password = bcrypt.hashSync(newPassword, salt);
      user.save();

      await this.mailerService.sendMail({
        to: user.email,
        from: 'developer@marco.com.pe',
        subject: 'Restablecimiento de contraseña',
        html: `
        <p>Estimad@ ${user.firstname} ${user.lastname},</p>
        <p>Le informamos que su contraseña fue modificada. Su nueva contraseña es ${newPassword}</p>
        <br>
        <p>Saludos,</p>
        <p>Developer Marco Peruana</p>
        `
      });
      return { email: user.email, new_pass: newPassword };
    } catch (error) {
      handleErrors(error, this.logger);
    }

  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, { active: false });
      return `User with id ${id} deleted`;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }


}
