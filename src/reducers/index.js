import { combineReducers } from "redux";
import HomeReducer from "./HomeReducer";
import LocationsReducer from "./LocationsReducer";
import BlogsReducer from "./BlogsReducer";
import BlogReducer from "./BlogReducer";
import MediaPlanningReducer from "./MediaPlanningReducer";
import LoginReducer from "./LoginReducer";
import SignupReducer from "./SignupReducer";
import LocationReducer from "./LocationReducer";
import BookingReducer from "./BookingReducer";
import ContactUsReducer from "./ContactUsReducer";
import ProfileReducer from "./ProfileReducer";
import BrandingReducer from "./BrandingReducer";
import PaymentReducer from "./PaymentReducer";

export default combineReducers({
  home: HomeReducer,
  locations: LocationsReducer,
  blogs: BlogsReducer,
  blog: BlogReducer,
  mediaplanning: MediaPlanningReducer,
  login: LoginReducer,
  signup: SignupReducer,
  location: LocationReducer,
  booking: BookingReducer,
  contactus: ContactUsReducer,
  profile: ProfileReducer,
  branding: BrandingReducer,
  paymentType: PaymentReducer,
});
