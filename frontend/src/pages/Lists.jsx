import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getLists, createList, deleteList } from '../api/lists'

function Lists() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: getLists,
  })

  const createMutation = useMutation({
    mutationFn: ({ name, description }) => createList(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries(['lists'])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries(['lists'])
    },
  })

  const handleCreate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const description = formData.get('description') || ''
    
    createMutation.mutate({ name, description }, {
      onSuccess: () => {
        e.target.reset()
      },
    })
  }

  const handleDelete = (listId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteMutation.mutate(listId)
    }
  }

  if (isLoading) {
    return <div className="container">Loading...</div>
  }

  const totalPrice = lists?.reduce((sum, list) => sum + (list.total_price || 0), 0) || 0

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Lists</h1>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Create New List</h2>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="input"
              placeholder="List name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="description"
              className="input"
              placeholder="Description (optional)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create List
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {lists?.map((list) => (
          <div
            key={list.id}
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/lists/${list.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '8px' }}>{list.name}</h3>
                {list.description && (
                  <p style={{ color: '#666', marginBottom: '8px' }}>{list.description}</p>
                )}
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {list.items_count} items
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>
                  ${(list.total_price || 0).toFixed(2)}
                </div>
              </div>
              <button
                className="btn btn-danger"
                style={{ marginLeft: '10px' }}
                onClick={(e) => handleDelete(list.id, e)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {lists?.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#666' }}>
          No lists yet. Create your first list above!
        </div>
      )}
    </div>
  )
}

export default Lists

