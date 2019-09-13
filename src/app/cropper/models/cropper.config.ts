export class CropperConfig
{
    width: number;
    height: number;
    cropWidth: number;
    cropHeight: number;
    imageUrl: string;
    imageBase64: string;


    constructor() {}

  public static fromSelf(pConfig: any): CropperConfig {
    let config = <CropperConfig>pConfig;

    let instance = new CropperConfig();
    instance = Object.assign(instance, config);

    return instance;
  }

}