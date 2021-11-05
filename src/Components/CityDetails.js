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
                    <Typography data-testid="city" variant="h5" component="div">
                        {selectedCity}</Typography>
                    <span>
                        <input list="cities" name="city" id="city"
                            onBlur={cityChange}/>
                        <datalist id="cities">
                            {options} </datalist>

                    </span>
                    <Typography sx={
                            {mb: 1.5}
                        }
                        color="text.secondary">
                        {
                        new Date().toString().split(' ')[0]
                    },{
                        MonthName(month)
                    }
                        {date}
                        {
                        suffix(date)
                    } </Typography>
                    <Typography variant="body2">
                        {weatherText} </Typography>
                    <span>
                        <img src={image}
                            width="70px"
                            height="70px"></img>
                    </span>
                    <Typography variant="body2"
                        style={
                            {
                                display: "inline-block",
                                verticalAlign: "top",
                                marginLeft: "20px",
                                marginTop: "20px"
                            }
                    }>
                        <span style={
                            {
                                fontSize: '24px',
                                fontWeight: 'bolder'
                            }
                        }>
                            {temp} </span>
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
                        <label forhtml="Fdeg">&deg;F
                        </label>
                        <span>|</span>
                        <input id="Cdeg" type="radio" aria-label="Cdeg"
                            onClick={
                                () => props.unitChange("C")
                            }
                            defaultChecked={
                                props.metric
                            }
                            aria-checked={
                                props.metric
                            }/><label forhtml="Cdeg">&deg;C</label>
                    </Typography>
                </div>
                <div width="50%"
                    style={
                        {display: 'inline-block'}
                }>
                    <p style={
                        {
                            margin: '0px',
                            fontWeight: 'lighter',
                            fontSize: '16px'
                        }
                    }>Precipitation : {rain}</p>
                    <p style={
                        {
                            margin: '0px',
                            fontWeight: 'lighter',
                            fontSize: '16px'
                        }
                    }>Humidity : {humidity}%</p>
                    <p style={
                        {
                            margin: '0px',
                            fontWeight: 'lighter',
                            fontSize: '16px'
                        }
                    }>Wind : {wind}</p>
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
        }>
            <Card variant="outlined">
                {card}</Card>
        </Box>
    );
})
