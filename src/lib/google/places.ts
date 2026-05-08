import { Client, PlaceDetailsRequest } from "@googlemaps/google-maps-services-js"

const client = new Client({})

export async function getPlaceDetails(placeId: string) {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_API_KEY!,
        fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'reviews', 'photos']
      }
    })

    return response.data.result
  } catch (error) {
    console.error('Error fetching Google Place details:', error)
    throw error
  }
}

export async function searchPlaces(query: string) {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input: query,
        key: process.env.GOOGLE_PLACES_API_KEY!,
        types: 'establishment' as any
      }
    })

    return response.data.predictions
  } catch (error) {
    console.error('Error searching Google Places:', error)
    throw error
  }
}
