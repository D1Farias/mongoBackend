export interface Trip {
    id?: string;
    origen: string;
    destino: string;
    fecha: Date;
    busLayout: number[][];
}