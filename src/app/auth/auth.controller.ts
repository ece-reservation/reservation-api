import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LoginRequest } from '../../libs/request/auth/login.request';
import { UsernameRequest } from '../../libs/request/users/username.request';
import { InternalServerErrorError } from '../../libs/response/status-code/internal-server-error.error';
import { NotFoundError } from '../../libs/response/status-code/not-found.error';
import { BadRequestError } from '../../libs/response/status-code/bad-request.error';
import { JwtResponse } from '../../libs/response/auth/jwt.response';
import { UnauthorizedError } from '../../libs/response/status-code/unauthorized.error';
import { AccessTokenResponse } from '../../libs/response/auth/access-token.response';
import { CheckUsernameSuccessResponse } from '../../libs/response/auth/check-username.success.response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({
    description:
      '계정 정보가 일치하는 경우 access_token과 user_id를 반환합니다.',
    type: AccessTokenResponse,
  })
  @ApiBadRequestResponse({
    description: 'password가 일치하지 않는 경우',
    type: BadRequestError,
  })
  @ApiNotFoundResponse({
    description: 'username이 존재하지 않는 경우',
    type: NotFoundError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버에 에러가 발생한 경우',
    type: InternalServerErrorError,
  })
  @ApiOperation({ summary: 'username과 password를 통해 로그인합니다.' })
  async login(@Body() dto: LoginRequest): Promise<AccessTokenResponse> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Get('profile')
  @ApiOkResponse({
    description: 'jwt 토큰의 인증이 성공한 경우 username을 반환합니다.',
    type: JwtResponse,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 되어있지 않은 경우',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버에 에러가 발생한 경우',
    type: InternalServerErrorError,
  })
  @ApiOperation({ summary: 'jwt access token의 적용 유무를 확인합니다.' })
  getProfile(@Req() req): JwtResponse {
    return req.user;
  }

  @Get(':username')
  @ApiOkResponse({
    description:
      '존재하는 username을 입력한 경우 user의 id와 name을 반환합니다.',
    type: CheckUsernameSuccessResponse,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 username을 입력한 경우',
    type: NotFoundError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러가 발생했을 경우',
    type: InternalServerErrorError,
  })
  @ApiOperation({
    summary: 'username을 통해 user의 id와 name을 조회하여 중복을 확인합니다.',
  })
  async checkUsername(
    @Param() dto: UsernameRequest,
  ): Promise<CheckUsernameSuccessResponse> {
    return await this.authService.checkUsername(dto);
  }
}
