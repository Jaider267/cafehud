import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { adminApi } from '../api/api';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [adminError, setAdminError] = useState('');
  const [newCafe, setNewCafe] = useState({
    name: '',
    brand: '',
    description: '',
    origin: '',
    roast: 'Medio',
    price: '0',
    available: true,
    imageUrl: ''
  });
  const [editingCafeId, setEditingCafeId] = useState(null);
  const [editingCafeData, setEditingCafeData] = useState({});

  useEffect(() => {
    if (!isAdmin()) return;

    const fetchData = async () => {
      try {
        const [usersRes, cafesRes, reviewsRes] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getCafes(),
          adminApi.getReviews()
        ]);
        setUsers(usersRes.data.data || usersRes.data || []);
        setCafes(cafesRes.data.data || cafesRes.data || []);
        setReviews(reviewsRes.data.data || reviewsRes.data || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteCafe = async (cafeId) => {
    if (!confirm('¿Estás seguro de eliminar este café?')) return;
    try {
      await adminApi.deleteCafe(cafeId);
      setCafes(cafes.filter(c => c._id !== cafeId));
    } catch (error) {
      console.error('Error deleting cafe:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;
    try {
      await adminApi.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleCreateCafe = async (event) => {
    event.preventDefault();
    setAdminError('');

    try {
      const payload = {
        ...newCafe,
        price: Number(newCafe.price)
      };
      const response = await adminApi.createCafe(payload);
      const created = response.data?.data || response.data;
      setCafes((current) => [...current, created]);
      setNewCafe({
        name: '',
        brand: '',
        description: '',
        origin: '',
        roast: 'Medio',
        price: '0',
        available: true,
        imageUrl: ''
      });
    } catch (error) {
      setAdminError(error.response?.data?.message || 'No se pudo crear el café.');
    }
  };

  const handleEditCafe = (cafe) => {
    setEditingCafeId(cafe._id);
    setEditingCafeData({
      name: cafe.name,
      brand: cafe.brand,
      description: cafe.description,
      origin: cafe.origin,
      roast: cafe.roast,
      price: String(cafe.price),
      available: cafe.available,
      imageUrl: cafe.imageUrl
    });
    setAdminError('');
  };

  const handleSaveCafe = async (cafeId) => {
    setAdminError('');
    try {
      const payload = {
        ...editingCafeData,
        price: Number(editingCafeData.price)
      };
      const response = await adminApi.updateCafe(cafeId, payload);
      const updated = response.data?.data || response.data;
      setCafes((current) => current.map((cafe) => (cafe._id === cafeId ? updated : cafe)));
      setEditingCafeId(null);
      setEditingCafeData({});
    } catch (error) {
      setAdminError(error.response?.data?.message || 'No se pudo actualizar el café.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCafeId(null);
    setEditingCafeData({});
    setAdminError('');
  };

  if (!isAdmin()) {
    return <div>No tienes permisos para acceder a esta página.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('cafes')}
            className={`px-4 py-2 rounded ${activeTab === 'cafes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Cafés ({cafes.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Reseñas ({reviews.length})
          </button>
        </nav>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Rol</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'cafes' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Gestión de Cafés</h2>

          <section className="mb-8 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Crear nuevo café</h3>
            {adminError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                {adminError}
              </div>
            )}
            <form onSubmit={handleCreateCafe} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <input
                value={newCafe.name}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre"
                className="input-premium"
                required
              />
              <input
                value={newCafe.brand}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, brand: e.target.value }))}
                placeholder="Marca"
                className="input-premium"
                required
              />
              <input
                value={newCafe.origin}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, origin: e.target.value }))}
                placeholder="Origen"
                className="input-premium"
                required
              />
              <select
                value={newCafe.roast}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, roast: e.target.value }))}
                className="input-premium"
              >
                <option value="Claro">Claro</option>
                <option value="Medio">Medio</option>
                <option value="Oscuro">Oscuro</option>
              </select>
              <input
                type="number"
                value={newCafe.price}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="Precio"
                className="input-premium"
                min="0"
                step="0.01"
                required
              />
              <input
                value={newCafe.imageUrl}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="URL de imagen"
                className="input-premium"
                required
              />
              <textarea
                value={newCafe.description}
                onChange={(e) => setNewCafe((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción"
                rows="3"
                className="input-premium col-span-1 lg:col-span-2"
                required
              />
              <button type="submit" className="btn-premium col-span-1 lg:col-span-2">
                Agregar café
              </button>
            </form>
          </section>

          {editingCafeId && (
            <section className="mb-8 p-6 bg-brand-beige/10 rounded-3xl border border-brand-beige shadow-sm">
              <h3 className="text-xl font-bold mb-4">Editar café</h3>
              <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  value={editingCafeData.name || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre"
                  className="input-premium"
                  required
                />
                <input
                  value={editingCafeData.brand || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Marca"
                  className="input-premium"
                  required
                />
                <input
                  value={editingCafeData.origin || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, origin: e.target.value }))}
                  placeholder="Origen"
                  className="input-premium"
                  required
                />
                <select
                  value={editingCafeData.roast || 'Medio'}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, roast: e.target.value }))}
                  className="input-premium"
                >
                  <option value="Claro">Claro</option>
                  <option value="Medio">Medio</option>
                  <option value="Oscuro">Oscuro</option>
                </select>
                <input
                  type="number"
                  value={editingCafeData.price || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Precio"
                  className="input-premium"
                  min="0"
                  step="0.01"
                  required
                />
                <input
                  value={editingCafeData.imageUrl || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="URL de imagen"
                  className="input-premium"
                  required
                />
                <textarea
                  value={editingCafeData.description || ''}
                  onChange={(e) => setEditingCafeData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción"
                  rows="3"
                  className="input-premium col-span-1 lg:col-span-2"
                  required
                />
                <div className="col-span-1 lg:col-span-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleSaveCafe(editingCafeId)}
                    className="btn-premium"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          )}

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Marca</th>
                <th className="border border-gray-300 px-4 py-2">Precio</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cafes.map(cafe => (
                <tr key={cafe._id}>
                  <td className="border border-gray-300 px-4 py-2">{cafe.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{cafe.brand}</td>
                  <td className="border border-gray-300 px-4 py-2">${cafe.price}</td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEditCafe(cafe)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCafe(cafe._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Gestión de Reseñas</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Usuario</th>
                <th className="border border-gray-300 px-4 py-2">Café</th>
                <th className="border border-gray-300 px-4 py-2">Calificación</th>
                <th className="border border-gray-300 px-4 py-2">Comentario</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review._id}>
                  <td className="border border-gray-300 px-4 py-2">{review.user?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.cafe?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.rating}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.comment}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;