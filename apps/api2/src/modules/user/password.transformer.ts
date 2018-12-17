import * as crypto from 'crypto';
import { ValueTransformer } from "typeorm";

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    return crypto.createHmac('sha256', value).digest('hex');
  }
  from(value) {
    return value;
  }
}
