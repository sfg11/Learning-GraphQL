/* Login.js component can have 2 major states:

    1) for users that already have an account and only need to login.
        - component will render 2 input fields for user to provide email and pw. (state.login = true in this case)

    2) users that havent created an account and need to sign up.
        - render a third input field where users can provide name. (state.login will be false)
the method _confirm will be used to implement mutations that we need to send for the login functionality.

Warning: Storing JWTs in localStorage is not a safe approach to implement authentication on the frontend. Because this tutorial is focussed on GraphQL, we want to keep things simple and therefore are using it here.



 */
 import React, { Component } from 'react'
 import { AUTH_TOKEN } from '../constants'
 import { graphql, compose } from 'react-apollo'
 import gql from 'graphql-tag'

 class Login extends Component {
   state = {
     login: true, // switch between Login and SignUp
     email: '',
     password: '',
     name: '',
   }

   render() {
     return (
       <div>
         <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
         <div className="flex flex-column">
           {!this.state.login && (
             <input
               value={this.state.name}
               onChange={e => this.setState({ name: e.target.value })}
               type="text"
               placeholder="Your name"
             />
           )}
           <input
             value={this.state.email}
             onChange={e => this.setState({ email: e.target.value })}
             type="text"
             placeholder="Your email address"
           />
           <input
             value={this.state.password}
             onChange={e => this.setState({ password: e.target.value })}
             type="password"
             placeholder="Choose a safe password"
           />
         </div>
         <div className="flex mt3">
           <div className="pointer mr2 button" onClick={() => this._confirm()}>
             {this.state.login ? 'login' : 'create account'}
           </div>
           <div
             className="pointer button"
             onClick={() => this.setState({ login: !this.state.login })}
           >
             {this.state.login
               ? 'need to create an account?'
               : 'already have an account?'}
           </div>
         </div>
       </div>
     )
   }

   _confirm = async () => {
     const { name, email, password } = this.state
     if (this.state.login) {
       const result = await this.props.loginMutation({
         variables: {
           email,
           password,
         },
       })
       const { token } = result.data.login
       this._saveUserData(token)
     } else {
       const result = await this.props.signupMutation({
         variables: {
           name,
           email,
           password,
         },
       })
       const { token } = result.data.signup
       this._saveUserData(token)
     }
     this.props.history.push(`/`)
   }

   _saveUserData = (token) => {
     localStorage.setItem(AUTH_TOKEN, token)
   }
 }

 const SIGNUP_MUTATION = gql`
   mutation SignupMutation($email: String!, $password: String!, $name: String!) {
     signup(email: $email, password: $password, name: $name) {
       token
     }
   }
 `

 const LOGIN_MUTATION = gql`
   mutation LoginMutation($email: String!, $password: String!) {
     login(email: $email, password: $password) {
       token
     }
   }
 `

 export default compose(
   graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
   graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
 )(Login)

// using compose for the export statement this time since there is more than one mutation
