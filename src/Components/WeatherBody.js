import React, {useState, useEffect} from 'react'
import Styles from '../Styles/WeatherBody.module.css'
import 'regenerator-runtime/runtime'
import {DailyReport} from './DailyReport'
import {CityDetails} from './CityDetails'
import "isomorphic-fetch"
export const WeatherBody = () => {

    const [localKey, setlocalKey] = useState()
    let [val, setVal] = useState()
    let [latitude, setlatitude] = useState()
    let [longitude, setlongitude] = useState()
    let [city, setcity] = useState()
    let [metric, setmetric] = useState(false)
    let unitChange = (unit) => {

        if (unit === 'C') {
            setmetric(true)
            document.getElementById("Fdeg").checked = false
        } else {
            setmetric(false)
            document.getElementById("Cdeg").checked = false
        }
    }
    useEffect(() => {

        let fetchData = async () => {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("position.coords is " + position.coords.latitude + position.coords.longitude)
                setlatitude(position.coords.latitude)
                setlongitude(position.coords.longitude)
            })
            debugger
            try {

                let data = await fetch(`http://dataservice.accuweather.com/locations/v1/topcities/50/?apikey=${
                    encodeURIComponent(process.env.REACT_APP_API_KEY)
                }`, {method: 'GET'})
                let response = await data.json();

                (response.map(item => {

                    if (latitude > 0 && longitude > 0) {

                        if (Math.floor(item.GeoPosition.Latitude) == Math.floor(latitude) && Math.floor(item.GeoPosition.Longitude) == Math.floor(longitude)) {
                            setlocalKey(item.Key)

                            setcity(item.LocalizedName)
                        }
                    }

                }))
            } catch (error) {
                console.log(error)
            }

            return(() => {
                setlocalKey()
                setcity()
            })
        } 
        fetchData()
    })
    let setValue = (value) => {
        setVal(value)

    }
    return (
        <> {
            console.log("city and localkey are " + city + " " + localKey)
        }
            {
            city && localKey > 0 && <div className={
                Styles.mainDiv
            }>
                <CityDetails city={city}
                    localKey={localKey}
                    onChange={setValue}
                    metric={metric}
                    unitChange={unitChange}/>
                <DailyReport localKey={localKey}

                    val={val}
                    metric={metric}
                    unitChange={unitChange}/>
            </div>
        } </>
    )


}
