import React from 'react'
import { connect } from 'react-redux'
import { getProductsFromDb } from '../store/products'
import { Link } from 'react-router-dom'
import CategoryList from './category-list'

// COMPONENT
class AllProducts extends React.Component {
  constructor() {
    super()
    this.renderButtons = this.renderButtons.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
  }

  handleEditClick(evt, productId) {
    evt.preventDefault()
    this.props.history.push(`/products/${productId}/edit`) // will make the edit form render
  }

  renderButtons(productId) {
    // add id to the buttons div? there is an id in shelby's code
    const { user } = this.props
    if (user && user.isAdmin) {
      return (
        <div>
          <button type="button" onClick={(evt) => this.handleEditClick(evt, productId)}>Edit</button>
          <button type="button" >Delete</button>
        </div>
      )
    }
  }

  componentDidMount() {
    this.props.fetchProducts()
    // need to fetch the user from the store? how does user get put on the store for us?
  }

  //may need refactoring to remove use of var
  render() {
    const selectedCategory = this.props.selectedCategory
    if (selectedCategory.name) {
      var { products } = selectedCategory
    }
    else {
      products = this.props.products
    }
    return (
      <div id="all-products">
        <CategoryList />
        {
          products.map(product => (
            <div className="product-card" key={product.id} >
              <Link to={`/shop/${product.id}`} >{product.title}</Link>
              <img className="product-card-image" src={product.photoUrl} />
              {/* does product.price give the correct price? also show part of description? show 'sold out' or similar comments to shopper based on inventory? */}
              <h4>${product.price}</h4>
              <h4>Number in stock: {product.inventory}</h4>
              { this.renderButtons(product.id) }
            </div>
          ))
        }
      </div>
    )
  }
}

const mapState = state => ({
  products: state.products,
  selectedCategory: state.selectedCategory,
  user: state.user
})

const mapDispatch = (dispatch) => ({
  fetchProducts: () => dispatch(getProductsFromDb())
})

export default connect(mapState, mapDispatch)(AllProducts)



