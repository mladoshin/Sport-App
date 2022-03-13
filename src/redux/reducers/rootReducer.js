import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {themeReducer} from './themeReducer'
import {goalsReducer} from './goalsReducer'
import { categoryReducer } from './categoryReducer'
import { avatarReducer } from './avatarReducer'
import { notificationReducer } from './notificationReducer'
import { isMobileReducer } from './isMobileReducer'
import { userPreferencesReducer } from "./userPreferencesReducer"
import { userChatsReducer } from './userChatsReducer'
import { userGroupChatsReducer } from './userGroupChatsReducer'
import { userGroupsReducer } from './userGroupsReducer'

export const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  userAvatar: avatarReducer,
  notifications: notificationReducer,
  isMobile: isMobileReducer,
  userPreferences: userPreferencesReducer,
  userChats: userChatsReducer,
  userGroupChats: userGroupChatsReducer,
  userGroups: userGroupsReducer
})