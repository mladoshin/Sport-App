import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {themeReducer} from './themeReducer'
import {goalsReducer} from './goalsReducer'
import { categoryReducer } from './categoryReducer'
import { avatarReducer } from './avatarReducer'
import { notificationReducer } from './notificationReducer'
import { isTouchableReducer } from './isTouchableReducer'
import { userPreferencesReducer } from "./userPreferencesReducer"

export const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  goals: goalsReducer,
  goalCategories: categoryReducer,
  userAvatar: avatarReducer,
  notifications: notificationReducer,
  isTouchable: isTouchableReducer,
  userPreferences: userPreferencesReducer
})