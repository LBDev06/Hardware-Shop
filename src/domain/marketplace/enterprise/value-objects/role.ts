
export class Role {
    static readonly Client = new Role('client')
    static  readonly Seller = new Role('seller')

    public readonly value :string

    private constructor (value: string){
        this.value = value
        Object.freeze(this)
    }
   
    public static fromString(roleReceived: string){
        if(roleReceived === 'client'){
            return new Role(Role.Client.value)
        }
        if(roleReceived === 'seller'){
            return new Role(Role.Seller.value)
        } else {
            throw new Error(`Invalid role ${roleReceived}`)
        }
    }

}