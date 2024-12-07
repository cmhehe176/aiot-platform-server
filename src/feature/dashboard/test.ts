export const test = {
  allDevice: [
    {
      id: 1,
      name: 'device 1',
      projectId: 1,
      objectCount: 27,
      sensorCount: 24,
      notificationCount: 24,
    },
    {
      id: 2,
      name: 'device 2',
      projectId: 2,
      objectCount: 15,
      sensorCount: 15,
      notificationCount: 16,
    },
    {
      id: 3,
      name: 'device 3',
      projectId: 3,
      objectCount: 11,
      sensorCount: 11,
      notificationCount: 10,
    },
  ],
  statusDevice: {
    active: 4,
    inActive: 6,
    total: 10,
  },
  objectChart: [
    {
      id: 1,
      device: 'device 1',
      human: 29,
      vehicle: 20,
      all: 12,
    },
    {
      id: 2,
      device: 'device 2',
      human: 29,
      vehicle: 20,
      all: 12,
    },
  ],
  notificationChart: [
    {
      id: 1,
      device: 'device 1',
      object: 20,
      sensor: 12,
      all: 22,
    },
    {
      id: 1,
      device: 'device 1',
      object: 29,
      sensor: 20,
      all: 12,
    },
  ],
}
