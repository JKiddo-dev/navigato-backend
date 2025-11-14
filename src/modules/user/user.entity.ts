export class User {
  constructor(
    public id: string,
    public nombre: string,
    public apellidos: string,
    public correo: string,
    public contraseña_hash: string,
    public sesion_activa: boolean = false,
    public listaLugares: any[] = [],
    public listaVehiculos: any[] = [],
    public listaRutasGuardadas: any[] = [],
    public preferencias: any = {}
  ) {}
}
