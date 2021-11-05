import React, {useEffect, useState} from 'react'
import 'regenerator-runtime/runtime'
import "isomorphic-fetch"
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Styles from '../Styles/DailyReport.module.css'
import {Images} from '../Utility/Images'
import { getNextDays } from '../Utility/getNextDays';
export const DailyReport = React.forwardRef((props, ref) => {

    let date = new Date().getUTCDay()
    let image
    let unit = props.metric ? 'C' : 'F'

    let [weather, setweather] = useState([])

   
    let nextDays = getNextDays(date)
    useEffect(() => {

        let cityKey = props.val || props.localKey
      let cancel=false
        let fetchData = async () => {
            try {
           
                let data = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${
                    encodeURIComponent(cityKey)
                }?apikey=${
                    encodeURIComponent(process.env.REACT_APP_API_KEY)
                }&details=true&metric=${
                    props.metric
                }`, {method: 'GET'})
                let response = await data.json();

               if(cancel)
                   return
                else
                setweather([...response.DailyForecasts])
            } catch (error) {
                console.log(error)
            }
        } 
        fetchData()
        return(()=>cancel=true)
    }, [props.val, props.metric])
    let array = weather.map((item, key) => {
        let {IconPhrase}=item.Day
        if (IconPhrase.includes('Overcast')) {
            image = Images[0]
        } else if (IconPhrase.includes('sun')) {
            image = Images[1]

        } else if (IconPhrase.includes('cloud')) {
            image = Images[2]
        } else if ((IconPhrase.includes('rain')) && (IconPhrase.includes('shower'))) {
            image = Images[3]
        } else if (IconPhrase.includes('thunder')) {
            image = Images[4]
        } else if (IconPhrase.includes('Fog')) {
            image = Images[5]
        } else 
            image = Images[4]
        
        return (
            <>
            { nextDays.length>0 &&
            <div className={
                    Styles.card
                }
                style={
                    {
                        flexShrink: '0',
                        flexGrow: '1'
                    }
                }
                key={key}>
                <Card sx={
                    {maxWidth: 345}}  style={{height:'100%'}
                }>
                    <CardContent>
                        <Typography variant="body2" color="text.primary">
                            {
                            nextDays[key]
                        } </Typography>

                    </CardContent>
                    <CardMedia component="img" height="50"
                        image={image}
                        style={
                            {objectFit: 'scale-down'}
                        }
                        alt={
                            `image for ${
                                nextDays[key]
                            }`
                        }/>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            <span style={
                                {paddingLeft: '10px'}
                            }>
                                {
                                item.Temperature.Maximum.Value
                            }&deg;</span>
                            <span style={
                                {paddingRight: '4px'}
                            }>
                                {unit}</span>
                            <span>{
                                item.Temperature.Minimum.Value
                            }&deg;</span>
                            <span data-testid="unit">
                                {unit}</span>
                        </Typography>
                    </CardContent>


                </Card>
            </div>
                        }
            </>
        );
    })

    return <div className={
            Styles.cardHolder
        } 
        style={
            {
                display: "flex",
                flexDirection: 'row',
                fontSize: "15px",
                justifyContent: 'space-evenly'
            }
    }>
        {array}</div>
})
