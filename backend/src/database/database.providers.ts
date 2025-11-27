import * as mongoose from 'mongoose'

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://tfm_user:tfm_password@tfm.0kaixhz.mongodb.net/?appName=TFMnest ',
      ),
  },
]
