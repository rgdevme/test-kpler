import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiHeader,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";

import { ACTOR_HEADER, xActorUserId } from "../../decorators/xActorUserId.decorator.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { ReplaceUserRolesDto } from "./dto/replace-user-roles.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UserResponseDto } from "./dto/user-response.dto.js";
import { UsersService } from "./users.service.js";

@ApiTags("users")
@Controller("users")
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOkResponse({ isArray: true, type: UserResponseDto })
	public async findAll(): Promise<UserResponseDto[]> {
		return this.usersService.findAll();
	}

	@Post()
	@ApiHeader({ name: ACTOR_HEADER, required: true })
	@ApiBody({ type: CreateUserDto })
	@ApiCreatedResponse({ type: UserResponseDto })
	@ApiBadRequestResponse()
	@ApiNotFoundResponse()
	@ApiConflictResponse()
	public async create(
		@xActorUserId(new ParseUUIDPipe({ version: "4" })) actorUserId: string,
		@Body() input: CreateUserDto,
	): Promise<UserResponseDto> {
		return this.usersService.create(actorUserId, input);
	}

	@Put(":userId")
	@ApiHeader({ name: ACTOR_HEADER, required: true })
	@ApiBody({ type: UpdateUserDto })
	@ApiParam({ format: "uuid", name: "userId", type: String })
	@ApiOkResponse({ type: UserResponseDto })
	@ApiBadRequestResponse()
	@ApiNotFoundResponse()
	public async update(
		@xActorUserId(new ParseUUIDPipe({ version: "4" })) actorUserId: string,
		@Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string,
		@Body() input: UpdateUserDto,
	): Promise<UserResponseDto> {
		return this.usersService.update(actorUserId, userId, input);
	}

	@Put(":userId/roles")
	@ApiHeader({ name: ACTOR_HEADER, required: true })
	@ApiBody({ type: ReplaceUserRolesDto })
	@ApiParam({ format: "uuid", name: "userId", type: String })
	@ApiOkResponse({ type: UserResponseDto })
	@ApiBadRequestResponse()
	@ApiNotFoundResponse()
	public async replaceRoles(
		@xActorUserId(new ParseUUIDPipe({ version: "4" })) actorUserId: string,
		@Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string,
		@Body() input: ReplaceUserRolesDto,
	): Promise<UserResponseDto> {
		return this.usersService.replaceRoles(actorUserId, userId, input);
	}
}
