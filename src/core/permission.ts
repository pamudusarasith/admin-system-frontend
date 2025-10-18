/*
  Permission enum representing various user permissions in the system.
  Formatted as 'resource:[scope]:action:[extra]'.
*/
export enum Permission {
  // Read letter
  letterAllRead = 'letter:all:read',
  letterUnassignedRead = 'letter:unassigned:read',
  letterDivisionRead = 'letter:division:read',

  // Create letter
  letterCreate = 'letter:create',

  // Update letter details
  letterAllUpdate = 'letter:all:update',
  letterUnassignedUpdate = 'letter:unassigned:update',
  letterDivisionUpdate = 'letter:division:update',

  // Letter assignment
  letterAssignDivision = 'letter:assign:division',
  letterAssignUser = 'letter:assign:user',
  letterReturnFromDivision = 'letter:return:from:division',
  letterReturnFromUser = 'letter:return:from:user',

  // Change letter priority
  letterAllUpdatePriority = 'letter:all:update:priority',
  letterUnassignedUpdatePriority = 'letter:unassigned:update:priority',
  letterDivisionUpdatePriority = 'letter:division:update:priority',

  // Add letter note
  letterAllAddNote = 'letter:all:add:note',
  letterUnassignedAddNote = 'letter:unassigned:add:note',
  letterDivisionAddNote = 'letter:division:add:note',

  // Add letter attachments
  letterAllAddAttachments = 'letter:all:add:attachments',
  letterUnassignedAddAttachments = 'letter:unassigned:add:attachments',
  letterDivisionAddAttachments = 'letter:division:add:attachments',

  // Mark letters as completed
  letterAllMarkComplete = 'letter:all:markcomplete',
  letterUnassignedMarkComplete = 'letter:unassigned:markcomplete',
  letterDivisionMarkComplete = 'letter:division:markcomplete',
}
