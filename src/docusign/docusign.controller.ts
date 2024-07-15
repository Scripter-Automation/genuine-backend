import { Controller, Get,  Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';


@Controller('docusign')
export class DocusignController {
    @Get("access_token")
    async getAccessToken(@Query("code") code:string,@Req() request:Request,@Res() response:Response){
        const access_token = request.cookies['access_token']
        const base_uri = request.cookies['base_uri']
        if(!access_token||!base_uri){
            await this.fetchAccessToken(response,code)
        }
    }

    async fetchAccessToken(@Res() response:Response,code:string) {

        const auth_header = "Basic "+btoa(process.env.Docusing_Integration_Key+":"+process.env.Docusign_Auth_Secret);
        //Cambiar a este url para produccion https://account.docusign.com/oauth/token
       let res= await fetch('https://account-d.docusign.com/oauth/token',{
            method: 'POST',
            headers: {
                "Authorization":auth_header,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:`grant_type=authorization_code&code=${code}`
                  
        })
        const output = await res.json()
        //Save the output of the access token fetch to a cookie
        response.cookie("access_token",output,{httpOnly:true,secure:true,maxAge:output['expires_in']})
        const base_uri = await this.get_user_base_URI(output['access_token'])
        response.cookie("base_uri",base_uri,{httpOnly:true,secure:true,maxAge:output['expires_in']})
    }

    async get_user_base_URI(access_token:string){
        let res = await fetch('https://account-d.docusign.com/oauth/userinfo',{
            method: 'GET',
            headers: {
                "Authorization": "Bearer "+access_token,
                
            }
        })
        return await res.json();
    }   

}
