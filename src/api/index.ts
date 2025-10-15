// Client exports
export { client, unauthenticatedClient } from './client'
export type { ErrorInfo, Pagination, ApiResponse } from './client'

// Auth exports
export { getCsrf, login, refreshToken, logout } from './auth'

// User exports
export { getUsers, createUser, getUserProfile, updateProfile } from './users'
export type { User } from './users'

// Role exports
export {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
} from './roles'
export type { Role } from './roles'

// Division exports
export {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from './divisions'
export type {
  Division,
  CreateDivisionRequest,
  UpdateDivisionRequest,
} from './divisions'

// Letter exports
export {
  getLetters,
  createLetter,
  getLetterById,
  addNote,
  assignDivision,
  assignUser,
  acceptLetter,
} from './letters'
export type {
  SenderDetails,
  ReceiverDetails,
  Attachment,
  ChangeStatusEventDetails,
  AddNoteEventDetails,
  LetterEvent,
  Letter,
  GetLettersParams,
} from './letters'
