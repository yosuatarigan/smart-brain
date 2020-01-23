import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Logo from './Component/Logo/Logo';
import SignIn from './Component/SignIn/SignIn';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import './App.css';
import Navigation from './Component/Navigation/Navigation';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import Register from './Component/Register/Register';



const initialState = {
  input : '',
  imgUrl : '',
  box : {},
  route : 'signin',
  insignedin : 'false',
  user : {
    id : '',
    name : '',
    email : '',
    entries : 0,
    joined : ''
  }
} 

class App extends Component{
  constructor(){
    super();
    this.state = initialState;
  }

  


  loaduser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) =>{
      const clarifaiFace =   data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      return{
        leftCol : clarifaiFace.left_col * width,
        topRow : clarifaiFace.top_row * height,
        rightCol : width - (clarifaiFace.right_col * width),
        bottomRow : height - (clarifaiFace.bottom_row * height)
      }
  }

  displayFaceBox = (box)=>{
    this.setState({box : box});
  }


  onInputChange = (event)=>{
    this.setState({input : event.target.value})
  }

  onButtonSubmit = ()=>{
    this.setState({imgUrl : this.state.input})
    fetch('https://nameless-everglades-85803.herokuapp.com/imageurl', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: this.state.input
          })
        })
        .then(response=>response.json())
    .then(response => {
      if(response){
        fetch('https://nameless-everglades-85803.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log())
      }

      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }

  

  onRouteChange = (route)=>{
    if(route === 'signout'){
      this.setState(initialState);
    }
    else if(route === 'signin'){
      this.setState({insignedin : 'false'});
    }
    else if (route === 'home'){
      this.setState({insignedin : 'true'})
    }
    this.setState({route : route})
    
    
  }


  //OPSI DASAR
  // onButtonSubmit = ()=>{
  //   this.setState({imgUrl : this.state.input})
  //   app.models.predict( Clarifai.FACE_DETECT_MODEL , this.state.imgUrl)
  //   .then(function(response) {
  //     // do something with response
  //     this.calculateFaceLocation();
  //   },
  //   function(err) {
  //     // there was an error
  //   }
  // );
  // }

  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(console.log)
  // }



  render(){
    const {insignedin,  route , box, input} = this.state;
    return(
      <div>
         <Particles className='particles' />
         
        <Navigation insignedin={insignedin} onRouteChange={this.onRouteChange}  />
        
        { this.state.route === 'home' ?  
        <div>
        <Logo/>
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} ImgUrlInput = {input}/>
        </div>
        :
        (route === 'signin'   ? 
        <div>
        <SignIn loaduser={this.loaduser}  onRouteChange={this.onRouteChange} />
        </div>
        
        :
        route === 'signout'   ? 
        <div>
        <SignIn loaduser={this.loaduser}  onRouteChange={this.onRouteChange} insignedin={insignedin}/>
        </div>
        :
        <div> 
        <Register loaduser={this.loaduser} onRouteChange={this.onRouteChange} />
        </div>)
        
        }
      </div>
    );
  }
}

export default App;
