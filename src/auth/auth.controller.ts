import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/DTO/create-user.dto';
import { CredentialsDto } from 'src/DTO/credentials.dto';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from './user.decorator';
import { UserRole } from 'src/users/user-roles.enum';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/signup')
	async signUp(
		@Body(ValidationPipe) createUserDto: CreateUserDto,
	): Promise<{ message: string }> {
		await this.authService.signUp(createUserDto);
		return { message: 'Cadastro realizado com sucesso' };
	}

	@Post('/signin')
	async signIn(
		@Body(ValidationPipe) credentialsDto: CredentialsDto,
	): Promise<{ token: string }> {
		return await this.authService.signIn(credentialsDto);
	}

	@Get('/me')
	@UseGuards(AuthGuard())
	// @UseGuards(AuthGuard('jwt'))
	getMe(@Req() req): User {
		return req.user;
	}

	@Patch(':token')
	async confirmEmail(@Param('token') token: string) {
		const user = await this.authService.confirmEmail(token);

		return { message: 'Email confirmado' };
	}

	@Post('/send-recover-email')
	async sendRecoverPasswordEmail(
		@Body('email') email: string,
	): Promise<{ message: string }> {
		await this.authService.sendRecoverPasswordEmail(email);
		return {
			message: 'Foi enviado um email com instruções para resetar sua senha',
		};
	}

	@Patch('/reset-password/:token')
	async resetPassword(
		@Param('token') token: string,
		@Body(ValidationPipe)
		changePasswordDto: ChangePasswordDto, // eslint-disable-line indent
	): Promise<{ message: string }> {
		await this.authService.resetPassword(token, changePasswordDto);

		return { message: 'Senha alterada com sucesso' };
	}

	@Patch(':id/change-password')
	@UseGuards(AuthGuard())
	async changePassword(
		@Param('id') id: string,
		@Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
		@GetUser() user: User,
	) {
		if (user.role != UserRole.ADMIN && user.id.toString() != id)
			throw new UnauthorizedException(
				'Você não tem permissão para realizar esta operação',
			);

		await this.authService.changePassword(id, changePasswordDto);
		return {
			message: 'Senha alterada',
		};
	}
}
