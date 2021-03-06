import { Mongo } from 'meteor/mongo';
import { Rides, Airports } from './collections.js';

Meteor.methods(
  {
    'rides.create'(newRide) {
      // TODO: validate args
      if(Meteor.isServer){
        { // doc enrichment
          // TODO: poor algorithm
          newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000)); // TODO: it should generate at the server (as method?)
        }
      }
      if (validateRide(newRide)) {
          // if(Rides.find().fetch().map((i) => i.bkn_ref === newRide.bkn_ref)){        //check bkn_ref before Ride.insert
        Rides.insert(newRide,
          (err, res) => {
            if(err){
              while(err.code===11000){                                                  //maybe another code of error?      
                newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000))
                Rides.insert(newRide)
              }
            }else{
              //"sucess"
            }
          });
      }else{
        throw new Meteor.Error("rides.create.invalidRide", "Invalid ride");
      }
    },
    'rides.delete'(rideId) {
      // TODO: validate ride
      Rides.remove(rideId);
    },
    'rides.update'(ride) {
      if (validateRide(ride)) {
         Rides.update({_id: ride._id}, ride);
      } else {
        throw new Meteor.Error("rides.update.invalidRide", "Invalid ride");
      }
    }
  },
);

function validateRide(ride) {
  // TODO: _id, bkn_ref
  return ride.name
    && ride.phone
    && ride.datetime && ride.datetime.unix
    && ride.from
    && ride.to && ride.to._id && ride.to.name;
}
