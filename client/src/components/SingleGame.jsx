import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import CreateReview from './CreateReview'
import { postReview, getReviews, getOneGame, getOneUser, deleteReview } from '../services/api-helper'
import ReviewList from './ReviewList'
import axios from 'axios';


export default class SingleGame extends Component {
  state = {
    currentGame: null,
    reviews: [],
    user: ''
  }

  destroyReview = async (gameId, reviewId) => {
    await deleteReview(gameId, reviewId)
    this.setState(prevState => ({
      reviews: prevState.reviews.filter(review => {
        return review.id !== reviewId
      })
    }))
  }

  async componentDidMount() {
    await this.setCurrentGame()
    await this.setUser(this.state.currentGame.userId)
    const reviews = await getReviews(this.props.gameId)
    this.setState({
      reviews
    })
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.gameId !== this.props.gameId) {
      this.setCurrentGame()
    }
  }

  setCurrentGame = async () => {
    const response = await axios.get(`https://intense-woodland-83144.herokuapp.com/games/${this.props.gameId}`)
    const currentGame = response.data
    this.setState({
      currentGame
    })

  }

  createReview = async (userId, gameId, reviewData) => {
    const newReview = await postReview(userId, gameId, reviewData)
    this.setState(prevState => ({
      reviews: [...prevState.reviews, newReview]
    }))
  }

  setUser = async (userId) => {
    const user = await getOneUser(userId)
    this.setState({
      user
    })
  }


  render() {
    const { currentGame } = this.state
    const { currentUser } = this.props;
    const reviews = this.state.reviews.filter(review => (
      review.gameId == currentGame.id
    ))
    return (
      <div id='game-info'>
        {currentGame && (
          <>
            <h1 id='single-game-title'>{currentGame.name}</h1>
            <img src={currentGame.image_url} alt={currentGame.name} id='game-pic' />
            <h3 id='description'>Description</h3>
            <p id='game-description'>{currentGame.description}</p>
            <ReviewList
              reviews={reviews}
              currentGame={currentGame}
              currentUser={currentUser}
              destroyReview={this.destroyReview}
            />
            <CreateReview
              currentUser={currentUser}
              gameId={this.props.gameId}
              createReview={this.createReview}
            />
            {
              currentUser.id === currentGame.userId && (
                <div id='buttons'>
                  <Link to={`/game/${currentGame.id}/edit`}><button id='edit-game'>Edit Game</button></Link>
                  <button id='delete-game' onClick={() => {
                    this.props.destroyGame(currentUser.id, currentGame.id)
                  }}>
                    Delete Game
                    </button>
                </div>
              )
            }
          </>
        )
        }
      </div >
    )
  }
}