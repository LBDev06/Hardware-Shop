import { Bcrypt } from "@/domain/marketplace/infra/cryptography/bcrypt";
import { compare, hash } from "bcryptjs";

export class BcryptAdapter implements Bcrypt {
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  async hash(password: string, salt: number): Promise<string> {
    return hash(password, salt);
  }
}
