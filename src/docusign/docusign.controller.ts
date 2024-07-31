import { Controller, Get,  Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { emitWarning } from 'process';


@Controller('docusign')
export class DocusignController {
    @Get("access_token")
    async getAccessToken(@Query("code") code:string,@Req() request:Request,@Res() response:Response){
        await this.fetchAccessToken(response,code)

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
        let acc_id= base_uri["accounts"][0]["account_id"]
        let acc_uri= base_uri["accounts"][0]["base_uri"]

        
        const embed_url = await this.get_embed_url(acc_uri,acc_id,base_uri,output['access_token'])

        response.status(200).send({url:embed_url})
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

    async get_embed_url(base_path: string, account_id: string, user_info:{[key:string]:any} ,access_token: string):Promise<string|undefined> {
        try {
            // 2. Create an envelope using the template
            const envelopeDefinition = {
                templateId: "360fba2e-b7dd-43ae-ba02-9ac9b562a1ea",
                status:"sent"
              }
      
            let res = await fetch(`${base_path}/restapi/v2.1/accounts/${account_id}/envelopes`, {
              method: "POST",
              headers: {
                "Authorization": "Bearer " + access_token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(envelopeDefinition),
            });
      
            const envelope = await res.json()

            const viewRequest = {
              returnUrl:"https://localhost:4200/Signing",
              authenticationMethod:"HTTPBasicAuth",
              email:user_info.email,
              userName:user_info.name,
              clientUserId:user_info.clientUserId

            }
           res = await fetch(`${base_path}/restapi/v2.1/accounts/${account_id}/envelopes/${envelope.envelopeId}/views/recipient`,{
            method:"POST",
            headers:{
              "Authorization": "Bearer " + access_token,
              "Content-Type": "application/json",
            },
            body:JSON.stringify(viewRequest)
           })

           let url = await res.json()
           return url.url

        } catch (error) {
          console.error("Error:", error);
        }
      }
}
