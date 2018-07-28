import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategoriesFromDb } from '../store/categories';
import { addCategoryToProduct, deleteCategoryFromProduct } from '../store/product'

class ProductCategoryForm extends Component {
  constructor() {
    super()
    this.state = {
      selectedCategory: 0, //id of category
      categories: [],
      isLoaded: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleChange(evt) {
    evt.preventDefault()
    const categoryId = +evt.target.value
    this.setState({
      selectedCategory: categoryId
    })
  }

  handleRemove(evt, categoryId) {
    evt.preventDefault()
    const productId = +this.props.product.id
    this.props.removeCategory(productId, categoryId)

    this.setState(prevState => ({
      categories: prevState.categories.filter(category => category.id !== categoryId)
    }))
  }

  async handleSubmit(evt) {
    evt.preventDefault()

    if (this.state.selectedCategory === 0) {
      return
    }

    const id = this.props.product.id
    const category = this.props.allCategories.find(element => element.id === this.state.selectedCategory)
    console.log('=== category in handlesubmit', category)

    this.props.addCategory(id, category)

    this.setState(prevState => ({
      categories: [...prevState.categories, category]
    }))
  }

  componentDidMount() {
    this.props.fetchCategories()
    console.log('== component mounted ==')
    this.setState({
      isLoaded: true,
      categories: this.props.productCategories || []
    })
  }

  render() {
    // render a special drop down menu only for admins to edit the categories for this product

    if (this.props.isAdmin) {
      const { allCategories } = this.props
      const { categories, isLoaded } = this.state
      let filteredCategories;
      console.log('**', this.state)
      if (isLoaded) {
        const ids = categories.map(category => category.id)
        filteredCategories = allCategories.filter(category => ids.indexOf(category.id) === -1)
      } else {
        filteredCategories = []
      }

      return (
        <div id="product-form-categories" >
          <h4>Current Categories</h4>
          {
            this.state.categories.length && this.state.categories.map(category => (<div key={category.id} >
              {category.name}
              <button onClick={(evt) => this.handleRemove(evt, category.id)} > x </button>
            </div>))
          }

          <h4>Edit Categories</h4>
          <form onSubmit={this.handleSubmit} >
            <select value={this.state.selectedCategory.name} onChange={this.handleChange} >
              <option value={0} >Select a category</option>
            {
              filteredCategories.length && filteredCategories.map(category => {
                return (
                  <option key={category.id} value={category.id}> {category.name} </option>
                )
              })
            }
            </select>
            <button type="submit" > Add Category </button>
          </form>

        </div>
      )
    } else {
      // user is not an admin, so we don't display this form to them
      return null
    }
  }
}

// CONNECTED COMPONENT
const mapState = state => {
  return {
    allCategories: state.categories,
    productCategories: state.product.categories,
    isAdmin: state.user.isAdmin,
    product: state.product
  }
}

const mapDispatch = dispatch => {
  return {
    fetchCategories: () => dispatch(getCategoriesFromDb()),
    addCategory: (productId, category) => dispatch(addCategoryToProduct(productId, category)),
    removeCategory: (productId, categoryId) => dispatch(deleteCategoryFromProduct(productId, categoryId))
  }
}

export default connect(mapState, mapDispatch)(ProductCategoryForm)


// notes: we don't always finish fetching the categories before we try to set our state with those fetched categories...