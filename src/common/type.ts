export type TObject = {
  message_id: string
  timestamp: string
  location: {
    id: string
    lat: number
    lon: number
    alt: number
    description: string
  }
  specs: {
    description: string
    camera: {
      id: string
      type: string
    }
  }
  number_of_objects: number
  object_list: Array<{
    Human?: {
      id: string
      gender: string
      age: string
      bbox: {
        topleftx: number
        toplefty: number
        bottomrightx: number
        bottomrighty: number
      }
      image_URL?: string
    }
    Vehicle?: {
      id: string
      type: string
      brand: string
      color: string
      Licence: string
      bbox: {
        topleftx: number
        toplefty: number
        bottomrightx: number
        bottomrighty: number
      }
      image_URL?: string
    }
  }>
  number_of_events: number
  event_list: Array<{
    human_event?: {
      object_id: string
      action: string
      video_URL: string
    }
    vehicle_event?: {
      object_id: string
      action: string
      video_URL: string
    }
  }>
}

export type TNotification = {
  message_id: string
  timestamp: string
  location: {
    id: string
    lat: number
    lon: number
    alt: number
    description: string
  }
  CAT: string
  payload: string
  external_messages: Array<{
    type: 'object' | 'sensor'
    message_id: string
  }>
}

export type TSensor = {
  message_id: string
  timestamp: string
  location: {
    id: string
    lat: number
    lon: number
    alt: number
    description: string
  }
  number_of_sensors: number
  sensor_list: Array<{
    id: string
    name: string
    description: string
    unit: string
    payload: number | number[] | number[][]
  }>
}
