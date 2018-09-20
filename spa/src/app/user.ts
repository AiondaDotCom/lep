export class User {
  constructor(
    public email: string,
    public userName?: string, // TODO remove (needed by dashboard)
    public fullName?: string,
    public password?: string,
    public accountType?: string,
    public accountState?: string,
    public userID?: number,
    public expireTimestamp?: string,
    public lastLogin?: string,
  ) { }
}
