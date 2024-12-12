export class createProjectDto {
  name: string
  userIds?: number[]
  description: string
  deviceIds: number[]
}

export class updateProjectDto {
  name?: string
  userIds?: number[]
  description?: string
}
