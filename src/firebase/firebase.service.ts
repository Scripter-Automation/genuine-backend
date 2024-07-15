import { Injectable } from '@nestjs/common';
import { app, auth} from 'firebase-admin';
import { getFirestore , } from "firebase-admin/firestore"
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class FirebaseService {
  user:DecodedIdToken;
  fireStore:FirebaseFirestore.Firestore

  constructor() {
    this.fireStore = getFirestore();
  }


  public async verify_user(token:string):Promise<boolean>{
    let ret_val:boolean=false;
    await auth().verifyIdToken(token,true).then((decoded_token:DecodedIdToken)=>{
      this.user=decoded_token;
      ret_val=true;
    });
    return ret_val;
  }

  public async getUserProfile(){
    try{
      let profile=null;
      await this.fireStore.collection("users").where("uid", "==", this.user.uid).get().then((query_snapshot)=>{
        profile = query_snapshot.docs[0].data();
      });
      return profile
    }catch(error){
      console.error(error)
      return null;
    }

  }


}
