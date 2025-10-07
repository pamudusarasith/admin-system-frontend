import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { AttachFile as AttachIcon, Send as SendIcon } from '@mui/icons-material'
import { AddNoteDialog } from './AddNoteDialog'

interface LetterDialogsProps {
  replyDialogOpen: boolean
  replyContent: string
  onReplyDialogClose: () => void
  onReplyContentChange: (content: string) => void
  onSendReply: () => void
  addNoteDialogOpen: boolean
  onAddNoteDialogClose: () => void
}

export const LetterDialogs: React.FC<LetterDialogsProps> = ({
  replyDialogOpen,
  replyContent,
  onReplyDialogClose,
  onReplyContentChange,
  onSendReply,
  addNoteDialogOpen,
  onAddNoteDialogClose,
}) => {
  return (
    <>
      {/* Reply Dialog */}
      <ReplyDialog
        replyDialogOpen={replyDialogOpen}
        replyContent={replyContent}
        onReplyDialogClose={onReplyDialogClose}
        onReplyContentChange={onReplyContentChange}
        onSendReply={onSendReply}
      />
      
      {/* Add Note Dialog */}
      <AddNoteDialog
        open={addNoteDialogOpen}
        onClose={onAddNoteDialogClose}
      />
    </>
  )
}

interface ReplyDialogProps {
  replyDialogOpen: boolean
  replyContent: string
  onReplyDialogClose: () => void
  onReplyContentChange: (content: string) => void
  onSendReply: () => void
}

function ReplyDialog({
  replyDialogOpen,
  replyContent,
  onReplyDialogClose,
  onReplyContentChange,
  onSendReply,
}: Readonly<ReplyDialogProps>) {
  return (
    <Dialog
      open={replyDialogOpen}
      onClose={onReplyDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Reply to Letter</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={replyContent}
          onChange={(e) => onReplyContentChange(e.target.value)}
          placeholder="Type your reply here..."
          sx={{ mt: 1 }}
        />
        <Button
          startIcon={<AttachIcon />}
          sx={{ mt: 2 }}
          onClick={() => console.log('Attach files')}
        >
          Attach Files
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReplyDialogClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={onSendReply}
        >
          Send Reply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
