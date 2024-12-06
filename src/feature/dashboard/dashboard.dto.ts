export class getDashboardDto {
  page?: number
  limit?: number
  q?: string
  start?: Date | string
  end?: Date | string
  type?: string
  device_id?: number
  project_id: number
}
