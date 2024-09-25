export class createProjectDto {
  name: string;
  userIds?: number[];
  description: string;
}

export class updateProjectDto {
  projectId: number;
  name: string;
  userIds?: number[];
  description: string;
}
