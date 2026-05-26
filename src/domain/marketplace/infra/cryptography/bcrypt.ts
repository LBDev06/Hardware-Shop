export interface Bcrypt {
  compare(plain: string, hash: string): Promise<boolean>;
  hash(password: string, hash: number): Promise<string>;
}
