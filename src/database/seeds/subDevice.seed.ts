import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { SubDevice } from '../entities'

export default class InitSubDevice implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(SubDevice).save([
      {
        id: 1,
        name: 'YOLOv8_enginE',
        unit: 'RBG',
        description: 'YOLOv8_engine',
        type: 'camera',
      },
      {
        id: 2,
        name: 'PMS5004 sensor: pm1',
        unit: 'ug/m3',
        description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm1',
      },
      {
        id: 3,
        name: 'PMS5004 sensor: pm2.5',
        unit: 'ug/m3',
        description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm2.5',
      },
      {
        id: 4,
        name: 'PMS5004 sensor: pm10',
        unit: 'ug/m3',
        description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm10',
      },
      {
        id: 5,
        name: 'GUVA-S12SD sensor: uv intensity',
        unit: 'mW/cm2',
        description:
          'GUVA-S12SD sensor: UV intensity with voltage and raw digital value: uv intensity',
      },
      {
        id: 6,
        name: 'GUVA-S12SD sensor: raw digital value',
        unit: '',
        description:
          'GUVA-S12SD sensor: UV intensity with voltage and raw digital value: digital raw value',
      },
      {
        id: 7,
        name: 'GUVA-S12SD sensor: voltage',
        unit: 'volt',
        description:
          'GUVA-S12SD sensor: UV intensity with voltage and raw digital value: voltage',
      },
      {
        id: 8,
        name: 'SCD41 sensor: co2',
        unit: 'ppm',
        description: 'SCD41 sensor: CO2, temperature and humidity: co2',
      },
      {
        id: 9,
        name: 'SCD41 sensor: temperature',
        unit: 'degree C',
        description: 'SCD41 sensor: CO2, temperature and humidity: temperature',
      },
      {
        id: 10,
        name: 'SCD41 sensor: humidity',
        unit: 'percentage',
        description: 'SCD41 sensor: CO2, temperature and humidity: humidity',
      },
    ])
  }
}
