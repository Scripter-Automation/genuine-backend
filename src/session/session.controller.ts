import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SessionGuard } from './session.guard';
import { Request, Response } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('session')
export class SessionController {
    constructor(private firebase_service:FirebaseService){}

    @Post("create")
    @UseGuards(SessionGuard)
    async create(@Req() request: Request, @Res() response: Response) {
        // Get the authorization header from the request
        const authorizationHeader = request.headers.authorization;
        response.cookie("access_token",authorizationHeader)
        const profile = await this.firebase_service.getUserProfile()
        console.log("Profile",profile) 

        response.status(200).send({profile:profile})

    }
}
