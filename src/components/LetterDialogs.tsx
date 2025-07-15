import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import {
  AttachFile as AttachIcon,
  Forward as ForwardIcon,
  Send as SendIcon,
} from '@mui/icons-material'

interface LetterDialogsProps {
  replyDialogOpen: boolean
  forwardDialogOpen: boolean
  replyContent: string
  onReplyDialogClose: () => void
  onForwardDialogClose: () => void
  onReplyContentChange: (content: string) => void
  onSendReply: () => void
  onForwardLetter: () => void
}

export const LetterDialogs: React.FC<LetterDialogsProps> = ({
  replyDialogOpen,
  forwardDialogOpen,
  replyContent,
  onReplyDialogClose,
  onForwardDialogClose,
  onReplyContentChange,
  onSendReply,
  onForwardLetter,
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

      {/* Forward Dialog */}
      <Dialog
        open={forwardDialogOpen}
        onClose={onForwardDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Forward Letter</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="To Division/Officer"
            sx={{ mb: 2, mt: 1 }}
            placeholder="Select division or officer"
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Add forwarding note (optional)..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onForwardDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<ForwardIcon />}
            onClick={onForwardLetter}
          >
            Forward
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
