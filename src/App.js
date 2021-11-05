import Container from '@mui/material/Container'
import React,{useState,useEffect,useReducer} from 'react'

import { WeatherBody } from './Components/WeatherBody';
import ReactDOM from 'react-dom'
import $ from 'jquery'

import _ from 'lodash'
// date-fns

export const App=()=>{
  return(
      <React.Fragment>
        <div  style={{position:'absolute',left:'25%'}}>
          <WeatherBody/>
          </div>
      </React.Fragment>
  )
}