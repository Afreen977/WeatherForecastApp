
import React,{useState,useEffect,useReducer} from 'react'

import { WeatherBody } from './Components/WeatherBody';




export const App=()=>{
  return(
      <React.Fragment>
        <div  style={{position:'absolute',left:'25%'}}>
          <WeatherBody/>
          </div>
      </React.Fragment>
  )
}