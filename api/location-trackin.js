import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export const TrackLocatiob = (data, error) => {

    if (error) {
        console.log(error);
        return;
    }
    if (data) {
        try {
            const { locations } = data;
            console.log('locations: ', +locations);
        } catch (e) {
            console.log(e);
        }
    }
  }

  export async function _handleBackGroundLocation () {
    const LOCATION_SETTINGS = {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 200,
      distanceInterval: 0,
    };
    
    var result = await TaskManager.isTaskRegisteredAsync('BACKGROUND_LOCATION_UPDATES_TASK')
    
    if(!result){
      TaskManager.defineTask('BACKGROUND_LOCATION_UPDATES_TASK',TrackLocatiob)
    }
          
  }
  //_handleBackGroundLocation();