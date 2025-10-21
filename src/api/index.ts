// Client exports
export { client, unauthenticatedClient } from './client'
export type { ErrorInfo, Pagination, ApiResponse } from './client'

// Auth exports
export { getCsrf, login, refreshToken, logout } from './auth'

// User exports
export {
  getUsers,
  createUser,
  updateUser,
  getUserProfile,
  updateProfile,
  accountSetup,
} from './users'
export type { User } from './users'

// Role exports
export { getRoles, createRole, updateRole, deleteRole } from './roles'
export type { Role } from './roles'

// Permission exports
export { getPermissions } from './permissions'
export type { Permission, PermissionCategory } from './permissions'

// Division exports
export {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from './divisions'
export type { Division } from './divisions'

// Letter exports
export {
  getLetters,
  createLetter,
  getLetterById,
  addNote,
  updateLetter,
  assignDivision,
  assignUser,
  returnFromDivision,
  returnFromUser,
  acceptLetter,
} from './letters'
export type {
  SenderDetails,
  ReceiverDetails,
  Attachment,
  ChangeStatusEventDetails,
  AddNoteEventDetails,
  ChangePriorityEventDetails,
  UpdateLetterEventDetails,
  LetterEvent,
  Letter,
  GetLettersParams,
} from './letters'

export {
  getCabinetPapers,
  createCabinetPaper,
  getCabinetPaperById,
  updateCabinetPaper,
  deleteCabinetPaper,
} from './cabinet-papers'
export type { CabinetPaper, CabinetPaperCategory } from './cabinet-papers'

// Cabinet Categories Exports
export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories'
export type { Category, CategoryFormData } from './categories'

// Dashboard exports
export { getDashboardStats } from './dashboard'
export type {
  DashboardStats,
  UserStats,
  LetterStats,
  CabinetPaperStats,
  DivisionStats,
  RoleStats,
} from './dashboard'
