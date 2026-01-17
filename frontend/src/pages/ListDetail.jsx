import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getList, addItem, updateItem, deleteItem, getListMembers, shareList, suggestCategory } from '../api/lists'
import ShareDialog from '../components/ShareDialog'

function ListDetail() {
  const { listId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showShare, setShowShare] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const { data: list, isLoading } = useQuery({
    queryKey: ['list', listId],
    queryFn: () => getList(listId),
  })

  const { data: members } = useQuery({
    queryKey: ['list-members', listId],
    queryFn: () => getListMembers(listId),
    enabled: !!listId,
  })

  const addItemMutation = useMutation({
    mutationFn: (itemData) => addItem(listId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries(['list', listId])
      queryClient.invalidateQueries(['lists'])
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }) => updateItem(listId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['list', listId])
      queryClient.invalidateQueries(['lists'])
      setEditingItem(null)
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => deleteItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['list', listId])
      queryClient.invalidateQueries(['lists'])
    },
  })

  const handleAddItem = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const notes = formData.get('notes') || ''
    const quantity = parseFloat(formData.get('quantity')) || 1
    const unitPrice = parseFloat(formData.get('unit_price')) || 0
    const currency = formData.get('currency') || 'USD'

    // Try to suggest category
    let category = ''
    try {
      const suggestion = await suggestCategory(name, notes)
      category = suggestion.category_suggestion
    } catch (err) {
      // Ignore category suggestion errors
    }

    addItemMutation.mutate({
      name,
      notes,
      category: category !== 'unknown' ? category : null,
      quantity,
      unit_price: unitPrice,
      currency,
    }, {
      onSuccess: () => {
        e.target.reset()
      },
    })
  }

  const handleToggleBought = (item) => {
    updateItemMutation.mutate({
      itemId: item.id,
      data: {
        bought: !item.bought,
        version: item.version,
      },
    })
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    updateItemMutation.mutate({
      itemId: editingItem.id,
      data: {
        name: formData.get('name'),
        notes: formData.get('notes') || null,
        category: formData.get('category') || null,
        quantity: parseFloat(formData.get('quantity')),
        unit_price: parseFloat(formData.get('unit_price')),
        currency: formData.get('currency'),
        version: editingItem.version,
      },
    })
  }

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(itemId)
    }
  }

  if (isLoading) {
    return <div className="container">Loading...</div>
  }

  if (!list) {
    return <div className="container">List not found</div>
  }

  const boughtItems = list.items?.filter((item) => item.bought) || []
  const remainingItems = list.items?.filter((item) => !item.bought) || []
  const totalBought = boughtItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
  const totalRemaining = remainingItems.reduce((sum, item) => sum + (item.total_price || 0), 0)

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
            ← Back to Lists
          </button>
          <h1>{list.name}</h1>
          {list.description && <p style={{ color: '#666' }}>{list.description}</p>}
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowShare(true)}>
            Share List
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total</div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>
              ${(totalBought + totalRemaining).toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Remaining</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#007bff' }}>
              ${totalRemaining.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Bought</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#28a745' }}>
              ${totalBought.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Add Item</h2>
        <form onSubmit={handleAddItem}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Item name"
              required
            />
            <input
              type="number"
              name="quantity"
              className="input"
              placeholder="Qty"
              step="0.1"
              defaultValue="1"
              min="0.1"
            />
            <input
              type="number"
              name="unit_price"
              className="input"
              placeholder="Price"
              step="0.01"
              defaultValue="0"
              min="0"
            />
            <select name="currency" className="input" defaultValue="USD">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <input
              type="text"
              name="notes"
              className="input"
              placeholder="Notes (optional)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
        </form>
      </div>

      {editingItem && (
        <div className="card" style={{ backgroundColor: '#fff3cd' }}>
          <h3>Edit Item</h3>
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="input"
                defaultValue={editingItem.name}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="input"
                  defaultValue={editingItem.quantity}
                  step="0.1"
                  min="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit Price</label>
                <input
                  type="number"
                  name="unit_price"
                  className="input"
                  defaultValue={editingItem.unit_price}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select name="currency" className="input" defaultValue={editingItem.currency}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input
                type="text"
                name="notes"
                className="input"
                defaultValue={editingItem.notes || ''}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                className="input"
                defaultValue={editingItem.category || ''}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Items ({list.items?.length || 0})</h2>
        {list.items && list.items.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id} style={{ opacity: item.bought ? 0.6 : 1 }}>
                  <td>
                    <strong>{item.name}</strong>
                    {item.notes && (
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.notes}</div>
                    )}
                  </td>
                  <td>{item.category || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>${(item.total_price || 0).toFixed(2)}</td>
                  <td>
                    {item.bought ? (
                      <span style={{ color: '#28a745' }}>
                        ✓ Bought
                        {item.bought_by && (
                          <div style={{ fontSize: '12px' }}>by {item.bought_by}</div>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: '#666' }}>Pending</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        className={`btn ${item.bought ? 'btn-secondary' : 'btn-success'}`}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => handleToggleBought(item)}
                      >
                        {item.bought ? 'Unmark' : 'Mark Bought'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#666' }}>No items yet. Add items above!</p>
        )}
      </div>

      {showShare && (
        <ShareDialog
          listId={listId}
          members={members || []}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}

export default ListDetail

