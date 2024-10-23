import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OnesignalService } from 'src/onesignal/onesignal.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private onesignalService: OnesignalService
    ) { }

    async signIn(authReqDto: AuthDto) {
        const user = await this.userService.findByUsername(authReqDto.username);

        if (!user) {
            throw new UnauthorizedException('Username or password invalid');
        }

        if (!bcrypt.compareSync(authReqDto.password, user?.password)) {
            throw new UnauthorizedException('Username or password invalid');
        }

        if(!user.onesignal_id) {
            if(authReqDto.onesignal_id) {
                await this.onesignalService.registerOneSignalTag(user._id.toString(), authReqDto.onesignal_id);
                
                user.onesignal_id = authReqDto.onesignal_id;
                user.external_id = user._id.toString();
                await user.save();

            }
        }

        const payload = { 
            _id: user._id, 
            firstname: user.firstname, 
            role: user.role, 
            society: user.society, 
            email: user.email,
            approver: user.approver, 
            competencyLevel: user.competencyLevel
         };

        const token = await this.jwtService.signAsync(payload);

        return { user: payload, token };
    }
}
