export default class ProductModel {
    public id: number
    public title: string
    public description: string
    public quantity: number
    public price: number
    constructor (id?, title?, description?, quantity?, price?) {
        this.id = id
        this.title = title
        this.description = description
        this.quantity = quantity
        this.price = price
    }
}