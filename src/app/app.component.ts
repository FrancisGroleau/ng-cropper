import { Component } from '@angular/core';
import { CropperConfig } from './cropper/models/cropper.config';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

  private _config: CropperConfig;
  private _uploaded: boolean = false;

  constructor()
  {
    this._config = CropperConfig.fromSelf({
            width: 652,
            height: 314,
            cropWidth: 200,
            cropHeight: 200
    });

  }

 
  processFile(files) {
  
    if (files.length === 0)
      return;
 
    var reader = new FileReader();
    let imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      let imgBase64 = reader.result;
      //console.log(imgBase64);
      this._config.imageBase64 = imgBase64;
      this._uploaded = true;

    }
  }
  

}


