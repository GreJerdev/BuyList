import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shareList, removeMember } from '../api/lists'

function ShareDialog({ listId, members, onClose }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const queryClient = useQueryClient()

  const shareMutation = useMutation({
    mutationFn: ({ email, role }) => shareList(listId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['list-members', listId])
      setEmail('')
    },
  })

  const removeMutation = useMutation({
    mutationFn: (userId) => removeMember(listId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['list-members', listId])
    },
  })

  const handleShare = (e) => {
    e.preventDefault()
    shareMutation.mutate({ email, role })
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Share List</h2>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleShare}>
          <div className="form-group">
            <label>User Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Member
          </button>
        </form>

        {shareMutation.error && (
          <div className="error" style={{ marginTop: '10px' }}>
            {shareMutation.error.response?.data?.detail || 'Failed to add member'}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3>Members</h3>
          {members && members.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.user_id}>
                    <td>{member.user_name}</td>
                    <td>{member.user_email}</td>
                    <td>{member.role}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => removeMutation.mutate(member.user_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#666' }}>No members yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareDialog

