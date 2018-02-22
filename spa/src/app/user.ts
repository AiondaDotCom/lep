export class User {
  constructor(
    public email: string,
    public password?: string,
    public accountType?: string,
    public expireTimestamp?: string,
    public fullName?: string,
    public userName?: string,
    public lastLogin?: string
  ) { }
}
