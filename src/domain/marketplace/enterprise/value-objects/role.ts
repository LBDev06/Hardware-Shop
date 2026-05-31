export class Role {
  static readonly Client = new Role("Client");
  static readonly Seller = new Role("Seller");

  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static fromString(roleReceived: string) {
    const role = roleReceived.toLowerCase();
    if (role === "client") {
      return new Role(Role.Client.value);
    }
    if (role === "seller") {
      return new Role(Role.Seller.value);
    } else {
      throw new Error(`Invalid role ${roleReceived}`);
    }
  }
}
