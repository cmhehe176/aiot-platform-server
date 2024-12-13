export class getNotificationDto {
  page?: number
  limit?: number
  q?: string
  start?: Date | string
  end?: Date | string
  device_id: number
  project_id: number
}
