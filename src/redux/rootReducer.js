import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth/authSlice";
import projectReducer from "./slices/project/projectSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
});

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

export { rootReducer as default, rootPersistConfig };

