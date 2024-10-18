import { config } from "./config";
import Smartcar from '@smartcar/auth';


const getPermissions = () => {
    const combinedPermissions =
      config.vehicleProperties
      .concat(config.requiredVehicleProperties)
      .filter((property) => property.permission)
      .map((property) => property.permission);
    const permissions = [...new Set(combinedPermissions)];
    return permissions;
  };
  

export const initSmartcar = (onComplete)=>{
    return new Smartcar({
        clientId: '3a6fe83a-2a9a-4f64-8ac8-08391d4a21af',
        redirectUri: "https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:5173",
        // set scope of permissions: https://smartcar.com/docs/api/#permissions
        scope: getPermissions(),
        mode: config.mode, // one of ['live', 'simulated']
        onComplete:onComplete
    });
}

export const authorize = (smartcar) =>{
        smartcar.openDialog({
        forcePrompt: true,
        // bypass car brand selection screen: https://smartcar.com/docs/api#brand-select
        vehicleInfo: {
        make: config.brandSelect,
        },
        // only allow users to authenticate ONE vehicle
        singleSelect: config.singleSelect,
    })
}