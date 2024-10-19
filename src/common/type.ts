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

export type QueueDetails = {
  consumer_details: Array<{
    arguments: Record<string, any>
    channel_details: {
      connection_name: string
      name: string
      node: string
      number: number
      peer_host: string
      peer_port: number
      user: string
    }
    ack_required: boolean
    active: boolean
    activity_status: string
    consumer_tag: string
    consumer_timeout: number
    exclusive: boolean
    prefetch_count: number
    queue: {
      name: string
      vhost: string
    }
  }>
  arguments: Record<string, any>
  auto_delete: boolean
  consumer_capacity: number
  consumer_utilisation: number
  consumers: number
  deliveries: any[]
  durable: boolean
  effective_policy_definition: {
    expires: number
    'max-length': number
    'queue-mode': string
    'queue-version': number
  }
  exclusive: boolean
  exclusive_consumer_tag: string | null
  garbage_collection: {
    fullsweep_after: number
    max_heap_size: number
    min_bin_vheap_size: number
    min_heap_size: number
    minor_gcs: number
  }
  head_message_timestamp: string | null
  idle_since: string
  incoming: any[]
  memory: number
  message_bytes: number
  message_bytes_paged_out: number
  message_bytes_persistent: number
  message_bytes_ram: number
  message_bytes_ready: number
  message_bytes_unacknowledged: number
  messages: number
  messages_details: {
    rate: number
  }
  messages_paged_out: number
  messages_persistent: number
  messages_ram: number
  messages_ready: number
  messages_ready_details: {
    rate: number
  }
  messages_ready_ram: number
  messages_unacknowledged: number
  messages_unacknowledged_details: {
    rate: number
  }
  messages_unacknowledged_ram: number
  name: string
  node: string
  operator_policy: string
  policy: string
  recoverable_slaves: string | null
  reductions: number
  reductions_details: {
    rate: number
  }
  single_active_consumer_tag: string | null
  state: string
  storage_version: number
  type: string
  vhost: string
}

export type QueueInfo = {
  arguments: Record<string, any>
  auto_delete: boolean
  consumer_capacity: number
  consumer_utilisation: number
  consumers: number
  durable: boolean
  effective_policy_definition: {
    expires: number
    'max-length': number
    'queue-mode': string
    'queue-version': number
  }
  exclusive: boolean
  memory: number
  message_bytes: number
  message_bytes_paged_out: number
  message_bytes_persistent: number
  message_bytes_ram: number
  message_bytes_ready: number
  message_bytes_unacknowledged: number
  messages: number
  messages_details: {
    rate: number
  }
  messages_paged_out: number
  messages_persistent: number
  messages_ram: number
  messages_ready: number
  messages_ready_details: {
    rate: number
  }
  messages_ready_ram: number
  messages_unacknowledged: number
  messages_unacknowledged_details: {
    rate: number
  }
  messages_unacknowledged_ram: number
  name: string
  node: string
  operator_policy: string
  policy: string
  reductions: number
  reductions_details: {
    rate: number
  }
  state: string
  storage_version: number
  type: string
  vhost: string
}
