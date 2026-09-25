import { getSupabase, owner, map } from './_supabase.js';

export default async function handler(req, res) {
  const supabase = getSupabase();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data.map(map));
    }

    if (!owner(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const product = req.body;

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          category: product.category,
          price: product.price,
          original_price: product.originalPrice,
          description: product.description || '',
          meesho_link: product.meeshoLink,
          image: product.image || '',
          badge: product.badge || '',
          available: product.available ?? true
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(map(data));
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
