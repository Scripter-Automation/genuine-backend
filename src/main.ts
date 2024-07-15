import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"
import { apps, credential, app } from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app'

async function bootstrap() {
  if(!apps.length){
    const config =  JSON.parse(process.env.firebase_config as string)
    
    initializeApp({

      credential: credential.cert({
        privateKey:config['private_key'],
        projectId:config['project_id'],
        clientEmail:config['client_email'],
      }),
      
      
    });
  }
  const app = await NestFactory.create(AppModule,{
   cors:{
     origin:"http://localhost:4200",
     credentials:true
   }
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
