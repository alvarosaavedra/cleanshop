class Product {
    
    constructor (public id: number, public nombre: string, public precio: number, public costo: number) {}

    public margen () {
        return this.precio - this.costo
    }
}

export { Product }