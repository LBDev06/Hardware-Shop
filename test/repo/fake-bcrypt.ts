import { Bcrypt } from "@/domain/marketplace/infra/cryptography/bcrypt";

export class FakeBcrypt implements Bcrypt {
  async hash(plain: string, salt: number | string): Promise<string> {
    return plain;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain === hash;
  }
}
