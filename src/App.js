import {useEffect, useState} from 'react'
import './App.css'
import Loader from 'react-loader-spinner'
import DishItem from './components/DishItem'
import Header from './components/Header'

// write your code here
const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [response, setResponse] = useState({})
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState([])

  const onUpdateActiveCategoryIdx = menuCategoryId =>
    setActiveCategoryId(menuCategoryId)

  const addItemToCart = dish => {
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (!isAlreadyExists) {
      const newDish = {...dish, quantity: 1}
      setCartItems(prev => [...prev, newDish])
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      )
    }
  }

  const removeItemFromCart = dish => {
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (isAlreadyExists) {
      setCartItems(prev =>
        prev
          .map(item =>
            item.dishId === dish.dishId
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      )
    }
  }

  const getUpdatedData = data => ({
    branchName: data.branch_name,
    nexturl: data.nexturl,
    restaturantId: data.restaurant_id,
    restaurantImage: data.restaurant_image,
    restaurantName: data.restaurant_name,
    tableId: data.table_id,
    tableMenuList: data.table_menu_list.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
      nexturl: eachMenu.nexturl,
    })),
  })

  useEffect(() => {
    const fetchRestaurantApi = async () => {
      const api =
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
      // const api = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
      const apiResponse = await fetch(api)
      const data = await apiResponse.json()
      const updatedData = getUpdatedData(data[0])
      console.log(updatedData)
      setResponse(updatedData)
      setActiveCategoryId(updatedData.tableMenuList[0].menuCategoryId)
      setIsLoading(false)
    }
    fetchRestaurantApi()
  }, [])

  const renderTabMenuList = () => {
    const {tableMenuList} = response
    console.log(tableMenuList)
    return tableMenuList.map(eachCategory => {
      const onClickHandler = () =>
        onUpdateActiveCategoryIdx(eachCategory.menuCategoryId)
      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button type="button" className="tab-category-button">
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })
  }

  const renderDishes = () => {
    const {tableMenuList} = response
    const {categoryDishes} = tableMenuList.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    return (
      <ul className="dishes-list-container">
        {categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <Loader type="TailSpin" color="#032541" />
    </div>
  )

  return isLoading ? (
    renderSpinner()
  ) : (
    <div className="home-background">
      <Header cartItems={cartItems} branchName={response.branchName} />
      <ul className="tab-container">{renderTabMenuList()}</ul>
      {renderDishes()}
    </div>
  )
}

export default App
