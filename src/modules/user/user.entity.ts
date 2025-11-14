export class User {
  constructor(
    public email: string,
    public password: string,
    public nombre: string,
    public apellidos: string,
    public sesion_activa: boolean = false,
  ) {}
}
