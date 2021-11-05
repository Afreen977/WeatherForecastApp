import {rest} from 'msw'
import 'regenerator-runtime/runtime'
export const handlers = [
    rest.get(`http://dataservice.accuweather.com/locations/v1/topcities/50/`, async (req, res, ctx) => {
        const query = req.url.searchParams
        const apiKey = query.get("apiKey")
        return await res(ctx.json([
            {
                Key: 206690,
                LocalizedName: 'Kolkata',
                GeoPosition: {
                    Latitude: 22.5001701,
                    Longitude: 88.4071865
                }
            }, {
                Key: 28143,
                LocalizedName: 'Dhaka',
                GeoPosition: {
                    Latitude: 23.71,
                    Longitude: 90.407
                }
            }
        ]))
    }),
    rest.get(`http://dataservice.accuweather.com/currentconditions/v1/:cityKey`, async (req, res, ctx) => {
        req.params

        const query = req.url.searchParams
        const apiKey = query.get("apiKey")

        return await res(ctx.json([{
                Temperature: {
                    Metric: {
                        Value: 88,
                        Unit: 'C'
                    },
                    Imperial: {
                        Value: 31.1,
                        Unit: 'F'
                    }
                },

                Wind: {
                    Speed: {
                        Metric: {
                            Value: 6.9,
                            Unit: 'km/h'
                        },
                        Imperial: {
                            Value: 11.1,
                            Unit: 'mi/h'
                        }
                    }
                },
                RelativeHumidity: 45,
                WeatherText: 'Mostly Sunny',
                PrecipitationSummary: {
                    Precipitation: {
                        Metric: {
                            Value: 0,
                            Unit: 'mm'
                        },
                        Imperial: {
                            Value: 0,
                            Unit: 'in'
                        }
                    }
                }

            }]))
    }),
    rest.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/:Days`, async (req, res, ctx) => {
        const query = req.url.searchParams
        const apiKey = query.get("apiKey")
        const details = query.get("details")
        const metric = query.get("metric")
        return await res(ctx.json({
            DailyForecasts: [
                {
                    Day: {
                        IconPhrase: 'Overcast'
                    },
                    Temperature: {
                        Maximum: {
                            Value: 20
                        },
                        Minimum: {
                            Value: 15
                        }
                    }
                },
                {
                    Day: {
                        IconPhrase: 'Overcast'
                    },
                    Temperature: {
                        Maximum: {
                            Value: 20
                        },
                        Minimum: {
                            Value: 15
                        }
                    }
                },
                {
                    Day: {
                        IconPhrase: 'Overcast'
                    },
                    Temperature: {
                        Maximum: {
                            Value: 20
                        },
                        Minimum: {
                            Value: 15
                        }
                    }
                },
                {
                    Day: {
                        IconPhrase: 'Overcast'
                    },
                    Temperature: {
                        Maximum: {
                            Value: 20
                        },
                        Minimum: {
                            Value: 15
                        }
                    }
                }, {
                    Day: {
                        IconPhrase: 'Overcast'
                    },
                    Temperature: {
                        Maximum: {
                            Value: 20
                        },
                        Minimum: {
                            Value: 15
                        }
                    }
                }
            ]
        }))
    })
]
