import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/DTO/create-user.dto';
import { ReturnUserDto } from 'src/DTO/return-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from './user-roles.enum';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from './user.entity';
import { UpdateUserDto } from 'src/DTO/update-user.dto';
import { GetUser } from 'src/auth/user.decorator';
import { FindUsersQueryDto } from 'src/DTO/find-users.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post()
	@Role(UserRole.ADMIN)
	// @UseGuards(AuthGuard(), RolesGuard)
	async createAdminUser(
		@Body(ValidationPipe) createUserDto: CreateUserDto,
	): Promise<ReturnUserDto> {
		const user = await this.usersService.createAdminUser(createUserDto);

		return {
			user,
			message: 'Administrador cadastrado com sucesso',
		};
	}

	@Get(':id')
	@Role(UserRole.ADMIN)
	async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
		const user = await this.usersService.findUserById(id);

		return { user, message: 'Usuário encotrado' };
	}

	@Patch(':id')
	// Tem outro jeito de fazer essa verificação de roles - Examples Nest Fastify
	async updateUser(
		@Body(ValidationPipe) updateUserDto: UpdateUserDto,
		@GetUser() user: User,
		@Param('id') id: string,
	) {
		if (user.role != UserRole.ADMIN && user.id.toString() != id)
			throw new ForbiddenException(
				'Você não tem autorização para acessar esse recurso',
			);
		else return this.usersService.updateUser(updateUserDto, id);
	}

	@Delete(':id')
	@Role(UserRole.ADMIN)
	async deleteUser(@Param('id') id: string) {
		await this.usersService.deleteUser(id);
		return { message: 'Usuário removido com sucesso' };
	}

	@Get()
	@Role(UserRole.ADMIN)
	async findUsers(@Query() query: FindUsersQueryDto) {
		const found = await this.usersService.findUsers(query);
		return { found, message: 'Usuários encontrados' };
	}
}
