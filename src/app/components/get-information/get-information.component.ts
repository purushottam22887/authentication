import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-get-information',
  templateUrl: './get-information.component.html',
  styleUrls: ['./get-information.component.scss']
})
export class GetInformationComponent implements OnInit {
  email: any;
  deviceInfo: any;
  deviceHash : string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;
  encPassword: string = "APIKEY";
  decPassword: string = "APIKEY";
  signature: { deviceHash: string; userInfo: { email: any; }; };

  constructor(private deviceService: DeviceDetectorService) {

  }

  ngOnInit() {
  }

  onSubmit(email) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceInfo['email'] = email;
    this.deviceHash = this.encryption(JSON.stringify(this.deviceInfo),"encrypt");
    this.deviceInfo['deviceHash'] = this.deviceHash;
    this.deviceInfo['deviceHashDecrypt'] = JSON.parse(this.encryption(this.deviceHash,"decrypt"));
    this.signature = {
      deviceHash :this.deviceHash,
      userInfo:{
        email:email
      }
    }
    console.log(">>", this.deviceInfo);
  }

  encryption(text: string, conversion: string) {
    let response = "";
    if (conversion == "encrypt") {
      response = CryptoJS.AES.encrypt(text.trim(), this.encPassword.trim()).toString();
    }
    else {
      response = CryptoJS.AES.decrypt(text.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
    }
    return response;
  }

}
