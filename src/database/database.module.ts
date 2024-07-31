import { Module } from '@nestjs/common';
import * as sql from "mssql"

@Module({
    providers:[{
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            const config:sql.config = {
                user:process.env.USER,
                password:process.env.PASSWORD,
                server:process.env.SERVER as string,
                database:"genuinemx-dev"
            }

            return await sql.connect(config)
        }
    }],
    exports:["DATABASE_CONNECTION"]
})
export class DatabaseModule {}
