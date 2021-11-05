import {screen, render, waitFor} from "@testing-library/react";
import React from 'react'
import {server} from '../handlers/server'
import {rest} from 'msw'
import {App} from '../App'
import {DailyReport} from "../Components/DailyReport";
import 'regenerator-runtime/runtime'
import {WeatherBody} from "../Components/WeatherBody";
import userEvent from '@testing-library/user-event'
describe("DailyReport component testing", () => {

    it('should show imperial values on page load', async () => {
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
            let unitsArr = screen.getAllByTestId("unit")
            console.log("unitsArr is " + unitsArr)
            unitsArr.map((unit) => {
                expect(unit.innerHTML).toBe("F")
            })

        })
    })
    it('should show correct units on changing to C', async () => {
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
            console.log("CRadio is " + CRadio)
            userEvent.click(CRadio)
            jest.setTimeout(3000)
            let unitsArr = screen.getAllByTestId("unit")
            console.log("unitsArr is " + unitsArr)
            unitsArr.map((unit) => {
                expect(unit.innerHTML).toBe("C")
            })
        })

    })

})
