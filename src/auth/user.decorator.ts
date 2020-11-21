import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/user.entity';

export const GetUser = createParamDecorator(
	(data, req): User => {
		// Versão antiga do Nestjs
		// return req.user;

		const user = req.args[0].user;
		return user;
	},
);
