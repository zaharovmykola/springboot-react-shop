export default class ProductModel {
	public id: number
	public title: string
	public description: string
	public quantity: number
	public price: number
	public categoryId: number
	constructor (title, description, quantity, price, categoryId, id?) {
		this.id = id
		this.title = title
		this.description = description
		this.quantity = quantity
		this.price = price
		this.categoryId = categoryId
	}
}