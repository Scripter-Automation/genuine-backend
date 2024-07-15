import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocusignController } from './docusign/docusign.controller';
import { DatabaseModule } from './database/database.module';
import { FirebaseService } from './firebase/firebase.service';
import { SessionController } from './session/session.controller';


@Module({
  imports: [ConfigModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [AppController, DocusignController, SessionController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
