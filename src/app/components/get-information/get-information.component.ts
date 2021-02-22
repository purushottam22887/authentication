import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-get-information',
  templateUrl: './get-information.component.html',
  styleUrls: ['./get-information.component.scss']
})
export class GetInformationComponent implements OnInit {
  email: any;
  deviceInfo: any;
  deviceHash: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;
  encPassword: string = "APIKEY";
  decPassword: string = "APIKEY";
  signature: { deviceHash: string; userInfo: { email: any; }; };

  constructor(private deviceService: DeviceDetectorService, private cookieService: CookieService) {

  }

  ngOnInit() {
  }

  onSubmit(email) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceInfo['email'] = email;
    this.deviceHash = this.encryption(JSON.stringify(this.deviceInfo), "encrypt");
    this.deviceInfo['deviceHash'] = this.deviceHash;
    this.deviceInfo['deviceHashDecrypt'] = JSON.parse(this.encryption(this.deviceHash, "decrypt"));
    this.signature = {
      deviceHash: this.deviceHash,
      userInfo: {
        email: email
      }
    }
    this.cookieService.set("signature", this.deviceHash,0.1);
    this.setCookie('sign', this.deviceHash, 1);
    // this.cookieService.set("sign", this.deviceHash, 1);
    console.log(">>", this.deviceInfo);
  }

  setCookie(cname, cvalue, exdays, option = 'minuts') {
    var d = new Date();
    let exp;
    switch (option) {
      case 'hours': exp = (exdays * 60 * 1000); break;
      case 'days': exp = (exdays * 24 * 60 * 60 * 1000); break;
      case 'minuts': exp = (exdays * 1000); break;
      default: exp = (exdays * 60 * 1000);
    }
    d.setTime(d.getTime() + exp);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  cookie:any;
  cookieName:any;
  getCookieValue = (name)=>{
    this.cookie = this.getCookie(name);
    // this.cookie = this.cookieService.get(name);
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
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
