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

interface LetterDialogsProps {
  replyDialogOpen: boolean
  replyContent: string
  onReplyDialogClose: () => void
  onReplyContentChange: (content: string) => void
  onSendReply: () => void
}

export const LetterDialogs: React.FC<LetterDialogsProps> = ({
  replyDialogOpen,
  replyContent,
  onReplyDialogClose,
  onReplyContentChange,
  onSendReply,
}) => {
  return (
    <>
      {/* Reply Dialog */}
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
    </>
  )
}
