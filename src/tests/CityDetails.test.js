import {screen, render, waitFor} from "@testing-library/react";
import React from 'react'
import {server} from '../handlers/server'
import {rest} from 'msw'
import {App} from '../App'
import {CityDetails} from "../Components/CityDetails";
import {WeatherBody} from "../Components/WeatherBody";
import {fireEvent} from "@testing-library/dom";
import 'regenerator-runtime/runtime'
import {delay} from "lodash";
import userEvent from '@testing-library/user-event'

describe("CityDetails component", () => {

    server.resetHandlers(rest.get('http://dataservice.accuweather.com/locations/v1/topcities/50', (req, res, ctx) => {
        const query = req.url.searchParams
        const apiKey = query.get("apiKey")
        return res(ctx.json([{
                Key: 206690,
                LocalizedName: 'Kolkata',
                GeoPosition: {
                    Latitude: 22.5001701,
                    Longitude: 88.4071865
                }
            }]))

    }))
    it("should show correct cityName", async () => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn().mockImplementationOnce((success) => Promise.resolve(success({
                coords: {
                    latitude: 22.5001701,
                    longitude: 88.4071865
                }
            })))
        };
        global.navigator.geolocation = mockGeolocation;

        render (
            <WeatherBody/>)

        await waitFor(() => {
            let city = screen.getByTestId("city")

            expect(city.innerHTML).toBe('Kolkata')
        }, {timeout: 3000})


    })
    it('should show C and F units on loading page', async () => {
        render (
            <CityDetails city="Kolkata" localKey="206690"
                metric={false}/>
        )

        let CRadio = await screen.findByRole('radio', {name: 'Cdeg'})
        let FRadio = await screen.findByRole('radio', {name: 'Fdeg'})
        console.log("FRadio in previous test is " + FRadio)
        expect(CRadio).toBeInTheDocument()
        expect(FRadio).toBeInTheDocument()


    })
    it('F should be checked by default', async () => {
        render (
            <CityDetails city="Kolkata" localKey="206690"
                metric={false}/>
        )

        let FRadio = await screen.findByRole('radio', {
            name: 'Fdeg',
            checked: true
        })

        expect(FRadio).toBeInTheDocument()


    })
    it('should show proper imperial units on page loading', async () => {
        render (
            <CityDetails city="Kolkata" localKey="206690"
                metric={false}/>
        )
        let speedUnit = await screen.findByText('Wind : 11.1mi/h')
        let precipitationUnit = await screen.findByText('Precipitation : 0in')

        expect(speedUnit).toBeVisible()
        expect(precipitationUnit).toBeVisible()
    })
    it('should change the units on changing it to C', async () => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn().mockImplementationOnce((success) => Promise.resolve(success({
                coords: {
                    latitude: 22.5001701,
                    longitude: 88.4071865
                }
            })))
        };
        global.navigator.geolocation = mockGeolocation;
        render (
            <WeatherBody/>)
        await waitFor(() => {
            let CRadio = screen.getByRole('radio', {name: 'Cdeg'})

            userEvent.click(CRadio)
            jest.setTimeout(3000)
            let speedUnit = screen.getByText('Wind : 6.9km/h')
            let precipitationUnit = screen.getByText('Precipitation : 0mm')

            expect(speedUnit).toBeVisible()
            expect(precipitationUnit).toBeVisible()
        }, {timeout: 1000})

    })
    it('should show cities in the dropdown', async () => {
        render (
            <CityDetails city="Kolkata" localKey="206690"
                metric={false}/>
        )
        await waitFor(() => {
            let cities = screen.getAllByTestId("cityNames")

            let cityNames = cities.map(city => {
                return city.innerHTML
            }, {timeout: 1000})

            expect(cityNames).toEqual(['Kolkata', 'Dhaka'])
        })

    })
})
