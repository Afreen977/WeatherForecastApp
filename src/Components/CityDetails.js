import React, {useEffect, useState, useImperativeHandle} from 'react'
import 'regenerator-runtime/runtime'
import "isomorphic-fetch"
import Box from '@mui/material/Box';
import {MonthName} from '../Utility/monthName';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {suffix} from '../Utility/suffix';
import Styles from '../Styles/CityDetails.module.css'
import {Images} from '../Utility/Images'
export const CityDetails = ((props) => {
    let image

    let curDate = new Date()

    let day = curDate.getDay()
    let month = curDate.getMonth()

    let date = curDate.getDate()
    let [humidity, sethumidity] = useState(0)
    let [rain, setrain] = useState(0)
    let [temp, setTemp] = useState(0)
    let [wind, setwind] = useState(0)
    let [weatherText, setweatherText] = useState('')
    let [cities, setCities] = useState([])
    let [cityKey, setCityKey] = useState(props.localKey)
    let [selectedCity, setselectedCity] = useState(props.city)


    if (weatherText.includes('Overcast')) {
        image = Images[0]
    } else if (weatherText.includes('sunny')) {
        image = Images[1]

    } else if (weatherText.includes('cloud')) {
        image = Images[2]
    } else if ((weatherText.includes('rain')) && (weatherText.includes('shower'))) {
        image = Images[3]
    } else if (weatherText.includes('thunder')) {
        image = Images[4]
    } else if (weatherText.includes('Fog')) {
        image = Images[5]
    } else 
        image = Images[4]

    

    let cityChange = async (event) => {
        debugger
        try {

            let data = await fetch(`http://dataservice.accuweather.com/locations/v1/topcities/50/?apikey=${
                encodeURIComponent(process.env.REACT_APP_API_KEY)
            }&details=true`, {method: 'GET'})
            let response = await data.json();
            response.map(item => {

                if (item.LocalizedName === event.target.value) {
                    setCityKey(item.Key)
                    setselectedCity(item.LocalizedName)

                    debugger
                    props.onChange(item.Key)
                }
            })
        } catch (error) {
            console.log("cannot fetch information about current city")
        }
    }


    useEffect(() => {
        let cancel = false
        let fetchData = async () => {
            try {


                let data = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${
                    encodeURIComponent(cityKey)
                }/?apikey=${
                    encodeURIComponent(process.env.REACT_APP_API_KEY)
                }&details=true`, {method: 'GET'})
                let response = await data.json()


                if (cancel) 
                    return
                 else {

                    if (props.metric == true) {
                        setTemp(response[0].Temperature.Metric.Value)
                    } else {

                        setTemp(response[0].Temperature.Imperial.Value)
                    }
                    setweatherText(response[0].WeatherText)
                    sethumidity(response[0].RelativeHumidity)
                    if (props.metric == true) {
                        setwind(response[0].Wind.Speed.Metric.Value + response[0].Wind.Speed.Metric.Unit)
                    } else {
                        setwind(response[0].Wind.Speed.Imperial.Value + response[0].Wind.Speed.Imperial.Unit)
                    }
                    if (props.metric == true) {
                        setrain(response[0].PrecipitationSummary.Precipitation.Metric.Value + response[0].PrecipitationSummary.Precipitation.Metric.Unit)
                    } else {
                        setrain(response[0].PrecipitationSummary.Precipitation.Imperial.Value + response[0].PrecipitationSummary.Precipitation.Imperial.Unit)
                    }
                }

            } catch (error) {
                console.log(error)
            }


        }
         fetchData()
        return() => {
            cancel = true;
        }

    }, [
        temp,
        humidity,
        wind,
        rain,
        weatherText,
        cityKey,
        props.metric
    ])


    useEffect(() => {
        let cancel = false
        let tempCities = []
        let fetchCities = async () => {
            try {

                let data = await fetch(`http://dataservice.accuweather.com/locations/v1/topcities/50/?apikey=${
                    encodeURIComponent(process.env.REACT_APP_API_KEY)
                }&details=true`, {method: 'GET'})
                let response = await data.json();

                response.map(item => {

                    tempCities.push(item.LocalizedName)
                })
                if (cancel) 
                    return
                 else {
                    setCities(tempCities)
                }
            } catch (error) {}
        } 
        fetchCities()
        return(() => cancel = true)
    }, [])

    let options
    if (cities.length > 0) {

        options = cities.map((city, key) => {
            return (
                <option value={city}
                    key={key}
                    data-testid="cityNames">
                    {city}</option>
            )
        })
    }

    const card = (
        <React.Fragment>
            <CardContent>
                <div width="50%" 
                    style={
                        {
                            display: 'inline-block',
                            marginRight: '80px'
                        }
                }>
                     <Typography  variant="h6" component="div" style={{display:'inline-block',position:'absolute',left:'20px',top:'10px'}} className={Styles.weather}>
                        Weather Widget</Typography>
                    <Typography data-testid="city" variant="h5" component="div" style={{display:'inline-block',position:'absolute',left:'20px',top:'50px'}} className={Styles.city}>
                        {selectedCity}</Typography>
                    <span style={{position:'relative',left:'130px',top:'20px'}} >
                        <input list="cities" name="city" id="city"
                            onBlur={cityChange} className={Styles.dropdown}/>
                        <datalist id="cities">
                            {options} </datalist>

                    </span>
                    <Typography sx={
                            {mb: 1.5}
                        }
                        color="text.secondary" style={{position:'absolute',left:'20px',top:'70px',marginTop:'3px',marginBottom:'3px'}} className={Styles.dateHolder}>
                        {
                        new Date().toString().split(' ')[0]
                    },{
                        MonthName(month)
                    }    
                        {date}
                        {
                        suffix(date)
                    } </Typography>
                    <Typography variant="body2" style={{position:'absolute',left:'20px',top:'90px',fontWeight:'400',color: 'rgba(0, 0, 0, 0.6)'}} className={Styles.weatherText}>
                        {weatherText} </Typography>
                    <span className={Styles.ImageHolder}>
                        <img src={image}
                            width="70px"
                            height="70px" className={Styles.image}></img>
                    </span>
                    <Typography variant="body2"
                        style={
                            {
                                display: "inline-block",
                                verticalAlign: "top",
                                marginLeft: "20px",
                                marginTop: "20px",
                                position:"relative",
                                left:"120px",
                                top:"8px"
                            }
                           
                     }  className={Styles.TempPanel}>
                        <span style={
                            {
                                fontSize: '24px',
                                fontWeight: 'bolder'
                            }
                        } className={Styles.Temperature}>
                            {temp}&deg;</span>
                        <input id="Fdeg" type="radio" aria-label="Fdeg"
                            onClick={
                                () => props.unitChange("F")
                            }
                            defaultChecked={
                                !props.metric
                            }
                            aria-checked={
                                !props.metric
                            }/>
                        <label forhtml="Fdeg">Metric
                        </label>
                        <input id="Cdeg" type="radio" aria-label="Cdeg"
                            onClick={
                                () => props.unitChange("C")
                            }
                            defaultChecked={
                                props.metric
                            }
                            aria-checked={
                                props.metric
                            }/><label forhtml="Cdeg">Imperial</label>
                    </Typography>
                </div>
                <div width="50%"
                    style={
                        {display: 'inline-block',position:'absolute',left:'18px',top:'80px'} 
                }   >
                    <p style={
                        {
                            margin: '0px',
                            fontWeight: 'lighter',
                            fontSize: '15px',
                            position:'relative',
                            top:'30px',
                            fontWeight:'400',
                            color: 'rgba(0, 0, 0, 0.6)'
                        }
                    } className={Styles.parameters} >Precipitation : {rain}</p>
                    <p style={
                        {
                            margin: '0px',
                            fontWeight: 'lighter',
                            fontSize: '15px',
                            position:'relative',
                            top:'30px',
                            fontWeight:'400',
                            color: 'rgba(0, 0, 0, 0.6)',
                            left:'-7px'
                        }
                    } className={Styles.parameters} >Humidity : {humidity}%</p>
                    <p style={
                        {
                            margin: '0px',
                            fontWeight:'lighter',
                            fontSize: '15px',
                            position:'relative',
                            top:'30px',
                            fontWeight:'400',
                            color: 'rgba(0, 0, 0, 0.6)',
                            left:'-5px'
                        }
                    } className={Styles.parameters} >Wind : {wind}</p>
                </div>
            </CardContent>

        </React.Fragment>
    );


    return (
        <Box sx={
                {minWidth: 275}
            }
            className={
                Styles.Box
        } style={{height:'200px'}}>
            <Card variant="outlined" style={{height:'200px'}}>
                {card}</Card>
        </Box>
    );
})
