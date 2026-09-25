import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, Plus, Pencil, Trash2, LogOut, Search, Instagram, ExternalLink, Upload, Sparkles } from 'lucide-react';
import './styles.css';

const OWNER_CODE = 'PRTRENDZ-OWNER-2026';
const PAGES = ['home', 'shop', 'about', 'contact'];
const CATEGORIES = ['All', 'Jewellery', 'Clothing', 'Gift Hampers', 'Beauty', 'Accessories'];
const API = '/api';

const demoProducts = [
  { id: 'demo-1', name: 'Signature Gold Necklace', category: 'Jewellery', price: 1299, originalPrice: 1999, badge: 'BESTSELLER', description: 'Elegant everyday statement piece.', meeshoLink: 'https://www.meesho.com/', image: '', available: true },
  { id: 'demo-2', name: 'Midnight Luxe Set', category: 'Accessories', price: 799, originalPrice: 1199, badge: 'NEW', description: 'A clean, premium finishing touch.', meeshoLink: 'https://www.meesho.com/', image: '', available: true },
  { id: 'demo-3', name: 'Pearl Edit', category: 'Jewellery', price: 1599, originalPrice: 2299, badge: 'CURATED', description: 'Pearl-inspired jewellery set.', meeshoLink: 'https://www.meesho.com/', image: '', available: true },
];

function safeJson(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image.'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1400;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Invalid image.'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function ProductCard({ product, onBuy }) {
  const discount = product.originalPrice ? Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100)) : 0;
  return <article className="product-card">
    <div className="product-media">
      {product.image ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder"><Sparkles size={34}/><span>PR TRENDZ</span></div>}
      {product.badge && <span className="badge">{product.badge}</span>}
    </div>
    <div className="product-info">
      <span className="eyebrow">{product.category}</span>
      <h3>{product.name}</h3>
      {product.description && <p>{product.description}</p>}
      <div className="price-row"><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>{product.originalPrice && <><del>₹{Number(product.originalPrice).toLocaleString('en-IN')}</del>{discount > 0 && <span>{discount}% OFF</span>}</>}</div>
      <button className="gold-button full" type="button" onClick={() => onBuy(product)}>BUY NOW <ExternalLink size={15}/></button>
    </div>
  </article>;
}

function Landing({ onEnter }) {
  return <main className="landing">
    <div className="landing-noise" />
    <div className="landing-content">
      <div className="mini-brand">PR / TRENDZ</div>
      <div className="landing-line" />
      <p className="eyebrow">FASHION • JEWELLERY • LIFESTYLE</p>
      <h1>WEAR<br/><span>YOUR</span><br/>STATEMENT.</h1>
      <p className="landing-copy">A curated world of premium looks, made to stand out.</p>
      <button className="enter-button" type="button" onClick={onEnter}>ENTER WEBSITE <ChevronRight size={20}/></button>
    </div>
  </main>;
}

function ProductModal({ product, onClose, onSave }) {
  const [data, setData] = useState(product || { name:'', category:'Jewellery', price:'', originalPrice:'', description:'', meeshoLink:'', image:'', badge:'', available:true });
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const change = (e) => setData(d => ({ ...d, [e.target.name]: e.target.value }));
  const pickImage = async (e) => {
    try { setBusy(true); const image = await compressImage(e.target.files?.[0]); setData(d => ({...d, image})); }
    catch (err) { alert(err.message); }
    finally { setBusy(false); }
  };
  const save = async () => {
    if (!data.name.trim() || !data.price || !data.meeshoLink.trim()) return alert('Product name, price and Meesho link are required.');
    setBusy(true);
    try { await onSave({...data, price:Number(data.price), originalPrice:data.originalPrice ? Number(data.originalPrice) : null}); }
    catch (e) { alert(e.message); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">OWNER PANEL</span><h2>{product ? 'Edit product' : 'Add product'}</h2></div><button className="icon-button" type="button" onClick={onClose}><X/></button></div>
    <div className="form-grid">
      <label>Product name<input name="name" value={data.name} onChange={change} placeholder="e.g. Signature Necklace" /></label>
      <label>Category<select name="category" value={data.category} onChange={change}>{CATEGORIES.filter(x=>x!=='All').map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Price (₹)<input name="price" type="number" value={data.price} onChange={change} placeholder="1299" /></label>
      <label>Original price (₹)<input name="originalPrice" type="number" value={data.originalPrice || ''} onChange={change} placeholder="1999" /></label>
      <label>Badge<input name="badge" value={data.badge || ''} onChange={change} placeholder="NEW / SALE / BESTSELLER" /></label>
      <label>Meesho product link<input name="meeshoLink" value={data.meeshoLink} onChange={change} placeholder="https://www.meesho.com/..." /></label>
      <label className="wide">Description<textarea name="description" value={data.description || ''} onChange={change} placeholder="Short product description" /></label>
      <div className="wide upload-box">
        <div><span className="eyebrow">PRODUCT IMAGE</span><strong>{data.image ? 'Image selected' : 'No image selected'}</strong><small>Images are resized before upload so the site stays fast.</small></div>
        <button type="button" className="outline-button" onClick={()=>fileRef.current?.click()} disabled={busy}><Upload size={16}/> {busy ? 'Processing…' : 'Choose image'}</button>
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={pickImage}/>
      </div>
      {data.image && <img className="upload-preview" src={data.image} alt="Preview" />}
    </div>
    <div className="modal-actions"><button className="outline-button" type="button" onClick={onClose}>Cancel</button><button className="gold-button" type="button" onClick={save} disabled={busy}>{busy ? 'Saving…' : product ? 'Save changes' : 'Add product'}</button></div>
  </div></div>;
}

function OwnerModal({ onClose, onLogin }) {
  const [code,setCode] = useState('');
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal small" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">PRIVATE AREA</span><h2>Owner access</h2></div><button className="icon-button" type="button" onClick={onClose}><X/></button></div>
    <label>Access code<input autoFocus type="password" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onLogin(code)} placeholder="Enter owner code" /></label>
    <button className="gold-button full top-gap" type="button" onClick={()=>onLogin(code)}>ENTER DASHBOARD</button>
  </div></div>;
}

export default function App() {
  const [entered,setEntered] = useState(() => sessionStorage.getItem('prtrendz_entered') === '1');
  const [page,setPage] = useState('home');
  const [products,setProducts] = useState(() => safeJson('prtrendz_products', demoProducts));
  const [owner,setOwner] = useState(false);
  const [ownerModal,setOwnerModal] = useState(false);
  const [productModal,setProductModal] = useState(null);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [search,setSearch] = useState('');
  const [category,setCategory] = useState('All');
  const [sort,setSort] = useState('newest');
  const [loading,setLoading] = useState(false);
  const [cloud,setCloud] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await api('/products');

      // FIXED: API returns the array directly
      if (Array.isArray(data)) {
        setProducts(data);
        localStorage.setItem('prtrendz_products', JSON.stringify(data));
        setCloud(true);
      }
    } catch {
      setCloud(false);
    } finally {
      setLoading(false);
    }
  }

  const go = (next) => { setPage(next); setMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const move = (dir) => { const i=PAGES.indexOf(page); go(PAGES[(i+dir+PAGES.length)%PAGES.length]); };
  const enter = () => { sessionStorage.setItem('prtrendz_entered','1'); setEntered(true); };
  const buy = (p) => { if (p.meeshoLink) window.open(p.meeshoLink,'_blank','noopener,noreferrer'); };

  const saveProduct = async (data) => {
    if (!owner) throw new Error('Owner session expired.');
    const editing = productModal?.id;

    try {
      const result = await api(
        editing ? `/products/${editing}` : '/products',
        {
          method: editing ? 'PUT' : 'POST',
          headers: {'x-owner-code':OWNER_CODE},
          body:JSON.stringify(data)
        }
      );

      // FIXED: API returns the product directly
      const next = result;

      setProducts(ps => editing ? ps.map(p=>p.id===editing?next:p) : [...ps,next]);
      setProductModal(null);
      setCloud(true);
      return;

    } catch (e) {
      // Local fallback keeps the site usable before the cloud keys are configured.
      const next = editing
        ? products.map(p=>p.id===editing?{...data,id:editing}:p)
        : [...products,{...data,id:crypto.randomUUID()}];

      setProducts(next);
      localStorage.setItem('prtrendz_products',JSON.stringify(next));
      setProductModal(null);
      setCloud(false);

      if (!String(e.message).toLowerCase().includes('not configured')) throw e;
    }
  };

  const removeProduct = async (id) => {
    if (!confirm('Delete this product?')) return;

    try {
      await api(`/products/${id}`,{
        method:'DELETE',
        headers:{'x-owner-code':OWNER_CODE}
      });

      setProducts(ps=>ps.filter(p=>p.id!==id));

    } catch (e) {
      if (String(e.message).toLowerCase().includes('not configured')) {
        setProducts(ps=>ps.filter(p=>p.id!==id));
      } else {
        alert(e.message);
      }
    }
  };

  const filtered = useMemo(
    () => [...products]
      .filter(p=>
        (category==='All'||p.category===category) &&
        (!search||p.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a,b)=>
        sort==='price-low'
          ? a.price-b.price
          : sort==='price-high'
            ? b.price-a.price
            : (Number(b.created_at||b.id)>Number(a.created_at||a.id)?1:-1)
      ),
    [products,category,search,sort]
  );

  if (!entered) return <Landing onEnter={enter}/>;

  const pageContent = page==='home' ? <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">PR TRENDZ / EST. 2026</span>
        <h1>THE NEW<br/><em>STANDARD</em><br/>OF STYLE.</h1>
        <p>Premium fashion, jewellery and lifestyle pieces, curated with intention.</p>
        <div className="hero-actions">
          <button className="gold-button" type="button" onClick={()=>go('shop')}>SHOP COLLECTION <ChevronRight/></button>
          <button className="text-button" type="button" onClick={()=>go('about')}>OUR STORY</button>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-inner">
          <span>01</span>
          <strong>CURATED<br/>EDIT</strong>
          <small>Affordable price<br/>Premium quality</small>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">THE EDIT</span>
          <h2>Featured pieces</h2>
        </div>
        <button className="text-button" type="button" onClick={()=>go('shop')}>VIEW ALL <ChevronRight/></button>
      </div>

      <div className="product-grid">
        {products.slice(0,3).map(p=><ProductCard key={p.id} product={p} onBuy={buy}/>)}
      </div>
    </section>
  </> : page==='shop' ? <section className="section">

    <div className="section-head">
      <div>
        <span className="eyebrow">SHOP</span>
        <h2>All collections</h2>
      </div>
      <span className="muted">{filtered.length} pieces</span>
    </div>

    <div className="filters">
      <label>
        <Search size={16}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products" />
      </label>

      <select value={category} onChange={e=>setCategory(e.target.value)}>
        {CATEGORIES.map(c=><option key={c}>{c}</option>)}
      </select>

      <select value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-low">Price: low to high</option>
        <option value="price-high">Price: high to low</option>
      </select>
    </div>

    {loading&&<p className="muted">Loading collection…</p>}

    <div className="product-grid">
      {filtered.map(p=><ProductCard key={p.id} product={p} onBuy={buy}/>)}
    </div>

    {!filtered.length&&<div className="empty">No products match your search.</div>}
  </section> : page==='about' ? <section className="editorial">

    <span className="eyebrow">THE BRAND</span>
    <h1>Style without<br/><em>noise.</em></h1>
    <p>PR TRENDZ brings together jewellery, clothing, gifts, beauty and accessories with a focus on clean presentation, accessible pricing and a premium shopping experience.</p>

    <div className="manifesto">
      <span>01</span>
      <strong>Affordable price.</strong>
      <span>02</span>
      <strong>Premium quality.</strong>
      <span>03</span>
      <strong>Curated for you.</strong>
    </div>

  </section> : <section className="editorial contact">

    <span className="eyebrow">CONTACT</span>
    <h1>Let's connect.</h1>
    <p>Follow PR TRENDZ for new drops, product updates and styling edits.</p>
    <a className="gold-button" href="https://instagram.com/pr_trendz" target="_blank" rel="noreferrer">
      <Instagram size={17}/> @pr_trendz
    </a>

  </section>;

  return <div className="app">

    <header className="nav">
      <button className="brand" type="button" onClick={()=>go('home')}>PR <span>TRENDZ</span></button>

      <nav className={mobileMenu?'open':''}>
        {PAGES.map(p=>
          <button key={p} type="button" className={page===p?'active':''} onClick={()=>go(p)}>
            {p}
          </button>
        )}
      </nav>

      <div className="nav-right">
        <button className="owner-link" type="button" onClick={()=>owner?go('dashboard'):setOwnerModal(true)}>
          OWNER
        </button>

        <button className="menu-button" type="button" onClick={()=>setMobileMenu(v=>!v)}>
          {mobileMenu?<X/>:<Menu/>}
        </button>
      </div>
    </header>

    {pageContent}

    {page==='dashboard' &&
      <OwnerPanel
        products={products}
        cloud={cloud}
        onAdd={()=>setProductModal('new')}
        onEdit={p=>setProductModal(p)}
        onDelete={removeProduct}
        onLogout={()=>{setOwner(false);go('home')}}
      />
    }

    <footer className="footer">
      <div>
        <button className="brand footer-brand" type="button" onClick={()=>go('home')}>PR <span>TRENDZ</span></button>
        <p>Curated style. Premium feel.</p>
      </div>

      <div className="footer-links">
        {PAGES.map(p=>
          <button key={p} type="button" onClick={()=>go(p)}>
            {p}
          </button>
        )}
      </div>

      <div className="footer-note">© 2026 PR TRENDZ</div>
    </footer>

    <div className="page-arrows">
      <button type="button" aria-label="Previous page" onClick={()=>move(-1)}>
        <ChevronLeft/>
      </button>

      <button type="button" aria-label="Next page" onClick={()=>move(1)}>
        <ChevronRight/>
      </button>
    </div>

    {ownerModal&&
      <OwnerModal
        onClose={()=>setOwnerModal(false)}
        onLogin={(code)=>{
          if(code===OWNER_CODE){
            setOwner(true);
            setOwnerModal(false);
            go('dashboard');
          } else {
            alert('Invalid owner code.');
          }
        }}
      />
    }

    {productModal&&
      <ProductModal
        product={productModal==='new'?null:productModal}
        onClose={()=>setProductModal(null)}
        onSave={saveProduct}
      />
    }

    <button className="owner-fab" type="button" onClick={()=>owner?go('dashboard'):setOwnerModal(true)}>
      PR
    </button>

  </div>;
}

function OwnerPanel({products,cloud,onAdd,onEdit,onDelete,onLogout}) {
  return <section className="section dashboard">

    <div className="section-head">
      <div>
        <span className="eyebrow">PRIVATE / OWNER</span>
        <h2>Product management</h2>
      </div>

      <div className="dashboard-actions">
        <span className={cloud?'cloud-status live':'cloud-status'}>
          {cloud?'● CLOUD SYNC':'○ LOCAL MODE'}
        </span>

        <button className="outline-button" type="button" onClick={onLogout}>
          <LogOut size={16}/> Logout
        </button>

        <button className="gold-button" type="button" onClick={onAdd}>
          <Plus size={17}/> Add product
        </button>
      </div>
    </div>

    <div className="owner-list">
      {products.map(p=>
        <div className="owner-row" key={p.id}>

          <div className="owner-thumb">
            {p.image?<img src={p.image} alt=""/>:<Sparkles/>}
          </div>

          <div className="owner-main">
            <strong>{p.name}</strong>
            <span>{p.category} · ₹{p.price}</span>
          </div>

          <button className="icon-button" type="button" onClick={()=>onEdit(p)}>
            <Pencil size={17}/>
          </button>

          <button className="icon-button danger" type="button" onClick={()=>onDelete(p.id)}>
            <Trash2 size={17}/>
          </button>

        </div>
      )}
    </div>

  </section>;
}
