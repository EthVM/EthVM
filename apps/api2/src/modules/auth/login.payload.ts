import { ApiModelProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginPayload {
  @ApiModelProperty({
    required: true
  })
  @IsEmail()
  email: string;
  @ApiModelProperty({
    required: true
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
