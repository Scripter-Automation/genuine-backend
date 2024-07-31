import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SessionGuard } from './session.guard';
import { Request, Response } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as sql from "mssql"

class SessionBody{
    email:string
}

@Controller('session')
export class SessionController {
    constructor(private firebase_service:FirebaseService, @Inject("DATABASE_CONNECTION") private readonly dbConnection: sql.ConnectionPool){}

    @Post("create")
    @UseGuards(SessionGuard)
    async create(@Req() request: Request, @Res() response: Response) {
        // Get the authorization header from the request
        const authorizationHeader = request.headers.authorization;
        response.cookie("access_token",authorizationHeader)
        const profile = await this.firebase_service.getUserProfile() 
        console.log(profile)
        if(profile !== null){
            const pool = this.dbConnection; // Ensure connection is established
            const request = pool.request();
            request.input('email', sql.VarChar, profile["email"]);
            const result = await request.query(`SELECT * FROM inversionistas WHERE correo = @email`);
            response.status(200).send({profile:profile, db_profile:result.recordset})

        }else[
            response.status(404).send({message:"User profile not found"})
        ]


    }

    
}
