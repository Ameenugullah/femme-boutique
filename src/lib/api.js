import pb from './pocketbase';

// ── PRODUCTS ──────────────────────────────────────────────────────────────────

export async function getProducts(category = '') {
  try {
    const filter = category && category !== 'All'
      ? `category = "${category}"`
      : '';
    const records = await pb.collection('products').getFullList({
      sort: '-created',
      filter,
    });
    return records.map(normalizeProduct);
  } catch (err) {
    console.warn('PocketBase unavailable, using static data:', err.message);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const record = await pb.collection('products').getOne(id);
    return normalizeProduct(record);
  } catch (err) {
    console.error('getProductById error:', err);
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const records = await pb.collection('products').getFullList({
      filter: 'featured = true',
      sort: '-created',
    });
    return records.map(normalizeProduct);
  } catch (err) {
    console.warn('getFeaturedProducts error:', err.message);
    return [];
  }
}

export async function createProduct(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('category', data.category);
  formData.append('price', data.price);
  if (data.originalPrice) formData.append('originalPrice', data.originalPrice);
  formData.append('description', data.description);
  formData.append('colors', JSON.stringify(data.colors));
  formData.append('sizes', JSON.stringify(data.sizes));
  formData.append('badge', data.badge || '');
  formData.append('featured', data.featured ? 'true' : 'false');
  formData.append('stock', data.stock ?? 10);
  formData.append('rating', 5);

  if (data.imageFiles && data.imageFiles.length > 0) {
    data.imageFiles.forEach(file => formData.append('images', file));
  }

  const record = await pb.collection('products').create(formData);
  return normalizeProduct(record);
}

export async function updateProduct(id, data) {
  const record = await pb.collection('products').update(id, data);
  return normalizeProduct(record);
}

export async function deleteProduct(id) {
  await pb.collection('products').delete(id);
}

export async function updateStock(id, stock) {
  await pb.collection('products').update(id, { stock: Number(stock) });
}

// ── ORDERS ────────────────────────────────────────────────────────────────────

export async function createOrder(orderData) {
  const record = await pb.collection('orders').create({
    customerName: orderData.customerName,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    city: orderData.city,
    state: orderData.state,
    items: JSON.stringify(orderData.items),
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    total: orderData.total,
    status: 'pending',
  });
  return record;
}

export async function getOrders() {
  const records = await pb.collection('orders').getFullList({
    sort: '-created',
  });
  return records.map(r => ({
    ...r,
    items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
  }));
}

export async function updateOrderStatus(id, status) {
  return pb.collection('orders').update(id, { status });
}

// ── ADMIN AUTH ────────────────────────────────────────────────────────────────

export async function adminLogin(email, password) {
  try {
    await pb.admins.authWithPassword(email, password);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Invalid email or password.' };
  }
}

export function adminLogout() {
  pb.authStore.clear();
}

export function isAdminLoggedIn() {
  return pb.authStore.isValid;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function normalizeProduct(record) {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    price: Number(record.price),
    originalPrice: record.originalPrice ? Number(record.originalPrice) : null,
    description: record.description,
    colors: typeof record.colors === 'string'
      ? JSON.parse(record.colors)
      : (record.colors || []),
    sizes: typeof record.sizes === 'string'
      ? JSON.parse(record.sizes)
      : (record.sizes || []),
    images: (record.images || []).map(img =>
      pb.files.getUrl(record, img)
    ),
    badge: record.badge || null,
    featured: record.featured || false,
    rating: Number(record.rating) || 5,
    stock: Number(record.stock) ?? 10,
  };
}
