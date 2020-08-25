export default class ProductModel {
    public id: number
    public name: string
    public description: string
    public quantity: number
    public categoryId: number
    constructor (id?, name?, description?, quantity?, categoryId?) {
        this.id = id
        this.name = name
        this.description = description
        this.quantity = quantity
        this.categoryId = categoryId
    }
}